import { type NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { buildEssayGradingPrompt } from "@/lib/buildEssayGradingPrompt";
import type {
  GradeAudioGapFillRequest,
  GradeEssayRequest,
} from "@/models/grading";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { countAiUsageSince, logAiUsage, startOfTodayUtc } from "@/lib/aiUsage";
import type { AiUsageKind } from "@/lib/aiUsage";
import { buildAudioGapFillGradingPrompt } from "@/lib/buildAudioGapFillGradingPrompt";

const DAILY_LIMIT = 3;
const GRADING_MODEL = "gpt-4.1";
const VALID_KINDS: AiUsageKind[] = ["essay_grading", "audio_open_text_grading"];

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      taskId: string;
    }>;
  },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const body: GradeEssayRequest | GradeAudioGapFillRequest = await req.json();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const kindParam = req.nextUrl.searchParams.get("kind");

    if (!kindParam || !VALID_KINDS.includes(kindParam as AiUsageKind)) {
      return NextResponse.json(
        { error: "Nieprawidłowy typ oceniania" },
        { status: 400 },
      );
    }

    const kind = kindParam as AiUsageKind;

    const { taskId } = await params;

    const usedToday = await countAiUsageSince(user.id, kind, startOfTodayUtc());

    if (usedToday >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: "Osiągnięto dzienny limit oceniania. Spróbuj ponownie jutro.",
          limit: DAILY_LIMIT,
          used: usedToday,
        },
        { status: 429 },
      );
    }

    let prompt: string;
    let answerText: string | null;

    if (kind === "essay_grading") {
      const essayBody = body as GradeEssayRequest;
      prompt = buildEssayGradingPrompt(essayBody);
      answerText = essayBody.essay;
    } else {
      const audioBody = body as GradeAudioGapFillRequest;
      prompt = buildAudioGapFillGradingPrompt(audioBody);
      answerText = null;
    }

    const completion = await openai.chat.completions.create({
      model: GRADING_MODEL,
      temperature: 0,
      response_format: { type: "json_object" },

      messages: [
        {
          role: "system",
          content: "You are a strict professional language examiner.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error("Pusta odpowiedź oceniania");
    }

    const grading = JSON.parse(content);

    await logAiUsage({
      userId: user.id,
      kind,
      taskId,
      model: GRADING_MODEL,
      promptTokens: completion.usage?.prompt_tokens ?? null,
      completionTokens: completion.usage?.completion_tokens ?? null,
    });

    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.task_attempts.create({
        data: {
          task_id: taskId,
          user_id: user.id,
          answer_text: answerText,
          started_at: new Date(),
          submitted_at: new Date(),
          status: "graded",
          score: grading.totalScore,
          metadata: {
            grading: {
              model: GRADING_MODEL,
              promptVersion: 1,
              result: grading,
            },
          },
        },
      });

      if (kind === "essay_grading") {
        const question = await tx.questions.findFirstOrThrow({
          where: { task_id: taskId },
          select: { id: true },
        });

        await tx.student_answers.create({
          data: {
            attempt_id: attempt.id,
            user_id: user.id,
            question_id: question.id,
            option_id: null,
            answer_text: answerText,
            is_correct: null,
            points_awarded: grading.totalScore ?? 0,
            created_at: new Date(),
          },
        });
      } else if (kind === "audio_open_text_grading") {
        const audioBody = body as GradeAudioGapFillRequest;
        const breakdown: { score: number }[] = Array.isArray(grading.breakdown)
          ? grading.breakdown
          : [];

        await tx.student_answers.createMany({
          data: audioBody.gaps.map((gap, i) => {
            const gapScore = Number(breakdown[i]?.score ?? 0);
            return {
              attempt_id: attempt.id,
              user_id: user.id,
              question_id: gap.id,
              option_id: null,
              answer_text: gap.studentAnswer,
              is_correct: gapScore === 1,
              points_awarded: gapScore,
              created_at: new Date(),
            };
          }),
        });
      }

      return { attemptId: attempt.id, completed: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Ocena nieudana" }, { status: 500 });
  }
}

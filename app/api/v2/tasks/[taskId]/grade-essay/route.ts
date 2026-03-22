import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { buildGradingPrompt } from "@/lib/buildGradingPrompt";
import type { GradeEssayRequest } from "@/models/grading";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const body: GradeEssayRequest = await req.json();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;

    const prompt = buildGradingPrompt(body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      temperature: 0,
      response_format: { type: "json_object" },

      messages: [
        {
          role: "system",
          content: "You are a strict professional essay grader.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error("Empty grading response");
    }

    const grading = JSON.parse(content);

    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.task_attempts.create({
        data: {
          task_id: taskId,
          user_id: user.id,
          answer_text: body.essay,
          started_at: new Date(),
          submitted_at: new Date(),
          status: "graded",
          score: grading.totalScore,
          metadata: {
            grading: {
              model: "gpt-4.1",
              promptVersion: 1,
              result: grading,
            },
          },
        },
      });

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
          answer_text: body.essay,
          is_correct: null,
          points_awarded: grading.totalScore ?? 0,
          created_at: new Date(),
        },
      });

      return { attemptId: attempt.id, completed: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Grading failed" }, { status: 500 });
  }
}

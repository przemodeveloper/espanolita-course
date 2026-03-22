import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { answers, options } from "@prisma/client";

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const body = await req.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // ---------------------------------
      // Get task
      // ---------------------------------
      const task = await tx.tasks.findUnique({
        where: { id: taskId },
        select: { type: true },
      });

      if (!task) throw new Error("Task not found");

      const answers: {
        questionId: string;
        optionId?: string;
        answerText?: string;
      }[] = body.answers ?? [];

      if (!answers.length) {
        throw new Error("No answers provided");
      }

      // ---------------------------------
      // VALIDATION
      // ---------------------------------

      // 1. No duplicate answers per question
      const seen = new Set<string>();
      for (const a of answers) {
        if (seen.has(a.questionId)) {
          throw new Error(`Duplicate answer for question ${a.questionId}`);
        }
        seen.add(a.questionId);
      }

      const isChoice =
        task.type === "single_choice" || task.type === "gap_fill_shared";

      const isOpenText =
        task.type === "open_text" || task.type === "open_text_gaps";

      // 2. Required fields
      if (isChoice && !answers.every((a) => a.optionId)) {
        throw new Error("Missing optionId for choice task");
      }

      if (isOpenText && !answers.every((a) => a.answerText !== undefined)) {
        throw new Error("Missing answerText for open text task");
      }

      // ---------------------------------
      // Create attempt
      // ---------------------------------
      const attempt = await tx.task_attempts.create({
        data: {
          task_id: taskId,
          user_id: user.id,
          started_at: new Date(),
          submitted_at: new Date(),
          status: "graded",
        },
      });

      const questionIds = answers.map((a) => a.questionId);

      // ---------------------------------
      // Fetch questions
      // ---------------------------------
      const questions = await tx.questions.findMany({
        where: { id: { in: questionIds } },
      });

      const questionMap = new Map(questions.map((q) => [q.id, q]));

      // ---------------------------------
      // Fetch options (choice)
      // ---------------------------------
      const optionIds = answers
        .map((a) => a.optionId)
        .filter(Boolean) as string[];

      let optionMap = new Map<string, options>();

      if (optionIds.length) {
        const options = await tx.options.findMany({
          where: { id: { in: optionIds } },
        });

        optionMap = new Map(options.map((o) => [o.id, o]));
      }

      // ---------------------------------
      // Fetch acceptable answers (open_text)
      // ---------------------------------
      type AcceptableAnswer = answers & { compiled?: RegExp };

      let acceptableMap = new Map<string, AcceptableAnswer[]>();

      if (isOpenText) {
        const acceptable = await tx.answers.findMany({
          where: { question_id: { in: questionIds } },
        });

        acceptableMap = acceptable.reduce((map, a) => {
          const list = map.get(a.question_id) ?? [];

          list.push({
            ...a,
            compiled: a.regex_pattern
              ? new RegExp(a.regex_pattern, "i")
              : undefined,
          });

          map.set(a.question_id, list);
          return map;
        }, new Map<string, AcceptableAnswer[]>());
      }

      // ---------------------------------
      // Grade answers
      // ---------------------------------
      const rows = answers.map((a) => {
        const q = questionMap.get(a.questionId);
        const option = a.optionId ? optionMap.get(a.optionId) : null;

        let isCorrect: boolean | null = null;
        let points = 0;

        // ================================
        // choice tasks
        // ================================
        if (isChoice) {
          isCorrect = option?.is_correct ?? false;
          points = isCorrect ? (q?.points ?? 1) : 0;
        }

        // ================================
        // open text
        // ================================
        if (isOpenText) {
          const userRaw = a.answerText ?? "";
          const normalizedUser = normalize(userRaw);

          const acceptable = acceptableMap.get(a.questionId) ?? [];

          if (!acceptable.length) {
            console.warn(`No acceptable answers for question ${a.questionId}`);
          }

          isCorrect = acceptable.some((ans) => {
            if (ans.normalized_text && normalizedUser === ans.normalized_text) {
              return true;
            }

            if (ans.compiled?.test(normalizedUser)) {
              return true;
            }

            return false;
          });

          points = isCorrect ? (q?.points ?? 1) : 0;
        }

        return {
          attempt_id: attempt.id,
          user_id: user.id,
          question_id: a.questionId,
          option_id: a.optionId ?? null,
          answer_text: a.answerText ?? null,
          is_correct: isCorrect,
          points_awarded: points,
          created_at: new Date(),
        };
      });

      // ---------------------------------
      // Save answers
      // ---------------------------------
      await tx.student_answers.createMany({ data: rows });

      // ---------------------------------
      // Score
      // ---------------------------------
      const score = rows.reduce((sum, r) => sum + r.points_awarded, 0);

      await tx.task_attempts.update({
        where: { id: attempt.id },
        data: { score },
      });

      // ---------------------------------
      // Minimal response
      // ---------------------------------
      return {
        attemptId: attempt.id,
        completed: true,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}

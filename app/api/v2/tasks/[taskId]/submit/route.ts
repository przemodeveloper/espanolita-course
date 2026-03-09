import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { answers_v2, options_v2 } from "@prisma/client";

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
      const task = await tx.tasks_v2.findUnique({
        where: { id: taskId },
        select: { type: true },
      });

      if (!task) throw new Error("Task not found");

      // =====================================================
      // QUESTION BASED TASKS
      // =====================================================
      const answers: {
        questionId: string;
        optionId?: string;
        answerText?: string;
      }[] = body.answers ?? [];

      if (!answers.length) {
        throw new Error("No answers provided");
      }

      // ---------------------------------
      // Create attempt
      // ---------------------------------
      const attempt = await tx.task_attempts_v2.create({
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
      const questions = await tx.questions_v2.findMany({
        where: { id: { in: questionIds } },
      });

      const questionMap = new Map(questions.map((q) => [q.id, q]));

      // ---------------------------------
      // Fetch options (choice tasks)
      // ---------------------------------
      const optionIds = answers
        .map((a) => a.optionId)
        .filter(Boolean) as string[];

      let optionMap = new Map<string, options_v2>();

      if (optionIds.length) {
        const options = await tx.options_v2.findMany({
          where: { id: { in: optionIds } },
        });

        optionMap = new Map(options.map((o) => [o.id, o]));
      }

      // ---------------------------------
      // Fetch acceptable answers (open_text)
      // ---------------------------------
      let acceptableMap = new Map<string, answers_v2[]>();

      if (task.type === "open_text") {
        const acceptable = await tx.answers_v2.findMany({
          where: { question_id: { in: questionIds } },
        });

        acceptableMap = acceptable.reduce((map, a) => {
          const list = map.get(a.question_id) ?? [];
          list.push(a);
          map.set(a.question_id, list);
          return map;
        }, new Map<string, typeof acceptable>());
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
        // single_choice + gap_fill_shared
        // ================================
        if (task.type === "single_choice" || task.type === "gap_fill_shared") {
          isCorrect = option?.is_correct ?? false;
          points = isCorrect ? (q?.points ?? 1) : 0;
        }

        // ================================
        // open_text (answers_v2 based)
        // ================================
        if (task.type === "open_text") {
          const userRaw = a.answerText ?? "";
          const normalizedUser = normalize(userRaw);

          const acceptable = acceptableMap.get(a.questionId) ?? [];

          isCorrect = acceptable.some((ans) => {
            if (ans.normalized_text) {
              if (normalizedUser === ans.normalized_text) return true;
            }

            if (ans.regex_pattern) {
              const regex = new RegExp(ans.regex_pattern, "i");
              if (regex.test(userRaw)) return true;
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
          answered_at: new Date(),
        };
      });

      // ---------------------------------
      // Save answers
      // ---------------------------------
      await tx.student_answers_v2.createMany({ data: rows });

      // ---------------------------------
      // Score
      // ---------------------------------
      const score = rows.reduce((sum, r) => sum + r.points_awarded, 0);

      await tx.task_attempts_v2.update({
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

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { options_v2 } from "@prisma/client";

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
      // Get task type
      // ---------------------------------
      const task = await tx.tasks_v2.findUnique({
        where: { id: taskId },
        select: { type: true },
      });

      if (!task) throw new Error("Task not found");

      // =====================================================
      // WRITING TASK
      // =====================================================
      if (task.type === "writing") {
        const attempt = await tx.task_attempts_v2.create({
          data: {
            task_id: taskId,
            user_id: user.id,
            answer_text: body.answerText ?? "",
            started_at: new Date(),
            submitted_at: new Date(),
            status: "submitted", // graded later
          },
        });

        return { attemptId: attempt.id, completed: true };
      }

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

      // ---------------------------------
      // Fetch questions
      // ---------------------------------
      const questionIds = answers.map((a) => a.questionId);

      const questions = await tx.questions_v2.findMany({
        where: { id: { in: questionIds } },
      });

      const questionMap = new Map(questions.map((q) => [q.id, q]));

      // ---------------------------------
      // Fetch options (for choice tasks)
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
      // Build rows + grade
      // ---------------------------------
      const rows = answers.map((a) => {
        const q = questionMap.get(a.questionId);
        const option = a.optionId ? optionMap.get(a.optionId) : null;

        let isCorrect: boolean | null = null;
        let points = 0;

        // single_choice + gap_fill_shared
        if (task.type === "single_choice" || task.type === "gap_fill_shared") {
          isCorrect = option?.is_correct ?? false;
          points = isCorrect ? (q?.points ?? 1) : 0;
        }

        // open_text (simple exact match for now)
        if (task.type === "open_text") {
          const normalizedUser = a.answerText?.trim().toLowerCase() ?? "";
          const normalizedKey = q?.correct_key?.trim().toLowerCase() ?? "";

          isCorrect = normalizedUser === normalizedKey;
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

      await tx.student_answers_v2.createMany({ data: rows });

      // ---------------------------------
      // Calculate + store score
      // ---------------------------------
      const score = rows.reduce((sum, r) => sum + r.points_awarded, 0);

      await tx.task_attempts_v2.update({
        where: { id: attempt.id },
        data: { score },
      });

      // ---------------------------------
      // Return minimal response ONLY
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

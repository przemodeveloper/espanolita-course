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
            status: "submitted", // AI/manual grading later
          },
        });

        return {
          attemptId: attempt.id,
          type: "writing",
          completed: true,
        };
      }

      // =====================================================
      // QUESTION BASED TASKS
      // (single_choice / gap_fill_shared / open_text)
      // =====================================================
      const answers: {
        questionId: string;
        optionId?: string;
        answerText?: string;
      }[] = body.answers ?? [];

      if (!answers.length) {
        throw new Error("No answers provided");
      }

      // create attempt
      const attempt = await tx.task_attempts_v2.create({
        data: {
          task_id: taskId,
          user_id: user.id,
          started_at: new Date(),
          submitted_at: new Date(),
          status: "graded",
        },
      });

      // -----------------------------
      // Fetch questions
      // -----------------------------
      const questionIds = answers.map((a) => a.questionId);

      const questions = await tx.questions_v2.findMany({
        where: { id: { in: questionIds } },
      });

      const questionMap = new Map(questions.map((q) => [q.id, q]));

      // -----------------------------
      // Fetch options if needed
      // -----------------------------
      const optionIds = answers
        .map((a) => a.optionId)
        .filter(Boolean) as string[];

      let optionMap = new Map<string, options_v2>();

      if (optionIds.length > 0) {
        const options = await tx.options_v2.findMany({
          where: { id: { in: optionIds } },
        });

        optionMap = new Map(options.map((o) => [o.id, o]));
      }

      // -----------------------------
      // Build answer rows + grading
      // -----------------------------
      const correctQuestionIds: string[] = [];
      const incorrectQuestionIds: string[] = [];

      const rows = answers.map((a) => {
        const q = questionMap.get(a.questionId);
        const option = a.optionId ? optionMap.get(a.optionId) : null;

        let isCorrect: boolean | null = null;
        let points = 0;

        // ==================================
        // single_choice + gap_fill_shared
        // ==================================
        if (task.type === "single_choice" || task.type === "gap_fill_shared") {
          isCorrect = option?.is_correct ?? false;
          points = isCorrect ? (q?.points ?? 1) : 0;
        }

        // ==================================
        // open_text
        // ==================================
        if (task.type === "open_text") {
          isCorrect =
            a.answerText?.trim().toLowerCase() ===
            q?.correct_key?.trim().toLowerCase();

          points = isCorrect ? (q?.points ?? 1) : 0;
        }

        if (isCorrect) {
          correctQuestionIds.push(a.questionId);
        } else {
          incorrectQuestionIds.push(a.questionId);
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

      // -----------------------------
      // Score calculation
      // -----------------------------
      const score = rows.reduce((sum, r) => sum + r.points_awarded, 0);

      const maxScore = questions.reduce((sum, q) => sum + (q.points ?? 1), 0);

      await tx.task_attempts_v2.update({
        where: { id: attempt.id },
        data: { score },
      });

      // -----------------------------
      // Return useful frontend data
      // -----------------------------
      return {
        attemptId: attempt.id,
        type: task.type,
        score,
        maxScore,
        completed: true,
        correctQuestionIds,
        incorrectQuestionIds,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}

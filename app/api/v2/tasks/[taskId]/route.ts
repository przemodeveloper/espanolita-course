import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;

  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      title: true,
      instructions: true,
      content: true,
      type: true,
      task_set_items: {
        take: 1,
        orderBy: { set_id: "asc" },
        select: {
          set_id: true,
          task_sets: { select: { title: true } },
        },
      },
      questions: {
        orderBy: { order_index: "asc" },
        select: {
          gap_index: true,
          id: true,
          order_index: true,
          prompt: true,
          options: {
            select: {
              id: true,
              label: true,
              text: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const { task_set_items, ...taskBase } = task;
  const taskSetId = task_set_items[0]?.set_id ?? null;
  const taskSetTitle = task_set_items[0]?.task_sets?.title ?? null;

  if (task.type === "gap_fill_shared") {
    const sharedOptions = task.questions[0]?.options ?? [];

    return NextResponse.json({
      ...taskBase,
      taskSetId,
      taskSetTitle,
      sharedOptions,
      questions: task.questions.map((q) => ({
        id: q.id,
        gap_index: q.gap_index,
        order_index: q.order_index,
        prompt: q.prompt,
      })),
    });
  }

  return NextResponse.json({ ...taskBase, taskSetId, taskSetTitle });
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
      const task = await tx.tasks.findUnique({
        where: { id: taskId },
        select: { type: true },
      });

      if (!task) throw new Error("Task not found");

      // ==================================================
      // WRITING (whole answer stored on attempt)
      // ==================================================
      if (task.type === "writing") {
        const answerText: string = body.answerText ?? "";

        const attempt = await tx.task_attempts.create({
          data: {
            task_id: taskId,
            user_id: user.id,
            answer_text: answerText,
            started_at: new Date(),
            submitted_at: new Date(),
            status: "submitted",
          },
        });

        return {
          attemptId: attempt.id,
          type: "writing",
        };
      }

      // ==================================================
      // QUESTION BASED
      // single_choice | gap_fill_shared | open_text
      // ==================================================
      const answers: {
        questionId: string;
        optionId?: string;
        answerText?: string;
      }[] = body.answers ?? [];

      if (!answers.length) throw new Error("No answers provided");

      const attempt = await tx.task_attempts.create({
        data: {
          task_id: taskId,
          user_id: user.id,
          started_at: new Date(),
          submitted_at: new Date(),
          status: "graded",
        },
      });

      const rows = [];

      for (const a of answers) {
        let points = 0;
        let isCorrect: boolean | null = null;

        // -------------------------
        // single choice / gap fill
        // -------------------------
        if (a.optionId) {
          const option = await tx.options.findUnique({
            where: { id: a.optionId },
            include: { questions: true },
          });

          isCorrect = option?.is_correct ?? false;
          points = isCorrect ? (option?.questions.points ?? 1) : 0;
        }

        // -------------------------
        // open text
        // -------------------------
        if (a.answerText) {
          const q = await tx.questions.findUnique({
            where: { id: a.questionId },
          });

          isCorrect =
            a.answerText.trim().toLowerCase() ===
            q?.correct_key?.trim().toLowerCase();

          points = isCorrect ? (q?.points ?? 1) : 0;
        }

        rows.push({
          attempt_id: attempt.id,
          user_id: user.id,
          question_id: a.questionId,
          option_id: a.optionId ?? null,
          answer_text: a.answerText ?? null,
          is_correct: isCorrect,
          points_awarded: points,
        });
      }

      await tx.student_answers.createMany({ data: rows });

      const total = rows.reduce((s, r) => s + r.points_awarded, 0);

      await tx.task_attempts.update({
        where: { id: attempt.id },
        data: { score: total },
      });

      return {
        attemptId: attempt.id,
        type: task.type,
        score: total,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}

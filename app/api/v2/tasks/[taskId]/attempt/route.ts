import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GradeEssayResponse } from "@/models/grading";

export async function GET(
  _req: NextRequest,
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

  const task = await prisma.tasks_v2.findUnique({
    where: { id: taskId },
    select: { type: true },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const attempt = await prisma.task_attempts_v2.findFirst({
    where: {
      user_id: user.id,
      task_id: taskId,
    },
    orderBy: { created_at: "desc" },
    include: {
      student_answers_v2: true,
    },
  });

  if (!attempt) {
    return NextResponse.json({ attempt: null });
  }

  // =====================================================
  // WRITING
  // =====================================================
  if (task.type === "writing") {
    return NextResponse.json({
      attemptId: attempt.id,
      type: "writing",
      answerText: attempt.answer_text ?? "",
      score: attempt.score ? Number(attempt.score) : null,
      grading:
        (
          attempt.metadata as {
            grading?: { result: GradeEssayResponse };
          } | null
        )?.grading?.result ?? null,
    });
  }

  // =====================================================
  // QUESTION BASED (single_choice / gap_fill_shared / open_text)
  // =====================================================
  const answers = attempt.student_answers_v2.map((a) => ({
    questionId: a.question_id,
    optionId: a.option_id,
    answerText: a.answer_text, // 🔥 works for open_text
  }));

  const correctQuestionIds = attempt.student_answers_v2
    .filter((a) => a.is_correct === true)
    .map((a) => a.question_id);

  const incorrectQuestionIds = attempt.student_answers_v2
    .filter((a) => a.is_correct === false)
    .map((a) => a.question_id);

  return NextResponse.json({
    attemptId: attempt.id,
    type: task.type,
    score: attempt.score ? Number(attempt.score) : null,
    answers, // 🔥 unified for all question types
    correctQuestionIds,
    incorrectQuestionIds,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { taskId } = await params;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // delete latest attempt only
  const latestAttempt = await prisma.task_attempts_v2.findFirst({
    where: {
      task_id: taskId,
      user_id: user.id,
    },
    orderBy: { created_at: "desc" },
    select: { id: true },
  });

  if (!latestAttempt) {
    return NextResponse.json({ success: true });
  }

  await prisma.task_attempts_v2.delete({
    where: { id: latestAttempt.id },
  });

  // student_answers auto delete via cascade
  return NextResponse.json({ success: true });
}

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { GradeEssayResponse } from "@/models/grading";

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
      student_answers_v2: {
        select: {
          question_id: true,
          option_id: true,
          answer_text: true,
          is_correct: true,
        },
      },
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
      type: task.type,
      answerText: attempt.answer_text ?? "",
      score: attempt.score !== null ? Number(attempt.score) : null,
      grading:
        (
          attempt.metadata as {
            grading?: { result: GradeEssayResponse };
          } | null
        )?.grading?.result ?? null,
    });
  }

  // =====================================================
  // QUESTION BASED
  // (single_choice / gap_fill_shared / open_text / open_text_gaps)
  // =====================================================

  const answersRaw = attempt.student_answers_v2;

  // OPTIONAL: ensure stable order (recommended for gaps)
  const questionOrder = new Map(
    (
      await prisma.questions_v2.findMany({
        where: {
          id: { in: answersRaw.map((a) => a.question_id) },
        },
        select: { id: true, order_index: true },
      })
    ).map((q) => [q.id, q.order_index]),
  );

  const answers = answersRaw
    .sort(
      (a, b) =>
        (questionOrder.get(a.question_id) ?? 0) -
        (questionOrder.get(b.question_id) ?? 0),
    )
    .map((a) => ({
      questionId: a.question_id,
      optionId: a.option_id,
      answerText: a.answer_text,
    }));

  const correctQuestionIds = answersRaw
    .filter((a) => a.is_correct === true)
    .map((a) => a.question_id);

  const incorrectQuestionIds = answersRaw
    .filter((a) => a.is_correct === false)
    .map((a) => a.question_id);

  return NextResponse.json({
    attemptId: attempt.id,
    type: task.type,
    score: attempt.score !== null ? Number(attempt.score) : null,
    answers,
    correctQuestionIds,
    incorrectQuestionIds,
  });
}

// =====================================================
// DELETE (latest attempt only)
// =====================================================

export async function DELETE(
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

  await prisma.task_attempts_v2.deleteMany({
    where: {
      id: latestAttempt.id,
      user_id: user.id,
    },
  });

  return NextResponse.json({ success: true });
}

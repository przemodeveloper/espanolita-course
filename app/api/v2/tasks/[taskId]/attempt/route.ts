import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  GradeEssayResponse,
  GradeAudioGapFillResponse,
} from "@/models/grading";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
  }

  const { taskId } = await params;

  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: { type: true },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Zadanie nie znalezione" },
      { status: 404 },
    );
  }

  const attempt = await prisma.task_attempts.findFirst({
    where: {
      user_id: user.id,
      task_id: taskId,
    },
    orderBy: { created_at: "desc" },
    include: {
      student_answers: {
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

  const answersRaw = attempt.student_answers;

  // OPTIONAL: ensure stable order (recommended for gaps)
  const questionOrder = new Map(
    (
      await prisma.questions.findMany({
        where: {
          id: { in: answersRaw.map((a) => a.question_id) },
        },
        select: { id: true, order_index: true },
      })
    ).map((q) => [q.id, q.order_index]),
  );

  const optionLabelById =
    task.type === "gap_fill_shared"
      ? new Map(
          (
            await prisma.options.findMany({
              where: {
                id: {
                  in: answersRaw
                    .map((a) => a.option_id)
                    .filter((id): id is string => id != null),
                },
              },
              select: { id: true, label: true },
            })
          ).map((o) => [o.id, o.label]),
        )
      : null;

  const answers = answersRaw
    .sort(
      (a, b) =>
        (questionOrder.get(a.question_id) ?? 0) -
        (questionOrder.get(b.question_id) ?? 0),
    )
    .map((a) => {
      const fromOption =
        optionLabelById && a.option_id
          ? (optionLabelById.get(a.option_id) ?? "").trim().toUpperCase()
          : "";

      return {
        questionId: a.question_id,
        optionId: a.option_id,
        answerText: a.answer_text ?? (fromOption !== "" ? fromOption : null),
      };
    });

  const correctQuestionIds = answersRaw
    .filter((a) => a.is_correct === true)
    .map((a) => a.question_id);

  const incorrectQuestionIds = answersRaw
    .filter((a) => a.is_correct === false)
    .map((a) => a.question_id);

  if (task.type === "audio_open_text") {
    return NextResponse.json({
      attemptId: attempt.id,
      type: task.type,
      score: attempt.score !== null ? Number(attempt.score) : null,
      answers: attempt.student_answers.map((a) => ({
        questionId: a.question_id,
        answerText: a.answer_text ?? "",
      })),
      correctQuestionIds,
      incorrectQuestionIds,
      grading:
        (
          attempt.metadata as {
            grading?: { result: GradeAudioGapFillResponse };
          } | null
        )?.grading?.result ?? null,
    });
  }

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
    return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
  }

  const { taskId } = await params;

  const latestAttempt = await prisma.task_attempts.findFirst({
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

  await prisma.task_attempts.deleteMany({
    where: {
      id: latestAttempt.id,
      user_id: user.id,
    },
  });

  return NextResponse.json({ success: true });
}

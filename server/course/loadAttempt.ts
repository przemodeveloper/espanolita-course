import { prisma } from "@/lib/prisma";
import type {
  GradeAudioGapFillResponse,
  GradeEssayResponse,
} from "@/models/grading";

/**
 * Latest attempt for a task in at most two DB round-trips:
 * 1) attempt + student_answers + task type
 * 2) parallel lookups for order / option labels / correct answers
 */
export async function loadAttempt(userId: string, taskId: string) {
  const attempt = await prisma.task_attempts.findFirst({
    where: {
      user_id: userId,
      task_id: taskId,
    },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      answer_text: true,
      score: true,
      metadata: true,
      tasks: { select: { type: true } },
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
    return { attempt: null };
  }

  const taskType = attempt.tasks.type;
  const answersRaw = attempt.student_answers;

  const correctQuestionIds = answersRaw
    .filter((a) => a.is_correct === true)
    .map((a) => a.question_id);
  const incorrectQuestionIds = answersRaw
    .filter((a) => a.is_correct === false)
    .map((a) => a.question_id);

  if (taskType === "writing") {
    return {
      attemptId: attempt.id,
      type: taskType,
      answerText: attempt.answer_text ?? "",
      score: attempt.score !== null ? Number(attempt.score) : null,
      grading:
        (
          attempt.metadata as {
            grading?: { result: GradeEssayResponse };
          } | null
        )?.grading?.result ?? null,
    };
  }

  const questionIds = answersRaw.map((a) => a.question_id);
  const optionIds = answersRaw
    .map((a) => a.option_id)
    .filter((id): id is string => id != null);

  const needsCorrectAnswers =
    taskType === "open_text_gaps" || taskType === "open_text";
  const needsOptionLabels =
    taskType === "gap_fill_shared" ||
    taskType === "single_choice" ||
    taskType === "audio_single_choice" ||
    taskType === "heading_match";

  const [questionOrderRows, optionRows, correctAnswersRaw] = await Promise.all([
    prisma.questions.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, order_index: true },
    }),
    needsOptionLabels && optionIds.length > 0
      ? prisma.options.findMany({
          where: { id: { in: optionIds } },
          select: { id: true, label: true },
        })
      : Promise.resolve([] as { id: string; label: string }[]),
    needsCorrectAnswers
      ? prisma.answers.findMany({
          where: { question_id: { in: questionIds } },
          select: {
            question_id: true,
            answer_text: true,
            is_primary: true,
            order_index: true,
          },
          orderBy: [{ is_primary: "desc" }, { order_index: "asc" }],
        })
      : Promise.resolve(
          [] as {
            question_id: string;
            answer_text: string | null;
            is_primary: boolean | null;
            order_index: number;
          }[],
        ),
  ]);

  const questionOrder = new Map(
    questionOrderRows.map((q) => [q.id, q.order_index]),
  );
  const optionLabelById = new Map(
    optionRows.map((o) => [o.id, o.label] as const),
  );

  const sortedAnswers = [...answersRaw].sort(
    (a, b) =>
      (questionOrder.get(a.question_id) ?? 0) -
      (questionOrder.get(b.question_id) ?? 0),
  );

  if (taskType === "audio_open_text") {
    return {
      attemptId: attempt.id,
      type: taskType,
      score: attempt.score !== null ? Number(attempt.score) : null,
      answers: sortedAnswers.map((a) => ({
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
    };
  }

  if (needsCorrectAnswers) {
    return {
      attemptId: attempt.id,
      type: taskType,
      score: attempt.score !== null ? Number(attempt.score) : null,
      correctQuestionIds,
      incorrectQuestionIds,
      answers: sortedAnswers.map((a) => ({
        questionId: a.question_id,
        answerText: a.answer_text ?? "",
      })),
      correctAnswers: correctAnswersRaw.map((a) => ({
        questionId: a.question_id,
        answerText: a.answer_text,
        isPrimary: a.is_primary ?? false,
      })),
    };
  }

  const answers = sortedAnswers.map((a) => {
    const fromOption =
      a.option_id != null
        ? (optionLabelById.get(a.option_id) ?? "").trim().toUpperCase()
        : "";
    return {
      questionId: a.question_id,
      optionId: a.option_id,
      answerText: a.answer_text ?? (fromOption !== "" ? fromOption : null),
    };
  });

  return {
    attemptId: attempt.id,
    type: taskType,
    score: attempt.score !== null ? Number(attempt.score) : null,
    answers,
    correctQuestionIds,
    incorrectQuestionIds,
  };
}

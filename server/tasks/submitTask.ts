import type { Prisma } from "@prisma/client";
import {
  gradeSubmitAnswers,
  taskGradeKind,
  validateSubmitAnswers,
  type SubmitAnswerInput,
} from "@/server/grading/gradeAnswers";
import { DomainError } from "@/server/errors";

export type SubmitTaskResult = {
  attemptId: string;
  completed: true;
};

export async function submitTaskAnswers(
  tx: Prisma.TransactionClient,
  args: {
    userId: string;
    taskId: string;
    answers: SubmitAnswerInput[];
  },
): Promise<SubmitTaskResult> {
  const { userId, taskId, answers } = args;

  const task = await tx.tasks.findUnique({
    where: { id: taskId },
    select: { type: true },
  });

  if (!task) {
    throw new DomainError("Zadanie nie znalezione", 404);
  }

  try {
    validateSubmitAnswers(task.type, answers);
  } catch (err) {
    throw new DomainError(
      err instanceof Error ? err.message : "Nieprawidłowe odpowiedzi",
      400,
    );
  }

  const kind = taskGradeKind(task.type);

  const attempt = await tx.task_attempts.create({
    data: {
      task_id: taskId,
      user_id: userId,
      started_at: new Date(),
      submitted_at: new Date(),
      status: "graded",
    },
  });

  const questionIds = answers.map((a) => a.questionId);
  const questions = await tx.questions.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, points: true, correct_key: true },
  });

  const optionIds = answers.map((a) => a.optionId).filter(Boolean) as string[];
  const options = optionIds.length
    ? await tx.options.findMany({
        where: { id: { in: optionIds } },
        select: { id: true, is_correct: true },
      })
    : [];

  const acceptableAnswers =
    kind === "open_text"
      ? await tx.answers.findMany({
          where: { question_id: { in: questionIds } },
          select: {
            question_id: true,
            normalized_text: true,
            regex_pattern: true,
          },
        })
      : [];

  const graded = gradeSubmitAnswers({
    taskType: task.type,
    answers,
    questions,
    options,
    acceptableAnswers,
  });

  const rows = graded.map((row) => ({
    attempt_id: attempt.id,
    user_id: userId,
    question_id: row.question_id,
    option_id: row.option_id,
    answer_text: row.answer_text,
    is_correct: row.is_correct,
    points_awarded: row.points_awarded,
    created_at: new Date(),
  }));

  await tx.student_answers.createMany({ data: rows });

  const score = rows.reduce((sum, r) => sum + r.points_awarded, 0);
  await tx.task_attempts.update({
    where: { id: attempt.id },
    data: { score },
  });

  return { attemptId: attempt.id, completed: true };
}

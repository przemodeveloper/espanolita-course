import type { Question } from "@/models/task";
import type { Attempt } from "@/models/attempt";
import OpenTextTask from "./open-text-task";
import { useState } from "react";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";
import { TaskSummary } from "./task-summary";
import { TaskActions } from "./task-actions";

export default function OpenTextTasks({
  questions,
  attempt,
  taskId,
}: {
  questions: Question[];
  attempt?: Attempt | null;
  taskId: string;
}) {
  const [answers, setAnswers] = useState<
    { questionId: string; answerText: string }[]
  >(
    () =>
      attempt?.answers?.map((a) => ({
        questionId: a.questionId,
        answerText: a.answerText ?? "",
      })) ?? [],
  );

  const { mutate: submitResponse, isPending: isSubmitting } =
    useSubmitResponse(taskId);

  const { mutate: deleteAttempt, isPending: isDeleting } =
    useDeleteAttempt(taskId);

  const handleSubmitAnswers = () => {
    submitResponse({ taskId, answers });
  };

  const handleResetAnswers = () => {
    deleteAttempt(undefined, {
      onSuccess: () => {
        setAnswers([]);
      },
    });
  };

  const handleChangeAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) =>
      prev.find((a) => a.questionId === questionId)
        ? prev.map((a) =>
            a.questionId === questionId ? { ...a, answerText: answer } : a,
          )
        : [...prev, { questionId, answerText: answer }],
    );
  };

  return (
    <div>
      <div className="space-y-4 mb-4">
        {questions.map((question) => (
          <OpenTextTask
            key={question.id}
            orderIndex={question.order_index}
            sentence={question.prompt.sentence}
            keywords={question.prompt.keywords}
            value={
              answers.find((a) => a.questionId === question.id)?.answerText ??
              ""
            }
            disabled={Boolean(attempt?.attemptId) || isSubmitting || isDeleting}
            onChange={(answerText) =>
              handleChangeAnswer(question.id, answerText)
            }
            isCorrect={Boolean(
              attempt?.correctQuestionIds?.includes(question.id),
            )}
            isIncorrect={Boolean(
              attempt?.incorrectQuestionIds?.includes(question.id),
            )}
          />
        ))}
      </div>

      {attempt?.attemptId && (
        <TaskSummary
          score={attempt.score}
          className="mb-4"
          maxScore={questions.length}
        />
      )}
      <TaskActions
        onSubmit={handleSubmitAnswers}
        onReset={handleResetAnswers}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        attemptId={attempt?.attemptId ?? null}
        disabled={answers.length !== questions.length}
      />
    </div>
  );
}

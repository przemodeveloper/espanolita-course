"use client";

import type { Question } from "@/models/task";
import { SingleChoiceTask } from "./single-choice-task";
import { useState } from "react";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import type { Attempt } from "@/models/attempt";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";
import { TaskSummary } from "./task-summary";
import { TaskActions } from "./task-actions";

export default function SingleChoiceTasks({
  text,
  title,
  questions,
  taskId,
  attempt,
}: {
  text?: string;
  title?: string;
  questions: Question[];
  taskId: string;
  attempt?: Attempt | null;
}) {
  const { mutate: submitResponse, isPending: isSubmitting } =
    useSubmitResponse(taskId);
  const { mutate: deleteAttempt, isPending: isDeleting } =
    useDeleteAttempt(taskId);

  const [answers, setAnswers] = useState<Attempt["answers"]>(
    () => attempt?.answers ?? [],
  );

  const handleSetAnswer = (
    questionId: string,
    optionId?: string,
    answerText?: string,
  ) => {
    if (answers?.find((answer) => answer.questionId === questionId)) {
      setAnswers((prev?: Attempt["answers"]) =>
        prev?.map((answer) =>
          answer.questionId === questionId
            ? { questionId, optionId, answerText }
            : answer,
        ),
      );
    } else {
      setAnswers((prev?: Attempt["answers"]) => [
        ...(prev ?? []),
        { questionId, optionId, answerText },
      ]);
    }
  };

  const handleSubmitAnswers = async () => {
    submitResponse({ taskId, answers: answers ?? [] });
  };

  const handleResetAnswers = async () => {
    deleteAttempt(undefined, {
      onSuccess: () => {
        setAnswers([]);
      },
    });
  };

  return (
    <div>
      {title && <h2 className="text-lg text-center font-bold mb-2">{title}</h2>}
      {text && <p className="mb-4">{text}</p>}
      <div className="space-y-4 mb-4">
        {questions?.map((question) => (
          <SingleChoiceTask
            value={
              answers?.find((answer) => answer.questionId === question.id)
                ?.optionId || ""
            }
            key={question.id}
            options={question.options}
            prompt={question.prompt}
            orderIndex={question.order_index}
            isIncorrect={Boolean(
              attempt?.incorrectQuestionIds?.includes(question.id),
            )}
            isCorrect={Boolean(
              attempt?.correctQuestionIds?.includes(question.id),
            )}
            onChange={(optionId) => {
              handleSetAnswer(question.id, optionId);
            }}
            disabled={Boolean(attempt?.attemptId) || isSubmitting || isDeleting}
          />
        ))}
      </div>

      {attempt?.attemptId && (
        <TaskSummary score={attempt.score} className="mb-4" />
      )}
      <TaskActions
        onSubmit={handleSubmitAnswers}
        onReset={handleResetAnswers}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        attemptId={attempt?.attemptId ?? null}
        disabled={questions.length !== (answers?.length ?? 0)}
      />
    </div>
  );
}

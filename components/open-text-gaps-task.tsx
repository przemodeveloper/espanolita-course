import type { Question } from "@/models/task";
import { Input } from "./ui/input";
import { useState } from "react";
import type { Attempt } from "../models/attempt";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";
import { TaskSummary } from "./task-summary";
import { TaskActions } from "./task-actions";

const GapFillInput = ({
  sentence,
  onChange,
  value,
  disabled,
}: {
  sentence: string;
  onChange: (answer: string) => void;
  value: string;
  disabled: boolean;
}) => {
  const parts = sentence?.split("______");
  return (
    <span className="flex-1 text-wrap">
      {parts[0]}{" "}
      <Input
        type="text"
        className="w-[100px]"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        disabled={disabled}
      />
      {parts[1]}
    </span>
  );
};

export default function OpenTextGapsTask({
  text,
  questions,
  attempt,
  taskId,
}: {
  text: string;
  questions: Question[];
  attempt?: Attempt | null;
  taskId: string;
}) {
  const parts = text.split("______");

  const sortedQuestions = [...questions].sort(
    (a, b) => a.gap_index - b.gap_index || a.order_index - b.order_index,
  );

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

  function handleChangeAnswer(questionId: string, answer: string) {
    setAnswers((prev) =>
      prev.find((a) => a.questionId === questionId)
        ? prev.map((a) =>
            a.questionId === questionId ? { ...a, answerText: answer } : a,
          )
        : [...prev, { questionId, answerText: answer }],
    );
  }

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

  const disabledInputs =
    Boolean(attempt?.attemptId) || isSubmitting || isDeleting;

  return (
    <div>
      <div className="mb-8">
        {parts.map((part, index) => {
          const question = sortedQuestions[index];
          if (!question) return null;
          return (
            <GapFillInput
              key={question.id}
              sentence={part}
              onChange={(answer) => handleChangeAnswer(question.id, answer)}
              value={
                answers.find((a) => a.questionId === question.id)?.answerText ??
                ""
              }
              disabled={disabledInputs}
            />
          );
        })}
      </div>
      {attempt?.attemptId && <TaskSummary score={attempt.score} />}
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

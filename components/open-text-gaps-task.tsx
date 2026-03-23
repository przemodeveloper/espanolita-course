import type { Question } from "@/models/task";
import { Input } from "./ui/input";
import { Fragment, useState } from "react";
import type { Attempt } from "../models/attempt";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";
import { TaskSummary } from "./task-summary";
import { TaskActions } from "./task-actions";

const GapFillInput = ({
  onChange,
  value,
  disabled,
}: {
  onChange: (answer: string) => void;
  value: string;
  disabled: boolean;
}) => {
  return (
    <Input
      type="text"
      className="w-[100px]"
      onChange={(e) => onChange(e.target.value)}
      value={value}
      disabled={disabled}
    />
  );
};

export default function OpenTextGapsTask({
  text,
  title,
  questions,
  attempt,
  taskId,
}: {
  text: string;
  title?: string;
  questions: Question[];
  attempt?: Attempt | null;
  taskId: string;
}) {
  const parts = text.split("______");

  const sortedQuestions = [...questions].sort(
    (a, b) =>
      (a.gap_index ?? 0) - (b.gap_index ?? 0) || a.order_index - b.order_index,
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
      {title && <h2 className="text-lg text-center font-bold mb-2">{title}</h2>}
      <div className="mb-4">
        {sortedQuestions.map((question, index) => (
          <Fragment key={question.id}>
            <span className="text-wrap">{parts[index] ?? ""}</span>{" "}
            <GapFillInput
              onChange={(answer) => handleChangeAnswer(question.id, answer)}
              value={
                answers.find((a) => a.questionId === question.id)?.answerText ??
                ""
              }
              disabled={disabledInputs}
            />{" "}
          </Fragment>
        ))}
        <span className="text-wrap">{parts[sortedQuestions.length] ?? ""}</span>
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
        disabled={answers.length !== questions.length}
      />
    </div>
  );
}

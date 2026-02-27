"use client";

import type { Question } from "@/models/task";
import { SingleChoiceTask } from "./single-choice-task";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import TaskHeader from "./task-header";
import type { Attempt } from "@/models/attempt";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";

export default function SingleChoiceTasks({
  title,
  instructions,
  questions,
  taskId,
  attempt,
}: {
  questions: Question[];
  title: string;
  instructions: string;
  taskId: string;
  attempt?: Attempt | null;
}) {
  const { mutate: submitResponse } = useSubmitResponse(taskId);
  const { mutate: deleteAttempt } = useDeleteAttempt(taskId);

  const [answers, setAnswers] = useState<Attempt["answers"]>(
    () => attempt?.answers ?? [],
  );

  const handleSetAnswer = (
    questionId: string,
    optionId?: string,
    answerText?: string,
  ) => {
    if (answers.find((answer) => answer.questionId === questionId)) {
      setAnswers((prev) =>
        prev.map((answer) =>
          answer.questionId === questionId
            ? { questionId, optionId, answerText }
            : answer,
        ),
      );
    } else {
      setAnswers((prev) => [...prev, { questionId, optionId, answerText }]);
    }
  };

  const handleSubmitAnswers = async () => {
    submitResponse({ taskId, answers });
  };

  return (
    <div>
      <TaskHeader title={title} instructions={instructions} />

      {questions?.map((question) => (
        <SingleChoiceTask
          value={
            answers.find((answer) => answer.questionId === question.id)
              ?.optionId || ""
          }
          key={question.id}
          options={question.options_v2}
          prompt={question.prompt}
          orderIndex={question.order_index}
          isIncorrect={Boolean(
            attempt?.incorrectQuestionIds?.includes(question.id),
          )}
          onChange={(optionId) => {
            handleSetAnswer(question.id, optionId);
          }}
          disabled={Boolean(attempt?.attemptId)}
        />
      ))}
      {attempt?.attemptId && (
        <div className="bg-green-100 p-2 rounded-md mb-2">
          <p>Wynik tego zadania: {attempt.score}</p>
          <p>To zadanie zostało zakończone</p>
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleSubmitAnswers}
          disabled={
            Boolean(attempt?.attemptId) || questions.length !== answers.length
          }
        >
          Sprawdź odpowiedzi
        </Button>
        <Button
          variant="outline"
          disabled={Boolean(!attempt?.attemptId)}
          onClick={() => deleteAttempt()}
        >
          Zresetuj odpowiedzi
        </Button>
      </div>
    </div>
  );
}

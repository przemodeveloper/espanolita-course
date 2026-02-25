"use client";

import type { Question } from "@/models/task";
import { SingleChoiceTask } from "./single-choice-task";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import TaskHeader from "./task-header";

export default function SingleChoiceTasks({
  title,
  instructions,
  questions,
  taskId,
}: {
  questions: Question[];
  title: string;
  instructions: string;
  taskId: string;
}) {
  const { mutate: submitResponse } = useSubmitResponse();

  const [answers, setAnswers] = useState<
    {
      questionId: string;
      optionId?: string;
      answerText?: string;
    }[]
  >([]);

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
          onChange={(optionId) => {
            handleSetAnswer(question.id, optionId);
          }}
        />
      ))}
      <Button onClick={() => submitResponse({ taskId, answers })}>
        Sprawdź odpowiedzi
      </Button>
    </div>
  );
}

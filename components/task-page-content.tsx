"use client";

import { SingleChoiceTask } from "@/components/single-choice-task";
import { useTask } from "@/queries/useTask";
import { GapFillSharedTask } from "./gap-fill-shared-task";
import OpenTextTask from "./open-text-task";
import LoadingSpinner from "./loading-spinner";
import WritingTask from "./writing-task";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import { useState } from "react";
import { Button } from "./ui/button";

export function TaskPageContent({ taskId }: { taskId: string }) {
  const { task, isLoading } = useTask({ taskId });

  const { mutate: submitResponse } = useSubmitResponse();

  const [answers, setAnswers] = useState<
    {
      questionId: string;
      optionId?: string;
      answerText?: string;
    }[]
  >([]);

  console.log(answers);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <LoadingSpinner />
      </div>
    );
  }

  switch (task?.type) {
    case "single_choice":
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
            <p className="max-w-2xl text-muted-foreground">
              {task?.instructions}
            </p>
          </div>

          {task?.questions_v2?.map((question) => (
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
    case "gap_fill_shared":
      return (
        <div>
          <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
          <p className="max-w-2xl text-muted-foreground mb-4">
            {task?.instructions}
          </p>
          <GapFillSharedTask
            text={task?.content.text}
            options={task?.content.options}
          />
        </div>
      );
    case "open_text":
      return (
        <div>
          <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
          <p className="max-w-2xl text-muted-foreground mb-4">
            {task?.instructions}
          </p>
          {task?.questions_v2.map((question) => (
            <OpenTextTask
              orderIndex={question.order_index}
              key={question.id}
              sentence={question.prompt.sentence}
              keywords={question.prompt.keywords}
            />
          ))}
        </div>
      );
    case "writing":
      return (
        <div>
          <h1 className="text-lg font-bold mb-2">{task?.title}</h1>
          <p className="max-w-2xl text-muted-foreground mb-4">
            {task?.instructions}
          </p>
          <WritingTask />
        </div>
      );
    default:
      return null;
  }
}

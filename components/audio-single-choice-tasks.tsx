"use client";

import type { Question } from "@/models/task";
import { SingleChoiceTask } from "./single-choice-task";
import { Fragment, useMemo, useState } from "react";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import type { Attempt } from "@/models/attempt";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";
import { TaskSummary } from "./task-summary";
import { TaskActions } from "./task-actions";
import AudioPlayer from "./audio-player";

function buildSectionToLabelMap(
  texts: { sections: string[]; label: string }[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of texts) {
    for (const section of entry.sections) {
      if (!map.has(section)) {
        map.set(section, entry.label);
      }
    }
  }
  return map;
}

export default function AudioSingleChoiceTasks({
  text,
  title,
  questions,
  audioUrl,
  taskId,
  attempt,
  texts,
}: {
  text?: string;
  title?: string;
  questions: Question[];
  audioUrl: string;
  taskId: string;
  attempt?: Attempt | null;
  texts: {
    sections: string[];
    label: string;
  }[];
}) {
  const sectionToLabel = useMemo(() => buildSectionToLabelMap(texts), [texts]);

  const labelsInQuestionOrder = useMemo(
    () => questions.map((q) => sectionToLabel.get(q.prompt.section ?? "")),
    [questions, sectionToLabel],
  );

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
      {title && (
        <h2 className="text-lg text-center font-semibold mb-2">{title}</h2>
      )}
      {text && <p className="mb-4">{text}</p>}
      <div className="space-y-4 mb-4">
        <AudioPlayer key={audioUrl} url={audioUrl} />

        {questions?.map((question, index) => {
          const label = labelsInQuestionOrder[index];
          const prevLabel =
            index > 0 ? labelsInQuestionOrder[index - 1] : undefined;
          const showLabel = Boolean(label && label !== prevLabel);
          return (
            <Fragment key={question.id}>
              {showLabel && <p className="mb-4 font-semibold">{label}</p>}
              <SingleChoiceTask
                value={
                  answers?.find((answer) => answer.questionId === question.id)
                    ?.optionId || ""
                }
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
                disabled={
                  Boolean(attempt?.attemptId) || isSubmitting || isDeleting
                }
              />
            </Fragment>
          );
        })}
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

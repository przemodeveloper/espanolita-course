"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import DraggableOption from "./draggable-option";
import Gap from "./gap";
import { Button } from "./ui/button";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import type { Question } from "@/models/task";
import type { Attempt } from "@/models/attempt";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";

type Option = { text: string; id: string; label: string };

export function GapFillSharedTask({
  text,
  options,
  taskId,
  questions,
  attempt,
}: {
  text: string;
  options?: Option[];
  taskId: string;
  questions: Question[];
  attempt?: Attempt | null;
}) {
  const { mutate: submitResponse } = useSubmitResponse(taskId);
  const { mutate: deleteAttempt } = useDeleteAttempt(taskId);

  const questionMap = useMemo(
    () => new Map(questions.map((q) => [q.gap_index, q.id])),
    [questions],
  );

  const gapIndexes = useMemo(() => {
    const matches = [...text.matchAll(/7\.(\d+)/g)];
    return matches.map((m) => Number(m[1]));
  }, [text]);

  const emptyAnswers = useMemo<Record<number, string | null>>(
    () =>
      Object.fromEntries(gapIndexes.map((g) => [g, null])) as Record<
        number,
        string | null
      >,
    [gapIndexes],
  );

  const [answers, setAnswers] = useState<Record<number, string | null>>(() => {
    const initial = { ...emptyAnswers };

    if (!attempt?.answers) return initial;

    const questionIdToGap = new Map(questions.map((q) => [q.id, q.gap_index]));

    for (const a of attempt.answers) {
      const gap = questionIdToGap.get(a.questionId);
      if (gap !== undefined) {
        initial[gap] = a.optionId ?? null;
      }
    }

    return initial;
  });

  function resetAnswers() {
    deleteAttempt(undefined, {
      onSuccess: () => {
        setAnswers(emptyAnswers);
      },
    });
  }

  function handleSubmitAnswers() {
    const formatted = Object.entries(answers)
      .filter((entry): entry is [string, string] => entry[1] != null)
      .flatMap(([gapIndex, optionId]) => {
        const questionId = questionMap.get(Number(gapIndex));
        if (questionId === undefined) return [];
        return [{ questionId, optionId }];
      });

    submitResponse({ taskId, answers: formatted });
  }

  function handleDragEnd(event: DragEndEvent) {
    const optionKey = event.active.id as string;
    const overId = event.over?.id as string | undefined;

    if (!overId) return;

    const gapIndex = Number(overId.replace("gap-", ""));

    setAnswers((prev) => {
      const next = { ...prev };

      // remove previous placement
      Object.keys(next).forEach((k) => {
        if (next[Number(k)] === optionKey) next[Number(k)] = null;
      });

      next[gapIndex] = optionKey;

      return next;
    });
  }

  const usedSet = new Set(Object.values(answers).filter(Boolean));
  const availableOptions = options?.filter((o) => !usedSet.has(o.id)) ?? [];

  const parts = text.split(/7\.\d+\.\s*_____?/g);

  const optionMap = useMemo(
    () => new Map(options?.map((o) => [o.id, o]) ?? []),
    [options],
  );

  const getDisplayValue = (optionId: string | null) =>
    optionId ? (optionMap.get(optionId)?.text ?? null) : null;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="max-w-2xl leading-relaxed text-muted-foreground">
            {parts.map((part, index) => {
              if (index === parts.length - 1) return part;

              const gapIndex = gapIndexes[index];
              if (!gapIndex) return part;

              return (
                <span key={gapIndex}>
                  {part}
                  <Gap
                    value={getDisplayValue(answers[gapIndex])}
                    id={`gap-${gapIndex}`}
                  />
                </span>
              );
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {availableOptions.map((option) => (
            <DraggableOption key={option.id} option={option} />
          ))}
        </div>
        <Button onClick={handleSubmitAnswers}>Sprawdź odpowiedzi</Button>
        <Button onClick={resetAnswers} variant="outline">
          Zresetuj odpowiedzi
        </Button>
      </div>
    </DndContext>
  );
}

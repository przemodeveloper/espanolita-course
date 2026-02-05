"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import DraggableOption from "./draggable-option";
import Gap from "./gap";
import { Button } from "./ui/button";

type Option = { key: string; text: string };

export function GapFillSharedTask({
  text,
  options,
}: {
  text: string;
  options: Option[];
}) {
  const gaps = useMemo(() => {
    const matches = [...text.matchAll(/7\.(\d+)/g)];
    return matches.map((m) => Number(m[1]));
  }, [text]);

  const [answers, setAnswers] = useState<Record<number, string | null>>(
    Object.fromEntries(gaps.map((g) => [g, null])),
  );

  function resetAnswers() {
    setAnswers(Object.fromEntries(gaps.map((g) => [g, null])));
  }

  function handleDragEnd(event: DragEndEvent) {
    const optionKey = event.active.id as string;
    const overId = event.over?.id as string | undefined;

    if (!overId) return;

    const gapIndex = Number(overId.replace("gap-", ""));

    setAnswers((prev) => {
      const next = { ...prev };

      // remove from previous gap
      Object.keys(next).forEach((k) => {
        if (next[Number(k)] === optionKey) next[Number(k)] = null;
      });

      next[gapIndex] = optionKey;
      return next;
    });
  }

  const used = Object.values(answers).filter(Boolean);
  const availableOptions = options.filter((o) => !used.includes(o.key));

  const parts = text.split(/7\.\d+\.\s*_____?/g);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="max-w-2xl leading-relaxed text-muted-foreground">
            {parts.map((part, index) => {
              if (index === parts.length - 1) return part;

              const gapIndex = gaps[index];

              return (
                <span key={gapIndex}>
                  {part}
                  <Gap value={answers[gapIndex]} id={`gap-${gapIndex}`} />
                </span>
              );
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {availableOptions.map((option) => (
            <DraggableOption key={option.key} option={option} />
          ))}
        </div>
        <Button onClick={resetAnswers} variant="outline">
          Zresetuj odpowiedzi
        </Button>
      </div>
    </DndContext>
  );
}

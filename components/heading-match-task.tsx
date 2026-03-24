"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import DraggableOption from "./draggable-option";
import { useSubmitResponse } from "@/queries/useSubmitResponse";
import type { Attempt } from "@/models/attempt";
import type { HeadingItem, Question } from "@/models/task";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";
import { TaskSummary } from "./task-summary";
import { TaskActions } from "./task-actions";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const headingDragId = (label: string) => `heading-${label}`;

function parseHeadingDragId(id: string): string | null {
  if (!id.startsWith("heading-")) return null;
  return id.slice("heading-".length);
}

function HeadingSectionSlot({
  questionId,
  label,
  headingText,
  disabled,
  onRemove,
}: {
  questionId: string;
  label: string | null;
  headingText: string | null;
  disabled: boolean;
  onRemove: () => void;
}) {
  const droppableId = `section-${questionId}`;
  const { isOver, setNodeRef } = useDroppable({ id: droppableId });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[4.5rem] min-w-[min(100%,14rem)] shrink-0 flex-col justify-center rounded-lg border border-dashed px-3 py-2 text-sm transition-colors md:max-w-[20rem]",
        isOver
          ? "border-orange-400 bg-orange-50/80"
          : "border-gray-200 bg-muted/30",
        disabled && "opacity-60",
      )}
    >
      {label && headingText ? (
        <div className="flex items-start gap-2">
          <strong className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
            {label}
          </strong>
          <span className="line-clamp-4 leading-snug" title={headingText}>
            {headingText}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className={cn(
              "ml-auto shrink-0",
              disabled && "pointer-events-none opacity-50",
            )}
            onClick={onRemove}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <span className="text-center">Przeciągnij nagłówek</span>
      )}
    </div>
  );
}

function buildInitialAssignments(
  questions: Question[],
  attempt: Attempt | null | undefined,
): Record<string, string | null> {
  const initial: Record<string, string | null> = {};
  for (const q of questions) {
    initial[q.id] = null;
  }
  if (!attempt?.answers) return initial;
  for (const a of attempt.answers) {
    if (a.answerText) {
      initial[a.questionId] = a.answerText.trim().toUpperCase();
    }
  }
  return initial;
}

export function HeadingMatchTask({
  headings,
  questions,
  taskId,
  attempt,
}: {
  headings: HeadingItem[];
  questions: Question[];
  taskId: string;
  attempt?: Attempt | null;
}) {
  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.order_index - b.order_index),
    [questions],
  );

  const labelToText = useMemo(
    () => new Map(headings.map((h) => [h.label.toUpperCase(), h.text])),
    [headings],
  );

  const { mutate: submitResponse, isPending: isSubmitting } =
    useSubmitResponse(taskId);
  const { mutate: deleteAttempt, isPending: isDeleting } =
    useDeleteAttempt(taskId);

  const [assignments, setAssignments] = useState<Record<string, string | null>>(
    () => buildInitialAssignments(sortedQuestions, attempt),
  );

  const disabled = Boolean(attempt?.attemptId) || isSubmitting || isDeleting;

  const usedLabels = new Set(
    Object.values(assignments).filter((v): v is string => Boolean(v)),
  );

  const availableHeadings = headings.filter(
    (h) => !usedLabels.has(h.label.toUpperCase()),
  );

  function handleDragEnd(event: DragEndEvent) {
    const label = parseHeadingDragId(String(event.active.id));
    const overId = event.over?.id ? String(event.over.id) : null;

    if (!label || !overId?.startsWith("section-")) return;

    const questionId = overId.replace("section-", "");

    setAssignments((prev) => {
      const next = { ...prev };
      for (const qid of Object.keys(next)) {
        if (next[qid]?.toUpperCase() === label.toUpperCase()) {
          next[qid] = null;
        }
      }
      next[questionId] = label.toUpperCase();
      return next;
    });
  }

  function handleSubmit() {
    const answers = sortedQuestions.map((q) => ({
      questionId: q.id,
      answerText: assignments[q.id] ?? "",
    }));
    submitResponse({ taskId, answers });
  }

  function handleReset() {
    deleteAttempt(undefined, {
      onSuccess: () => {
        setAssignments(buildInitialAssignments(sortedQuestions, null));
      },
    });
  }

  const allFilled = sortedQuestions.every(
    (q) => assignments[q.id] != null && assignments[q.id] !== "",
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-4 mb-4">
        {sortedQuestions.map((question) => {
          const label = assignments[question.id];
          const headingText = label ? (labelToText.get(label) ?? null) : null;

          return (
            <div
              key={question.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:gap-6">
                <HeadingSectionSlot
                  questionId={question.id}
                  label={label}
                  headingText={headingText}
                  disabled={disabled}
                  onRemove={() =>
                    setAssignments((prev) => ({
                      ...prev,
                      [question.id]: null,
                    }))
                  }
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="leading-relaxed text-foreground">
                    {question.prompt.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap gap-3">
          {availableHeadings.map((h) => (
            <DraggableOption
              key={headingDragId(h.label)}
              option={{
                id: headingDragId(h.label),
                label: h.label,
                text: h.text,
              }}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {attempt?.attemptId && (
        <TaskSummary score={attempt.score} className="mb-4" />
      )}
      <TaskActions
        onSubmit={handleSubmit}
        onReset={handleReset}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        attemptId={attempt?.attemptId ?? null}
        disabled={!allFilled}
      />
    </DndContext>
  );
}

"use client";

import type { Option } from "@/models/task";
import { Options } from "./options";
import { Fragment } from "react/jsx-runtime";
import { TaskLabel } from "./task-label";
import { CircleCheck, CircleX } from "lucide-react";

export function SingleChoiceTask({
  orderIndex,
  options,
  prompt,
  onChange,
  value,
  isIncorrect,
  isCorrect,
  disabled,
}: {
  orderIndex: number;
  options: Option[];
  prompt?: {
    lines?: string[];
  };
  onChange: (optionId: string) => void;
  value: string;
  isIncorrect: boolean;
  isCorrect: boolean;
  disabled: boolean;
}) {
  return (
    <div className="mb-8 border border-gray-200 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <TaskLabel label={`Przykład ${orderIndex}`} />
        {isIncorrect && (
          <div className="flex items-center gap-2 mb-2">
            <CircleX className="size-4 text-red-500" />
            <p className="text-red-500">Nieprawidłowa odpowiedź</p>
          </div>
        )}
        {isCorrect && (
          <div className="flex items-center gap-2 mb-2">
            <CircleCheck className="size-4 text-green-500" />
            <p className="text-green-500">Poprawna odpowiedź</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        {prompt?.lines?.map((line: string) => (
          <Fragment key={line}>
            <p>{line}</p>
          </Fragment>
        ))}
      </div>

      <Options
        options={options}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  );
}

"use client";

import type { Option } from "@/models/task";
import { Options } from "./options";
import { Fragment } from "react/jsx-runtime";
import { TaskLabel } from "./task-label";

export function SingleChoiceTask({
  orderIndex,
  options,
  prompt,
  onChange,
  value,
  isIncorrect,
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
  disabled: boolean;
}) {
  return (
    <div className="mb-8">
      <TaskLabel label={`Przykład ${orderIndex}`} />
      {isIncorrect && (
        <p className="text-red-500 mb-2">Nieprawidłowa odpowiedź</p>
      )}
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

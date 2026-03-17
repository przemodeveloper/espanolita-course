"use client";

import type { Option } from "@/models/task";
import { Options } from "./options";
import { Fragment } from "react/jsx-runtime";

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
      <h2 className="text-sm mb-1 font-bold">Przykład {orderIndex}</h2>
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

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
}: {
  orderIndex: number;
  options: Option[];
  prompt?: {
    lines?: string[];
  };
  onChange: (optionId: string) => void;
  value: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-sm mb-2">Przykład {orderIndex}</h2>
      <div className="mb-4">
        {prompt?.lines?.map((line: string) => (
          <Fragment key={line}>
            <p>{line}</p>
          </Fragment>
        ))}
      </div>

      <Options options={options} onChange={onChange} value={value} />
    </div>
  );
}

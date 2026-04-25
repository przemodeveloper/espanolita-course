"use client";

import { TaskLabel } from "./task-label";
import { Input } from "./ui/input";

const GapFillInput = ({
  sentence,
  onChange,
  value,
  disabled,
}: {
  sentence: string;
  onChange: (answer: string) => void;
  value: string;
  disabled: boolean;
}) => {
  const parts = sentence?.split("______");
  return (
    <div className="flex gap-2">
      <span className="flex-1">
        {parts[0]}{" "}
        <Input
          type="text"
          className="w-full"
          onChange={(e) => onChange(e.target.value)}
          value={value}
          disabled={disabled}
        />
        {parts[1]}
      </span>
    </div>
  );
};

export default function OpenTextTask({
  orderIndex,
  sentence,
  keywords,
  onChange,
  value,
  disabled,
}: {
  orderIndex: number;
  sentence?: string;
  keywords?: string[];
  onChange: (answer: string) => void;
  value: string;
  disabled: boolean;
}) {
  return (
    <div className="border border-gray-200 p-4 rounded-lg">
      <TaskLabel label={`Przykład ${orderIndex}`} />
      <div className="mb-4">
        {sentence && (
          <GapFillInput
            sentence={sentence}
            onChange={onChange}
            value={value}
            disabled={disabled}
          />
        )}
      </div>
      <p className="text-sm italic text-gray-500">{keywords?.join(", ")}</p>
    </div>
  );
}

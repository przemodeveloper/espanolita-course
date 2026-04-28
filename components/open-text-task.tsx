"use client";

import { TaskLabel } from "./task-label";
import { Input } from "./ui/input";
import { CircleCheck, CircleX } from "lucide-react";

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
          className="w-[200px]"
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
  isCorrect,
  isIncorrect,
}: {
  orderIndex: number;
  sentence?: string;
  keywords?: string[];
  onChange: (answer: string) => void;
  value: string;
  disabled: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
}) {
  return (
    <div className="border border-gray-200 p-4 rounded-lg">
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

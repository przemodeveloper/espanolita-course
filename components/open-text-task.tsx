"use client";

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
          className="w-[300px]"
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
    <div>
      <h2 className="text-sm mb-2 font-bold">Przykład {orderIndex}</h2>
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
      <div className="mb-4">
        <p className="text-sm font-semibold">{keywords?.join(", ")}</p>
      </div>
    </div>
  );
}

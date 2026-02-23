"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Option } from "@/models/task";

export function Options({
  options,
  onChange,
  value,
}: {
  options: Option[];
  onChange: (optionId: string) => void;
  value: string;
}) {
  return (
    <RadioGroup
      className="w-fit"
      value={value}
      onValueChange={(value) => onChange(value)}
    >
      {options.map((option) => (
        <div key={option.id} className="flex items-center gap-3">
          <RadioGroupItem value={option.id} id={option.id} />
          <Label htmlFor={option.id}>{option.text}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Option } from "@/models/task";
import { useState } from "react";

export function Options({ options }: { options: Option[] }) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  return (
    <RadioGroup
      className="w-fit"
      value={selectedOption?.id}
      onValueChange={(value) =>
        setSelectedOption(options.find((option) => option.id === value) || null)
      }
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

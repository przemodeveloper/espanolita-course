"use client";

import { Input } from "./ui/input";

const GapFillInput = ({ sentence }: { sentence: string }) => {
  const parts = sentence?.split("______");
  return (
    <div className="flex gap-2">
      <span className="flex-1">
        {parts[0]} <Input type="text" className="w-[300px]" />
        {parts[1]}
      </span>
    </div>
  );
};

export default function OpenTextTask({
  orderIndex,
  sentence,
  keywords,
}: {
  orderIndex: number;
  sentence?: string;
  keywords?: string[];
}) {
  return (
    <div>
      <h2 className="text-sm mb-2">Przykład {orderIndex}</h2>
      <div className="mb-4">
        {sentence && <GapFillInput sentence={sentence} />}
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold">{keywords?.join(", ")}</p>
      </div>
    </div>
  );
}

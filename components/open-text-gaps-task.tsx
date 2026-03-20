import { Question } from "@/models/task";
import { Input } from "./ui/input";
import { useState } from "react";

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
    <span className="flex-1 text-wrap">
      {parts[0]}{" "}
      <Input
        type="text"
        className="w-[100px]"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        disabled={disabled}
      />
      {parts[1]}
    </span>
  );
};

export default function OpenTextGapsTask({
  text,
  title,
  questions,
}: {
  text: string;
  title: string;
  questions: Question[];
}) {
  const parts = text.split("______");
  const [answers, setAnswers] = useState<string[]>([]);

  function handleChangeAnswer(index: number, answer: string) {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = answer;
      return newAnswers;
    });
  }

  return (
    <div>
      <h1>{title}</h1>
      {parts.map((part, index) => {
        return (
          <GapFillInput
            key={part}
            sentence={part}
            onChange={(answer) => handleChangeAnswer(index, answer)}
            value={answers[index] ?? ""}
            disabled={false}
          />
        );
      })}
    </div>
  );
}

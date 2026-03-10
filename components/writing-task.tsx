import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import type { RubricItem } from "@/models/grading";
import { useGradeEssay } from "@/queries/useGradeEssay";

interface WritingTaskProps {
  taskId: string;
  instructions: string;
  language: string;
  minWords: number;
  maxWords: number;
  requirements: string[];
  rubric: RubricItem[];
  openingText: string;
}

export default function WritingTask({
  taskId,
  instructions,
  language,
  minWords,
  maxWords,
  requirements,
  rubric,
  openingText,
}: WritingTaskProps) {
  const { mutate: gradeEssay } = useGradeEssay(taskId);
  const [essay, setEssay] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChangeEssay = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssay(e.target.value);
    if (error !== null) {
      setError(null);
    }
  };

  const handleGradeEssay = () => {
    if (essay.length < minWords) {
      setError(`Wypracowanie musi mieć co najmniej ${minWords} słów`);
      return;
    }
    gradeEssay({
      language,
      task: instructions,
      wordLimit: {
        min: minWords,
        max: maxWords,
      },
      requirements,
      rubric,
      essay,
    });
  };

  const handleResetEssay = () => {
    setEssay("");
  };

  return (
    <div className="flex flex-col gap-4">
      <ul>
        {requirements?.map((requirement) => (
          <li className="list-disc list-inside" key={requirement}>
            {requirement}
          </li>
        ))}
      </ul>
      Oceniane są
      <ul>
        <li className="list-disc list-inside">
          długość wypowiedzi (min. {minWords} słów, max. {maxWords} słów)
        </li>
        {rubric?.map((rubric) => (
          <li className="list-disc list-inside" key={rubric.name}>
            {rubric.name} ({rubric.weight} punktów)
          </li>
        ))}
      </ul>
      <p className="font-bold">{openingText}</p>
      <Textarea
        className="w-full h-[500px]"
        value={essay}
        onChange={handleChangeEssay}
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleGradeEssay}>
          Sprawdź wypracowanie
        </Button>
        <Button variant="outline" onClick={handleResetEssay} disabled={!essay}>
          Zresetuj wypracowanie
        </Button>
      </div>
    </div>
  );
}

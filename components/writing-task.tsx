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

  const handleGradeEssay = () => {
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

  return (
    <div className="flex flex-col  gap-4">
      <ul>
        {requirements?.map((requirement) => (
          <li className="list-disc list-inside" key={requirement}>
            {requirement}
          </li>
        ))}
      </ul>
      Oceniane są
      <ul>
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
        onChange={(e) => setEssay(e.target.value)}
      />
      <Button variant="outline" onClick={handleGradeEssay} disabled={!essay}>
        Sprawdź
      </Button>
    </div>
  );
}

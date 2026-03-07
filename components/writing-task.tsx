import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import type { RubricItem } from "@/models/grading";

interface WritingTaskProps {
  language?: string;
  maxScore?: number;
  minWords?: number;
  maxWords?: number;
  requirements?: string[];
  rubric?: RubricItem[];
  openingText?: string;
}
export default function WritingTask({
  language,
  maxScore,
  minWords,
  maxWords,
  requirements,
  rubric,
  openingText,
}: WritingTaskProps) {
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
      <Textarea className="w-full h-[500px]" />
      <Button variant="outline">Sprawdź</Button>
    </div>
  );
}

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import type { RubricItem } from "@/models/grading";
import { useGradeEssay } from "@/queries/useGradeEssay";
import { useDeleteAttempt } from "@/queries/useDeleteAttempt";
import type { Attempt } from "@/models/attempt";

interface WritingTaskProps {
  attempt?: Attempt;
  taskId: string;
  instructions: string;
  language: string;
  minWords: number;
  maxWords: number;
  requirements: string[];
  rubric: RubricItem[];
}

export default function WritingTask({
  attempt,
  taskId,
  instructions,
  language,
  minWords,
  maxWords,
  requirements,
  rubric,
}: WritingTaskProps) {
  const { mutate: gradeEssay, isPending: isSubmitting } = useGradeEssay(taskId);
  const { mutate: deleteAttempt, isPending: isDeleting } =
    useDeleteAttempt(taskId);
  const [essay, setEssay] = useState(() => attempt?.answerText ?? "");
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
    deleteAttempt(undefined, {
      onSuccess: () => {
        setEssay("");
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="border border-gray-200 p-4 rounded-lg">
        <p className="font-semibold text-lg mb-4">Twoja odpowiedź</p>
        <Textarea
          className="w-full h-[500px] bg-gray-100 resize-none"
          value={essay}
          onChange={handleChangeEssay}
          disabled={Boolean(attempt?.attemptId)}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {attempt?.grading && (
        <div className="bg-green-50 border border-green-200 p-2 rounded-md mb-2">
          <p>
            <span className="font-bold">Wynik:</span>{" "}
            {attempt?.grading?.totalScore}
          </p>
          <ul>
            {attempt?.grading?.missingPoints?.map((item) => (
              <li className="list-disc list-inside" key={item}>
                {item}
              </li>
            ))}
          </ul>
          <p>
            <span className="font-bold">Podsumowanie:</span>{" "}
            {attempt?.grading?.feedback}
          </p>
        </div>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant="outline"
          disabled={Boolean(attempt?.attemptId) || isSubmitting || isDeleting}
          onClick={handleGradeEssay}
        >
          {isSubmitting ? "Sprawdzam wypracowanie..." : "Sprawdź wypracowanie"}
        </Button>
        <Button
          variant="outline"
          onClick={handleResetEssay}
          disabled={
            Boolean(!attempt?.attemptId) || !essay || isSubmitting || isDeleting
          }
        >
          {isDeleting ? "Resetuję wypracowanie..." : "Zresetuj wypracowanie"}
        </Button>
      </div>
    </div>
  );
}

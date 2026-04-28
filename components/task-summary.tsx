import { cn } from "@/lib/utils";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { CircleAlert } from "lucide-react";

const BreakdownSection = ({
  breakdown,
}: {
  breakdown: {
    category: string;
    score: number;
    reasoning: string;
  }[];
}) => {
  return (
    <div className="p-4">
      <p className="font-semibold text-gray-700 mb-2">Wyjaśnienie:</p>
      <div className="space-y-2">
        {breakdown.map((item) => (
          <BreakdownItem
            key={item.category}
            category={item.category}
            reasoning={item.reasoning}
            score={item.score}
          />
        ))}
      </div>
    </div>
  );
};

const BreakdownItem = ({
  category,
  reasoning,
  score,
}: {
  category: string;
  reasoning: string;
  score: number;
}) => {
  return (
    <div
      className={cn(
        score === 0 &&
          "bg-red-50 border-red-200 border-2 p-2 rounded-md text-red-800",
        score > 0 &&
          "bg-green-50 border-green-200 border-2 p-2 rounded-md text-green-800",
      )}
    >
      <p className="font-semibold text-sm">{category}</p>
      <p>{reasoning}</p>
    </div>
  );
};

export function TaskSummary({
  score,
  className,
  breakdown,
  maxScore,
  feedback,
  missingPoints,
}: {
  score: number;
  className?: string;
  breakdown?: {
    category: string;
    score: number;
    reasoning: string;
  }[];
  maxScore: number;
  feedback?: string;
  missingPoints?: string[];
}) {
  return (
    <div
      className={cn(
        "bg-white border-2 border-gray-200 rounded-md mb-2 space-y-2",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-x-4 border-b border-gray-200 p-4",
          score === maxScore
            ? "bg-green-50"
            : score === 0
              ? "bg-red-50"
              : "bg-orange-50",
        )}
      >
        {score === maxScore ? (
          <CheckCircleIcon className="size-6 text-green-500" />
        ) : score === 0 ? (
          <XCircleIcon className="size-6 text-red-500" />
        ) : (
          <CircleAlert className="size-6 text-orange-500" />
        )}
        <p className="font-semibold text-gray-700">Zadanie zakończone</p>
        <div
          className={cn(
            "flex flex-col items-center gap-1 w-fit bg-white",
            score === maxScore
              ? "text-green-500 border-green-500 border-2 py-2 px-4 rounded-md"
              : score === 0
                ? "text-red-500 border-red-500 border-2 py-2 px-4 rounded-md"
                : "text-orange-500 border-orange-500 border-2 py-2 px-4 rounded-md",
          )}
        >
          <p className="text-2xl font-bold">{score}</p>
          <div>
            <p className="text-sm font-semibold text-gray-500">z {maxScore}</p>
          </div>
        </div>
      </div>

      {breakdown && <BreakdownSection breakdown={breakdown} />}
      {feedback && (
        <p className="text-gray-500 font-semibold p-4">{feedback}</p>
      )}
      {missingPoints && missingPoints.length > 0 && (
        <p className="text-sm text-gray-500 p-4">
          <span className="font-semibold">Brakujące punkty:</span>{" "}
          {missingPoints.join(", ")}
        </p>
      )}
    </div>
  );
}

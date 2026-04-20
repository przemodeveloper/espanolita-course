import { cn } from "@/lib/utils";

export function TaskSummary({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-green-50 border border-green-200 p-2 rounded-md mb-2",
        className,
      )}
    >
      <p>Wynik tego zadania: {score}</p>
      <p>To zadanie zostało zakończone</p>
    </div>
  );
}

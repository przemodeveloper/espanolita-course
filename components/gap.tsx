import { useDroppable } from "@dnd-kit/core";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Gap({
  id,
  value,
  disabled,
  onRemoveAnswer,
}: {
  id: string;
  value: string | null;
  disabled: boolean;
  onRemoveAnswer: () => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <span
      ref={setNodeRef}
      className={`mx-2 inline-flex min-w-[40px] items-center justify-center rounded-md border px-2 py-1 text-sm
        ${isOver ? "bg-muted" : "bg-background"} ${disabled ? "opacity-50" : ""}`}
    >
      {value ?? "____"}

      {value && (
        <Button
          variant="outline"
          size="xs"
          className={cn("ml-2", disabled && "opacity-50 pointer-events-none")}
          onClick={onRemoveAnswer}
        >
          <XIcon className="size-4" />
        </Button>
      )}
    </span>
  );
}

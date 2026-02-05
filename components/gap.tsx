import { useDroppable } from "@dnd-kit/core";

export default function Gap({
  id,
  value,
}: {
  id: string;
  value: string | null;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <span
      ref={setNodeRef}
      className={`mx-2 inline-flex min-w-[40px] items-center justify-center rounded-md border px-2 py-1 text-sm
        ${isOver ? "bg-muted" : "bg-background"}`}
    >
      {value ?? "____"}
    </span>
  );
}

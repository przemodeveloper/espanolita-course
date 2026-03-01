import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function DraggableOption({
  option,
}: {
  option: { id: string; text: string; label: string };
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: option.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-xl border bg-white px-3 py-2 shadow-sm hover:shadow-md"
    >
      <strong>{option.label}.</strong> {option.text}
    </div>
  );
}

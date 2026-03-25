import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function DraggableOption({
  option,
  disabled,
}: {
  option: { id: string; text: string; label: string };
  disabled: boolean;
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
      className={`flex touch-none items-center gap-2 cursor-grab rounded-lg bg-white border border-gray-200 p-2 shadow-sm hover:shadow-md active:cursor-grabbing ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <strong className="text-lg inline-flex items-center justify-center rounded-full bg-orange-100 w-8 h-8 text-orange-700 leading-none font-semibold flex-shrink-0 text-xs">
        {option.label}
      </strong>
      <span>{option.text}</span>
    </div>
  );
}

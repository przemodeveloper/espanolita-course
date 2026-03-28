import { cn } from "@/lib/utils";

export function TaskLabel({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn("bg-orange-200 px-2 py-1 rounded-md mb-2 w-fit", className)}
    >
      <p className="font-semibold text-sm text-orange-700">{label}</p>
    </div>
  );
}

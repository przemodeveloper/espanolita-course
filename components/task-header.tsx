import { cn } from "@/lib/utils";
import { Instructions } from "./instructions";

export default function TaskHeader({
  title,
  instructions,
  className,
}: {
  title: string;
  instructions: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 w-full", className)}>
      <h1 className="text-lg font-bold mb-2">{title}</h1>
      <Instructions>{instructions}</Instructions>
    </div>
  );
}

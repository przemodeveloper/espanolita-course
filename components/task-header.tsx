import { cn } from "@/lib/utils";

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
    <div className={cn("mb-8", className)}>
      <h1 className="text-lg font-bold mb-2">{title}</h1>
      <p className="max-w-2xl text-muted-foreground">{instructions}</p>
    </div>
  );
}

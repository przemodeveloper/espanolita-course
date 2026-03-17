import { cn } from "@/lib/utils";

export const Instructions = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "p-4 bg-blue-50 rounded-lg border border-blue-200",
        className,
      )}
    >
      <h2 className="font-semibold text-lg mb-4">Instrukcje</h2>
      {children}
    </div>
  );
};

import { Button } from "./ui/button";

export function TaskActions({
  onSubmit,
  onReset,
  isSubmitting,
  isDeleting,
  disabled,
  attemptId,
}: {
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting: boolean;
  isDeleting: boolean;
  disabled: boolean;
  attemptId: string | null;
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={onSubmit}
        disabled={disabled || Boolean(attemptId) || isSubmitting || isDeleting}
      >
        {isSubmitting ? "Sprawdzam odpowiedzi..." : "Sprawdź odpowiedzi"}
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        disabled={Boolean(!attemptId) || isSubmitting || isDeleting}
      >
        {isDeleting ? "Resetuję odpowiedzi..." : "Zresetuj odpowiedzi"}
      </Button>
    </div>
  );
}

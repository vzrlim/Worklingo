import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "cn";

interface QuizOptionProps {
  text: string;
  index: number;
  isSelected: boolean;
  isAnswered: boolean;
  isCorrect: boolean;
  onSelect: (index: number) => void;
}

export function QuizOption({
  text,
  index,
  isSelected,
  isAnswered,
  isCorrect,
  onSelect,
}: QuizOptionProps) {
  let styleClasses = "border-border text-foreground hover:bg-muted";
  let statusBadge = null;

  if (isAnswered) {
    if (isCorrect) {
      styleClasses =
        "bg-success-soft border-success text-foreground font-medium";
      statusBadge = (
        <span className="flex items-center gap-1 text-xs text-success font-semibold shrink-0">
          <CheckCircle2 className="size-4" /> Correct
        </span>
      );
    } else if (isSelected) {
      styleClasses = "bg-danger-soft border-destructive text-foreground";
      statusBadge = (
        <span className="flex items-center gap-1 text-xs text-destructive font-semibold shrink-0">
          <XCircle className="size-4" /> Incorrect
        </span>
      );
    } else {
      styleClasses = "border-border text-muted-foreground opacity-50";
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      disabled={isAnswered}
      onClick={() => onSelect(index)}
      className={cn(
        "w-full h-auto min-h-12 py-3 px-4 flex items-center justify-between gap-3 text-left whitespace-normal leading-snug rounded-lg transition-colors cursor-pointer",
        styleClasses,
        isAnswered && "cursor-default"
      )}
    >
      <span className="flex-1 font-sans text-sm md:text-base">{text}</span>
      {statusBadge}
    </Button>
  );
}

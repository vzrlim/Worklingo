import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InterviewQuestion } from "@/data/interview-questions";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: InterviewQuestion;
  isSelected: boolean;
  onSelect: (question: InterviewQuestion) => void;
}

const FRAMEWORK_LABEL: Record<InterviewQuestion["framework"], string> = {
  STAR: "STAR",
  SEAT: "SEAT",
  CHECKLIST: "Checklist",
};

export function QuestionCard({
  question,
  isSelected,
  onSelect,
}: QuestionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(question)}
      aria-pressed={isSelected}
      className="group block w-full text-left rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer"
    >
      <Card
        className={cn(
          "transition-colors border border-border shadow-xs group-hover:border-primary/50",
          isSelected
            ? "ring-2 ring-primary bg-secondary border-primary shadow-sm"
            : "bg-card"
        )}
      >
        <CardHeader className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant={isSelected ? "default" : "outline"}
              className="text-xs font-sans"
            >
              {FRAMEWORK_LABEL[question.framework]}
            </Badge>
            {isSelected && (
              <span className="text-xs font-semibold text-primary font-sans">
                Selected
              </span>
            )}
          </div>
          <p className="font-serif text-base font-semibold leading-snug text-foreground">
            {question.prompt}
          </p>
        </CardHeader>
      </Card>
    </button>
  );
}

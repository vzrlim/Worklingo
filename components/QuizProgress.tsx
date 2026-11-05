import { Progress, ProgressLabel } from "@/components/ui/progress";

interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = Math.round((current / total) * 100);

  // The shadcn Progress renders its own track + indicator after the children.
  return (
    <Progress value={percentage} className="w-full gap-x-3 gap-y-1.5">
      <ProgressLabel className="text-xs font-normal text-muted-foreground font-sans">
        Question {current} of {total}
      </ProgressLabel>
      <span
        aria-hidden="true"
        className="ml-auto text-xs font-medium text-foreground font-sans tabular-nums"
      >
        {current} / {total}
      </span>
    </Progress>
  );
}

"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LIMITS } from "@/lib/config";
import { cn } from "cn";

interface AnswerBoxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AnswerBox({ value, onChange, disabled }: AnswerBoxProps) {
  const charCount = value.length;
  const isTooShort = charCount > 0 && charCount < LIMITS.MIN_ANSWER_LENGTH;
  const isTooLong = charCount > LIMITS.MAX_ANSWER_LENGTH;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="interview-answer" className="font-serif text-sm font-semibold">
          Your Answer
        </Label>
        <span
          className={cn(
            "text-xs font-sans tabular-nums",
            isTooLong
              ? "text-destructive font-semibold"
              : isTooShort
              ? "text-warn"
              : "text-muted-foreground"
          )}
        >
          {charCount} / {LIMITS.MAX_ANSWER_LENGTH}
        </span>
      </div>

      <Textarea
        id="interview-answer"
        rows={6}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here, or tap the microphone above to speak out loud..."
        className={cn(
          "w-full resize-y font-sans text-base leading-relaxed bg-card border-border",
          isTooLong && "border-destructive focus-visible:ring-destructive",
          isTooShort && "border-warn/60"
        )}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground font-sans">
        <span>Speak or type. Aim for 1–2 minutes (about 120–250 words).</span>
        {isTooShort && (
          <span className="text-warn font-medium">Min 20 characters</span>
        )}
      </div>
    </div>
  );
}

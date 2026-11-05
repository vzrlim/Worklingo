"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OfflineNotice } from "@/components/OfflineNotice";
import { Laurel } from "@/components/greek";
import { FeedbackResponse } from "@/lib/feedback-schema";
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";

interface FeedbackPanelProps {
  feedback: FeedbackResponse;
  onTryAgain: () => void;
  onNextQuestion: () => void;
}

export function FeedbackPanel({
  feedback,
  onTryAgain,
  onNextQuestion,
}: FeedbackPanelProps) {
  const [copied, setCopied] = useState(false);
  const scoreNumber = (
    <div className="flex items-baseline gap-1 mt-0.5">
      <span className="font-serif text-4xl font-bold text-primary">
        {feedback.overallScore}
      </span>
      <span className="text-lg text-muted-foreground font-sans">/ 10</span>
    </div>
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(feedback.improvedAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const getSourceBadge = () => {
    switch (feedback.source) {
      case "ai":
        return (
          <Badge variant="default" className="text-xs bg-primary text-primary-foreground font-sans">
            AI Coach
          </Badge>
        );
      case "ai-backup":
        return (
          <Badge variant="secondary" className="text-xs font-sans">
            AI Coach (Backup)
          </Badge>
        );
      case "offline":
      default:
        return (
          <Badge variant="outline" className="text-xs border-warn text-warn font-sans">
            Offline Coach Mode
          </Badge>
        );
    }
  };

  return (
    <div aria-live="polite" className="space-y-6 animate-in fade-in duration-300">
      {feedback.source === "offline" && <OfflineNotice />}

      <Card className="border-border shadow-sm">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-sans uppercase tracking-wider">
                Overall Assessment
              </span>
              {feedback.overallScore >= 8 ? (
                <Laurel className="h-24 w-28 -ml-3">{scoreNumber}</Laurel>
              ) : (
                scoreNumber
              )}
            </div>
            <div>{getSourceBadge()}</div>
          </div>
          <CardDescription className="text-xs text-muted-foreground font-sans">
            Detailed breakdown based on essential workplace interview standards.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 pt-5">
          {/* Element Checklist */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wide text-foreground">
              Framework Elements
            </h4>
            <div className="space-y-2">
              {feedback.elements.map((el, idx) => (
                <div
                  key={`el-${idx}`}
                  className="p-3 rounded-lg border border-border bg-card/60 flex items-start gap-2.5 text-xs font-sans"
                >
                  {el.present ? (
                    <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 flex-1">
                    <span className="font-semibold text-foreground">
                      {el.name}: {el.present ? "Present" : "Missing / Needs Polish"}
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {el.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          {feedback.strengths.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-success">
                <ThumbsUp className="size-4" />
                <h4 className="font-serif text-sm font-semibold text-foreground">
                  Key Strengths
                </h4>
              </div>
              <ul className="space-y-1.5 pl-5 list-disc text-xs font-sans text-muted-foreground leading-relaxed">
                {feedback.strengths.map((str, idx) => (
                  <li key={`str-${idx}`}>{str}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {feedback.improvements.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-warn">
                <TrendingUp className="size-4" />
                <h4 className="font-serif text-sm font-semibold text-foreground">
                  Areas to Polish
                </h4>
              </div>
              <ul className="space-y-1.5 pl-5 list-disc text-xs font-sans text-muted-foreground leading-relaxed">
                {feedback.improvements.map((imp, idx) => (
                  <li key={`imp-${idx}`}>{imp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Improved Answer */}
          {feedback.improvedAnswer && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-semibold text-foreground">
                  Coach&apos;s Reformulated Answer
                </h4>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleCopy}
                  className="gap-1 text-xs cursor-pointer text-primary"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-success" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
              <div className="p-3.5 rounded-lg bg-secondary text-secondary-foreground border border-border/80 font-sans text-xs leading-relaxed whitespace-pre-line italic">
                {feedback.improvedAnswer}
              </div>
            </div>
          )}

          {/* Communication Tip */}
          {feedback.communicationTip && (
            <div className="p-3 rounded-lg border border-border bg-secondary/40 flex items-start gap-2.5 text-xs font-sans">
              <Lightbulb className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary font-semibold">Delivery Tip: </strong>
                <span className="text-foreground">{feedback.communicationTip}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2.5 pt-2">
            <Button
              size="lg"
              onClick={onNextQuestion}
              className="w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              Next Question
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onTryAgain}
              className="w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="size-4" />
              Try Again With Same Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

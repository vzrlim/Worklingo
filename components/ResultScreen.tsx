import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, IG_HANDLE } from "@/lib/config";
import { Laurel } from "@/components/greek";
import { Award, RotateCcw, ArrowRight, Sparkles } from "lucide-react";

interface ResultScreenProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
}

export function ResultScreen({ score, total, onPlayAgain }: ResultScreenProps) {
  const xpEarned = score * 10 + 20;
  const isBadgeEarned = score >= 8;
  const scoreNumber = (
    <div className="font-serif text-5xl font-bold tracking-tight text-primary">
      {score}{" "}
      <span className="text-2xl text-muted-foreground font-normal">
        / {total}
      </span>
    </div>
  );

  let feedbackMessage =
    "Good attempt! Review the workplace insights and try again to improve your score.";
  if (score >= 9) {
    feedbackMessage =
      "Exceptional workplace instincts! You're ready to navigate team and interview scenarios like a pro.";
  } else if (score >= 7) {
    feedbackMessage =
      "Great job! You have solid foundational instincts for workplace communication.";
  }

  return (
    <Card className="text-center">
      <CardHeader className="space-y-3 pb-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <Award className="size-8" />
        </div>
        <CardTitle className="font-serif text-2xl font-bold">
          Quiz Completed
        </CardTitle>
        <CardDescription className="font-sans text-sm text-muted-foreground">
          {feedbackMessage}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="py-2 flex flex-col items-center">
          {isBadgeEarned ? (
            <Laurel className="h-32 w-40">{scoreNumber}</Laurel>
          ) : (
            scoreNumber
          )}
          <p className="mt-1 text-xs text-muted-foreground font-sans">
            {Math.round((score / total) * 100)}% accuracy
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
            ⚡ +{xpEarned} XP Earned
          </Badge>
          {isBadgeEarned && (
            <Badge
              variant="default"
              className="px-3 py-1 text-xs font-semibold gap-1 bg-primary text-primary-foreground"
            >
              <Sparkles className="size-3.5 text-accent" />
              Badge Unlocked: Prepared Pro
            </Badge>
          )}
        </div>

        <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground font-sans border border-border/60">
          📸 Screenshot your {APP_NAME} result and tag us on Instagram{" "}
          <a
            href={`https://instagram.com/${IG_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            @{IG_HANDLE}
          </a>
        </div>

        <div className="space-y-2.5 pt-2">
          <Button
            render={<Link href="/interview" />}
            nativeButton={false}
            size="lg"
            className="w-full flex items-center justify-center gap-2"
          >
            Try Interview Practice
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="size-4" />
            Play Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

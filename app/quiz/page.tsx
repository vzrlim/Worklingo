"use client";

import { useState, useSyncExternalStore } from "react";
import { QUIZ_SCENARIOS, QuizScenario } from "@/data/quiz-scenarios";
import { QuizProgress } from "@/components/QuizProgress";
import { QuizOption } from "@/components/QuizOption";
import { WhyBox } from "@/components/WhyBox";
import { ResultScreen } from "@/components/ResultScreen";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { addXp, unlockBadge } from "@/lib/progress";
import { ArrowRight } from "lucide-react";

interface PreparedOption {
  text: string;
  isCorrect: boolean;
}

interface PreparedQuestion {
  id: string;
  topic: string;
  scenario: string;
  options: PreparedOption[];
  why: string;
}

function shuffleQuestionOptions(scenario: QuizScenario): PreparedQuestion {
  const options: PreparedOption[] = scenario.options.map((text, idx) => ({
    text,
    isCorrect: idx === scenario.correctIndex,
  }));

  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    id: scenario.id,
    topic: scenario.topic,
    scenario: scenario.scenario,
    options,
    why: scenario.why,
  };
}

function QuizSkeleton() {
  return (
    <div className="max-w-md mx-auto space-y-6" aria-hidden="true">
      <Skeleton className="h-6 w-full" />
      <Card className="border-border">
        <CardHeader className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-16 w-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function QuizContent() {
  const [questions, setQuestions] = useState<PreparedQuestion[]>(() =>
    QUIZ_SCENARIOS.map(shuffleQuestionOptions)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handlePlayAgain = () => {
    setQuestions(QUIZ_SCENARIOS.map(shuffleQuestionOptions));
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <ResultScreen
        score={score}
        total={questions.length}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedOptionIndex !== null;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(index);
    if (currentQuestion.options[index].isCorrect) {
      setScore((prev) => prev + 1);
      addXp(10); // PRD §5: +10 per correct answer
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      addXp(20); // PRD §5: +20 for completing the quiz
      if (score >= 8) {
        const { newlyUnlocked, badge } = unlockBadge("prepared-pro");
        if (newlyUnlocked && badge) {
          toast.success(`Badge Unlocked: ${badge.name}!`, {
            description: `${badge.icon} ${badge.description}`,
            duration: 5000,
          });
        }
      }
      setIsFinished(true);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <QuizProgress current={currentIndex + 1} total={questions.length} />

      <Card className="border-border shadow-sm">
        <CardHeader className="space-y-3 pb-4">
          <div>
            <Badge
              variant="outline"
              className="text-xs font-sans text-muted-foreground border-border"
            >
              {currentQuestion.topic}
            </Badge>
          </div>
          <h2 className="font-serif text-lg md:text-xl font-semibold leading-snug text-foreground">
            {currentQuestion.scenario}
          </h2>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => (
              <QuizOption
                key={`${currentQuestion.id}-opt-${idx}`}
                text={option.text}
                index={idx}
                isSelected={selectedOptionIndex === idx}
                isAnswered={isAnswered}
                isCorrect={option.isCorrect}
                onSelect={handleSelectOption}
              />
            ))}
          </div>

          {isAnswered && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-300">
              <WhyBox explanation={currentQuestion.why} />

              <Button
                size="lg"
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                {currentIndex + 1 === questions.length
                  ? "See Results"
                  : "Next Question"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const emptySubscribe = () => () => {};

export default function QuizPage() {
  // Options are shuffled with Math.random(), so render the quiz on the client only.
  // Otherwise the server and browser pick different orders (hydration mismatch).
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  return isClient ? <QuizContent /> : <QuizSkeleton />;
}

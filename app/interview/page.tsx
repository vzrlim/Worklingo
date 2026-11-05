"use client";

import { useState } from "react";
import {
  INTERVIEW_QUESTIONS,
  InterviewQuestion,
} from "@/data/interview-questions";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerBox } from "@/components/AnswerBox";
import { MicButton } from "@/components/MicButton";
import { InAppBrowserBanner } from "@/components/InAppBrowserBanner";
import { LoadingFeedback } from "@/components/LoadingFeedback";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { buildOfflineFeedback } from "@/lib/fallback";
import {
  FeedbackResponse,
  feedbackResponseSchema,
  cleanTargetRole,
} from "@/lib/feedback-schema";
import { LIMITS } from "@/lib/config";
import {
  awardSimulatorResult,
  getDailyAiUsage,
  incrementDailyAiUsage,
} from "@/lib/progress";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { MeanderBand } from "@/components/greek";

export default function InterviewPage() {
  const [selectedQuestion, setSelectedQuestion] =
    useState<InterviewQuestion | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [hasUsedVoice, setHasUsedVoice] = useState(false);

  const canSubmit =
    answer.trim().length >= LIMITS.MIN_ANSWER_LENGTH &&
    answer.trim().length <= LIMITS.MAX_ANSWER_LENGTH &&
    !isLoading;

  const handleSubmit = async () => {
    if (!selectedQuestion || !canSubmit) return;

    setIsLoading(true);

    let feedbackResult: FeedbackResponse;

    // Check client-side daily soft cap (10 requests per day)
    const { canUseAi } = getDailyAiUsage();
    if (!canUseAi) {
      toast.info(
        "Daily AI coaching limit reached (10/day). Providing offline checklist review.",
        { duration: 4000 }
      );
      feedbackResult = buildOfflineFeedback(
        selectedQuestion.id,
        answer.trim()
      );
    } else {
      // 15 second client timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), LIMITS.CLIENT_TIMEOUT_MS);

      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: selectedQuestion.id,
            answer: answer.trim(),
            targetRole: cleanTargetRole(targetRole) || undefined,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const parsed = response.ok
          ? feedbackResponseSchema.safeParse(await response.json())
          : null;

        if (parsed?.success) {
          feedbackResult = parsed.data;
          if (parsed.data.source === "ai" || parsed.data.source === "ai-backup") {
            incrementDailyAiUsage();
          }
        } else {
          // Gracefully fallback on non-200 (including 403 / 429 from firewall)
          feedbackResult = buildOfflineFeedback(
            selectedQuestion.id,
            answer.trim()
          );
        }
      } catch {
        // Gracefully fallback on timeout or connection abort
        clearTimeout(timeoutId);
        feedbackResult = buildOfflineFeedback(
          selectedQuestion.id,
          answer.trim()
        );
      }
    }

    setFeedback(feedbackResult);
    setIsLoading(false);

    // Award XP and badges per PRD §5
    const { xpEarned, newBadges } = awardSimulatorResult({
      score: feedbackResult.overallScore,
      framework: selectedQuestion.framework,
      elements: feedbackResult.elements,
      usedVoice: hasUsedVoice,
    });

    toast(`+${xpEarned} XP Earned!`, {
      description: `Submission evaluated successfully.`,
      duration: 3000,
    });

    newBadges.forEach((badge) => {
      toast.success(`Badge Unlocked: ${badge.name}!`, {
        description: `${badge.icon} ${badge.description}`,
        duration: 5000,
      });
    });
  };

  const handleTryAgain = () => {
    setFeedback(null);
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setAnswer("");
    setHasUsedVoice(false);
    setSelectedQuestion(null);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <InAppBrowserBanner />

      {/* Screen 1: Question Selection */}
      {!selectedQuestion && (
        <div className="space-y-4">
          <BackButton href="/">Home</BackButton>
          <section className="text-center space-y-3">
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Interview Simulator
            </h1>
            <MeanderBand className="mx-auto w-28 text-bronze/70" />
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Pick a question. Then say your answer out loud or type it.
            </p>
          </section>

          <div className="slab rounded-lg p-3 text-xs font-sans text-muted-foreground leading-relaxed space-y-1">
            <p>
              <strong className="text-foreground">STAR</strong> = Situation,
              Task, Action, Result — for &ldquo;tell me about a time&rdquo;
              questions.
            </p>
            <p>
              <strong className="text-foreground">SEAT</strong> = Skills,
              Experience, Attributes/ambition, Technology — for &ldquo;tell me
              about yourself&rdquo;.
            </p>
          </div>

          <div className="space-y-3">
            {INTERVIEW_QUESTIONS.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                isSelected={false}
                onSelect={(question) => {
                  setSelectedQuestion(question);
                  setAnswer("");
                  setFeedback(null);
                  setHasUsedVoice(false);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Screen 2: Practice & Answering */}
      {selectedQuestion && !feedback && (
        <div className="space-y-5">
          <BackButton onClick={() => setSelectedQuestion(null)}>
            All questions
          </BackButton>

          <Card className="border-l-4 border-l-bronze/70">
            <CardHeader className="p-4 space-y-1">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-primary">
                Question ({selectedQuestion.framework})
              </span>
              <CardTitle className="font-serif text-base md:text-lg font-bold leading-snug">
                {selectedQuestion.prompt}
              </CardTitle>
              <CardDescription className="text-xs font-sans text-muted-foreground">
                Tip: {selectedQuestion.tip}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Optional Target Role Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="target-role"
              className="font-serif text-xs font-semibold text-foreground"
            >
              Target Role (Optional)
            </Label>
            <Input
              id="target-role"
              type="text"
              placeholder="e.g. Junior Project Manager, Frontend Intern"
              maxLength={LIMITS.MAX_TARGET_ROLE_LENGTH}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-card border-primary/25 shadow-sm font-sans text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Voice Input Section */}
          <Card className="p-4">
            <CardContent className="p-0 flex flex-col items-center justify-center">
              <MicButton
                currentAnswer={answer}
                onTranscriptChunk={(transcript) => {
                  setAnswer(transcript);
                  setHasUsedVoice(true);
                }}
                onListeningChange={(isListening) => {
                  if (isListening) setHasUsedVoice(true);
                }}
              />
            </CardContent>
          </Card>

          {/* Answer Text Area */}
          <AnswerBox
            value={answer}
            onChange={(text) => setAnswer(text)}
            disabled={isLoading}
          />

          {/* Loading or Submit Action */}
          {isLoading ? (
            <LoadingFeedback />
          ) : (
            <Button
              size="lg"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="size-4" />
              Submit answer
            </Button>
          )}

          <p className="text-[11px] leading-relaxed text-muted-foreground font-sans">
            Answers are sent to Google&apos;s Gemini (free tier) to generate
            feedback and may be used by Google to improve its products.
            Don&apos;t type personal or sensitive information. We don&apos;t
            store your answers.
          </p>
        </div>
      )}

      {/* Screen 3: Feedback Display */}
      {selectedQuestion && feedback && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <BackButton onClick={() => setFeedback(null)}>
              Edit answer
            </BackButton>
            <span className="text-xs text-muted-foreground font-sans">
              Framework: <strong>{selectedQuestion.framework}</strong>
            </span>
          </div>

          <FeedbackPanel
            feedback={feedback}
            onTryAgain={handleTryAgain}
            onNextQuestion={handleNextQuestion}
          />
        </div>
      )}
    </div>
  );
}

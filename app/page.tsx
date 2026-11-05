import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  APP_NAME,
  SDG_LABEL,
  IG_HANDLE,
  EXPERT_CREDIT,
} from "@/lib/config";
import {
  ArrowRight,
  BookOpen,
  Mic,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16 py-4 md:py-8 animate-in fade-in duration-300">
      {/* 1. Hero Section */}
      <section className="text-center space-y-5 max-w-2xl mx-auto">
        <div>
          <Badge
            variant="outline"
            className="text-xs font-sans text-muted-foreground border-border px-3 py-1 gap-1.5"
          >
            <Sparkles className="size-3.5 text-primary" />
            {SDG_LABEL}
          </Badge>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {APP_NAME}
        </h1>
        <p className="font-serif text-lg md:text-2xl font-semibold text-primary -mt-2">
          Learn the lingo of the workplace
        </p>

        <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed">
          Practise interviews out loud. Get coached in seconds.
          <br className="hidden sm:inline" /> Designed for university students
          preparing for internships and graduate roles.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            render={<Link href="/interview" />}
            size="lg"
            className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Mic className="size-4" />
            Start Interview Practice
            <ArrowRight className="size-4" />
          </Button>

          <Button
            render={<Link href="/quiz" />}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="size-4" />
            Play Workplace Quiz
          </Button>
        </div>
      </section>

      {/* 2. Core Modules */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card className="border-border shadow-xs hover:border-primary/50 transition-colors flex flex-col justify-between">
          <CardHeader className="space-y-2 pb-3">
            <div className="flex items-center gap-2 text-primary">
              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <Mic className="size-5" />
              </div>
              <CardTitle className="font-serif text-lg font-bold">
                AI Interview Simulator
              </CardTitle>
            </div>
            <CardDescription className="font-sans text-xs md:text-sm text-muted-foreground leading-relaxed">
              Practice answering tough interview questions with speech-to-text or
              typing. Receive structured feedback scoring your STAR & SEAT
              elements with an instant rewritten answer.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              render={<Link href="/interview" />}
              size="lg"
              variant="secondary"
              className="w-full flex items-center justify-between text-xs font-semibold cursor-pointer"
            >
              <span>Practice Speaking</span>
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs hover:border-primary/50 transition-colors flex flex-col justify-between">
          <CardHeader className="space-y-2 pb-3">
            <div className="flex items-center gap-2 text-primary">
              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <BookOpen className="size-5" />
              </div>
              <CardTitle className="font-serif text-lg font-bold">
                Workplace Scenario Quiz
              </CardTitle>
            </div>
            <CardDescription className="font-sans text-xs md:text-sm text-muted-foreground leading-relaxed">
              Test your judgment in 10 realistic workplace dilemmas covering team
              conflict, meeting etiquette, resume structure, and professional
              attitude. No AI required — works offline anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              render={<Link href="/quiz" />}
              size="lg"
              variant="secondary"
              className="w-full flex items-center justify-between text-xs font-semibold cursor-pointer"
            >
              <span>Start 10 Scenarios</span>
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* 3. Why We Built This (3 Expert Insights from PRD §2) */}
      <section className="space-y-6 max-w-4xl mx-auto pt-4">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-primary">
            Research-Driven Design
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Why We Built {APP_NAME}
          </h2>
          <p className="font-sans text-xs md:text-sm text-muted-foreground italic max-w-xl mx-auto">
            {EXPERT_CREDIT}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Insight E1 */}
          <Card className="border-border shadow-xs bg-card/60 flex flex-col justify-between">
            <CardHeader className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <Badge variant="outline" className="text-[11px] font-sans">
                  Insight #1: Talking
                </Badge>
              </div>
              <p className="font-serif text-sm font-semibold leading-snug text-foreground italic">
                &ldquo;Communication is the #1 weakness: students know the answer
                but can&apos;t express or structure it. It only improves by
                talking.&rdquo;
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                <strong>Our feature:</strong> A voice-enabled simulator with live
                transcription and speech timer so you can practice speaking out loud
                before facing real interviewers.
              </p>
            </CardContent>
          </Card>

          {/* Insight E2 */}
          <Card className="border-border shadow-xs bg-card/60 flex flex-col justify-between">
            <CardHeader className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-primary" />
                <Badge variant="outline" className="text-[11px] font-sans">
                  Insight #2: Frameworks
                </Badge>
              </div>
              <p className="font-serif text-sm font-semibold leading-snug text-foreground italic">
                &ldquo;Students learn STAR and SEAT in class, but fail to apply
                them when put on the spot in mock interviews.&rdquo;
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                <strong>Our feature:</strong> Automated coaching that breaks down
                every response into its core framework elements, telling you exactly
                which parts you hit and what was missing.
              </p>
            </CardContent>
          </Card>

          {/* Insight E3 */}
          <Card className="border-border shadow-xs bg-card/60 flex flex-col justify-between">
            <CardHeader className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <Badge variant="outline" className="text-[11px] font-sans">
                  Insight #3: Preparation
                </Badge>
              </div>
              <p className="font-serif text-sm font-semibold leading-snug text-foreground italic">
                &ldquo;The biggest gap is preparation: zero research on job
                scope, company background, or connecting projects to
                needs.&rdquo;
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                <strong>Our feature:</strong> Targeted scenario quizzes on
                preparation habits, company research questions, and role-tailored
                answer rewrites.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Trust, Privacy & Campaign Footer Banner */}
      <section className="rounded-xl border border-border bg-secondary/40 p-6 text-center space-y-3 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-1.5 text-primary text-xs font-semibold font-sans">
          <ShieldCheck className="size-4" />
          <span>Student Privacy & Integrity</span>
        </div>
        <p className="font-sans text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
          No login or accounts required. Your XP stays on your device. Spoken and
          typed answers are never logged or stored on our servers.
        </p>
        <div className="pt-1">
          <p className="font-sans text-xs text-muted-foreground">
            Follow the campaign on Instagram:{" "}
            <a
              href={`https://instagram.com/${IG_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              @{IG_HANDLE}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

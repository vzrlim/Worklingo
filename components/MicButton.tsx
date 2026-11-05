"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square } from "lucide-react";
import {
  SpeechRecorder,
  isSpeechRecognitionSupported,
} from "@/lib/speech";
import { cn } from "@/lib/utils";

// Errors that mean voice can't work on this device/browser → fall back to typing.
const BLOCKING_ERRORS = [
  "not-allowed",
  "service-not-allowed",
  "audio-capture",
  "language-not-supported",
  "not supported",
  "Failed to access",
];

interface MicButtonProps {
  onTranscriptChunk: (transcript: string) => void;
  currentAnswer: string;
  onListeningChange?: (isListening: boolean) => void;
}

const emptySubscribe = () => () => {};

export function MicButton({
  onTranscriptChunk,
  currentAnswer,
  onListeningChange,
}: MicButtonProps) {
  const supported = useSyncExternalStore(
    emptySubscribe,
    isSpeechRecognitionSupported,
    () => false
  );
  const [listening, setListening] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [voiceBlocked, setVoiceBlocked] = useState(false);

  const recorderRef = useRef<SpeechRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    recorderRef.current = new SpeechRecorder();

    return () => {
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    setErrorMessage(null);
    setSeconds(0);

    const recorder = recorderRef.current;
    if (!recorder) return;

    const started = recorder.start(currentAnswer, {
      onTranscript: (transcript) => {
        onTranscriptChunk(transcript);
      },
      onError: (err) => {
        setListening(false);
        onListeningChange?.(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (err === "aborted") return;
        if (BLOCKING_ERRORS.some((code) => err.includes(code))) {
          setVoiceBlocked(true);
          return;
        }
        setErrorMessage(
          err === "no-speech"
            ? "We didn't hear anything. Tap the mic and try again."
            : "Voice input had a problem. Try again, or type your answer below."
        );
      },
      onEnd: () => {
        setListening(false);
        onListeningChange?.(false);
        if (timerRef.current) clearInterval(timerRef.current);
      },
    });

    if (started) {
      setListening(true);
      onListeningChange?.(true);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStop = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
    }
    setListening(false);
    onListeningChange?.(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  if (!supported || voiceBlocked) {
    return (
      <div
        role="status"
        className="flex items-center gap-2 text-xs text-muted-foreground font-sans"
      >
        <MicOff className="size-4 shrink-0 text-muted-foreground" />
        <span>Voice isn&apos;t available here — type your answer instead.</span>
      </div>
    );
  }

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {listening ? (
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={handleStop}
          className="h-14 px-6 rounded-full border-destructive/50 bg-danger-soft/60 hover:bg-danger-soft text-foreground flex items-center gap-3 cursor-pointer transition-all shadow-xs"
        >
          <span className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full size-3 bg-destructive"></span>
          </span>
          <span className="font-sans font-medium text-sm">
            Listening… tap to stop ({formatTimer(seconds)})
          </span>
          <Square className="size-4 fill-destructive text-destructive shrink-0" />
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <Button
            type="button"
            size="icon"
            onClick={handleStart}
            className={cn(
              "size-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
            )}
            aria-label="Start voice recording"
          >
            <Mic className="size-6" />
          </Button>
          <span className="text-xs text-muted-foreground font-sans">
            Tap to speak (aim for 1–2 minutes)
          </span>
        </div>
      )}

      {errorMessage && (
        <p role="status" className="text-xs text-muted-foreground font-sans text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition
  );
}

export interface SpeechListenerOptions {
  onTranscript: (transcript: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

interface WebkitSpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface WebkitSpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: WebkitSpeechRecognitionEvent) => void) | null;
  onerror: ((event: WebkitSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export class SpeechRecorder {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening = false;
  private finalTranscript = "";

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (
          window as unknown as {
            SpeechRecognition?: SpeechRecognitionConstructor;
            webkitSpeechRecognition?: SpeechRecognitionConstructor;
          }
        ).SpeechRecognition ||
        (
          window as unknown as {
            SpeechRecognition?: SpeechRecognitionConstructor;
            webkitSpeechRecognition?: SpeechRecognitionConstructor;
          }
        ).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = "en-US";
        } catch {
          this.recognition = null;
        }
      }
    }
  }

  public start(
    initialText: string,
    options: SpeechListenerOptions
  ): boolean {
    if (!this.recognition) {
      options.onError("Speech recognition is not supported in this browser.");
      return false;
    }

    if (this.isListening) {
      return true;
    }

    this.finalTranscript = initialText;

    this.recognition.onresult = (event: WebkitSpeechRecognitionEvent) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          const chunk = item[0].transcript.trim();
          if (chunk) {
            this.finalTranscript = this.finalTranscript
              ? `${this.finalTranscript} ${chunk}`
              : chunk;
          }
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const combined = interimTranscript
        ? this.finalTranscript
          ? `${this.finalTranscript} ${interimTranscript}`
          : interimTranscript
        : this.finalTranscript;

      options.onTranscript(combined);
    };

    this.recognition.onerror = (event: WebkitSpeechRecognitionErrorEvent) => {
      this.isListening = false;
      options.onError(event.error || "An error occurred with voice recognition.");
    };

    this.recognition.onend = () => {
      this.isListening = false;
      options.onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch {
      this.isListening = false;
      options.onError("Failed to access microphone.");
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.isListening = false;
  }

  public getListeningStatus(): boolean {
    return this.isListening;
  }
}

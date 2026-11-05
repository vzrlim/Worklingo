"use client";

import { useState, useSyncExternalStore } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function getIsIAB() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    /Instagram|FBAN|FBAV|FB_IAB/i.test(ua) ||
    (ua.includes("Mobile") && !ua.includes("Chrome") && !ua.includes("Safari"))
  );
}

export function InAppBrowserBanner() {
  const isInAppBrowser = useSyncExternalStore(
    emptySubscribe,
    getIsIAB,
    () => false
  );
  const [dismissed, setDismissed] = useState(false);

  if (!isInAppBrowser || dismissed) {
    return null;
  }

  return (
    <Alert className="relative border-border bg-secondary/80 pr-10 text-xs">
      <Info className="size-4 text-primary shrink-0" />
      <AlertDescription className="font-sans text-xs text-foreground leading-normal">
        <strong>Tip for voice input:</strong> Tap <strong>⋯</strong> in the top
        corner and select <strong>Open in external browser</strong> to enable
        microphone access.
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="size-3.5" />
      </Button>
    </Alert>
  );
}

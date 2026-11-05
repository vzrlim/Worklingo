"use client";

import { useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { getProgress, getLevel, UserProgress } from "@/lib/progress";

function subscribe(callback: () => void) {
  window.addEventListener("worklingo_progress_updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("worklingo_progress_updated", callback);
    window.removeEventListener("storage", callback);
  };
}

const SERVER_SNAPSHOT: UserProgress = {
  xp: 0,
  unlockedBadges: [],
  isStorageAvailable: true,
};

let cachedRaw: string | null = null;
let cachedSnapshot: UserProgress = SERVER_SNAPSHOT;

function getClientSnapshot(): UserProgress {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  try {
    const raw = window.localStorage.getItem("worklingo_progress");
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSnapshot = getProgress();
    }
    return cachedSnapshot;
  } catch {
    return { xp: 0, unlockedBadges: [], isStorageAvailable: false };
  }
}

function getServerSnapshot(): UserProgress {
  return SERVER_SNAPSHOT;
}

export function XpChip() {
  const progress = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  if (!progress.isStorageAvailable) {
    return (
      <Badge
        variant="outline"
        className="font-sans font-medium text-xs px-2.5 py-1 text-muted-foreground border-border"
      >
        Guest
      </Badge>
    );
  }

  const level = getLevel(progress.xp);

  return (
    <Badge
      variant="secondary"
      className="font-sans font-medium text-xs px-2.5 py-1 border border-border transition-all duration-200"
    >
      ⚡ {progress.xp} XP · {level}
    </Badge>
  );
}

import { LIMITS } from "@/lib/config";

export type Level = "Intern" | "Junior" | "Associate" | "Lead";

export type BadgeId =
  | "first-interview"
  | "star-speaker"
  | "seat-ready"
  | "prepared-pro"
  | "voice-brave";

export interface BadgeDefinition {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
}

export interface UserProgress {
  xp: number;
  unlockedBadges: BadgeId[];
  isStorageAvailable: boolean;
}

export const BADGES: Record<BadgeId, BadgeDefinition> = {
  "first-interview": {
    id: "first-interview",
    name: "First Interview",
    description: "Submit 1 simulator answer",
    icon: "🎯",
  },
  "star-speaker": {
    id: "star-speaker",
    name: "STAR Speaker",
    description: "All 4 STAR elements present in one answer",
    icon: "⭐",
  },
  "seat-ready": {
    id: "seat-ready",
    name: "SEAT Ready",
    description: "All 4 SEAT elements present in one answer",
    icon: "💼",
  },
  "prepared-pro": {
    id: "prepared-pro",
    name: "Prepared Pro",
    description: "Score 8/10 or higher on the Workplace Scenario Quiz",
    icon: "🎓",
  },
  "voice-brave": {
    id: "voice-brave",
    name: "Voice Brave",
    description: "Submit an answer recorded with the mic",
    icon: "🎙️",
  },
};

const STORAGE_KEY = "worklingo_progress";

export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "__worklingo_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getLevel(xp: number): Level {
  if (xp >= 500) return "Lead";
  if (xp >= 250) return "Associate";
  if (xp >= 100) return "Junior";
  return "Intern";
}

export function getProgress(): UserProgress {
  if (!isLocalStorageAvailable()) {
    return { xp: 0, unlockedBadges: [], isStorageAvailable: false };
  }
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { xp: 0, unlockedBadges: [], isStorageAvailable: true };
    }
    const parsed = JSON.parse(data);
    return {
      xp: typeof parsed.xp === "number" ? parsed.xp : 0,
      unlockedBadges: Array.isArray(parsed.unlockedBadges)
        ? parsed.unlockedBadges
        : [],
      isStorageAvailable: true,
    };
  } catch {
    return { xp: 0, unlockedBadges: [], isStorageAvailable: false };
  }
}

export function saveProgress(progress: {
  xp: number;
  unlockedBadges: BadgeId[];
}): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event("worklingo_progress_updated"));
    return true;
  } catch {
    return false;
  }
}

export function addXp(amount: number): UserProgress {
  const current = getProgress();
  const updated = {
    xp: current.xp + amount,
    unlockedBadges: current.unlockedBadges,
  };
  saveProgress(updated);
  return { ...updated, isStorageAvailable: current.isStorageAvailable };
}

export function unlockBadge(badgeId: BadgeId): {
  newlyUnlocked: boolean;
  badge?: BadgeDefinition;
} {
  const current = getProgress();
  if (current.unlockedBadges.includes(badgeId)) {
    return { newlyUnlocked: false, badge: BADGES[badgeId] };
  }
  const updatedBadges = [...current.unlockedBadges, badgeId];
  saveProgress({
    xp: current.xp,
    unlockedBadges: updatedBadges,
  });
  return { newlyUnlocked: true, badge: BADGES[badgeId] };
}

export function awardSimulatorResult({
  score,
  framework,
  elements,
  usedVoice,
}: {
  score: number;
  framework: string;
  elements: { name: string; present: boolean }[];
  usedVoice: boolean;
}): {
  xpEarned: number;
  newBadges: BadgeDefinition[];
} {
  let xpEarned = 20; // Base: simulator answer submitted +20
  if (score >= 8) {
    xpEarned += 10; // Bonus: score >= 8 +10
  }
  addXp(xpEarned);

  const newBadges: BadgeDefinition[] = [];

  // 1. First Interview badge
  const firstBadge = unlockBadge("first-interview");
  if (firstBadge.newlyUnlocked && firstBadge.badge) {
    newBadges.push(firstBadge.badge);
  }

  // 2. STAR Speaker badge: all 4 STAR elements present
  if (framework === "STAR" && elements.length === 4) {
    const allPresent = elements.every((e) => e.present);
    if (allPresent) {
      const starBadge = unlockBadge("star-speaker");
      if (starBadge.newlyUnlocked && starBadge.badge) {
        newBadges.push(starBadge.badge);
      }
    }
  }

  // 3. SEAT Ready badge: all 4 SEAT elements present
  if (framework === "SEAT" && elements.length === 4) {
    const allPresent = elements.every((e) => e.present);
    if (allPresent) {
      const seatBadge = unlockBadge("seat-ready");
      if (seatBadge.newlyUnlocked && seatBadge.badge) {
        newBadges.push(seatBadge.badge);
      }
    }
  }

  // 4. Voice Brave badge: submitted with mic
  if (usedVoice) {
    const voiceBadge = unlockBadge("voice-brave");
    if (voiceBadge.newlyUnlocked && voiceBadge.badge) {
      newBadges.push(voiceBadge.badge);
    }
  }

  return { xpEarned, newBadges };
}

const DAILY_AI_CAP_KEY = "worklingo_daily_ai_usage";

/** Device-local date (YYYY-MM-DD) so the cap resets at the user's midnight, not UTC's. */
function localDateKey(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function getDailyAiUsage(): { count: number; canUseAi: boolean } {
  if (!isLocalStorageAvailable()) {
    return { count: 0, canUseAi: true };
  }
  try {
    const raw = window.localStorage.getItem(DAILY_AI_CAP_KEY);
    const today = localDateKey();
    if (!raw) {
      return { count: 0, canUseAi: true };
    }
    const parsed = JSON.parse(raw);
    if (parsed.date !== today) {
      return { count: 0, canUseAi: true };
    }
    const count = typeof parsed.count === "number" ? parsed.count : 0;
    return { count, canUseAi: count < LIMITS.DAILY_AI_CAP };
  } catch {
    return { count: 0, canUseAi: true };
  }
}

export function incrementDailyAiUsage(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    const today = localDateKey();
    const { count } = getDailyAiUsage();
    window.localStorage.setItem(
      DAILY_AI_CAP_KEY,
      JSON.stringify({ date: today, count: count + 1 })
    );
  } catch {
    // ignore
  }
}

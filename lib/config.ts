export const APP_NAME = "Worklingo";
export const SDG_LABEL = "SDG 4.4 – Skills for employment";
export const IG_HANDLE = "worklingo.my";
export const EXPERT_CREDIT =
  "Based on insights from an APU Workplace Professional Skills lecturer";

export const LIMITS = {
  MIN_ANSWER_LENGTH: 20,
  MAX_ANSWER_LENGTH: 1500,
  MAX_TARGET_ROLE_LENGTH: 60,
  DAILY_AI_CAP: 10,
  AI_TIMEOUT_MS: 10_000,
  CLIENT_TIMEOUT_MS: 15_000,
} as const;

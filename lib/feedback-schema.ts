import { z } from "zod";
import { LIMITS } from "@/lib/config";

/**
 * Target role: letters in any language (Mbappé, Penolong Akauntan, 数据分析师), numbers,
 * spaces and everyday punctuation . , ' ( ) & / + # -  (e.g. "C++ Developer (Intern)").
 * Still blocks < > { } " ; ` so the role can't break out of the prompt template.
 */
const TARGET_ROLE_PATTERN = /^[\p{L}\p{M}\p{N}\s.,'‘’()&/+#-]*$/u;

/** Make a typed role safe to send: curly quotes → straight, drop anything else not allowed. */
export function cleanTargetRole(raw: string): string {
  return raw
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[^\p{L}\p{M}\p{N}\s.,'()&/+#-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, LIMITS.MAX_TARGET_ROLE_LENGTH);
}

export const feedbackRequestSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  answer: z
    .string()
    .trim()
    .min(
      LIMITS.MIN_ANSWER_LENGTH,
      `Answer must be at least ${LIMITS.MIN_ANSWER_LENGTH} characters.`
    )
    .max(
      LIMITS.MAX_ANSWER_LENGTH,
      `Answer must not exceed ${LIMITS.MAX_ANSWER_LENGTH} characters.`
    ),
  targetRole: z
    .string()
    .trim()
    .max(
      LIMITS.MAX_TARGET_ROLE_LENGTH,
      `Target role must not exceed ${LIMITS.MAX_TARGET_ROLE_LENGTH} characters.`
    )
    .regex(TARGET_ROLE_PATTERN, "Target role contains invalid characters")
    .optional(),
});

export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;

export const feedbackElementSchema = z.object({
  name: z.string(),
  present: z.boolean(),
  comment: z.string(),
});

export type FeedbackElement = z.infer<typeof feedbackElementSchema>;

export const feedbackResponseSchema = z.object({
  source: z.enum(["ai", "ai-backup", "offline"]),
  overallScore: z.number().int().min(1).max(10),
  elements: z.array(feedbackElementSchema),
  strengths: z.array(z.string()).max(3),
  improvements: z.array(z.string()).max(3),
  improvedAnswer: z.string(),
  communicationTip: z.string(),
});

export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;

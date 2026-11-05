import { NextRequest, NextResponse } from "next/server";
import { isValidQuestionId } from "@/data/interview-questions";
import { feedbackRequestSchema } from "@/lib/feedback-schema";
import { generateInterviewFeedback } from "@/lib/gemini";
import { buildOfflineFeedback } from "@/lib/fallback";

const MAX_BODY_SIZE_BYTES = 8192; // 8 KB limit

// Control characters except tab, newline and carriage return.
const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

function reject(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function isAllowedOrigin(request: NextRequest): boolean {
  const allowed = (process.env.ALLOWED_ORIGIN || "")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
  if (allowed.length === 0) return true; // check disabled
  const origin = request.headers.get("origin");
  // Browsers always send Origin on POST, so a missing header is not a real visitor.
  return origin !== null && allowed.includes(origin.replace(/\/$/, ""));
}

export async function POST(request: NextRequest) {
  // 1. Optional origin lock (ALLOWED_ORIGIN, comma-separated)
  if (!isAllowedOrigin(request)) {
    return reject("Forbidden origin", 403);
  }

  // 2. JSON only
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return reject("Content-Type must be application/json", 415);
  }

  // 3. Reject bodies > 8 KB (header check first, then the real byte length)
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_SIZE_BYTES) {
    return reject("Payload too large", 413);
  }
  let bodyText: string;
  try {
    bodyText = await request.text();
  } catch {
    return reject("Could not read body", 400);
  }
  if (new TextEncoder().encode(bodyText).length > MAX_BODY_SIZE_BYTES) {
    return reject("Payload too large", 413);
  }

  // 4. Parse JSON
  let rawBody: unknown;
  try {
    rawBody = JSON.parse(bodyText);
  } catch {
    return reject("Invalid JSON format", 400);
  }

  // 5. Strip control characters BEFORE length validation
  if (rawBody && typeof rawBody === "object") {
    const body = rawBody as Record<string, unknown>;
    if (typeof body.answer === "string") {
      body.answer = body.answer.replace(CONTROL_CHARS, "");
    }
    if (typeof body.targetRole === "string") {
      body.targetRole = body.targetRole.replace(CONTROL_CHARS, "");
    }
  }

  // 6. Validate shape (only questionId / answer / targetRole are kept)
  const parseResult = feedbackRequestSchema.safeParse(rawBody);
  if (!parseResult.success) {
    return reject("Validation failed", 400);
  }
  const { questionId, answer, targetRole } = parseResult.data;

  // 7. Whitelist: questionId must exist in the question bank
  if (!isValidQuestionId(questionId)) {
    return reject("Unknown question ID", 400);
  }

  // 8. Fallback chain (never log answers). Always return usable feedback.
  try {
    const feedback = await generateInterviewFeedback(
      questionId,
      answer,
      targetRole || undefined
    );
    return NextResponse.json(feedback, { status: 200 });
  } catch {
    return NextResponse.json(buildOfflineFeedback(questionId, answer), {
      status: 200,
    });
  }
}

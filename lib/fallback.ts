import { getQuestionById, InterviewQuestion } from "@/data/interview-questions";
import { FeedbackResponse } from "@/lib/feedback-schema";

export function buildOfflineFeedback(
  questionId: string,
  answer: string
): FeedbackResponse {
  const question: InterviewQuestion | undefined = getQuestionById(questionId);

  if (!question) {
    return {
      source: "offline",
      overallScore: 1,
      elements: [],
      strengths: [],
      improvements: ["Unknown question selected."],
      improvedAnswer: "",
      communicationTip: "Select a question from the question bank.",
    };
  }

  const normalizedAnswer = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  // Check presence of keywords for each framework element
  const elements = question.elements.map((el) => {
    const present = el.keywords.some((kw) =>
      normalizedAnswer.includes(kw.toLowerCase())
    );
    const comment = present
      ? `Clear mention of ${el.name.toLowerCase()} elements detected.`
      : `Missing clear keywords indicating ${el.name.toLowerCase()}.`;

    return {
      name: el.name,
      present,
      comment,
    };
  });

  const presentCount = elements.filter((e) => e.present).length;
  const rawScore =
    question.elements.length > 0
      ? Math.round((10 * presentCount) / question.elements.length)
      : 1;
  const overallScore = Math.max(1, Math.min(10, rawScore));

  const strengths: string[] = [];
  const improvements: string[] = [];

  elements.forEach((el) => {
    if (el.present) {
      if (strengths.length < 3) {
        strengths.push(`Addressed ${el.name}: successfully identified in your response.`);
      }
    } else {
      if (improvements.length < 3) {
        improvements.push(`Strengthen ${el.name}: add specific details explaining what occurred.`);
      }
    }
  });

  // Length checks per PRD §6
  if (wordCount < 40) {
    improvements.push(
      "Too short — aim for 1–2 minutes (about 120–250 words) to provide sufficient detail."
    );
  } else if (wordCount > 300) {
    improvements.push(
      "Too long — keep your spoken answer to 1–2 minutes so the interviewer stays engaged."
    );
  }

  return {
    source: "offline",
    overallScore,
    elements,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    improvedAnswer: `Example answer — adapt it to you:\n\n"${question.modelAnswer}"`,
    communicationTip: question.tip,
  };
}

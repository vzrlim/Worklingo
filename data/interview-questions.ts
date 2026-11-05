export type FrameworkType = "STAR" | "SEAT" | "CHECKLIST";

export interface QuestionElement {
  name: string;
  keywords: string[];
}

export interface InterviewQuestion {
  id: string;
  prompt: string;
  framework: FrameworkType;
  elements: QuestionElement[];
  modelAnswer: string;
  tip: string;
}

export const STAR_ELEMENTS: QuestionElement[] = [
  {
    name: "Situation",
    keywords: [
      "during",
      "when",
      "in my",
      "project",
      "semester",
      "assignment",
      "internship",
    ],
  },
  {
    name: "Task",
    keywords: [
      "i needed",
      "my task",
      "responsible",
      "my role",
      "goal",
      "had to",
    ],
  },
  {
    name: "Action",
    keywords: [
      "i decided",
      "i created",
      "i contacted",
      "i organised",
      "i organized",
      "i built",
      "so i",
      "i asked",
      "i set up",
    ],
  },
  {
    name: "Result",
    keywords: [
      "as a result",
      "finally",
      "completed",
      "achieved",
      "improved",
      "on time",
      "learned",
      "%",
      "grade",
      "approved",
    ],
  },
];

export const SEAT_ELEMENTS: QuestionElement[] = [
  {
    name: "Skill",
    keywords: [
      "skill",
      "good at",
      "able to",
      "strong in",
      "problem-solving",
      "communication",
    ],
  },
  {
    name: "Experience",
    keywords: [
      "project",
      "internship",
      "worked",
      "built",
      "led",
      "experience",
      "part-time",
      "competition",
      "hackathon",
    ],
  },
  {
    name: "Attribute/Ambition",
    keywords: [
      "i am",
      "passionate",
      "motivated",
      "aim",
      "goal",
      "want to",
      "ambition",
      "hope to",
    ],
  },
  {
    name: "Technology",
    keywords: [
      "python",
      "java",
      "javascript",
      "react",
      "sql",
      "ai",
      "cloud",
      "figma",
      "excel",
      "tools",
      "framework",
    ],
  },
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "tell-me-about-yourself",
    prompt: "Tell me about yourself.",
    framework: "SEAT",
    elements: SEAT_ELEMENTS,
    modelAnswer:
      "I'm a final-year IT student at APU. My strongest skills are problem-solving and turning ideas into working web apps. In my final-year project I built [project], and in a group module I led a team of seven, handling the schedule and risks. I'm someone who keeps to deadlines, and my goal is to grow into a project lead. I mainly work with [Python / React / SQL] and I'm learning cloud deployment. That's why this [role] at [company] interests me.",
    tip: "Skip family and hobbies — they're already in your CV. Link every point to the role.",
  },
  {
    id: "project-problem",
    prompt:
      "Tell me about a problem you faced in a project and how you solved it.",
    framework: "STAR",
    elements: STAR_ELEMENTS,
    modelAnswer:
      "In our group project, we couldn't get the information we needed to finish our website. As the developer, I had to collect it within two weeks. I set up short interviews with three users and made a simple online survey, then shared a summary with the team. We finished on time, and our lecturer praised how well the site met user needs.",
    tip: "Don't just say \"it was successful\" — say what YOU did and what changed.",
  },
  {
    id: "three-years",
    prompt: "Where do you see yourself in three years?",
    framework: "CHECKLIST",
    elements: [
      {
        name: "Specific role/goal",
        keywords: [
          "lead",
          "manager",
          "senior",
          "specialist",
          "analyst",
          "engineer",
          "project",
        ],
      },
      {
        name: "How you'll get there",
        keywords: [
          "learn",
          "certification",
          "skills",
          "experience",
          "responsibility",
        ],
      },
      {
        name: "Link to this company",
        keywords: ["your company", "here", "this role", "this team", "you"],
      },
    ],
    modelAnswer:
      "In three years, I see myself as a junior project lead — leading a small team and handling client requirements. To get there, I'll master the core tools in this role, take on more responsibility in projects, and work towards a project management certification. I'd like to grow on that path here, because your team runs [type of projects] that match this goal.",
    tip: "Be specific — name a role and a path. \"I want to be successful\" is not an answer.",
  },
  {
    id: "why-our-company",
    prompt: "What do you know about our company and this role?",
    framework: "CHECKLIST",
    elements: [
      {
        name: "Company facts",
        keywords: [
          "company",
          "industry",
          "products",
          "clients",
          "services",
          "founded",
          "market",
        ],
      },
      {
        name: "Role responsibilities",
        keywords: [
          "responsible",
          "role",
          "job scope",
          "tasks",
          "requirements",
          "duties",
        ],
      },
      {
        name: "Your matching experience",
        keywords: [
          "i have",
          "my project",
          "i built",
          "assignment",
          "experience",
          "similar",
        ],
      },
    ],
    modelAnswer:
      "[Company] provides [products/services] for [customers] in [industry], and recently [news or project]. This role involves [2–3 duties from the job ad]. I've done similar work: in my [assignment/project] I [matching task], so I can contribute from day one.",
    tip: "Research the company and the job ad before every interview. If you don't know them, why should they hire you?",
  },
  {
    id: "team-conflict",
    prompt:
      "Tell me about a time a teammate wasn't contributing. What did you do?",
    framework: "STAR",
    elements: STAR_ELEMENTS,
    modelAnswer:
      "In a seven-member assignment, one member missed two deadlines. As group leader, I needed his part done without hurting the team. Instead of calling him out in the group chat, I invited him for a drink, explained how the delay affected his marks and the whole group, and we agreed on smaller tasks with a check-in date. He delivered his part and we submitted on time. I learned that a calm, private talk works better than public blame.",
    tip: "Show you handled it privately and professionally — never blame.",
  },
  {
    id: "why-hire-you",
    prompt: "Why should we hire you?",
    framework: "CHECKLIST",
    elements: [
      {
        name: "Match to requirements",
        keywords: [
          "requirement",
          "you need",
          "the role needs",
          "looking for",
          "job",
        ],
      },
      {
        name: "Evidence",
        keywords: [
          "project",
          "built",
          "led",
          "achieved",
          "result",
          "award",
          "competition",
        ],
      },
      {
        name: "Value to company",
        keywords: [
          "contribute",
          "help your",
          "add value",
          "benefit",
          "from day one",
        ],
      },
    ],
    modelAnswer:
      "You're looking for someone who can [requirement 1] and [requirement 2]. In my [project], I [evidence with a result]. I also [second piece of evidence]. So I can contribute to [team/goal] from day one, and I'm keen to keep learning in this role.",
    tip: "Use the job ad's own words, then prove each one with a real example.",
  },
];

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id);
}

export function isValidQuestionId(id: string): boolean {
  return INTERVIEW_QUESTIONS.some((q) => q.id === id);
}

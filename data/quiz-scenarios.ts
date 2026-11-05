export interface QuizScenario {
  id: string;
  topic: string;
  scenario: string;
  options: [string, string, string, string];
  correctIndex: number;
  why: string;
}

export const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: "teamwork",
    topic: "Teamwork",
    scenario:
      "Your groupmate has missed two tasks and the deadline is next week. As group leader, what do you do first?",
    options: [
      "Complain about him in the group chat so everyone knows",
      "Invite him for a private chat, explain how it affects him and the group, and agree on next steps",
      "Do his part yourself to save time",
      "Report him to the lecturer immediately",
    ],
    correctIndex: 1,
    why: "A calm private talk that explains the consequences and gives him a chance to change works better than public blame.",
  },
  {
    id: "meetings",
    topic: "Meetings",
    scenario:
      "You need the whole group to finalise the project plan. When do you hold the meeting?",
    options: [
      "Tonight at 6pm — post it in the chat now",
      "Check everyone's free slots and give about 3 days' notice",
      "Only invite members who usually reply",
      "Skip the meeting and decide alone",
    ],
    correctIndex: 1,
    why: "Short-notice meetings mean people can't come — then the leader ends up blaming members for the leader's own planning.",
  },
  {
    id: "interview-opener",
    topic: "Interview opener",
    scenario: 'The interviewer says "Tell me about yourself." What\'s the best approach?',
    options: [
      "Talk about your family, hometown and hobbies",
      "Read out your CV line by line",
      "Use SEAT: Skills, Experience, Attributes/ambition and Technology — linked to the role",
      "Keep it to one sentence so you don't make mistakes",
    ],
    correctIndex: 2,
    why: "Your personal details are already in your CV. Interviewers want to know what you can do for this role.",
  },
  {
    id: "star",
    topic: "STAR",
    scenario:
      '"Tell me about a problem in a project and how you solved it." Which answer is strongest?',
    options: [
      '"We had a project, I did many things, and it was successful."',
      '"Our website lacked user data (S). I had two weeks to get it (T). I interviewed users and ran a survey (A). We finished on time and the client approved it (R)."',
      '"I don\'t really face problems."',
      '"My teammates caused the problems, so it wasn\'t my fault."',
    ],
    correctIndex: 1,
    why: "STAR shows the interviewer exactly what you did and what changed.",
  },
  {
    id: "preparation",
    topic: "Preparation",
    scenario:
      "You have an interview tomorrow at a fintech company. What matters most tonight?",
    options: [
      "Pick your outfit and sleep early — that's enough",
      "Research the company, read the job scope, and practise answers to common questions",
      "Memorise your CV word for word",
      "Prepare questions about salary and leave",
    ],
    correctIndex: 1,
    why: "Lack of preparation is the biggest reason students fail interviews. If you don't know their industry, why should they hire you?",
  },
  {
    id: "applying",
    topic: "Applying",
    scenario: "You want an internship. What's the smartest way to apply?",
    options: [
      "Send the same email and cover letter to 200 companies at once",
      "Choose roles you really want and tailor each email to that company and the exact job title in the ad",
      "Only apply where your friends applied",
      "Wait for companies to find you on LinkedIn",
    ],
    correctIndex: 1,
    why: "A generic mass email tells employers you're not interested in THEM. Use their job title and show you know what they need.",
  },
  {
    id: "resume",
    topic: "Resume",
    scenario: "Your resume is one page. What should take up most of the space?",
    options: [
      "Personal details and a photo",
      "Your education, listed first",
      "Your experience — projects, competitions, activities and what you achieved",
      "Your hobbies",
    ],
    correctIndex: 2,
    why: "Employers go straight to your experience to see what you can do. Education comes last.",
  },
  {
    id: "job-ad",
    topic: "Job ad",
    scenario:
      "A job ad lists 5 requirements. You've never had a job, but you've done related assignments. How do you show you fit?",
    options: [
      "Don't apply until you have work experience",
      "Match each requirement to a specific assignment or project and mention it in your answers",
      "Just say you're a fast learner",
      "Say you have industry experience you don't have",
    ],
    correctIndex: 1,
    why: "Your campus projects ARE experience — if you connect them to the job's requirements.",
  },
  {
    id: "speaking-up",
    topic: "Speaking up",
    scenario:
      "In class, the lecturer asks a question you know the answer to. What helps your interview skills most?",
    options: [
      "Whisper it to a friend so they can answer",
      "Stay quiet — you already know it",
      "Answer out loud, even if it's not perfect",
      "Write it in your notes",
    ],
    correctIndex: 2,
    why: "Communication only improves by talking. Knowing the answer isn't enough if you can't say it.",
  },
  {
    id: "attitude",
    topic: "Attitude",
    scenario:
      "You're meeting your internship supervisor at 9am but you're running late. What do you do?",
    options: [
      "Walk in late without saying anything — it's only a few minutes",
      "Message before 9am, apologise, give a realistic arrival time — and don't let it happen again",
      "Skip it and email to reschedule later",
      "Blame the traffic when you arrive",
    ],
    correctIndex: 1,
    why: "Attitude matters as much as skills: be on time and keep your appointments.",
  },
];

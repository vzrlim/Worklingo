# Worklingo

**Learn the lingo of the workplace.** A free, mobile-first web app where university students practise job interviews out loud and test their workplace judgment.

- **Live app:** https://worklingo-pmg3.vercel.app
- **Instagram:** [@worklingo.my](https://instagram.com/worklingo.my)
- **SDG:** 4.4 – Skills for employment

Worklingo is part of an APU Project Management SDG awareness campaign. Its design is based on an interview with an APU Workplace Professional Skills lecturer.

---

## Features

**AI Interview Simulator** (`/interview`)
- Pick one of 6 common interview questions, for example "Tell me about yourself" or "Tell me about a time a teammate wasn't contributing".
- Answer by **speaking** (speech-to-text in the browser) or by typing. You can also add a target role, for example "Junior Data Analyst".
- The feedback contains:
  - a score out of 10
  - a STAR / SEAT / checklist breakdown, with a comment on each element
  - up to 3 strengths and 3 improvements
  - your own answer rewritten in the framework, with missing details shown as `[brackets]`
  - one tip for saying the answer out loud

**Workplace Scenario Quiz** (`/quiz`)
- 10 multiple-choice workplace situations: teamwork, meetings, preparation, applying, resume and punctuality.
- Each answer comes with a short explanation.
- No AI needed, so the quiz always works.

**XP and badges**
- Levels: Intern → Junior → Associate → Lead.
- 5 badges: First Interview, STAR Speaker, SEAT Ready, Prepared Pro and Voice Brave.
- Progress is stored only on the student's device. There is no login.

## Why it works this way

Each feature answers a finding from the expert interview:

| Expert insight | Feature |
|---|---|
| Communication is the #1 weakness, and it only improves by talking | Voice-first simulator with live transcript and timer |
| Students learn STAR and SEAT but don't apply them | AI scores each STAR / SEAT element |
| The biggest gap is preparation (company, job scope) | Quiz scenarios on preparation; a "What do you know about our company?" question |
| Generic chatbots give canned answers | The AI rewrites the student's **own** answer, tailored to their target role |
| Group conflict: talk privately and give notice | Teamwork and meeting scenarios; a teammate-conflict question |
| Mass-sending one cover letter; resumes should lead with experience | Applying and resume scenarios |
| Attitude: be on time and keep appointments | Punctuality scenario |
| AI helps with writing, not speaking | Students must still say their answer out loud |

## How the AI feedback works

```
Phone browser ──► /api/feedback (Vercel server) ──► Google Gemini
                   holds the API key; builds the prompt
```

1. The fast model (`gemini-3.1-flash-lite`) is tried first.
2. If it hasn't answered after 4 s, or it fails, the backup model (`gemini-3.8-flash`) starts in parallel. The first valid answer wins.
3. If no model answers within 12 s, the app switches to **Offline coach mode**: a keyword checklist plus an example answer. Students never see an error message.

Every result is labelled **AI Coach**, **AI Coach (backup)** or **Offline coach mode**.

## Privacy and safety

- No accounts and no database. Answers are **not stored or logged**.
- Answers are sent to Google's Gemini (free tier) to generate feedback, and Google may use them to improve its products. The app tells students this on screen.
- The API key exists only on the server. It never reaches the browser.
- Abuse protection:
  - input validation (known questions only, answers of 20–1,500 characters, bodies up to 8 KB, JSON only)
  - an origin lock, so only this site can call the API
  - a Vercel Firewall rate limit of **10 requests per 10 minutes per IP**
  - a soft cap of 10 AI reviews per device per day
  - prompt-injection fencing around the student's answer
  - a kill switch (`AI_ENABLED`)

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Google Gen AI SDK (`@google/genai`) · zod · lucide-react · hosted on Vercel (Hobby).

The Greek visuals (temple, Greek key, laurel, marble) are inline SVG and CSS. The app uses no image files and no animation libraries.

## Run it locally

You need Node.js 20 or newer, and a Gemini API key from [Google AI Studio](https://aistudio.google.com). Use a project with **no billing linked**, so it can never charge you.

```bash
git clone https://github.com/vzrlim/Worklingo.git
cd Worklingo
npm install
cp .env.example .env.local    # then paste your key after GEMINI_API_KEY=
npm run dev                   # open http://localhost:3000
```

Without a key, the simulator runs in Offline coach mode. The quiz works fully either way.

| Variable | Purpose | Default |
|---|---|---|
| `GEMINI_API_KEY` | Gemini API key (server only, never commit it) | — |
| `GEMINI_MODEL_PRIMARY` | Model tried first | `gemini-3.1-flash-lite` |
| `GEMINI_MODEL_FALLBACK` | Backup model | `gemini-3.8-flash` |
| `AI_ENABLED` | `true` turns AI on; anything else forces Offline coach mode | `true` |
| `ALLOWED_ORIGIN` | Live site URL; other sites are refused. Leave it empty locally | empty |

Other commands: `npm run build` (production build) and `npm run lint`.

## Deploy to Vercel

1. In Vercel, import this repo. The framework preset should be **Next.js**.
2. Add the environment variables above, then deploy.
3. Set `ALLOWED_ORIGIN` to the production URL (no trailing slash), then redeploy.
4. Go to **Firewall → New Rule**:
   - path starts with `/api/feedback`
   - rate limit: fixed window, 600 seconds, 10 requests, keyed by IP address
   - action: 429 Too Many Requests

After that, every push to `main` redeploys automatically.

## Project structure

```
app/              pages (landing, /interview, /quiz) and the API route /api/feedback
components/       app components (Greek motifs, feedback panel, quiz, mic button…)
components/ui/    shadcn/ui primitives
data/             interview question bank and quiz scenarios
lib/              Gemini call + fallback chain, offline feedback, XP/badges, speech, config
```

Project docs:
- [`PRD.md`](PRD.md): scope
- [`DESIGN.md`](DESIGN.md): UI rules
- [`AGENTS.md`](AGENTS.md): coding and security rules
- [`TODO.md`](TODO.md): progress log

## Testing

- **Lighthouse (mobile):** Accessibility score of 100 on all pages.
- **Devices:**
  - checked on a real iPhone (Safari)
  - emulated on Android Chrome, Samsung Internet, Instagram's in-app browser on Android, and desktop Chrome
  - every page fits the screen with no horizontal scroll and no JavaScript errors
- **AI chain:** all three modes verified (AI Coach, AI Coach backup, Offline coach mode). The firewall rate limit was also verified: the 11th request returns 429.

## Credits

Interview insights: an APU Workplace Professional Skills lecturer.

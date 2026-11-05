# TODO.md — Single source of truth for progress

Rules: work top to bottom. Tick `[x]` only when done AND `npm run build` passes. Add a Handoff log line after each task.
Items marked **(YOU)** are manual steps for the human — agents should remind, not attempt.

## Phase 0 — Setup (YOU)
- [x] **(YOU)** Google AI Studio → create a project **with NO billing linked** → create API key
- [ ] **(YOU)** Create GitHub repo (keep `.env.local` out of git)
- [ ] **(YOU)** Fill in `lib/config.ts` later: SDG_LABEL, IG_HANDLE, EXPERT_CREDIT (APP_NAME = "Worklingo" — set)
- [ ] **(YOU)** Check the Instagram handle for Worklingo is available

## Phase 1 — Scaffold
- [x] `npx create-next-app@latest` (TypeScript, App Router, Tailwind, ESLint, no `src/` dir)
- [x] Install: `@google/genai zod lucide-react server-only`
- [x] `npx shadcn@latest init` (accept Base UI default) → creates `components.json`, `components/ui/`, `globals.css` variables
- [x] `npx shadcn@latest add button card badge progress textarea input label alert skeleton separator` + the current toast component
- [x] Edit `components/ui/button.tsx`: `lg` size ≥ `h-11` (44 px)
- [x] Apply DESIGN.md §3 token values in `app/globals.css` (replace `:root` values with Aegean theme, delete `.dark`, add custom tokens); Cinzel (headings) & Times New Roman (body/inputs)
- [x] **(YOU, 2 min)** Install skills in the project root: *(done by Claude Code — `frontend-design` now lives in `anthropics/skills`, not `anthropics/claude-code`)*
  - `npx skills add shadcn/ui`
  - `npx skills add https://github.com/anthropics/claude-code --skill frontend-design`
  - If asked which agents, pick **Claude Code** and **Antigravity**. Check both `.agents/skills/` (Antigravity) and `.claude/skills/` (Claude Code) contain `shadcn` and `frontend-design`; if one is missing, copy the skill folder there.
- [x] **(YOU, optional)** shadcn MCP for Claude Code *(`.mcp.json` created with the Windows `cmd /c` wrapper — approve it when Claude Code asks on restart)*: create `.mcp.json` → `{"mcpServers": {"shadcn": {"command": "npx", "args": ["shadcn@latest", "mcp"]}}}` → restart Claude Code → `/mcp` shows Connected. For Antigravity, add the same command (`npx shadcn@latest mcp`) in its MCP settings if you want it there too.
- [x] Create folder structure (AGENTS.md §3), `.env.example`, `.gitignore` check
- [x] `lib/config.ts` with `APP_NAME = "Worklingo"`, placeholders for the rest + limits (answer 1500, role 60, daily AI cap 10, timeouts 10 s / 15 s)
- [x] `layout.tsx`: header (app name + XP chip placeholder) + footer (SDG, IG link, privacy note)

## Phase 2 — Data
- [x] `data/quiz-scenarios.ts` — 10 scenarios from PRD §7
- [x] `data/interview-questions.ts` — 6 questions + elements/keywords + model answers + tips from PRD §6
- [x] `lib/feedback-schema.ts` — zod schemas for request + response (PRD §4)

## Phase 3 — Scenario Quiz `/quiz` (no AI — build first so we always have a working demo)
- [x] QuizOption, WhyBox, QuizProgress components (composed from shadcn primitives — DESIGN.md §6.2)
- [x] Quiz flow: shuffle options, answer → lock → feedback → next
- [x] ResultScreen with score + IG share line
- [x] Test on 375 px

## Phase 4 — Gamification
- [x] `lib/progress.ts` — XP, levels, badges (PRD §5), all storage in try/catch
- [x] XpChip live in header; award XP from quiz
- [x] Badge unlock toast/inline message (no modal)

## Phase 5 — Interview Simulator UI `/interview`
- [x] Question picker (QuestionCard list) + optional Target role input
- [x] AnswerBox with counter + validation (min 20 / max 1500)
- [x] `lib/speech.ts` + MicButton: feature-detect `SpeechRecognition || webkitSpeechRecognition`, live transcript into textarea, timer, handle denied/unsupported → typing only
- [x] InAppBrowserBanner (Instagram / FB user agent)
- [x] FeedbackPanel + OfflineNotice + loading skeleton

## Phase 6 — Feedback API + fallback chain
- [x] `lib/fallback.ts` — offline keyword checklist (PRD §6, pure function, used by server + client)
- [x] `lib/gemini.ts` — `import "server-only"`, primary → backup model, 10 s timeout, JSON schema output, zod validation
- [x] `app/api/feedback/route.ts` — validation & limits (AGENTS.md §4), kill switch `AI_ENABLED`, optional `ALLOWED_ORIGIN`, never log answers
- [x] Client: 15 s timeout, non-200/failed → local offline feedback; daily soft cap (10/device)
- [x] Award simulator XP + badges (First Interview, STAR Speaker, SEAT Ready, Voice Brave)

## Phase 7 — Landing `/`
- [x] Hero + 2 CTAs
- [x] "Why we built this" — 3 expert insight cards (PRD §2: E1, E2, E3) + EXPERT_CREDIT
- [x] SDG badge + IG link + privacy note

## Phase 8 — Deploy & protect
- [ ] **(YOU)** Import repo in Vercel → add env vars (`GEMINI_API_KEY`, models, `AI_ENABLED=true`, `ALLOWED_ORIGIN=https://<your-app>.vercel.app`)
- [ ] **(YOU)** Vercel → Project → Firewall → New Rule → path starts with `/api/feedback` → Rate Limit, Fixed window, **10 requests / 10 min per IP** → action 429 (if Hobby shows an upgrade prompt, use **Deny**) → Publish
- [ ] Test checklist:
  - [x] Quiz works with `AI_ENABLED=false` *(quiz makes no API calls; verified locally with no key)*
  - [ ] Simulator: normal AI response (`source: ai`) — needs your key in `.env.local`
  - [ ] Wrong primary model name → `source: ai-backup` — needs your key
  - [x] Invalid key → `source: offline` *(verified locally: fake key → offline in ~0.5 s)*
  - [ ] Hit the rate limit → client shows offline mode, no raw error — needs Vercel Firewall rule
  - [x] API key not visible in DevTools (Network / Sources) *(no key name / Gemini URL / system prompt in `.next/static`; re-check Network tab on live site)*
  - [ ] Works in Instagram in-app browser (typing path) + Chrome mobile (voice path) — needs a phone + live URL
  - [x] Lighthouse mobile Accessibility ≥ 90 *(local: 100 on `/`, `/quiz`, `/interview`)*

## Phase 9 — Evidence for report (YOU)
- [ ] Screenshots of each page + feedback modes; short screen recording
- [ ] Live URL + QR code → Instagram link in bio / Story / post
- [ ] Save AI tool chat links (Antigravity / Claude) for the APU AI Declaration & Usage Log
- [ ] Note which features came from which expert insight (PRD §2 table) for Design Rationale

## Stretch (only with user approval) — see PRD §11
- [ ] (optional, after MVP) Stageshow skill (`npx skills add benjitaylor/skills --skill stageshow`) to make animated demo clips of the app for Instagram posts — NOT for the app UI itself

---
## Handoff log
<!-- Format: - YYYY-MM-DD | tool | done: ... | next: ... | notes: ... -->
- 2026-11-05 | Claude (Cowork) | done: created AGENTS.md, CLAUDE.md, PRD.md, DESIGN.md, TODO.md | next: Phase 0 (you) then Phase 1 | notes: AGENTS.md is the master rules file (Antigravity reads it automatically; .cursorrules is not used)
- 2026-11-05 | Claude (Cowork) | done: switched UI to shadcn/ui (Base UI) + shadcn & frontend-design skills in AGENTS.md, DESIGN.md, TODO.md | next: Phase 0 (you) then Phase 1 | notes: DESIGN.md beats skills on colours/fonts/layout
- 2026-11-05 | Antigravity | done: Phase 1 scaffold, dependencies (@google/genai, zod, lucide-react, server-only), shadcn/ui Base UI primitives, Aegean & Cinzel theme in globals.css, button touch size, lib/config.ts, .env.example, root layout with header & footer | next: Phase 2 Data | notes: skipped (YOU) manual steps; npm run build and npm run lint pass with 0 errors
- 2026-11-05 | Antigravity | done: Phase 2 Data: quiz scenarios (10), interview questions bank (6 with STAR/SEAT/Checklist), feedback zod request & response schemas | next: Phase 3 Scenario Quiz | notes: npm run build and npm run lint pass with 0 errors
- 2026-11-05 | Antigravity | done: Phase 3 Scenario Quiz: QuizProgress, QuizOption, WhyBox, ResultScreen, /quiz flow with Fisher-Yates runtime option shuffle, mobile 375px responsive layout | next: Phase 4 Gamification | notes: npm run build and npm run lint pass with 0 errors
- 2026-11-05 | Antigravity | done: Phase 4 Gamification: lib/progress.ts (XP, levels, badges with try/catch storage safety), XpChip live in header with useSyncExternalStore, badge unlock toasts with sonner, quiz XP award | next: Phase 5 Interview Simulator UI | notes: npm run build and npm run lint pass with 0 errors
- 2026-11-05 | Antigravity | done: Phase 5 Interview Simulator UI: QuestionCard, AnswerBox, MicButton with Web Speech API wrapper, InAppBrowserBanner, LoadingFeedback, FeedbackPanel with offline checklist fallback | next: Phase 6 Feedback API | notes: npm run build and npm run lint pass with 0 errors
- 2026-11-05 | Antigravity | done: Phase 6 Feedback API: lib/gemini.ts with fallback chain & 10s timeout, POST /api/feedback route with 8KB limit & whitelist, client 15s timeout & 10/day soft cap, simulator XP (+20/+10) and badge triggers (First Interview, STAR Speaker, SEAT Ready, Voice Brave) | next: Phase 7 Landing | notes: npm run build and npm run lint pass with 0 errors
- 2026-11-05 | Antigravity | done: Phase 7 Landing: hero section with 2 CTAs, 3 expert insight cards (E1, E2, E3) with EXPERT_CREDIT, SDG badge, IG handle link, privacy callout | next: Phase 8 Deploy & protect (YOU) | notes: npm run build and npm run lint pass with 0 errors
- 2026-11-05 | Claude Code | done: audit of Phases 1–7 vs PRD/DESIGN/AGENTS + fixes: gemini.ts (JSON schema output, lowest thinking level, real abort, 13 s total budget so backup answers before client's 15 s), route.ts (real 8 KB byte check, JSON-only 415, control chars stripped before validation, origin lock incl. missing Origin + comma list, never 500), quiz double progress bar + hydration mismatch, +10 XP per correct answer, QuestionCard keyboard-accessible, mic denied → typing-only copy, STAR/SEAT one-liner + privacy note on /interview, client validates API response, local-date daily cap, light-only toasts, prefers-reduced-motion, APP_NAME in hero/footer/share; installed shadcn + frontend-design skills, .mcp.json, .env.local template, git init; local tests: 10/10 API checks, invalid key → offline, origin lock, no key in bundle, Lighthouse a11y 100 | next: (YOU) paste key → test ai/ai-backup, push to GitHub, Vercel import + Firewall | notes: model IDs verified on Google's model list 2026-11-05; build + lint pass

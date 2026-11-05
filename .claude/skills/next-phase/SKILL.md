---
name: next-phase
description: Continue building Worklingo with the next unfinished phase in TODO.md. Use only when the user types /next-phase or asks to continue / do the next phase.
---

# Next phase

1. Follow the AGENTS.md session start protocol: read `PRD.md`, `DESIGN.md`, `TODO.md` and the Handoff log at the bottom of `TODO.md`.
2. Find the **first phase in TODO.md that still has unticked items not marked (YOU)**. That is the ONLY phase for this conversation.
   - Never redo ticked `[x]` items. If the phase is partly done, continue from its first unticked item.
   - Check the repo first: if an unticked item already exists in the code and works, verify it, tick it, and move on.
3. If the work depends on an unticked **(YOU)** item (e.g. skills installed, `.env.local`, Vercel env vars), stop and tell the user exactly what to do, with copy-paste steps. Otherwise list remaining (YOU) items at the end.
4. **Before editing any file, present an implementation plan** for this phase: the TODO items, files to create/change, shadcn components to add. Wait for the user's approval.
5. Build it following `AGENTS.md` (security rules, fallback chain), `DESIGN.md` (shadcn/ui, tokens, mobile 375 px) and `PRD.md` (nothing outside it).
6. Run `npm run build` and `npm run lint`. Fix all errors. Do not tick anything if the build fails.
7. Tick the finished items in `TODO.md` and add one Handoff log line:
   `- YYYY-MM-DD | <tool name> | done: <what> | next: <what> | notes: <blockers>`
8. **Stop.** Reply briefly with:
   - What was done
   - How to check it (e.g. `npm run dev` → open which page, at phone width)
   - Any (YOU) steps for the user
   - "Next: commit (`git add -A && git commit -m \"Phase N done\"`), then start a new chat and type /next-phase"

Never ask for, display, or read the Gemini API key. The user puts it in `.env.local` and Vercel themselves.

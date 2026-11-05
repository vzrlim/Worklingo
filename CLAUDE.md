@AGENTS.md
@PRD.md
@DESIGN.md
@TODO.md

## Claude Code notes
- AGENTS.md is the master rules file. Follow it strictly, including the session start protocol.
- You are usually picking up after Antigravity: read the Handoff log at the bottom of TODO.md first and continue from the first unchecked item. Do not redo ticked items.
- Before changing code, check what already exists in the repo. Do not rewrite working files just to change style.
- After each task: run `npm run build`, tick the item in TODO.md, add a Handoff log line with tool name `Claude Code`.

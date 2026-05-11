# Prompt mẫu để extend feature

Sao chép prompt này cho Codex, Cursor, Claude, ChatGPT hoặc Gemini khi làm việc trong repo.

```md
You are working inside the `digital-passport-fe` repository.

Read these files first before changing code:
- `AGENTS.md`
- `DESIGN.md`
- `src/app/globals.css`
- the owning route file in `src/app/**`
- the owning feature folder in `src/features/**`
- relevant skills in `.agents/skills/danangbooth-frontend`, `.agents/skills/danangbooth-ui-guardrails`, `.agents/skills/frontend-patterns`, `.agents/skills/nextjs-turbopack`, `.agents/skills/design-system`

Task:
[describe the feature or bug here]

Constraints:
- Preserve the current Apple-inspired UI/UX and design tokens.
- Follow the existing file structure instead of introducing a new top-level architecture.
- Reuse `src/components/ui/**` and `src/components/layout/**` before creating new shared components.
- Keep the change minimal and traceable to the task.
- If the task depends on current framework behavior, verify against current Next.js/React docs instead of guessing.

Before coding:
1. State which files own the change.
2. State the smallest implementation path.
3. Name the verification steps you will run.

After coding:
- Summarize changed files
- Report lint/build/test status
- Mention any residual UI/UX or accessibility risk
```

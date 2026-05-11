# Codex Setup for DanangBooth

This supplements the root `AGENTS.md` with project-local Codex guidance.

## Default Intent

- Preserve the current visual language defined in `DESIGN.md` and `src/app/globals.css`.
- Extend features inside the existing file layout before creating new top-level folders.
- Prefer existing UI primitives in `src/components/ui/` and layout chrome in `src/components/layout/`.

## Local Skills

Codex should discover and prefer these project-local skills:

- `danangbooth-frontend`
- `danangbooth-ui-guardrails`
- `frontend-patterns`
- `nextjs-turbopack`
- `documentation-lookup`
- `design-system`
- `accessibility`
- `verification-loop`

## Structure Guardrails

- Routes and route shells live in `src/app/**`.
- Shared reusable UI primitives live in `src/components/ui/**`.
- Shared layout chrome lives in `src/components/layout/**`.
- Feature-specific state and view logic should stay in `src/features/<feature>/**`.
- Cross-cutting state belongs in `src/store/**`, hooks in `src/hooks/**`, and shared utilities in `src/lib/**` or `src/services/**`.

## UI/UX Guardrails

- Reuse existing tokens, spacing rhythm, rounded corners, and motion timing before inventing new ones.
- Treat `TopBar`, `BottomNav`, safe-area variables, and the glass/parchment/tile surfaces as part of the product identity.
- Keep mobile-first behavior intact. New screens should work cleanly inside the current app shell.

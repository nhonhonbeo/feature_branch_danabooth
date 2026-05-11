---
name: danangbooth-frontend
description: Project-specific frontend extension workflow for DanangBooth.
origin: project
---

# DanangBooth Frontend

Use this skill for any non-trivial frontend task in this repository.

## File Map

- `src/app/**`: route entry points, layouts, and page shells
- `src/components/layout/**`: shared navigation and app chrome
- `src/components/ui/**`: reusable primitives
- `src/features/**`: feature-local state and UI
- `src/store/**`: cross-feature client state
- `src/hooks/**`: reusable hooks
- `src/lib/**`, `src/services/**`: utilities and data access

## Workflow

1. Start at the route in `src/app/**`.
2. Trace which feature folder owns the behavior.
3. Reuse shared primitives before creating new ones.
4. Keep feature-specific complexity inside `src/features/<feature>/**`.
5. If the change spans multiple screens, check `TopBar`, `BottomNav`, and safe-area spacing before finalizing.

## Default Heuristics

- Prefer extending an existing feature folder over creating a new top-level folder.
- Keep UI state local unless multiple screens truly need it.
- Keep current motion, spacing, and typography intact unless the task explicitly changes design.

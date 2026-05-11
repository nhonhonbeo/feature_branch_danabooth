---
name: frontend-patterns
description: Frontend development patterns for React, Next.js, state management, performance optimization, and UI best practices.
origin: ECC
---

# Frontend Patterns

Use this skill when building or extending React and Next.js UI in this repo.

## When To Use

- Creating or extending React components
- Adding client-side state or derived state
- Working with forms, loading states, or route-level UI
- Improving rendering behavior or reducing unnecessary re-renders

## Core Rules

1. Prefer composition over one-off abstractions.
2. Keep feature logic close to the owning feature folder.
3. Reuse existing `src/components/ui/**` primitives before creating new shared components.
4. Keep server/client boundaries explicit in Next.js App Router files.
5. Only memoize when a real rerender or computation problem exists.

## Project Fit

- Route shells live in `src/app/**`.
- Feature-specific logic should stay in `src/features/<feature>/**`.
- Cross-feature utilities belong in `src/lib/**`, `src/hooks/**`, or `src/store/**`.
- Shared layout chrome belongs in `src/components/layout/**`.

## Delivery Checklist

- Does the component fit the existing file ownership?
- Did you reuse existing primitives first?
- Are loading, empty, and error states covered where needed?
- Does the component preserve mobile behavior and safe-area spacing?

---
name: design-system
description: Audit or extend the existing visual system without drifting from it.
origin: ECC
---

# Design System

Use this skill when a task changes styling, layout, or shared UI primitives.

## Source Of Truth

- `DESIGN.md`
- `src/app/globals.css`
- `src/components/ui/**`
- `src/components/layout/TopBar.tsx`
- `src/components/layout/BottomNav.tsx`

## Rules

1. Extend the existing token system before inventing new colors, radii, or shadows.
2. Preserve the Apple-inspired feel: restrained chrome, clear typography hierarchy, purposeful motion, and one dominant interactive blue.
3. Treat glass surfaces, parchment backgrounds, dark tiles, and safe-area handling as product identity.
4. If a new UI pattern is reusable, first check whether it belongs in `src/components/ui/**` or should stay feature-local.

## Review Checklist

- Are colors and spacing pulled from existing tokens?
- Does the new screen still feel like the same product?
- Are layout and motion choices consistent with current primitives?

---
name: danangbooth-ui-guardrails
description: Project-specific UI and UX guardrails for preserving the current product feel.
origin: project
---

# DanangBooth UI Guardrails

Use this skill when touching visual design, layouts, or new screens.

## Read First

- `DESIGN.md`
- `src/app/globals.css`
- `src/components/layout/TopBar.tsx`
- `src/components/layout/BottomNav.tsx`

## What Must Stay Stable

- Apple-inspired typography hierarchy and restrained chrome
- One dominant action blue
- Glass, parchment, pearl, and dark tile surfaces
- Rounded system from `--radius-xs` through `--radius-pill`
- Mobile-first spacing and safe-area behavior

## Extension Rules

1. New screens should look like a continuation of the current app, not a redesign.
2. New calls to action should use existing button language first.
3. New cards, drawers, or overlays should reuse current shadows and radius tokens.
4. Avoid introducing ad hoc hex colors, spacing values, or animation curves.
5. If a visual decision conflicts with `DESIGN.md`, the design doc wins unless intentionally updated.

## Quick Review

- Does the screen still match the current shell?
- Are tokens reused instead of invented?
- Does the new UI remain clean on mobile?

---
name: nextjs-turbopack
description: Next.js 16+ and Turbopack workflow guidance for this project.
origin: ECC
---

# Next.js Turbopack

This repo runs on Next.js `16.x`, so version-aware behavior matters.

## Use This Skill When

- Adding or moving App Router files
- Debugging build or dev-server behavior
- Making decisions that depend on Next.js 16 conventions

## Guardrails

1. Read the relevant docs under `node_modules/next/dist/docs/` before relying on memory for changed APIs.
2. Default to `next dev` with Turbopack for local development.
3. Keep App Router patterns aligned with the existing `src/app/**` layout.
4. Treat server/client component boundaries as design constraints, not afterthoughts.

## Verification

- `npm run dev` for local flow validation
- `npm run build` before merge when routing or config changes

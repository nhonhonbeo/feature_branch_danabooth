---
name: verification-loop
description: Run a practical verification pass after changes.
origin: ECC
---

# Verification Loop

Use this skill after making changes or before opening a PR.

## Default Sequence

1. `npm run lint`
2. `npm run build`
3. Run any task-specific test command if the repo has tests for that area
4. Review `git diff --stat`

## UI-Focused Checks

- Reconfirm the changed route still fits the current shell and safe-area spacing.
- Verify typography, color tokens, and spacing still come from the shared system.
- Check for accidental new dependencies or duplicated primitives.

## Output

Report:

- Build status
- Lint status
- Test status if applicable
- Residual risks or unverified areas

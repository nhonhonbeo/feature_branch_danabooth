---
name: accessibility
description: WCAG-focused accessibility checks for components, navigation, and interactive UI.
origin: ECC
---

# Accessibility

Use this skill whenever a task introduces or changes interactive UI.

## Minimum Bar

- Use semantic elements before generic containers.
- Keep interactive targets at least `24x24px`.
- Preserve visible focus states.
- Ensure icon-only controls have an accessible label.
- Keep modals, drawers, and overlays keyboard-usable and escapable.

## Project-Specific Focus

- Navigation chrome such as `TopBar` and `BottomNav` must remain usable by keyboard and screen readers.
- Search inputs, map controls, and floating action buttons need labels and focus handling.
- Do not rely on color alone for status or emphasis.

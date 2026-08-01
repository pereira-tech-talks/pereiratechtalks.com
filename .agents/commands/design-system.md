---
name: design-system
description: Create or refresh this repo's DESIGN.md (design tokens + rules for AI agents; at docs/DESIGN.md, indexed from AGENTS.md) via the DeepWorkPlan design-system addon.
---

# /design-system

Create or refresh this repository's [`docs/DESIGN.md`](../../docs/DESIGN.md) — the
agent-facing UI contract indexed from `AGENTS.md` — so coding agents generate
interface output consistent with Pereira Tech Talks' **own** conventions rather
than generic defaults. This command is a **thin delegator** to the DeepWorkPlan
`deepworkplan-addon-design-system` addon; it carries no logic of its own.

## Steps

1. Invoke the `deepworkplan-addon-design-system` addon (via
   `/deepworkplan-addon-design-system`, or by reading
   `.agents/skills/deepworkplan/addons/design-system/SKILL.md`).
2. Follow the addon's flow: locate this repo's real design source, reason out each
   canonical section from it, and **reconcile** `docs/DESIGN.md` (never clobber —
   keep working values, ask before any destructive change). Confirm `AGENTS.md`
   still references it.
3. Run the addon's validation step: all `visual-ui` sections present, values
   traceable to the real source, inferred values flagged, WCAG AA pairings hold,
   token references resolve.

## Notes

- **Profile: `visual-ui` only.** This repo has no styled-CLI surface
  (`scripts/*.mjs` use plain `console.log`; no chalk/ora/picocolors) and no
  conversational surface (no chat/email SDK — `functions/api/contact.ts` is a
  plain form handler). Do **not** add the `cli-output` or `conversational`
  profiles unless one of those surfaces actually appears — and always ask first.
- **Design source for this repo:**
  - `src/styles/global.css` — the Tailwind 4 `@theme` block (`--color-ptt-*`
    tokens), the `.dark` override block, `@layer base` focus rings, and the
    `prefers-reduced-motion` block.
  - `tailwind.config.mjs` — `darkMode: ['class']`, typography plugin overrides.
  - `docs/BRAND_GUIDE.md` — palette rationale, type scale, spacing/radius/motion
    scales, per-edition kits.
  - `src/components/ui/` primitives (`Pill.astro`, `EmptyState.astro`) and
    `src/components/pages/*Page.astro` for real component patterns.
  - `src/content/pereiraTechDays/{year}.{json,yaml}` — per-edition `brandKit`s.
- **Integrity rules to enforce:** body text ≥ WCAG AA 4.5:1 (`text-ptt`,
  `text-ptt-secondary`); `text-gray-400/500` and their `dark:` variants are
  **forbidden** for body text; `--ptt-accent` (~2.4:1 on `--ptt-bg`) is never body
  text; `--ptt-*` is never set outside `global.css` or a `[data-edition-theme]`
  scope; light **and** dark verified; motion gated by `prefers-reduced-motion`.
- Reason about the real tokens — never paste a third-party brand's `DESIGN.md`.
- Keep `DESIGN.md` and `BRAND_GUIDE.md` consistent: `DESIGN.md` documents
  **shipped** behavior and flags divergence (e.g. the currently unwired
  `Inter Variable` / Atkinson font discrepancy).

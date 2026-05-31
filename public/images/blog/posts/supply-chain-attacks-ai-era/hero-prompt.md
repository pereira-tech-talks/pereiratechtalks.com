# Hero image prompt — supply-chain-attacks-ai-era

**Post slug:** `supply-chain-attacks-ai-era`
**Layout:** `banner` (landscape, ~1920×960 or 2:1)
**Format:** Save as `hero.webp` in this directory.

## What the image should communicate

The open-source supply chain compromised by an AI-augmented adversary — but the visual should feel like a careful engineering diagram, not a hacker-stock-photo cliché. Think "data-flow diagram corrupted at one node," not "hooded figure at a green terminal."

## Concept directions (pick one)

1. **Compromised dependency graph.** A clean technical illustration of a `package.json` dependency tree — boxes connected by lines — with one node (somewhere mid-tree, not at the root) rendered in red/orange and bleeding a subtle dark stain into its downstream neighbors. The infected node has a small badge that reads "v1.14.1" or a similar version number to suggest a recently-published compromised version. Background: deep navy `#0f1124` (matches `MainLayout`'s dark theme); text/lines in soft off-white.

2. **The Shai-Hulud worm reference (subtle).** A horizontal Dune-style sandworm silhouette as the negative space inside the bracket characters of a `dependencies: { ... }` block. Almost ASCII-art feel. Same dark navy background. Tag underneath: "Shai-Hulud, axios, TanStack, Bitwarden CLI, ultralytics — 18 months."

3. **AI-on-AI metaphor.** A neural-network glyph (rounded nodes, dashed connections) wrapped in a chain-link border that's broken at one segment. Inside the broken link, a tiny prompt-box icon (like a CLI cursor) indicates the injection point. Caption-free; the broken link does the storytelling.

## Style rules

- **Background:** dark navy `#0f1124` (this site's primary dark canvas) — do not use pure black, do not use white.
- **Accents:** site's brand orange `#d97f00` for the compromised/highlighted element only. Keep accent area under ~10% of the canvas.
- **Type (if any):** Inter or a similar geometric sans. Small, monospaced for version numbers.
- **No stock-photo tropes:** no hoodies, no green Matrix code, no padlocks-on-keyboards, no glowing skull, no anonymous mask.
- **Minimum text:** the image should read without copy. If a single label is included, keep it to one line.

## Avoid

- Hacker iconography (skulls, masks, hoodies, "1337"-style glyphs).
- Pure red color-grading — the post is technical, not alarmist.
- AI-generated faces or hands.
- Generic "shield + checkmark" security imagery.
- More than two accent colors.

## Reference posts

- `2026-05-04_openclaw-anatomy-of-a-lobster` — for tone (technical, considered, not breathless).
- `2026-04-22_aeo-well-known-field-guide` — for diagrammatic hero style.

Once the final WebP is in place, delete this `hero-prompt.md` file so the directory only ships the assets used at build time.

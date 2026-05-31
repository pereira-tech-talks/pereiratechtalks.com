---
name: add-component
description: Create new Astro or Svelte components with correct patterns. Use proactively when creating new UI components.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: haiku
# === Documentation (ignored by tools, useful for humans) ===
tier: 1
intent: create
max-files: 3
max-loc: 150
---

# Skill: Add Component

## Objective

Create new Astro (`.astro`) or Svelte (`.svelte`) components following project patterns. This skill guides the decision of which technology to use and where to place the component.

## Non-Goals

- Does NOT create entire features (just components)
- Does NOT modify existing components
- Does NOT create pages (use add-page skill)
- Does NOT create blog posts (use add-blog-post skill)

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** Creating a single component is mechanical, follows clear patterns, and has low risk. Decision tree for Astro vs Svelte is straightforward.

## Inputs

### Required Parameters

- `$NAME`: Component name (PascalCase, e.g., `UserCard`)
- `$PURPOSE`: What the component does

### Optional Parameters

- `$LOCATION`: Where to place (default: infer from purpose)
- `$TYPE`: Force `astro` or `svelte` (default: auto-select)

## Decision: Astro vs Svelte

### Use Astro (`.astro`) When:

- Static content only
- Server-rendered, no client JavaScript needed
- SEO-critical content (meta tags, structured data)
- Wrapping other components (layouts, containers)
- No user interactions needed

**Examples:** `Footer.astro`, `BlogContainer.astro`, `HeroSection.astro`

### Use Svelte (`.svelte`) When:

- Interactive UI (click handlers, hover effects)
- Client-side state management needed
- Animations or transitions
- Real-time updates
- Form inputs with validation

**Examples:** `Header.svelte`, `BlogSearchInput.svelte`, `MobileMenu.svelte`

## Component Locations

| Location | Purpose |
|----------|---------|
| `src/components/` | Standalone utilities |
| `src/components/blog/` | Blog-related components |
| `src/components/home/` | Homepage sections |
| `src/components/layout/` | Layout (Header, Menu) |

## Steps

### Step 1: Determine Type and Location

- Analyze purpose → Astro or Svelte?
- Determine folder based on component role

### Step 2: Create Component

**i18n Requirement:** If the component displays user-visible text, it MUST accept a `lang` prop and use `getTranslations(lang)` for all text. Never hardcode user-visible strings directly in templates. If new translation keys are needed, add them to `src/lib/translations.ts` in BOTH English and Spanish.

**Astro Template (with i18n):**

```astro
---
import { getTranslations } from '@/lib/translations';

import type { Language } from '@/lib/translations';

interface Props {
  lang: Language;
  description?: string;
}

const { lang, description } = Astro.props;
const t = getTranslations(lang);
---

<div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
  <h2 class="text-xl font-bold text-gray-900 dark:text-white">{t.section.title}</h2>
  {description && <p class="text-gray-600 dark:text-gray-300">{description}</p>}
</div>
```

**Svelte Template (with i18n):**

```svelte
<script lang="ts">
  import { getTranslations } from '@/lib/translations';

  export let lang: string = 'en';
  export let onClick: (() => void) | undefined = undefined;

  $: t = getTranslations(lang);
</script>

<button
  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
  on:click={onClick}
>
  {t.section.buttonLabel}
</button>
```

**Note:** Components that only display props (no hardcoded text) do not need the `lang` prop or `getTranslations()`.

### Step 3: Validate

```bash
pnpm run biome:check
pnpm run astro:check
```

## Output Format

### Success Output

```
## ✅ Component Created

### Component
- Name: {ComponentName}
- Type: {Astro|Svelte}
- Location: `src/components/{path}/{ComponentName}.{astro|svelte}`

### Features
- Props: {list of props}
- Dark mode: ✅
- TypeScript: ✅

### Usage
\`\`\`astro
---
import {ComponentName} from '@/components/{path}/{ComponentName}.{ext}';
---

<{ComponentName} {client:load if svelte} title="Example" />
\`\`\`

### Validation
- Biome: ✅
- Astro: ✅

### Commit Message
feat: add {ComponentName} component
```

## Guardrails

### Scope Limits

- **Maximum files:** 3 (component + optional subcomponents)
- **Maximum LOC:** 150

### Required Patterns

- [ ] Props interface defined (TypeScript)
- [ ] Dark mode support (`dark:` Tailwind classes)
- [ ] Accessible (aria labels if interactive)
- [ ] No hardcoded user-visible text (use `getTranslations(lang)`)
- [ ] New translation keys added for both en and es in `translations.ts` (if applicable)

### Stop Conditions

**Stop and escalate** if:

- Component requires complex state management
- Needs to create multiple interconnected components
- Requires architectural decisions

## Definition of Done

- [ ] Component file created
- [ ] Props interface defined
- [ ] Dark mode classes included
- [ ] No hardcoded user-visible text (uses `getTranslations()` if text is displayed)
- [ ] New translation keys added for both languages (if applicable)
- [ ] Component accepts `lang` prop if it displays text
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes

## Examples

### Example 1: Static Card (Astro)

**Input:**
```
$NAME: FeatureCard
$PURPOSE: Display a feature with icon and description
```

**Result:** Creates `src/components/FeatureCard.astro`

### Example 2: Interactive Button (Svelte)

**Input:**
```
$NAME: ThemeButton
$PURPOSE: Toggle between light and dark mode
```

**Result:** Creates `src/components/ThemeButton.svelte`

## Related

- [add-page](../add-page/SKILL.md) - Create pages
- [add-blog-post](../add-blog-post/SKILL.md) - Create blog posts
- [translate-sync](../translate-sync/SKILL.md) - Synchronize translations
- [update-styles](../update-styles/SKILL.md) - Style modifications
- [reviewer](../../agents/reviewer.md) - Review components

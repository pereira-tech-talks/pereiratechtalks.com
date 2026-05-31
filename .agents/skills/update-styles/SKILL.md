---
name: update-styles
description: Update Tailwind styles with dark mode support. Use proactively for styling updates.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: haiku
# === Documentation (ignored by tools, useful for humans) ===
tier: 1
intent: fix
max-files: 5
max-loc: 100
---

# Skill: Update Styles

## Objective

Update Tailwind CSS styles in components or global CSS with proper dark mode support. This skill handles styling-only changes without modifying component logic.

## Non-Goals

- Does NOT modify component logic
- Does NOT add new features
- Does NOT create new components
- Does NOT change layout structure

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** Styling changes are visual-only, follow clear Tailwind patterns, and have low risk. Easy to validate visually.

## Inputs

### Required Parameters

- `$TARGET`: File(s) to update (component or global.css)
- `$CHANGES`: What styling changes are needed

### Optional Parameters

- `$DARK_MODE`: Ensure dark mode support (default: true)

## Brand Reference

> **Always consult [Brand Guide](../../../docs/BRAND_GUIDE.md)** for the official color palette, dark mode pairing rules, and typography scale before making styling decisions.
>
> **Key tokens:** `bg-main` (Void Black `#0F1124`), `bg-secondary`/`text-secondary` (Crimson Strike `#E51641`)
> **Full palette:** Ninja Navy `#152E45`, Shadow Steel `#637996`, Pure White `#FFFFFF`

## Key Concepts

### Tailwind Utility Classes

```html
<!-- Spacing -->
<div class="p-4 m-2 px-6 py-3">

<!-- Colors -->
<div class="bg-white text-gray-900">

<!-- Typography -->
<p class="text-lg font-bold text-center">

<!-- Flexbox/Grid -->
<div class="flex items-center justify-between gap-4">
<div class="grid grid-cols-3 gap-6">

<!-- Responsive -->
<div class="text-sm md:text-base lg:text-lg">
```

### Dark Mode Pattern

**Always pair light and dark:**

```html
<!-- Background -->
<div class="bg-white dark:bg-gray-900">

<!-- Text -->
<p class="text-gray-900 dark:text-gray-100">

<!-- Borders -->
<div class="border-gray-200 dark:border-gray-700">

<!-- Hover states -->
<button class="hover:bg-gray-100 dark:hover:bg-gray-800">
```

### Theme Colors

From `src/styles/global.css`:

```css
@theme {
  --color-main: #0f1124;
  --color-secondary: #e41541;
}
```

Usage:
```html
<div class="bg-main text-white">
<span class="text-secondary">
```

### Responsive Design Patterns

**Mobile-first approach with Tailwind breakpoints:**

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| None (default) | < 640px | Mobile (320-639px) |
| `sm:` | >= 640px | Large phones |
| `md:` | >= 768px | Tablets |
| `lg:` | >= 1024px | Laptops |
| `xl:` | >= 1280px | Desktops |
| `2xl:` | >= 1536px | Large monitors |

**Always design mobile-first, then progressively enhance:**

```html
<!-- Start simple on mobile, enhance at larger sizes -->
<div class="text-sm md:text-base lg:text-lg">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<div class="p-4 md:p-6 lg:p-8">
```

**Heading text scaling (common pattern):**

```html
<!-- Scale headings across breakpoints for better mobile UX -->
<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
<h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
```

**Responsive spacing patterns:**

```html
<!-- Stack on mobile, side-by-side on larger screens -->
<div class="flex flex-col md:flex-row gap-4 md:gap-8">

<!-- Reduce padding on mobile, increase on desktop -->
<div class="p-4 sm:p-6 md:p-8 lg:p-12">

<!-- Hide on mobile, show on larger screens -->
<div class="hidden md:block">

<!-- Show different content at different sizes -->
<div class="block md:hidden">Mobile content</div>
<div class="hidden md:block">Desktop content</div>
```

**Touch target sizing (accessibility requirement):**

Minimum 44px touch targets for interactive elements:

```html
<!-- Buttons and interactive elements should be at least 44x44px -->
<button class="px-4 py-2 rounded min-h-[44px] min-w-[44px]">
<a href="/" class="inline-flex items-center justify-center h-12 px-4 rounded">
<div class="w-12 h-12 flex items-center justify-center rounded">
```

**Dark mode + responsive combination:**

```html
<!-- Always pair dark mode with responsive changes -->
<h2 class="text-2xl sm:text-3xl md:text-4xl
           text-gray-900 dark:text-gray-100
           font-bold">

<div class="bg-white dark:bg-gray-800
           text-gray-900 dark:text-gray-100
           p-4 md:p-6 lg:p-8">

<button class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
              px-4 md:px-6 py-2 md:py-3">
```

## Steps

### Step 1: Identify Target

- Read the target file(s)
- Understand current styling
- Note what needs to change

### Step 2: Apply Changes

- Use Tailwind utilities (not custom CSS when possible)
- Add `dark:` variants for all color-related classes
- Maintain responsive design (`sm:`, `md:`, `lg:`)
- Keep existing structure

### Step 3: Validate

```bash
pnpm run biome:check
pnpm run dev  # Visual inspection
```

## Output Format

### Success Output

```
## ✅ Styles Updated

### Target
{What was styled}

### Changes
- `{file}`: {what changed}

### Dark Mode
- Light mode: ✅
- Dark mode: ✅

### Validation
- Biome: ✅
- Visual check: ✅

### Commit Message
style: {description}
```

## Guardrails

### Required Patterns

- [ ] Dark mode classes included
- [ ] Responsive if needed
- [ ] Consistent with existing styles
- [ ] Uses Tailwind utilities

### Scope Limits

- **Maximum files:** 5
- **Maximum LOC:** 100 (styling changes)

### Stop Conditions

**Stop and escalate** if:

- Requires new custom CSS classes
- Layout restructuring needed
- Component logic changes required

## Definition of Done

- [ ] Styling changes applied
- [ ] Dark mode supported
- [ ] Looks correct in both themes
- [ ] `pnpm run biome:check` passes

## Common Patterns

### Card Component

```html
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 
            hover:shadow-lg transition-shadow">
  <h3 class="text-lg font-bold text-gray-900 dark:text-white">
  <p class="text-gray-600 dark:text-gray-300">
</div>
```

### Button

```html
<button class="px-4 py-2 rounded-lg font-medium
               bg-blue-500 hover:bg-blue-600 text-white
               dark:bg-blue-600 dark:hover:bg-blue-700
               transition-colors">
```

### Link

```html
<a class="text-blue-600 hover:text-blue-800 
          dark:text-blue-400 dark:hover:text-blue-300
          underline transition-colors">
```

### Input

```html
<input class="w-full px-4 py-2 rounded-lg border
              bg-white dark:bg-gray-800
              border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500 focus:outline-none">
```

## Examples

### Example 1: Add Dark Mode to Component

**Input:**
```
$TARGET: src/components/Footer.astro
$CHANGES: Add dark mode support to footer text
```

**Before:**
```html
<footer class="bg-gray-100 text-gray-600">
```

**After:**
```html
<footer class="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
```

### Example 2: Update Global Container

**Input:**
```
$TARGET: src/styles/global.css
$CHANGES: Add new utility class for cards
```

**Add to global.css:**
```css
@layer components {
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
  }
}
```

### Example 3: Responsive + Dark Mode Fix

**Input:**
```
$TARGET: src/components/home/HeroSection.astro
$CHANGES: Scale heading text responsively and ensure dark mode support
```

**Before:**
```html
<h1 class="text-6xl font-bold text-gray-900">
```

**After:**
```html
<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl
           font-bold
           text-gray-900 dark:text-gray-100">
```

### Example 4: Responsive Grid Layout

**Input:**
```
$TARGET: src/components/ProjectsSection.astro
$CHANGES: Make project grid responsive with dark mode
```

**Before:**
```html
<div class="grid grid-cols-4 gap-6 bg-gray-50">
```

**After:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6
           bg-gray-50 dark:bg-gray-900
           p-4 md:p-8">
```

## Related

- [quick-fix](../quick-fix/SKILL.md) - Small fixes
- [add-component](../add-component/SKILL.md) - Create components
- src/styles/README.md - Styling guide
- tailwind.config.mjs - Tailwind configuration

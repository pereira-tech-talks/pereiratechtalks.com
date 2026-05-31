# Dark Mode Feature

## Overview

The website supports dark and light themes with:
- User preference persistence via `localStorage`
- System preference detection via `prefers-color-scheme`
- Flash-free theme application on page load
- Manual toggle via ThemeToggle component

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Theme Flow                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Page Load (Before Paint)                                 │
│     └── Inline theme script in layout executes              │
│         ├── Check localStorage('theme')                     │
│         ├── OR Check prefers-color-scheme                   │
│         └── Apply 'dark' class to <html> if needed         │
│                                                              │
│  2. User Toggles Theme                                       │
│     └── ThemeToggle clicked                                 │
│         ├── Toggle 'dark' class on <html>                  │
│         └── Save preference to localStorage                 │
│                                                              │
│  3. Components React                                         │
│     └── Tailwind 'dark:' utilities apply                   │
│         └── Colors/backgrounds update instantly             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Components

| Component | File | Role |
|-----------|------|------|
| Theme Script | Inlined in layouts | Initial theme detection (no external request) |
| ThemeToggle | `src/components/ThemeToggle.astro` | Manual theme toggle |
| MainLayout | `src/layouts/MainLayout.astro` | Inlines theme script in head |
| global.css | `src/styles/global.css` | Dark mode configuration |

## Theme Script

**Location:** Inlined in `MainLayout.astro`, `InternalLayout.astro`, `ShowcaseLayout.astro`

The theme script runs inline before the page paints to prevent flash (no external request, no render-blocking):

```javascript
(function() {
  var t = localStorage.getItem('theme');
  if (!t) t = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  if (t === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();
```

**Priority order:** saved `localStorage` preference > system `prefers-color-scheme` > light (default).

`localStorage` is only written when the user explicitly clicks the toggle, so the site continues to follow system preference changes until the user makes a manual choice.

## ThemeToggle Component

**Location:** `src/components/ThemeToggle.astro`

```astro
<button id="theme-toggle" aria-label="Toggle dark mode">
  <span class="block dark:hidden">☀️</span>
  <span class="hidden dark:block">🌙</span>
  <script is:inline>
    document.getElementById("theme-toggle").onclick = function () {
      const html = document.documentElement;
      const isDark = html.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    };
  </script>
</button>
```

## Tailwind Configuration

**In `tailwind.config.mjs`:**

```javascript
export default {
  darkMode: ['class'],  // Use class-based dark mode
  // ...
}
```

**In `global.css`:**

```css
@custom-variant dark (&:where(.dark, .dark *));
```

## Using Dark Mode in Components

Apply dark styles using the `dark:` prefix:

```html
<!-- Background -->
<div class="bg-white dark:bg-gray-900">

<!-- Text -->
<p class="text-gray-900 dark:text-gray-100">

<!-- Borders -->
<div class="border-gray-200 dark:border-gray-700">

<!-- Shadows -->
<div class="shadow-md dark:shadow-gray-900/50">
```

## Contrast Requirements (WCAG AA)

All text must meet WCAG AA contrast ratios in **both** light and dark modes:

| Text Purpose | Light Mode | Dark Mode | Combined |
|-------------|-----------|-----------|----------|
| Primary text | `text-gray-900` | `dark:text-white` | `text-gray-900 dark:text-white` |
| Secondary/body text | `text-gray-600` | `dark:text-gray-300` | `text-gray-600 dark:text-gray-300` |
| Text on bg-main | N/A | `text-gray-300` | `text-gray-300` |

**Never use:** `text-gray-400`, `dark:text-gray-400`, or `dark:text-gray-500` for body text — they fail WCAG AA 4.5:1 contrast on their respective backgrounds.

**Full reference:** See [Accessibility Guide](../ACCESSIBILITY.md) for contrast ratio tables and all approved pairings.

## Common Patterns

### Card Component

```html
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h3 class="text-gray-900 dark:text-white">Title</h3>
  <p class="text-gray-600 dark:text-gray-300">Content</p>
</div>
```

### Button

```html
<button class="bg-blue-500 hover:bg-blue-600 text-white
               dark:bg-blue-600 dark:hover:bg-blue-700">
  Click me
</button>
```

### Link

```html
<a class="text-blue-600 hover:text-blue-800
          dark:text-blue-400 dark:hover:text-blue-300">
  Link text
</a>
```

## Icon Variants

For icons that need different versions:

```html
<!-- Use white variant on dark backgrounds -->
<img src="/icons/github_white.svg" alt="GitHub" />

<!-- Or use CSS filters -->
<img src="/icons/github.svg" class="dark:invert" alt="GitHub" />
```

## Theme Colors

Custom theme colors in `global.css`:

```css
@theme {
  --color-main: #0f1124;      /* Void Black — dark mode base */
  --color-secondary: #e41541; /* Crimson Strike — light mode accent */
  --color-gray-50: #f1f5f9;   /* Slightly stronger light surface contrast */
}

.dark {
  --color-secondary: #cd3553; /* Softer accent for dark mode readability */
}
```

Use in Tailwind:

```html
<div class="bg-main">Dark branded background (Void Black)</div>
<span class="text-secondary">Accent text (Crimson Strike)</span>
```

### Accent Token Behavior by Theme

| Token | Light Mode | Dark Mode | Why |
|-------|-----------|-----------|-----|
| `--color-secondary` | `#E41541` | `#CD3553` | Keeps brand identity while reducing perceived intensity on dark backgrounds |
| `--color-gray-50` | `#F1F5F9` | N/A | Improves separation between adjacent light surfaces |

Implementation note:

- Components should keep using `bg-secondary`, `text-secondary`, and `border-secondary`.
- Avoid hardcoding red shades (e.g. `text-red-*`) for primary accent elements.
- The dark accent adjustment is global and automatic via `.dark`.

> **Full palette:** See **[Brand Guide](../BRAND_GUIDE.md)** for the complete 5-color system (Ninja Navy, Crimson Strike, Shadow Steel, Void Black, Pure White), dark/light mode pairing rules, and usage guidelines.

## Storage

Theme preference is stored in `localStorage` only after the user manually toggles:

```javascript
// Get — returns 'dark', 'light', or null (no manual choice yet)
localStorage.getItem('theme')

// Set — only written by ThemeToggle on click
localStorage.setItem('theme', 'dark')
```

When `localStorage` has no value (`null`), the system preference is used:

```javascript
window.matchMedia('(prefers-color-scheme: dark)').matches
```

## Transition Effects

Smooth theme transitions in `MainLayout.astro`:

```html
<body class="transition-colors duration-300">
```

## Debugging

Check current theme state:

```javascript
// In browser console
document.documentElement.classList.contains('dark')  // true = dark mode
localStorage.getItem('theme')  // Saved preference
```

## Related Documentation

- [Brand Guide](../BRAND_GUIDE.md) - Complete color palette and dark mode pairing rules
- [Styling Guide](../../src/styles/README.md)
- [Layout Components](../../src/components/layout/README.md)
- [Public Assets](./PUBLIC_ASSETS.md) - Icon variants

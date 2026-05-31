# Styles (`src/styles/`)

This directory contains global CSS styles and Tailwind CSS configuration for the application.

## Directory Structure

```
styles/
└── global.css    # Global styles, Tailwind imports, custom properties
```

## Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `global.css` | `src/styles/` | Global styles, Tailwind base |
| `tailwind.config.mjs` | Project root | Tailwind configuration |

## global.css

The main stylesheet that imports Tailwind and defines global styles.

### Structure

```css
/* 1. Tailwind Base Import */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* 2. Theme Variables */
@theme {
  --color-main: #0f1124;
  --color-secondary: #e41541;
}

/* 3. Dark Mode Configuration */
@custom-variant dark (&:where(.dark, .dark *));

/* 4. Component Classes */
@layer components {
  .main-container {
    @apply max-w-7xl mx-auto py-4 px-4 md:px-8;
  }
}

/* 5. Custom Animations */
@keyframes chevron-bounce { ... }
.animate-chevron-bounce { ... }
```

### Theme Colors

| Variable | Value | Brand Name | Usage |
|----------|-------|-----------|-------|
| `--color-main` | `#0f1124` | Void Black | Dark mode base background |
| `--color-secondary` | `#e41541` | Crimson Strike | Accent — highlights, CTAs, interactive elements |

Additional brand colors not yet registered as tokens: Ninja Navy `#152E45`, Shadow Steel `#637996`.

> **Full palette and usage rules:** See **[Brand Guide](../../docs/BRAND_GUIDE.md)** for the complete 5-color system, pairing rules, and logo guidelines.

Use in Tailwind classes:

```html
<div class="bg-main">Dark background (Void Black)</div>
<span class="text-secondary">Accent text (Crimson Strike)</span>
```

### Custom Components

#### `.main-container`

Standard content container with responsive padding:

```css
.main-container {
  @apply max-w-7xl mx-auto py-4 px-4 md:px-8;
}
```

Usage:

```html
<div class="main-container">
  <!-- Centered content with max-width and padding -->
</div>
```

### Custom Animations

#### `chevron-bounce`

Bouncing animation for scroll indicators:

```css
.animate-chevron-bounce {
  animation: chevron-bounce 2s infinite;
}
```

## tailwind.config.mjs

Tailwind CSS configuration file.

### Key Settings

```javascript
export default {
  // Dark mode via class (not media query)
  darkMode: ['class'],
  
  // Content sources for class detection
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  theme: {
    extend: {
      // Typography plugin customization
      typography: {
        DEFAULT: {
          css: {
            h1: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '700',
            },
          },
        },
      },
    },
  },
  
  // Plugins
  plugins: [require('@tailwindcss/typography')],
};
```

### Dark Mode

Dark mode is controlled by the `dark` class on the `<html>` element:

```html
<!-- Light mode -->
<html>...</html>

<!-- Dark mode -->
<html class="dark">...</html>
```

Use `dark:` prefix for dark mode styles:

```html
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-gray-100">
    Content that adapts to theme
  </p>
</div>
```

### Typography Plugin

The `@tailwindcss/typography` plugin provides `prose` classes for markdown content:

```html
<article class="prose dark:prose-invert">
  <!-- Rendered markdown content -->
</article>
```

## Usage in Components

### Importing Global CSS

Global CSS is imported in `MainLayout.astro`:

```astro
---
import '@/styles/global.css';
---
```

### Using Tailwind Classes

In Astro components:

```astro
<div class="bg-main text-white p-4 rounded-lg">
  Content
</div>
```

In Svelte components:

```svelte
<div class="bg-main text-white p-4 rounded-lg">
  Content
</div>
```

## Adding Custom Styles

### Add a Custom Component Class

In `global.css`:

```css
@layer components {
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
  }
}
```

### Add a Custom Utility

In `global.css`:

```css
@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500;
  }
}
```

### Add Theme Colors

In `global.css`:

```css
@theme {
  --color-main: #0f1124;
  --color-secondary: #e41541;
  --color-accent: #3b82f6;  /* New color */
}
```

## Best Practices

1. **Use Tailwind utilities** over custom CSS when possible
2. **Use `@layer`** for custom styles to maintain proper cascading
3. **Use CSS variables** for theme colors for consistency
4. **Use `dark:` prefix** for all color-related styles
5. **Keep global.css minimal** - component styles belong in components
6. **Use semantic class names** for reusable components

## Common Patterns

### Responsive Container

```html
<div class="main-container">...</div>
```

### Card Component

```html
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  Card content
</div>
```

### Button Styles

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
  Click me
</button>
```

### Text with Dark Mode

```html
<p class="text-gray-900 dark:text-gray-100">
  Adaptive text
</p>
```

## Related Documentation

- [Brand Guide](../../docs/BRAND_GUIDE.md) - Complete color palette, typography, and brand rules
- [Features: Dark Mode](../../docs/features/DARK_MODE.md)
- [Components](../components/README.md)
- [Layouts](../layouts/README.md)
- [Architecture](../../docs/ARCHITECTURE.md)

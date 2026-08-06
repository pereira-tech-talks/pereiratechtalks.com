# Accessibility Guide

Accessibility standards and conventions for Pereira Tech Talks v3.0.0. This site targets **WCAG 2.1 AA compliance** and **Lighthouse Accessibility score of 100**.

## Accessibility-First Philosophy

**Accessibility is a core value of this project, not an afterthought.** Every change to the codebase — whether a new component, page, or style update — MUST consider its accessibility impact.

### For AI Agents: Accessibility Rules

When working on this codebase, **always apply these principles:**

1. **Meet WCAG AA contrast ratios** — 4.5:1 for normal text, 3:1 for large text (>=18px or >=14px bold)
2. **Use semantic HTML** — proper heading hierarchy, landmark elements, button vs link
3. **Support keyboard navigation** — all interactive elements must be focusable and operable
4. **Provide text alternatives** — meaningful alt text for informative images, `alt=""` for decorative images
5. **Use ARIA correctly** — only when semantic HTML is insufficient, never misuse roles

## Color Contrast Standards

### Approved Text Color Pairings

These are the **only** gray text classes that should be used for body/secondary text:

| Use Case | Light Mode | Dark Mode | Combined Class |
|----------|-----------|-----------|----------------|
| **Body / secondary on canvas** | `text-ptt-secondary` | `text-ptt-secondary` (token flips in `.dark`) | Prefer PTT tokens over raw gray utilities |
| **Legacy gray pair (avoid in new UI)** | `text-gray-600` | `dark:text-gray-300` | Only if migrating old markup; convert to `text-ptt-secondary` |
| **Primary text** | `text-gray-900` | `dark:text-white` | `text-gray-900 dark:text-white` |
| **Headings** | `text-gray-900` | `dark:text-white` | `text-gray-900 dark:text-white` |
| **Text on dark bg-main (#0f1124)** | N/A | `text-gray-300` | `text-gray-300` |

### Banned Text Color Classes

**NEVER use these classes for visible body text:**

| Banned Class | Reason | Replacement |
|-------------|--------|-------------|
| `text-gray-400` | Fails 4.5:1 on both white and gray-50 backgrounds | `text-gray-600` |
| `text-gray-500` (without dark pair) | May fail on some backgrounds | `text-gray-600 dark:text-gray-300` |
| `dark:text-gray-400` | Fails 4.5:1 on gray-800 (#1f2937) and gray-900 (#111827) | `dark:text-gray-300` |
| `dark:text-gray-500` | Fails contrast on all dark backgrounds | `dark:text-gray-300` |

### Contrast Reference

| Text Color | Hex | vs White (#fff) | vs Gray-50 (#f8fafc) | vs Gray-800 (#1f2937) | vs Gray-900 (#111827) |
|-----------|-----|:---------------:|:--------------------:|:---------------------:|:---------------------:|
| gray-300 | #d1d5db | 2.1:1 | 2.0:1 | **6.5:1** | **8.1:1** |
| gray-400 | #9ca3af | 3.0:1 | 2.9:1 | 3.8:1 | 4.8:1 |
| gray-500 | #6b7280 | **5.0:1** | 4.8:1 | 2.5:1 | 3.1:1 |
| gray-600 | #4b5563 | **7.5:1** | **7.2:1** | 1.7:1 | 2.1:1 |

Bold values pass WCAG AA (4.5:1). This is why `text-gray-600 dark:text-gray-300` is the standard pairing.

## Semantic HTML

### Heading Hierarchy

- Only one `<h1>` per page
- Never skip heading levels (no h1 -> h3 without h2)
- Homepage: `<h1>` in HeroSection, `<h2>` for each section, `<h3>` for items within sections
- Other pages: `<h1>` via PageHero component

### Landmark Elements

```html
<body>
  <a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to content</a>
  <header>
    <nav aria-label="Main navigation">...</nav>
  </header>
  <main id="main-content">
    <section>...</section>
  </main>
  <footer>...</footer>
</body>
```

### Button vs Link

- `<a>` — navigates to a URL
- `<button>` — performs an action (toggle, open dropdown, submit)

## ARIA Patterns

### Dropdown Navigation (Header)

The site uses a **disclosure pattern** (not menu pattern) for navigation dropdowns:

```html
<button
  aria-expanded="false"
  aria-haspopup="true"
  aria-controls="dropdown-id"
  type="button"
>
  Label
</button>
<div id="dropdown-id">
  <a href="/page1">Link 1</a>
  <a href="/page2">Link 2</a>
</div>
```

**Do NOT use** `role="menu"` / `role="menuitem"` for navigation dropdowns. The ARIA menu pattern is for application menus (like a desktop app's File menu), not for website navigation.

### Progress Bars

```html
<div
  role="progressbar"
  aria-valuenow="90"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="HTML proficiency: 90%"
>
  <!-- Visual bar -->
</div>
```

### Decorative Elements

```html
<!-- Decorative images: empty alt, hidden from screen readers -->
<img src="/icons/chevron.svg" alt="" aria-hidden="true" />

<!-- Icons inside labeled links: empty alt (parent has aria-label) -->
<a href="https://github.com/user" aria-label="GitHub">
  <img src="/icons/github.svg" alt="" />
</a>

<!-- Emoji used decoratively -->
<span aria-hidden="true">☀️</span>
```

### Theme Toggle

```html
<button id="theme-toggle" aria-label="Toggle dark mode">
  <span class="block dark:hidden" aria-hidden="true">☀️</span>
  <span class="hidden dark:block" aria-hidden="true">🌙</span>
</button>
```

## Images

### All Images Must Have Dimensions

Every `<img>` element **MUST** include `width` and `height` attributes to prevent Cumulative Layout Shift (CLS):

```html
<!-- Correct -->
<img src="/image.jpg" alt="Description" width={600} height={400} class="w-full h-40 object-cover" />

<!-- Wrong: missing dimensions -->
<img src="/image.jpg" alt="Description" class="w-full h-40 object-cover" />
```

CSS classes still control the visual size. The `width`/`height` attributes tell the browser the aspect ratio for layout calculation.

### Image Alt Text Rules

| Image Type | Alt Text | Example |
|-----------|---------|---------|
| **Informative** | Descriptive text | `alt="Pereira Tech Talks Logo"` |
| **Decorative** | Empty string | `alt=""` |
| **Icon in labeled link** | Empty string | `alt=""` (parent `<a>` has `aria-label`) |
| **Blog hero** | Post title | `alt={post.data.title}` |

## Keyboard Accessibility

### Skip-to-Content Link

Present on every page as the first focusable element:

```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 ...">
  Skip to content
</a>
```

### Focus Indicators

All interactive elements must have visible focus indicators. Tailwind's default focus ring handles most cases. Custom interactive elements should include:

```html
<button class="focus:outline-none focus:ring-2 focus:ring-blue-500">
```

## External Links

All links opening in new tabs must include `rel="noopener"`:

```html
<a href="https://example.com" target="_blank" rel="noopener" aria-label="Example (opens in new tab)">
```

## Font Loading

Use `font-display: swap` for custom fonts to prevent invisible text during loading:

```css
@font-face {
  font-family: "Atkinson";
  font-display: swap;
  src: url("/fonts/atkinson-regular.woff") format("woff");
}
```

## Accessibility Checklist for New Components

Before creating or modifying a component:

- [ ] Text contrast meets WCAG AA (4.5:1 normal, 3:1 large)
- [ ] Uses `text-ptt-secondary` (or approved PTT secondary) for secondary text — never `text-gray-400`, `text-gray-500`, or dark equivalents
- [ ] All `<img>` elements have `width`, `height`, and appropriate `alt` text
- [ ] Interactive elements are keyboard accessible (`<button>` or `<a>`)
- [ ] Heading hierarchy is sequential (no skipped levels)
- [ ] ARIA attributes used correctly (or not at all if semantic HTML suffices)
- [ ] Dark mode tested for contrast compliance
- [ ] External links have `rel="noopener"`

## Related Documentation

- [Performance Guide](PERFORMANCE.md) - CLS prevention, image optimization
- [Standards](STANDARDS.md) - Coding standards including accessibility
- [Dark Mode](features/DARK_MODE.md) - Theme implementation
- [Brand Guide](BRAND_GUIDE.md) - Color palette and dark mode pairings

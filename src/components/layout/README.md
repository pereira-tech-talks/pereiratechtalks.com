# Layout Components (`src/components/layout/`)

This directory contains navigation and layout-related Svelte components that are used across all pages.

## Directory Structure

```
layout/
├── Header.svelte      # Main navigation header
└── MobileMenu.svelte  # Mobile navigation menu
```

## Component Details

### Header.svelte

The main navigation header component with desktop and mobile navigation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lang` | `string` | `'en'` | Current language code |

**Features:**
- Sticky positioning (stays at top when scrolling)
- Desktop navigation with dropdown menus
- Mobile hamburger menu trigger
- Language switcher (EN/ES)
- Logo link to homepage
- About section dropdown with sub-pages
- Dark mode compatible

**Internal State:**
- `open` - Mobile menu visibility
- `aboutOpen` - About dropdown visibility
- `languageOpen` - Language dropdown visibility

**Desktop Navigation Links:**
- Home (`/`)
- Blog (`/blog`)
- About (dropdown with sub-pages)
- Contact (`/contact`)
- Language switcher

**About Dropdown Sub-pages:**
- About Me, CV, DailyBot, Entrepreneur, Tech Talks, Maker/Builder, Trading, Foodie Enthusiast, Hobbies

**Usage in MainLayout:**

```astro
---
import Header from '@/components/layout/Header.svelte';
---

<Header client:load lang={lang} />
```

**Important:** The `client:load` directive is required for interactivity.

### MobileMenu.svelte

Full-screen mobile navigation overlay menu.

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Menu visibility state |
| `toggleMenu` | `() => void` | Function to toggle menu |

**Features:**
- Full-screen overlay (`fixed inset-0`)
- Slide transitions for dropdowns
- Close button (X icon)
- Same navigation structure as desktop
- Touch-friendly large tap targets
- Background opacity effect

**Internal State:**
- `aboutOpen` - About section expanded
- `languageOpen` - Language section expanded

**Transitions:**
Uses Svelte's `slide` transition for smooth dropdown animations.

## Integration with MainLayout

The Header component is used in `MainLayout.astro`:

```astro
---
import Header from '@/components/layout/Header.svelte';

interface Props {
  lang?: string;
  title: string;
  description: string;
}

const { lang = 'en', title, description } = Astro.props;
---

<!doctype html>
<html lang={lang}>
  <head>
    <BaseHead title={title} description={description} />
  </head>
  <body>
    <Header client:load {lang} />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

## Styling

Both components use:
- **Tailwind CSS** utility classes
- **CSS custom property** `.bg-main` for consistent background
- **Dark mode support** via `dark:` prefix
- **Responsive breakpoints** (`md:` for desktop)

## Navigation Structure

```
Header
├── Logo (link to /)
├── Desktop Navigation (hidden on mobile)
│   ├── Home
│   ├── Blog
│   ├── About (dropdown)
│   │   ├── About Me
│   │   ├── CV
│   │   ├── DailyBot
│   │   ├── Entrepreneur
│   │   ├── Tech Talks
│   │   ├── Maker / Builder
│   │   ├── Trading
│   │   ├── Foodie Enthusiast
│   │   └── Hobbies
│   ├── Contact
│   └── Language Switcher
│       ├── 🇬🇧 EN
│       └── 🇪🇸 ES
├── Mobile Menu Button (visible only on mobile)
└── MobileMenu (full-screen overlay)
    └── (same structure as desktop)
```

## Accessibility

- `aria-label` on buttons
- `aria-expanded` for dropdown states
- `aria-controls` linking buttons to dropdowns
- `role="menu"` on dropdown containers
- Keyboard navigation support via `tabindex`
- Screen reader text for icons

## Modifying Navigation

To add a new navigation link:

1. **Desktop (Header.svelte):**
   ```svelte
   <a href="/new-page" class="nav-link">New Page</a>
   ```

2. **Mobile (MobileMenu.svelte):**
   ```svelte
   <a href="/new-page" class="nav-link text-2xl text-center">New Page</a>
   ```

3. **As dropdown item:**
   Add inside the appropriate `{#if ...Open}` block.

## Related Documentation

- [MainLayout](../../layouts/README.md)
- [i18n Guide](../../../docs/I18N_GUIDE.md)
- [Features: Dark Mode](../../../docs/features/DARK_MODE.md)

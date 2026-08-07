# Layout Components (`src/components/layout/`)

Navigation and chrome Svelte islands used across public pages.

## Directory Structure

```
layout/
├── Header.svelte              # Global PTT header (desktop + mobile trigger)
├── MobileMenu.svelte          # Full-viewport mobile nav (portaled to body)
├── ThemeToggle.svelte         # Light/dark toggle
└── TopNotificationBar.svelte  # Sticky announcement strip
```

## Critical: fixed overlays vs `backdrop-filter`

The global header uses `backdrop-blur-md`. **Never** render a `position: fixed` fullscreen overlay as a **DOM descendant** of an element with `backdrop-filter` / `filter` / `transform` — the browser treats that ancestor as the containing block, so `inset-0` only covers the header strip (users see only “Inicio” and a fighting X/hamburger).

`MobileMenu` uses a Svelte `use:portal` action to append the dialog to `document.body` at `z-[100]`.

## Header.svelte

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lang` | `string` | `'es'` | Current language |

**Hydration:** `client:load` in `MainLayout` (reliable first-tap hamburger).

**Desktop (`lg+`):** Meetups, Pereira Tech Day, Calendar, Blog, Comunidad dropdown, Contact, language, theme.

**Mobile:** Hamburger trigger; when menu is open the trigger is `invisible` so only the sheet’s X is shown.

## MobileMenu.svelte

| Prop | Type | Description |
|------|------|-------------|
| `lang` | `string` | Language |
| `open` | `boolean` | Visibility |
| `toggleMenu` | `() => void` | Open/close |

**Features:**
- Portaled fullscreen sheet (`100dvh`, `z-[100]`)
- Primary links + Comunidad accordion (default open) + Contact
- Theme toggle + language disclosure in footer
- Body scroll lock, Escape, Tab focus trap, restore focus
- Safe-area insets; `overscroll-contain`
- Closing a link closes the sheet

## Usage

```astro
<Header client:load lang={lang} />
```

PTD edition pages use `PtdEditionHeader` instead (minimal chrome) — see `docs/features/PEREIRA_TECH_DAYS.md`.

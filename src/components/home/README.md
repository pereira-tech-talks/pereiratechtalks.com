# Home Components (`src/components/home/`)

This directory contains all components used on the homepage, organized into sections. The homepage follows a vertical scrolling layout with distinct sections for different content areas.

## Directory Structure

```
home/
├── BlogPreviewSection.astro    # Recent blog posts preview
├── ContactSection.astro        # Contact information
├── EducationSection.astro      # Education history
├── ExperienceSection.astro     # Work experience
├── ProjectsSection.astro       # Featured projects
├── SkillsSection.astro         # Technical skills
├── HeroSection/                # Hero with typewriter effect
│   ├── HeroSection.astro
│   └── TypewriterWords.astro
└── HomeSection/                # Reusable section wrapper
    ├── HomeSection.astro
    ├── HomeSectionContent.astro
    ├── HomeSectionImage.astro
    └── enum.ts
```

## Homepage Architecture

```
┌─────────────────────────────────────────────────────┐
│                    HeroSection                       │
│    (Full viewport, logo, typewriter, social links)  │
├─────────────────────────────────────────────────────┤
│                  ExperienceSection                   │
│              (Work experience timeline)              │
├─────────────────────────────────────────────────────┤
│                  EducationSection                    │
│             (Education history)                      │
├─────────────────────────────────────────────────────┤
│                    SkillsSection                     │
│              (Technical skills grid)                 │
├─────────────────────────────────────────────────────┤
│                  ProjectsSection                     │
│             (Featured projects cards)                │
├─────────────────────────────────────────────────────┤
│                BlogPreviewSection                    │
│              (Recent blog posts)                     │
├─────────────────────────────────────────────────────┤
│                  ContactSection                      │
│            (Contact information/form)                │
└─────────────────────────────────────────────────────┘
```

## Component Details

### HeroSection

Full-viewport hero section with animated typewriter effect.

**Location:** `HeroSection/HeroSection.astro`

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Display name |
| `description` | `string` | HTML description text |
| `typewriterWords` | `string[]` | Words for typewriter animation |

**Features:**
- Full viewport height (`100dvh - header`)
- SVG grid background pattern
- Logo display
- Rotating words animation (CSS-only)
- Social media links
- Animated chevron indicator

**Usage:**
```astro
<HeroSection 
  name="Pereira Tech Talks"
  description="Tech community of Pereira, Risaralda, Colombia"
  typewriterWords={['Builders', 'Speakers', 'Mentors', 'Learners']}
/>
```

### TypewriterWords.astro

CSS-only rotating words effect (zero JavaScript). Respects `prefers-reduced-motion`.

**Location:** `HeroSection/TypewriterWords.astro`

| Prop | Type | Description |
|------|------|-------------|
| `words` | `string[]` | Words to cycle through |

**Animation:** Words fade in/out in sequence. Cursor blinks. No JS in critical path.

### HomeSection (Reusable Wrapper)

A flexible section layout component for content with optional image.

**Location:** `HomeSection/HomeSection.astro`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | Section title |
| `subtitle` | `string` | - | Optional subtitle |
| `description` | `string` | **Required** | Section description |
| `ctaText` | `string` | - | Primary CTA button text |
| `ctaLink` | `string` | - | Primary CTA link |
| `cta2Text` | `string` | - | Secondary CTA text |
| `cta2Link` | `string` | - | Secondary CTA link |
| `image` | `string` | - | Section image path |
| `contentAlignment` | `'left' \| 'right'` | `'left'` | Content position |

**Layout behavior:**
- Mobile: Stacked (image on top, content below)
- Desktop: Side-by-side (configurable alignment)

**Usage:**
```astro
import HomeSection from './HomeSection/HomeSection.astro';
import { HomeSectionContentAlignmentEType } from './HomeSection/enum';

<HomeSection
  title="About Me"
  description="I'm a software engineer..."
  image="/images/pereira-tech-days/2026/about-panel.webp"
  contentAlignment={HomeSectionContentAlignmentEType.LEFT}
  ctaText="Learn More"
  ctaLink="/about"
/>
```

### Content Alignment Enum

**Location:** `HomeSection/enum.ts`

```typescript
export enum HomeSectionContentAlignmentEType {
  LEFT = 'left',   // Content on left, image on right
  RIGHT = 'right', // Image on left, content on right
}
```

### Section Components

Each section component is a standalone Astro component for a specific homepage area:

| Component | Purpose |
|-----------|---------|
| `ExperienceSection.astro` | Work history timeline |
| `EducationSection.astro` | Education background |
| `SkillsSection.astro` | Technical skills grid |
| `ProjectsSection.astro` | Featured projects |
| `BlogPreviewSection.astro` | Recent blog posts |
| `ContactSection.astro` | Contact information |

## Styling

All components use:
- **Tailwind CSS** for utility classes
- **Dark mode support** via `dark:` prefix
- **Responsive design** with breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **CSS custom properties** for theming

## Creating a New Section

1. Create a new `.astro` file in `home/`:

```astro
---
// src/components/home/NewSection.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<section class="py-24">
  <div class="main-container">
    <h2 class="text-3xl font-bold mb-8">{title}</h2>
    <slot />
  </div>
</section>
```

2. Import and use in the homepage:

```astro
---
import NewSection from '@/components/home/NewSection.astro';
---

<NewSection title="New Section">
  <!-- Content -->
</NewSection>
```

## Related Documentation

- [Components Overview](../README.md)
- [Layout Components](../layout/README.md)
- [Styling Guide](../../styles/README.md)
- [Architecture](../../../docs/ARCHITECTURE.md)

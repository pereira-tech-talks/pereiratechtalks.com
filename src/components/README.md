# Components (`src/components/`)

This directory contains all reusable UI components for the Pereira Tech Talks website (v3.0.0). Components are organized by feature area and use both Astro (`.astro`) and Svelte (`.svelte`) formats.

## Directory Structure

```
components/
├── pages/              # Shared page components (Page wrapper pattern)
│   ├── HomePage.astro      # Handles MainLayout internally, receives lang prop
│   ├── AboutPage.astro
│   ├── ContactPage.astro
│   ├── CvPage.astro
│   ├── PortfolioPage.astro
│   ├── blog/               # Shared blog page components
│   │   ├── BlogListingPage.astro
│   │   └── BlogPostPage.astro
│   └── ...
├── blog/               # Blog-related components
│   ├── BlogCard.svelte
│   ├── BlogContainer.astro
│   ├── BlogGrid.svelte
│   ├── BlogHeader.svelte
│   ├── BlogPagination.svelte
│   ├── BlogSearchInput.svelte
│   ├── SearchResults.svelte
│   └── StaticBlogSearch.svelte
├── home/               # Homepage section components
│   ├── BlogPreviewSection.astro
│   ├── ContactSection.astro
│   ├── EducationSection.astro
│   ├── ExperienceSection.astro
│   ├── HeroSection/
│   ├── HomeSection/
│   ├── ProjectsSection.astro
│   └── SkillsSection.astro
├── layout/             # Layout components
│   ├── Header.svelte
│   └── MobileMenu.svelte
├── BaseHead.astro      # HTML head metadata
├── Footer.astro        # Site footer
├── FormattedDate.astro # Date formatting utility
├── HeaderLink.astro    # Navigation link
└── ThemeToggle.astro   # Dark mode toggle
```

## Component Catalog

### Page Components (Page Wrapper Pattern)

Shared page components in `pages/` handle `MainLayout`, translations, and content internally. Page files in `src/pages/` are thin 3-line wrappers that only pass `lang`.

| Component | Type | Description |
|-----------|------|-------------|
| `pages/HomePage.astro` | Astro | Homepage with all sections |
| `pages/AboutPage.astro` | Astro | About page |
| `pages/ContactPage.astro` | Astro | Contact page |
| `pages/CvPage.astro` | Astro | CV/Resume page |
| `pages/PortfolioPage.astro` | Astro | Portfolio page |
| `pages/blog/BlogListingPage.astro` | Astro | Blog listing with pagination |
| `pages/blog/BlogPostPage.astro` | Astro | Individual blog post |

**Key:** Each `*Page.astro` component accepts a `lang: Language` prop and wraps content in `MainLayout` internally.

### Root Components

| Component | Type | Description |
|-----------|------|-------------|
| `BaseHead.astro` | Astro | HTML head with meta tags, fonts, SEO |
| `Footer.astro` | Astro | Site footer with social links |
| `FormattedDate.astro` | Astro | Formats dates consistently |
| `HeaderLink.astro` | Astro | Navigation link with active state |
| `ThemeToggle.astro` | Astro | Dark/light FAB (certificate pages) |
| `layout/ThemeToggle.svelte` | Svelte | Header / mobile theme toggle |

### Blog Components

| Component | Type | Description |
|-----------|------|-------------|
| `BlogCard.svelte` | Svelte | Individual blog post card |
| `BlogContainer.astro` | Astro | Blog page wrapper |
| `BlogGrid.svelte` | Svelte | Grid layout for blog posts |
| `BlogHeader.svelte` | Svelte | Blog section header with title |
| `BlogPagination.svelte` | Svelte | Page navigation for blog |
| `BlogSearchInput.svelte` | Svelte | Search input field |
| `SearchResults.svelte` | Svelte | Search results display |
| `StaticBlogSearch.svelte` | Svelte | Complete search functionality |

### Home Components

| Component | Type | Description |
|-----------|------|-------------|
| `BlogPreviewSection.astro` | Astro | Recent blog posts preview |
| `ContactSection.astro` | Astro | Contact information |
| `EducationSection.astro` | Astro | Education history |
| `ExperienceSection.astro` | Astro | Work experience timeline |
| `HeroSection/` | Mixed | Hero with typewriter effect |
| `HomeSection/` | Mixed | Reusable section wrapper |
| `ProjectsSection.astro` | Astro | Featured projects |
| `SkillsSection.astro` | Astro | Technical skills |

### Layout Components

| Component | Type | Description |
|-----------|------|-------------|
| `Header.svelte` | Svelte | Main navigation header |
| `MobileMenu.svelte` | Svelte | Mobile navigation menu |

## Astro vs Svelte Guidelines

### Use Astro (`.astro`) When:

- Content is static and doesn't need client-side JavaScript
- Component is server-rendered only
- SEO is critical (meta tags, structured content)
- No user interactions needed
- Component wraps other components (layouts)

**Examples:** `BaseHead.astro`, `Footer.astro`, `BlogContainer.astro`

### Use Svelte (`.svelte`) When:

- Component needs interactivity (click handlers, state)
- Client-side state management is required
- Animations or transitions are needed
- Real-time updates are necessary
- Complex event handling

**Examples:** `Header.svelte` (mobile menu toggle), `BlogSearchInput.svelte` (search state)

## Component Props Pattern

### Astro Components

```astro
---
// Define props interface
interface Props {
  title: string;
  description?: string;
}

// Destructure with defaults
const { title, description = 'Default description' } = Astro.props;
---

<div>{title}</div>
```

### Svelte Components

```svelte
<script lang="ts">
  // Export props
  export let title: string;
  export let description: string = 'Default description';
</script>

<div>{title}</div>
```

## Usage Examples

### Using an Astro Component

```astro
---
import BaseHead from '../components/BaseHead.astro';
---

<head>
  <BaseHead title="Page Title" description="Page description" />
</head>
```

### Using a Svelte Component

```astro
---
import Header from '../components/layout/Header.svelte';
---

<Header client:load lang="en" />
```

**Note:** Svelte components need a `client:*` directive to hydrate:
- `client:load` - Load immediately
- `client:idle` - Load when browser is idle
- `client:visible` - Load when visible in viewport

## Creating a New Component

1. **Choose the right type** (Astro vs Svelte)
2. **Choose the right folder** (blog/, home/, layout/, or root)
3. **Follow naming conventions** (PascalCase)
4. **Add TypeScript types** for props
5. **Use Tailwind** for styling
6. **Document complex props** with comments

```bash
# Example: Creating a new Astro component
touch src/components/NewComponent.astro

# Example: Creating a new Svelte component in blog/
touch src/components/blog/NewBlogComponent.svelte
```

## Related Documentation

- [Blog Components](./blog/README.md)
- [Home Components](./home/README.md)
- [Layout Components](./layout/README.md)
- [Styling Guide](../styles/README.md)
- [Architecture Guide](../../docs/ARCHITECTURE.md)
- [Standards](../../docs/STANDARDS.md)

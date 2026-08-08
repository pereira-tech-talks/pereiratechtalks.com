# Public Assets (`public/`)

Static assets served directly without processing. Files are copied as-is to the build output.

**Post-audit state (2026-02-16):** 84 files, ~5.5 MB total across 4 top-level directories.

## Directory Structure

```
public/
├── favicon.ico                        # ICO favicon fallback
├── favicon.svg                        # SVG favicon (primary)
├── llms.txt                           # LLM-readable site summary
├── llms-full.txt                      # LLM-readable full content
├── robots.txt                         # Search engine crawling rules
├── fonts/                             # Custom web fonts (2 files, 48 KB)
│   ├── atkinson-bold.woff
│   └── atkinson-regular.woff
├── icons/                             # Social/UI icons with dark mode variants (10 files, 40 KB)
│   ├── {name}.svg                     # Light background variant
│   └── {name}_white.svg               # Dark background variant
├── images/                            # All site images (~5.4 MB)
│   ├── (root-level images)            # Brand, section, and profile images (10 files)
│   └── blog/                          # Blog-specific images
│       ├── posts/{slug}/              # Per-post image folders (10 folders)
│       ├── shared/                    # Shared placeholders (6 files, 200 KB)
│       └── _staging/                  # Drop zone for new images (README only)
└── scripts/                           # (empty; theme script is inlined in layouts)
```

## Format Breakdown

| Format | Count | Primary Use |
|--------|------:|-------------|
| WebP   | 34    | Blog inline images |
| JPG    | 16    | Blog hero images, placeholders |
| SVG    | 14    | Icons, logos |
| PNG    | 12    | Section images, blog assets |
| WOFF   | 2     | Fonts |
| Other  | 6     | JS, TXT, MD, ICO |

## Asset Categories

### Root Config Files

| File | Purpose |
|------|---------|
| `favicon.svg` | Primary site favicon (SVG) |
| `favicon.ico` | ICO fallback for older browsers |
| `robots.txt` | Search engine crawling rules |
| `llms.txt` | LLM-readable site summary |
| `llms-full.txt` | LLM-readable full content |

### Fonts

Custom Atkinson Hyperlegible fonts for improved readability.

| File | Weight | Usage |
|------|--------|-------|
| `atkinson-regular.woff` | 400 | Body text |
| `atkinson-bold.woff` | 700 | Headings, emphasis |

Preloaded in `BaseHead.astro`:

```html
<link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin />
<link rel="preload" href="/fonts/atkinson-bold.woff" as="font" type="font/woff" crossorigin />
```

### Icons

Social media and UI icons with light/dark paired variants.

**Naming Convention:** `{name}.svg` (dark icon, light backgrounds) + `{name}_white.svg` (light icon, dark backgrounds)

| Icon Set | Light | Dark |
|----------|-------|------|
| GitHub | `github.svg` | `github_white.svg` |
| LinkedIn | `linkedin.svg` | `linkedin_white.svg` |
| Instagram | `instagram.svg` | `instagram_white.svg` |
| X (Twitter) | `x.svg` | `x_white.svg` |
| Chevron | `chevron_down.svg` | `chevron_down_white.svg` |

**Usage:**

```html
<img src="/icons/github_white.svg" alt="GitHub" class="w-7 h-7" />
```

### Root Images

Site images for branding, sections, and profile. Located directly in `public/images/`.

| Image | Size | Purpose | Referenced By |
|-------|-----:|---------|---------------|
| `og-default.jpg` | ~98 KB | Default Open Graph / Twitter share image (1200×630), Spanish | BaseHead, HomePage |
| `og-default-en.jpg` | ~109 KB | Default Open Graph / Twitter share image (1200×630), English | BaseHead, HomePage |
| `trading.png` | 416 KB | Trading section | HomePage |
| `techtalks.png` | 296 KB | Tech talks section | HomePage |
| `dailybotyc.png` | 252 KB | DailyBot YC image | HomePage, DailybotPage |
| `foddie.png` | 200 KB | Foodie section | HomePage |
| `bicycle.png` | 184 KB | Hobbies section | HomePage |
| `ia.png` | 120 KB | AI/ML section | HomePage |

Brand logos live under `images/pereira-tech-talks/` and `images/brand/`. App icons live under `icons/` (`apple-touch-icon.png`, `icon-192x192.png`, `icon-512x512.png`).

See **[Brand Guide](../BRAND_GUIDE.md)** for logo usage rules and color pairing guidelines.

**Note:** `dailybotyc.png`, `foddie.png`, and `bicycle.png` have `.png` extensions but contain JPEG data internally. They display correctly in all browsers. Do not rename them (would break references).

### Blog Images

Organized in per-post folders under `public/images/blog/`:

```
public/images/blog/
├── posts/{slug}/        # Per-post image folders
│   ├── hero.{ext}       # Hero/cover image
│   └── {name}.{ext}     # Inline images
├── shared/              # Shared placeholder images
└── _staging/            # Drop zone for new images (processed by optimizer)
```

**Current blog post image folders (10 of 51 posts have images):**

| Post Slug | Files | Size | Formats |
|-----------|------:|-----:|---------|
| `nodeschool-day-pereira` | 10 | 1.1 MB | JPG + WebP |
| `blockchain-industrial-revolution` | 13 | 1020 KB | JPG + WebP |
| `meetup-recap-march-2026` | 5 | 412 KB | JPG + PNG |
| `internet-of-things` | 5 | 304 KB | JPG + WebP |
| `webvr-aframe` | 4 | 268 KB | JPG + WebP |
| `what-is-blockchain` | 3 | 192 KB | JPG + WebP |
| `blockchain-ethereum` | 3 | 172 KB | JPG + WebP |
| `tensorflow` | 3 | 140 KB | JPG + WebP |
| `introduction-to-meteorjs` | 1 | 28 KB | PNG |
| `nosql-and-mongodb` | 1 | 20 KB | PNG |

**Shared placeholders** (`images/blog/shared/`, 6 files, 200 KB):

| File | Purpose |
|------|---------|
| `blog-placeholder-1.jpg` through `blog-placeholder-5.jpg` | Default post placeholders |
| `blog-placeholder-about.jpg` | About page placeholder |

### Scripts

| Script | Purpose |
|--------|---------|
| (inline in layouts) | Theme script inlined — checks `localStorage`; defaults to light (ignores browser `prefers-color-scheme`); applies `dark` class to `<html>` only when saved as dark |

Loaded inline in `MainLayout.astro` to prevent flash of wrong theme:

```html
<script is:inline>(function(){var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();</script>
```

## Blog Image Conventions

- **Hero images:** `hero.{jpg,png,webp}` — max 1400px wide
- **Inline images:** `{descriptive-name}.{ext}` (lowercase, kebab-case) — max 1200px wide
- **Folder name** matches the post slug (without date prefix)
- **Hero path in frontmatter:** `/images/blog/posts/{slug}/hero.jpg`

**New images** should be added via the staging workflow. See **[Image Optimization](./IMAGE_OPTIMIZATION.md)** for the complete workflow.

## Image Size Guidelines

After the 2026-02-16 audit, all images follow these targets:

| Category | Max Width | Max File Size | Format |
|----------|----------:|-------------:|--------|
| Blog heroes | 1400px | 300 KB | JPG, WebP |
| Blog inline | 1200px | 200 KB | WebP preferred |
| Root section images | 800px | 500 KB | PNG |
| Icons | N/A | 5 KB each | SVG |
| Logos | N/A | 100 KB | SVG |

**Optimization scripts:** `scripts/optimize-images.mjs` (staging workflow), `scripts/optimize-existing-images.mjs` (bulk). See **[Image Optimization](./IMAGE_OPTIMIZATION.md)**.

## Adding New Assets

### Adding a Blog Image

1. Name with staging convention: `{slug}--{name}.{ext}`
2. Drop into `public/images/blog/_staging/`
3. Run `pnpm run images:optimize`
4. Reference in post frontmatter or body

### Adding a Site Image

1. Optimize before adding (compress, resize to max 800px for section images)
2. Place in `public/images/`
3. Reference in component: `<img src="/images/my-image.png" alt="Description" />`

### Adding an Icon

1. Create both variants: `{name}.svg` and `{name}_white.svg`
2. Place in `public/icons/`
3. Use: `<img src="/icons/{name}_white.svg" alt="Icon" class="w-6 h-6" />`

### Adding a Font

1. Place `.woff` file in `public/fonts/`
2. Add preload link in `BaseHead.astro`
3. Add `@font-face` rule in CSS

## Maintenance

### Periodic Audit Checklist

- Check for orphaned images (files not referenced in any source code)
- Check for duplicates (files with identical SHA-256 hashes)
- Check for oversized images (> 500 KB for blog, > 1 MB for anything)
- Remove `.DS_Store` files (covered by `.gitignore`)
- Verify all blog post image folders match existing post slugs

### URL Mapping

Files in `public/` are served from the site root:

| File Location | URL |
|---------------|-----|
| `public/favicon.svg` | `/favicon.svg` |
| `public/icons/apple-touch-icon.png` | `/icons/apple-touch-icon.png` |
| `public/images/og-default.jpg` | `/images/og-default.jpg` |
| `public/images/og-default-en.jpg` | `/images/og-default-en.jpg` |
| `public/images/blog/posts/my-post/hero.jpg` | `/images/blog/posts/my-post/hero.jpg` |

## Related Documentation

- **[Image Optimization](./IMAGE_OPTIMIZATION.md)** - Staging workflow, bulk optimizer, quality settings
- **[Blog Posts](./BLOG_POSTS.md)** - Blog post structure, naming, hero layouts
- **[Brand Guide](../BRAND_GUIDE.md)** - Logo usage rules and color pairing
- **[Performance Guide](../PERFORMANCE.md)** - Site performance best practices

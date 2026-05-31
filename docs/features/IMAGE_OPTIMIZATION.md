# Image Optimization

Pipeline for optimizing blog images using [sharp](https://sharp.pixelplumbing.com/). Includes a staging workflow for new images, a bulk optimizer for existing images, and a WebP conversion workflow for AI agents.

## WebP-First Policy

**All blog images MUST be in WebP format.** When adding any image to the blog (hero, inline, or shared), convert it to WebP before committing. If an image cannot be converted (e.g., BMP with unsupported channels, corrupted files, or formats sharp can't process), keep it in the best available format (JPG preferred over PNG for photos) and document the exception.

## Overview

The project uses two Node.js scripts powered by `sharp` (installed as a dev dependency) to resize and compress blog images:

| Script | Command | Purpose |
|--------|---------|---------|
| `scripts/optimize-images.mjs` | `pnpm run images:optimize` | Process new images from staging |
| `scripts/optimize-existing-images.mjs` | `node scripts/optimize-existing-images.mjs` | One-off bulk optimization |

## Staging Workflow

The primary workflow for adding new blog images.

### How It Works

1. Drop images into `public/images/blog/_staging/` using the naming convention
2. Run `pnpm run images:optimize`
3. Images are resized, compressed, and moved to `public/images/blog/posts/{slug}/`
4. Staging files are deleted after successful processing

### Staging File Naming Convention

**Format:** `{slug}--{name}.{ext}`

The double-dash (`--`) separates the post slug from the image name.

| Staging filename | Output path |
|-----------------|-------------|
| `my-post--hero.jpg` | `posts/my-post/hero.webp` (converted to WebP) |
| `my-post--screenshot.png` | `posts/my-post/screenshot.webp` (converted to WebP) |
| `my-post--diagram.webp` | `posts/my-post/diagram.webp` (already WebP) |

> **Note:** Always use the `--webp` flag or convert to WebP before staging. All blog images must be in WebP format.

**Invalid names** (missing `--` separator) are skipped with a warning.

### Commands

```bash
# Process all staged images
pnpm run images:optimize

# Preview what would happen (no files modified)
pnpm run images:optimize -- --dry-run

# Process and also generate WebP variants
pnpm run images:optimize -- --webp

# Combine flags
pnpm run images:optimize -- --dry-run --webp
```

### Example Output

```
Blog Image Optimizer
====================

Found 3 image(s) to process:

  Processing: my-post--hero.jpg
    -> posts/my-post/hero.jpg
    120.5KB -> 45.2KB (62.5% reduction)

  Processing: my-post--screenshot.png
    -> posts/my-post/screenshot.jpg
    744.0KB -> 61.3KB (91.8% reduction)

--------------------
Processed: 2 | Errors: 0
Total: 864.5KB -> 106.5KB (87.7% reduction)
```

## Optimization Presets

The staging optimizer auto-selects a preset based on the image name and aspect ratio:

| Preset | Max width | Fit | Used when |
|--------|-----------|-----|-----------|
| `hero` | 1400px | inside (preserve ratio) | Image named `hero*` with landscape aspect ratio |
| `hero-square` | 800px | inside (preserve ratio) | Image named `hero*` with square aspect ratio (0.8-1.2) |
| `default` | 1200px | inside (preserve ratio) | All other images |

**Aspect ratio detection:** For hero images, the script reads the original dimensions. If the aspect ratio is between 0.8 and 1.2, it uses the `hero-square` preset (max 800px width); otherwise, it uses the landscape `hero` preset (max 1400px width). **All presets preserve the original aspect ratio — no cropping.**

**No upscaling:** Images smaller than the preset dimensions are not enlarged (`withoutEnlargement: true`).

## Quality Settings

| Format | Quality | Notes |
|--------|---------|-------|
| JPEG (from JPEG) | 80 | mozjpeg compression |
| JPEG (from PNG) | 85 | Opaque PNGs are converted to JPEG |
| PNG (with transparency) | 80 | Compression level 9, preserves alpha |
| WebP | 80 | Only when `--webp` flag is used |
| AVIF | 60 | Preserved if input is AVIF |

### PNG Handling

- **Opaque PNGs** (no transparency): Automatically converted to JPEG for better compression
- **Transparent PNGs**: Kept as PNG with maximum compression
- This is the biggest optimization win (e.g., 744KB PNG -> 61KB JPEG = 91.8% reduction)

## Bulk Optimizer (Existing Images)

For one-off optimization of images already in `public/images/blog/`:

```bash
# Optimize all existing blog images in-place
node scripts/optimize-existing-images.mjs

# Preview what would happen
node scripts/optimize-existing-images.mjs --dry-run
```

### How It Differs from Staging

| Aspect | Staging (`images:optimize`) | Bulk (`optimize-existing-images`) |
|--------|---------------------------|----------------------------------|
| Input dir | `_staging/` | `posts/` and `shared/` |
| Output | Moves to `posts/{slug}/` | Overwrites in-place |
| Naming | Requires `{slug}--{name}.{ext}` | Uses existing filenames |
| Safety | Deletes staging file after | Only replaces if size reduced |
| Usage | Ongoing workflow | One-off cleanup |

### Safety Mechanism

The bulk optimizer writes to a temporary file first, then only replaces the original if the optimized version is smaller. If the optimization doesn't reduce file size, the original is kept unchanged.

## Supported Formats

| Extension | Supported | Notes |
|-----------|-----------|-------|
| `.jpg` / `.jpeg` | Yes | Convert to WebP (fallback: keep as JPG) |
| `.png` | Yes | Convert to WebP (fallback: keep as JPG if opaque, PNG if transparent) |
| `.webp` | Yes | **Preferred format** — optimize in-place |
| `.avif` | Yes | Next-gen format, accepted |

## Agent Conversion Workflow

**For AI agents adding images to blog posts.** When the user provides an image (PNG, JPG, etc.), convert it to WebP using this inline Node.js script before placing it in the post folder.

### Quick Conversion Script

**IMPORTANT:** Always use `resize({ width, withoutEnlargement: true })` WITHOUT a fixed height. This preserves the original aspect ratio. Never use `resize(width, height, { fit: 'cover' })` — it crops the image.

```bash
# Convert a single image to WebP (run from project root)
node -e "
const sharp = require('sharp');
const path = require('path');

const input = process.argv[1];
const output = process.argv[2];

sharp(input)
  .resize({ width: 1400, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile(output)
  .then(info => console.log('Converted:', info.width + 'x' + info.height, info.size + ' bytes'))
  .catch(err => console.error('Error:', err.message));
" /path/to/source.png public/images/blog/posts/{slug}/hero.webp
```

### Conversion Parameters

**CRITICAL: Always preserve the original aspect ratio.** Use `inside` fit (or `null` height) — NEVER use `cover` with fixed height, as it crops the image and cuts off content.

| Image type | Max width | Quality | Fit | Height |
|------------|-----------|---------|-----|--------|
| Hero | 1400px | 80 | inside | auto (preserve ratio) |
| Series hero | 1400px | 80 | inside | auto (preserve ratio) |
| Inline/content | 1200px | 80 | inside | auto (preserve ratio) |

### Full Conversion Script (file-based)

For converting multiple images or when the inline script has shell escaping issues, create a temporary `.mjs` file:

```javascript
// /tmp/convert-to-webp.mjs
import sharp from 'sharp';

const input = process.argv[2];
const output = process.argv[3];
const maxWidth = parseInt(process.argv[4] || '1400', 10);

try {
  const info = await sharp(input)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  console.log(`OK: ${info.width}x${info.height}, ${info.size} bytes`);
} catch (err) {
  console.error(`FAIL: ${err.message}`);
  process.exit(1);
}
```

```bash
# Run from project root (so sharp is found in node_modules)
node /tmp/convert-to-webp.mjs /path/to/source.png public/images/blog/posts/{slug}/hero.webp 1400
```

### Error Handling

If sharp fails to convert an image (e.g., unsupported format, BMP with unusual channels):

1. **Try converting with the original format** as fallback (e.g., keep as `.jpg`)
2. **Log the issue** — note the file path, error message, and file size
3. **Use the best available format** — JPG preferred over PNG for photos without transparency
4. **Report to the user** — list any images that couldn't be converted to WebP

### Important Notes

- **Always run from the project root** (`/app/`) so Node.js can find `sharp` in `node_modules`
- **Do NOT run scripts from `/tmp/`** unless using an `.mjs` file with the `import` syntax — `require()` won't find sharp from outside the project
- The `withoutEnlargement: true` option prevents upscaling small images
- WebP at quality 80 provides excellent quality-to-size ratio for web use

## Adding Images to a New Blog Post

Complete workflow for adding images when creating a new blog post:

1. **Prepare images** — convert to WebP first (see [Agent Conversion Workflow](#agent-conversion-workflow) above):
   ```bash
   # Convert hero image to WebP
   node -e "require('sharp')('source-hero.jpg').resize({width:1400,withoutEnlargement:true}).webp({quality:80}).toFile('public/images/blog/posts/my-new-post/hero.webp').then(i=>console.log('OK',i.size+'B'))"
   ```

2. **Or use the staging pipeline** (for multiple images):
   ```
   my-new-post--hero.jpg
   my-new-post--diagram.png
   ```
   ```bash
   cp my-new-post--hero.jpg public/images/blog/_staging/
   pnpm run images:optimize -- --webp
   ```

3. **Verify output:**
   ```bash
   ls public/images/blog/posts/my-new-post/
   # hero.webp
   ```

4. **Reference in frontmatter:**
   ```markdown
   ---
   heroImage: '/images/blog/posts/my-new-post/hero.webp'
   heroLayout: 'banner'
   ---

   ![Diagram](/images/blog/posts/my-new-post/diagram.webp)
   ```

## Directory Structure

```
public/images/blog/
├── posts/                    # Optimized per-post images (output)
│   ├── {slug}/
│   │   ├── hero.webp         # Hero image (WebP only)
│   │   └── {name}.webp       # Inline images (WebP only)
│   └── ...
├── shared/                   # Shared images (placeholders, common)
└── _staging/                 # Drop zone for new images (input)
    └── {slug}--{name}.{ext}  # Any format (converted to WebP on optimize)

scripts/
├── optimize-images.mjs       # Staging workflow optimizer
└── optimize-existing-images.mjs  # One-off bulk optimizer
```

## Related Documentation

- [Blog Posts](./BLOG_POSTS.md) - Blog post structure, naming, and hero layouts
- [Public Assets](./PUBLIC_ASSETS.md) - General static assets structure
- [Performance Guide](../PERFORMANCE.md) - Site performance best practices

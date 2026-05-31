---
name: optimize-image
description: Convert and optimize images to WebP for blog posts and series. Use proactively when adding images to blog posts or series.
disable-model-invocation: false
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: haiku
argument-hint: "<source-path> [--slug <post-slug>] [--type hero|content]"
tier: 1
intent: execute
max-files: 5
max-loc: 0
---

# Skill: Optimize Image

## Objective

Convert user-provided images (PNG, JPG, etc.) to optimized WebP format and place them in the correct blog post or series directory. This is the standard workflow for adding any image to blog content (posts, series, shared assets).

## Non-Goals

- Does NOT create or modify blog post content (use `/add-blog-post` for that)
- Does NOT handle image generation or design
- Does NOT modify the image optimization scripts themselves
- Does NOT process images in bulk across all posts (use `pnpm run images:optimize` for staging pipeline)

## Tier Classification

**Tier: 1** - Light

**Reasoning:** Simple file conversion using sharp with well-defined parameters. No reasoning needed, just execution.

## Inputs

### Required Parameters

- `$SOURCE_PATH`: Path to the source image file (any format: PNG, JPG, JPEG, BMP, TIFF, etc.)

### Optional Parameters

- `$SLUG`: Blog post slug for the target directory (default: inferred from source filename or asked)
- `$TYPE`: Image type — `hero` or `content` (default: `hero` if filename contains "hero", otherwise `content`)
- `$OUTPUT_NAME`: Output filename without extension (default: `hero` for hero type, or source filename in kebab-case)

## Prerequisites

Before running this skill, ensure:

- [ ] Source image file exists and is accessible
- [ ] The blog post slug is known (either provided or inferable)
- [ ] `sharp` is available in `node_modules` (installed as dev dependency)

## Steps

### Step 1: Validate Input

1. Check the source file exists
2. Determine the post slug (from `$SLUG` parameter, or ask the user)
3. Determine image type (hero vs content) from `$TYPE` or filename
4. Set max width based on type:
   - **Hero (landscape):** 1400px
   - **Hero (square, aspect ratio 0.8-1.2):** 800px
   - **Content/inline:** 1200px

### Step 2: Create Output Directory

```bash
mkdir -p public/images/blog/posts/{slug}
```

### Step 3: Convert to WebP

Create a temporary conversion script and run it from the project root:

```bash
node -e "
const sharp = require('sharp');
const input = '${SOURCE_PATH}';
const output = 'public/images/blog/posts/${SLUG}/${OUTPUT_NAME}.webp';
const maxWidth = ${MAX_WIDTH};

sharp(input)
  .resize({ width: maxWidth, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile(output)
  .then(info => console.log('OK:', info.width + 'x' + info.height + ',', (info.size / 1024).toFixed(1) + 'KB'))
  .catch(err => {
    console.error('WebP conversion failed:', err.message);
    process.exit(1);
  });
"
```

**If the inline script has escaping issues**, use a file-based approach:

```javascript
// /tmp/convert-to-webp.mjs (run from project root)
import sharp from 'sharp';
const [input, output, width] = process.argv.slice(2);
try {
  const info = await sharp(input)
    .resize({ width: parseInt(width || '1400'), withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  console.log(`OK: ${info.width}x${info.height}, ${(info.size/1024).toFixed(1)}KB`);
} catch (err) {
  console.error(`FAIL: ${err.message}`);
  process.exit(1);
}
```

```bash
node /tmp/convert-to-webp.mjs "{source}" "public/images/blog/posts/{slug}/{name}.webp" {maxWidth}
```

### Step 4: Handle Conversion Failure

If sharp cannot convert the image to WebP:

1. Try keeping the original format (optimize in-place with sharp)
2. Prefer JPG over PNG for photos without transparency
3. Report the issue to the user with the error message
4. Document the exception

### Step 5: Report Result

Show the conversion result:

```
Image optimized:
  Source: {source_path} ({original_size})
  Output: public/images/blog/posts/{slug}/{name}.webp ({output_size})
  Dimensions: {width}x{height}
  Reduction: {percentage}%

Reference in frontmatter:
  heroImage: '/images/blog/posts/{slug}/{name}.webp'

Reference in markdown:
  ![Description](/images/blog/posts/{slug}/{name}.webp)
```

## Output Format

### Success Output

```
Image optimized:
  Source: ~/Downloads/screenshot.png (1.2MB)
  Output: public/images/blog/posts/my-post/hero.webp (45.2KB)
  Dimensions: 1400x700
  Reduction: 96.2%

Reference in frontmatter:
  heroImage: '/images/blog/posts/my-post/hero.webp'
```

### Failure Output

```
WebP conversion failed for: ~/Downloads/photo.bmp
  Error: Input file has unsupported pixel format

Fallback: Keeping as JPG format
  Output: public/images/blog/posts/my-post/hero.jpg (89.5KB)

Note: This image could not be converted to WebP. Using JPG as fallback.
```

## Guardrails

### Scope Limits

- **Maximum files:** 5 images per invocation
- **Maximum LOC:** 0 (no code changes, only image files)
- **Allowed directories:** `public/images/blog/posts/`, `public/images/blog/shared/`, `public/images/blog/series/`
- **Forbidden directories:** `src/`, `scripts/`, `docs/`

### Safety Checks

Before making changes:

- [ ] Source image exists and is a valid image file
- [ ] Output directory is within `public/images/blog/`
- [ ] Will not overwrite an existing image without user confirmation

### Stop Conditions

**Stop immediately** and report if:

- Source file does not exist
- Source file is not a recognized image format
- Output path is outside `public/images/blog/`
- Sharp is not installed (`node_modules/sharp` missing)

## Definition of Done

This skill is **complete** when ALL of the following are true:

- [ ] Image converted to WebP (or fallback format if WebP fails)
- [ ] Output file exists in the correct `posts/{slug}/` directory
- [ ] File size is reasonable (hero < 200KB, content < 300KB typical)
- [ ] Frontmatter/markdown reference provided to the user

## Escalation Conditions

**Escalate to user** if:

- Image cannot be converted to any web-compatible format
- Converted image exceeds 500KB (may need manual quality tuning)
- Multiple images need processing (suggest using staging pipeline instead)

**Escalation Path:**

1. First: Try fallback format (JPG/PNG)
2. Then: Report the issue with details
3. Finally: Ask user for guidance

## Examples

### Example 1: Hero image from user-provided PNG

**Context:** User provides a PNG screenshot to use as hero image for a new post.

**Input:**

```
/optimize-image ~/Downloads/hero-banner.png --slug my-new-post --type hero
```

**Execution:**
Converts PNG to WebP at 1400px max width, quality 80. Places in `public/images/blog/posts/my-new-post/hero.webp`.

**Output:**

```
Image optimized:
  Source: ~/Downloads/hero-banner.png (2.1MB)
  Output: public/images/blog/posts/my-new-post/hero.webp (67.3KB)
  Dimensions: 1400x700
  Reduction: 96.8%

Reference in frontmatter:
  heroImage: '/images/blog/posts/my-new-post/hero.webp'
```

### Example 2: Inline content image

**Context:** User wants to add a diagram to an existing post.

**Input:**

```
/optimize-image /tmp/architecture-diagram.jpg --slug getting-started-with-astro --type content
```

**Execution:**
Converts JPG to WebP at 1200px max width. Names output after the source file.

**Output:**

```
Image optimized:
  Source: /tmp/architecture-diagram.jpg (450KB)
  Output: public/images/blog/posts/getting-started-with-astro/architecture-diagram.webp (38.1KB)
  Dimensions: 1200x800
  Reduction: 91.5%

Reference in markdown:
  ![Architecture diagram](/images/blog/posts/getting-started-with-astro/architecture-diagram.webp)
```

### Example 3: Unconvertible image (fallback)

**Context:** User provides a BMP file that sharp can't convert to WebP.

**Input:**

```
/optimize-image ~/old-screenshot.bmp --slug legacy-project
```

**Result:**

```
WebP conversion failed for: ~/old-screenshot.bmp
  Error: Input file has unsupported pixel format

Fallback: Optimized as JPG
  Output: public/images/blog/posts/legacy-project/old-screenshot.jpg (92KB)

Note: This image could not be converted to WebP. Using JPG as fallback.
Report this to the user for manual review.
```

## Related Skills/Agents

- [`add-blog-post`](../add-blog-post/SKILL.md) - Creates blog posts that reference these optimized images
- [`doc-edit`](../doc-edit/SKILL.md) - For updating image-related documentation

## Changelog

| Version | Date       | Changes         |
| ------- | ---------- | --------------- |
| 1.0.0   | 2026-03-11 | Initial version |

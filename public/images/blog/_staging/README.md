# Blog Image Staging Area

Drop raw/unprocessed images here. They will be optimized and moved to their final destination.

## Workflow

1. Drop image(s) here
2. Run `pnpm run images:optimize`
3. Optimized images are moved to `public/images/blog/posts/{slug}/`

## Naming Convention

Name files with the target post slug prefix:
- `{slug}--hero.jpg` -> Will become `posts/{slug}/hero.jpg`
- `{slug}--{name}.jpg` -> Will become `posts/{slug}/{name}.jpg`

## Supported Formats

Input: JPG, PNG, WebP, AVIF
Output: Optimized JPG/WebP (depending on script config)

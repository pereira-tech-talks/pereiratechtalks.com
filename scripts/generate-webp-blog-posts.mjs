#!/usr/bin/env node

/**
 * Generates WebP variants of blog post hero images (hero.png, hero.jpg).
 * Max width 1020px for banner display. Skips if WebP would be larger.
 *
 * Usage: node scripts/generate-webp-blog-posts.mjs
 */

import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const POSTS_DIR = join(ROOT, 'public/images/blog/posts');

const MAX_WIDTH = 1020;
const WEBP_QUALITY = 80;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

async function main() {
  console.log('\nBlog Posts Hero WebP Generator');
  console.log('================================\n');

  if (!existsSync(POSTS_DIR)) {
    console.log('Posts directory not found.');
    return;
  }

  const slugs = readdirSync(POSTS_DIR).filter((f) => {
    const p = join(POSTS_DIR, f);
    return existsSync(p) && statSync(p).isDirectory();
  });

  let totalSaved = 0;
  let processed = 0;

  for (const slug of slugs) {
    const dir = join(POSTS_DIR, slug);
    const files = readdirSync(dir).filter((f) =>
      /^hero\.(png|jpe?g)$/i.test(f)
    );

    for (const filename of files) {
      const inputPath = join(dir, filename);
      const webpPath = inputPath.replace(/\.(png|jpe?g)$/i, '.webp');

      // Skip if WebP exists and is newer than or equal to source
      if (existsSync(webpPath)) {
        const inputMtime = statSync(inputPath).mtimeMs;
        const webpMtime = statSync(webpPath).mtimeMs;
        if (webpMtime >= inputMtime) {
          console.log(
            `  ${slug}/${filename}: skipped (WebP exists and is up to date)`
          );
          continue;
        }
      }

      try {
        const inputSize = statSync(inputPath).size;
        await sharp(inputPath)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toFile(webpPath);
        const webpSize = statSync(webpPath).size;
        const saved = inputSize - webpSize;
        if (saved <= 0) {
          unlinkSync(webpPath);
          console.log(`  ${slug}/${filename}: skipped (WebP larger)`);
        } else {
          totalSaved += saved;
          processed++;
          console.log(
            `  ${slug}/${filename}: ${formatSize(inputSize)} -> ${formatSize(webpSize)} (saved ${formatSize(saved)})`
          );
        }
      } catch (err) {
        console.error(`  ERROR ${slug}/${filename}: ${err.message}`);
      }
    }
  }

  console.log(
    `\nProcessed: ${processed} | Total saved: ${formatSize(totalSaved)}\n`
  );
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

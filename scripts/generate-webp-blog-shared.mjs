#!/usr/bin/env node

/**
 * Generates WebP variants of blog shared placeholders at display-appropriate size.
 * Display: ~380x190 (h-40). Generates 400x210 for 1x, serves WebP when smaller.
 *
 * Usage: node scripts/generate-webp-blog-shared.mjs
 */

import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const SHARED_DIR = join(ROOT, 'public/images/blog/shared');

const MAX_WIDTH = 400;
const WEBP_QUALITY = 80;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

async function main() {
  console.log('\nBlog Shared WebP Generator');
  console.log('===========================\n');

  if (!existsSync(SHARED_DIR)) {
    console.log('Shared directory not found.');
    return;
  }

  const files = readdirSync(SHARED_DIR).filter((f) =>
    /\.(jpg|jpeg|png)$/i.test(f)
  );
  let totalSaved = 0;

  for (const filename of files) {
    const inputPath = join(SHARED_DIR, filename);
    const webpPath = inputPath.replace(/\.(png|jpe?g)$/i, '.webp');

    // Skip if WebP exists and is newer than or equal to source
    if (existsSync(webpPath)) {
      const inputMtime = statSync(inputPath).mtimeMs;
      const webpMtime = statSync(webpPath).mtimeMs;
      if (webpMtime >= inputMtime) {
        console.log(`  ${filename}: skipped (WebP exists and is up to date)`);
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
        console.log(`  ${filename}: skipped (WebP larger)`);
      } else {
        totalSaved += saved;
        console.log(
          `  ${filename}: ${formatSize(inputSize)} -> ${formatSize(webpSize)} (saved ${formatSize(saved)})`
        );
      }
    } catch (err) {
      console.error(`  ERROR ${filename}: ${err.message}`);
    }
  }

  console.log(`\nTotal saved: ${formatSize(totalSaved)}\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

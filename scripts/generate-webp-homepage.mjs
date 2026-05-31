#!/usr/bin/env node

/**
 * Generates WebP variants of homepage section images.
 * Run before build to enable modern image delivery (~30-50% smaller).
 *
 * Usage: node scripts/generate-webp-homepage.mjs
 */

import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const IMAGES_DIR = join(ROOT, 'public/images');

const RESPONSIVE_SIZES = [280, 360, 480];

const HOMEPAGE_IMAGES = [
  { file: 'profile.png', maxSize: null, responsive: false },
  { file: 'dailybotyc.png', maxSize: 480, responsive: true },
  { file: 'ia.png', maxSize: 480, responsive: true },
  { file: 'techtalks.png', maxSize: null, responsive: false },
  { file: 'trading.png', maxSize: null, responsive: false },
  { file: 'bicycle.png', maxSize: null, responsive: false },
  { file: 'foddie.png', maxSize: null, responsive: false },
];

const WEBP_QUALITY = 82;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(1)}KB`;
}

async function main() {
  console.log('\nHomepage WebP Generator');
  console.log('=====================\n');

  let totalSaved = 0;

  for (const { file: filename, maxSize, responsive } of HOMEPAGE_IMAGES) {
    const inputPath = join(IMAGES_DIR, filename);
    const baseName = filename.replace(/\.(png|jpe?g)$/i, '');
    const webpPath = inputPath.replace(/\.(png|jpe?g)$/i, '.webp');

    if (!existsSync(inputPath)) continue;
    const inputMtime = statSync(inputPath).mtimeMs;
    const ext = filename.toLowerCase().slice(-4);
    if (!['.png', '.jpg', '.jpeg'].some((e) => ext.endsWith(e))) continue;

    try {
      const inputSize = statSync(inputPath).size;
      let pipeline = sharp(inputPath);
      if (maxSize) {
        const meta = await pipeline.metadata();
        if (meta.width > maxSize || meta.height > maxSize) {
          pipeline = pipeline.resize({
            width: maxSize,
            height: maxSize,
            fit: 'inside',
            withoutEnlargement: true,
          });
        }
      }

      if (responsive) {
        for (const size of RESPONSIVE_SIZES) {
          const outPath = join(IMAGES_DIR, `${baseName}-${size}.webp`);
          const skip =
            existsSync(outPath) && statSync(outPath).mtimeMs >= inputMtime;
          if (skip) {
            console.log(`  ${baseName}-${size}.webp: skipped (up to date)`);
            continue;
          }
          await sharp(inputPath)
            .resize({
              width: size,
              height: size,
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({ quality: WEBP_QUALITY })
            .toFile(outPath);
          const webpSize = statSync(outPath).size;
          totalSaved += inputSize - webpSize;
          console.log(`  ${baseName}-${size}.webp: ${formatSize(webpSize)}`);
        }
      } else {
        const skip =
          existsSync(webpPath) && statSync(webpPath).mtimeMs >= inputMtime;
        if (skip) {
          console.log(`  ${filename}: skipped (WebP exists and is up to date)`);
          continue;
        }
        await pipeline.webp({ quality: WEBP_QUALITY }).toFile(webpPath);
        const webpSize = statSync(webpPath).size;
        const saved = inputSize - webpSize;
        if (saved <= 0) {
          const { unlinkSync } = await import('node:fs');
          unlinkSync(webpPath);
          console.log(`  ${filename}: skipped (WebP larger, kept original)`);
        } else {
          totalSaved += saved;
          const resizeNote = maxSize ? `[resized to ${maxSize}px] ` : '';
          console.log(
            `  ${filename}: ${formatSize(inputSize)} -> ${formatSize(webpSize)} (saved ${formatSize(saved)}) ${resizeNote}`
          );
        }
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

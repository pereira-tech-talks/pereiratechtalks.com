#!/usr/bin/env node

/**
 * One-off script to optimize existing blog images in-place.
 *
 * Scans public/images/blog/posts/ and public/images/blog/shared/
 * and optimizes all images (resize, compress). Overwrites originals.
 *
 * Usage:
 *   node scripts/optimize-existing-images.mjs
 *   node scripts/optimize-existing-images.mjs --dry-run
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const BLOG_IMAGES_DIR = join(ROOT, 'public/images/blog');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

const MAX_WIDTH_HERO = 1400;
const MAX_WIDTH_DEFAULT = 1200;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;

const dryRun = process.argv.includes('--dry-run');

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)}MB`;
}

function collectImages(dir, results = []) {
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip _staging directory
      if (entry.name === '_staging') continue;
      collectImages(fullPath, results);
    } else if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }

  return results;
}

async function optimizeImage(imagePath) {
  const inputSize = statSync(imagePath).size;
  const ext = extname(imagePath).toLowerCase();
  const filename = imagePath.split('/').pop();
  const isHero = filename.startsWith('hero');

  const maxWidth = isHero ? MAX_WIDTH_HERO : MAX_WIDTH_DEFAULT;

  const metadata = await sharp(imagePath).metadata();
  const needsResize = metadata.width > maxWidth;

  if (dryRun) {
    const relativePath = imagePath.replace(`${BLOG_IMAGES_DIR}/`, '');
    console.log(`  [DRY RUN] ${relativePath} (${formatSize(inputSize)})`);
    if (needsResize) {
      console.log(
        `    Would resize: ${metadata.width}x${metadata.height} -> max ${maxWidth}px wide`
      );
    }
    return { inputSize, outputSize: inputSize, skipped: true };
  }

  // Write to temp file then rename to avoid corruption
  const tempPath = `${imagePath}.tmp`;

  let pipeline = sharp(imagePath);

  if (needsResize) {
    pipeline = pipeline.resize({
      width: maxWidth,
      withoutEnlargement: true,
    });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (ext === '.png') {
    // Check for transparency
    if (metadata.hasAlpha) {
      pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
    } else {
      // Convert to JPEG for better compression
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    }
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 80 });
  }

  await pipeline.toFile(tempPath);

  const outputSize = statSync(tempPath).size;

  // Only replace if we actually reduced the size
  if (outputSize < inputSize) {
    const { renameSync } = await import('node:fs');
    // For PNGs converted to JPEG, keep original extension for now
    // (URL references use the original filename)
    renameSync(tempPath, imagePath);
  } else {
    const { rmSync } = await import('node:fs');
    rmSync(tempPath);
  }

  return {
    inputSize,
    outputSize: Math.min(outputSize, inputSize),
    skipped: false,
  };
}

async function main() {
  console.log('');
  console.log('Existing Blog Image Optimizer');
  console.log('=============================');
  if (dryRun) console.log('(DRY RUN - no files will be modified)');
  console.log('');

  const images = collectImages(BLOG_IMAGES_DIR);

  if (images.length === 0) {
    console.log('No images found.');
    return;
  }

  console.log(`Found ${images.length} image(s) to optimize:\n`);

  let totalInputSize = 0;
  let totalOutputSize = 0;

  for (const imagePath of images) {
    const relativePath = imagePath.replace(`${BLOG_IMAGES_DIR}/`, '');

    try {
      const result = await optimizeImage(imagePath);
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;

      if (!result.skipped) {
        const ratio = (
          (1 - result.outputSize / result.inputSize) *
          100
        ).toFixed(1);
        console.log(
          `  ${relativePath}: ${formatSize(result.inputSize)} -> ${formatSize(result.outputSize)} (${ratio}% reduction)`
        );
      }
    } catch (err) {
      console.error(`  ERROR processing ${relativePath}: ${err.message}`);
    }
  }

  console.log('');
  console.log('--------------------');
  if (!dryRun && totalInputSize > 0) {
    const totalRatio = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(
      1
    );
    console.log(
      `Total: ${formatSize(totalInputSize)} -> ${formatSize(totalOutputSize)} (${totalRatio}% reduction)`
    );
  } else if (dryRun) {
    console.log(
      `Total images: ${images.length}, Total size: ${formatSize(totalInputSize)}`
    );
  }
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

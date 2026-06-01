#!/usr/bin/env node

/**
 * Optimize images shipped by the Pereira Tech Talks v3.0.0 migration.
 *
 * Walks the v3-specific public image directories (meetups, speakers,
 * contributors, communities, sponsors, pereira-tech-days, authors) and
 * optimizes each file in place using sharp:
 *
 *   - Resizes to a max width (1400px for hero* files, 800px for portraits,
 *     1200px otherwise).
 *   - JPEG/PNG → mozjpeg quality 80 (PNG with alpha kept as PNG).
 *   - WebP → quality 80.
 *   - Skips SVG (already small) and any file already smaller than its
 *     optimized output (we keep the smaller of the two).
 *
 * Usage:
 *   node scripts/optimize-v3-images.mjs
 *   node scripts/optimize-v3-images.mjs --dry-run
 */

import { existsSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public/images');

const TARGET_DIRS = [
  'meetups',
  'speakers',
  'contributors',
  'communities',
  'sponsors',
  'pereira-tech-days',
  'authors',
];

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const PORTRAIT_DIRS = new Set([
  'speakers',
  'contributors',
  'authors',
  'communities',
  'sponsors',
]);

const MAX_HERO = 1400;
const MAX_PORTRAIT = 800;
const MAX_DEFAULT = 1200;
const QUALITY = 80;

const dryRun = process.argv.includes('--dry-run');

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  return `${(kb / 1024).toFixed(2)}MB`;
}

function collectImages(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
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
  const fileName = imagePath.split('/').pop().toLowerCase();
  const rel = relative(PUBLIC_DIR, imagePath);
  const topDir = rel.split('/')[0];

  const isHero = fileName.startsWith('hero');
  const isPortrait = PORTRAIT_DIRS.has(topDir);
  const maxWidth = isHero ? MAX_HERO : isPortrait ? MAX_PORTRAIT : MAX_DEFAULT;

  const metadata = await sharp(imagePath).metadata();
  const width = metadata.width || 0;
  const needsResize = width > maxWidth;

  if (dryRun) {
    return { inputSize, outputSize: inputSize, skipped: true, needsResize };
  }

  const tempPath = `${imagePath}.tmp`;
  let pipeline = sharp(imagePath);
  if (needsResize) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
  } else if (ext === '.png') {
    if (metadata.hasAlpha) {
      pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
    } else {
      pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
    }
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: QUALITY });
  }

  await pipeline.toFile(tempPath);

  const outputSize = statSync(tempPath).size;

  if (outputSize < inputSize) {
    renameSync(tempPath, imagePath);
    return { inputSize, outputSize, skipped: false };
  }
  rmSync(tempPath);
  return { inputSize, outputSize: inputSize, skipped: false, kept: true };
}

async function main() {
  console.log('');
  console.log('Pereira Tech Talks v3.0.0 image optimizer');
  console.log('=========================================');
  if (dryRun) console.log('(DRY RUN - no files will be modified)');
  console.log('');

  let totalIn = 0;
  let totalOut = 0;
  let processed = 0;
  let kept = 0;

  for (const dirName of TARGET_DIRS) {
    const dir = join(PUBLIC_DIR, dirName);
    const images = collectImages(dir);
    if (images.length === 0) {
      console.log(`  ${dirName}/: (no images)`);
      continue;
    }
    console.log(`\n${dirName}/  (${images.length} images)`);
    for (const imagePath of images) {
      const rel = relative(PUBLIC_DIR, imagePath);
      try {
        const r = await optimizeImage(imagePath);
        totalIn += r.inputSize;
        totalOut += r.outputSize;
        processed++;
        if (r.kept) {
          kept++;
          console.log(
            `  = ${rel}: ${formatSize(r.inputSize)} (already optimal)`
          );
        } else if (!r.skipped) {
          const ratio = ((1 - r.outputSize / r.inputSize) * 100).toFixed(1);
          console.log(
            `  ✓ ${rel}: ${formatSize(r.inputSize)} → ${formatSize(r.outputSize)} (-${ratio}%)`
          );
        } else {
          console.log(`  ? ${rel}: ${formatSize(r.inputSize)} (dry-run)`);
        }
      } catch (e) {
        console.error(`  ✗ ${rel}: ${e.message}`);
      }
    }
  }

  const ratio = totalIn > 0 ? ((1 - totalOut / totalIn) * 100).toFixed(1) : 0;
  console.log('');
  console.log('---------------------------------------------');
  console.log(`Processed: ${processed} images`);
  console.log(`Already optimal: ${kept}`);
  console.log(
    `Total: ${formatSize(totalIn)} → ${formatSize(totalOut)} (-${ratio}%)`
  );
}

await main();

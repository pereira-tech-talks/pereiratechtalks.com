#!/usr/bin/env node

/**
 * Image Optimizer (blog posts + slide decks)
 *
 * Processes images from a target collection's `_staging/` directory and
 * optimizes them for production use, mirroring the same conventions across
 * blog posts and slide decks.
 *
 * Staging file naming convention:
 *   {slug}--hero.{ext}     -> {output}/{slug}/hero.{ext optimized}
 *   {slug}--{name}.{ext}   -> {output}/{slug}/{name.ext optimized}
 *
 * Per-language slide hero images live in the same slug folder, e.g.:
 *   slug--hero-en.png  -> images/slides/slug/hero-en.png
 *   slug--hero-es.png  -> images/slides/slug/hero-es.png
 *
 * Targets (--target):
 *   blog (default) — staging at public/images/blog/_staging/
 *                    output  at public/images/blog/posts/{slug}/
 *   slides         — staging at public/images/slides/_staging/
 *                    output  at public/images/slides/{slug}/
 *
 * Usage:
 *   pnpm run images:optimize                          # Blog (default)
 *   pnpm run images:optimize -- --webp                # Blog with WebP variants
 *   pnpm run images:optimize -- --dry-run             # Preview blog work
 *   pnpm run images:optimize:slides                   # Slides
 *   pnpm run images:optimize:slides -- --webp         # Slides with WebP
 */

import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');

const TARGETS = {
  blog: {
    staging: join(ROOT, 'public/images/blog/_staging'),
    output: join(ROOT, 'public/images/blog/posts'),
    label: 'Blog',
    outputLabel: 'posts',
  },
  slides: {
    staging: join(ROOT, 'public/images/slides/_staging'),
    output: join(ROOT, 'public/images/slides'),
    label: 'Slides',
    outputLabel: 'slides',
  },
};

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

const PRESETS = {
  hero: { width: 1400, height: null, fit: 'inside' },
  'hero-square': { width: 800, height: null, fit: 'inside' },
  default: { width: 1200, height: null, fit: 'inside' },
};

const JPEG_QUALITY = 80;
const PNG_TO_JPEG_QUALITY = 85;
const WEBP_QUALITY = 80;

function parseArgs() {
  const args = process.argv.slice(2);
  const targetArg = args.find((a) => a.startsWith('--target='));
  const target = targetArg ? targetArg.slice('--target='.length) : 'blog';
  if (!TARGETS[target]) {
    console.error(
      `Unknown --target=${target}. Valid: ${Object.keys(TARGETS).join(', ')}`
    );
    process.exit(1);
  }
  return {
    webp: args.includes('--webp'),
    dryRun: args.includes('--dry-run'),
    target,
  };
}

function parseStagingFilename(filename) {
  const ext = extname(filename);
  const nameWithoutExt = basename(filename, ext);
  const separatorIndex = nameWithoutExt.indexOf('--');

  if (separatorIndex === -1) {
    return null;
  }

  const slug = nameWithoutExt.substring(0, separatorIndex);
  const name = nameWithoutExt.substring(separatorIndex + 2);

  if (!slug || !name) {
    return null;
  }

  return { slug, name, ext };
}

async function getPreset(imagePath, name) {
  if (!name.startsWith('hero')) {
    return PRESETS.default;
  }

  const metadata = await sharp(imagePath).metadata();
  const { width, height } = metadata;

  if (width && height) {
    const aspectRatio = width / height;
    // Square-ish images (aspect ratio between 0.8 and 1.2)
    if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
      return PRESETS['hero-square'];
    }
  }

  return PRESETS.hero;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)}MB`;
}

async function optimizeImage(inputPath, outputDir, name, ext, options) {
  const preset = await getPreset(inputPath, name);
  const inputSize = statSync(inputPath).size;
  const isPng = ext.toLowerCase() === '.png';

  // Determine if PNG has transparency
  let hasAlpha = false;
  if (isPng) {
    const metadata = await sharp(inputPath).metadata();
    hasAlpha = metadata.hasAlpha;
  }

  // Determine output format
  const outputExt = isPng && !hasAlpha ? '.jpg' : ext.toLowerCase();
  const outputFilename = `${name}${outputExt}`;
  const outputPath = join(outputDir, outputFilename);

  if (options.dryRun) {
    console.log(`  [DRY RUN] ${basename(inputPath)} -> ${outputFilename}`);
    console.log(
      `    Preset: ${preset.width}x${preset.height || 'auto'} (${preset.fit})`
    );
    console.log(`    Format: ${ext} -> ${outputExt}`);
    return { outputPath, inputSize, outputSize: 0, skipped: true };
  }

  let pipeline = sharp(inputPath).resize({
    width: preset.width,
    height: preset.height,
    fit: preset.fit,
    withoutEnlargement: true,
  });

  if (outputExt === '.jpg' || outputExt === '.jpeg') {
    const quality = isPng ? PNG_TO_JPEG_QUALITY : JPEG_QUALITY;
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (outputExt === '.png') {
    pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
  } else if (outputExt === '.webp') {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY });
  } else if (outputExt === '.avif') {
    pipeline = pipeline.avif({ quality: 60 });
  }

  await pipeline.toFile(outputPath);
  const outputSize = statSync(outputPath).size;

  // Generate WebP variant if requested
  if (options.webp && outputExt !== '.webp') {
    const webpPath = join(outputDir, `${name}.webp`);
    await sharp(inputPath)
      .resize({
        width: preset.width,
        height: preset.height,
        fit: preset.fit,
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);
    const webpSize = statSync(webpPath).size;
    console.log(`    + WebP variant: ${formatSize(webpSize)}`);
  }

  return { outputPath, inputSize, outputSize, skipped: false };
}

async function main() {
  const options = parseArgs();
  const target = TARGETS[options.target];

  console.log('');
  console.log(`${target.label} Image Optimizer`);
  console.log('====================');
  if (options.dryRun) console.log('(DRY RUN - no files will be modified)');
  if (options.webp) console.log('(WebP variants will be generated)');
  console.log('');

  if (!existsSync(target.staging)) {
    console.log(
      `Staging directory not found (${target.staging}). Nothing to process.`
    );
    return;
  }

  const files = readdirSync(target.staging).filter((f) => {
    const ext = extname(f).toLowerCase();
    return IMAGE_EXTENSIONS.has(ext);
  });

  if (files.length === 0) {
    console.log('No images found in staging directory.');
    return;
  }

  console.log(`Found ${files.length} image(s) to process:\n`);

  let totalInputSize = 0;
  let totalOutputSize = 0;
  let processed = 0;
  let errors = 0;

  for (const file of files) {
    const parsed = parseStagingFilename(file);
    if (!parsed) {
      console.log(
        `  SKIP: ${file} (invalid naming, expected {slug}--{name}.{ext})`
      );
      errors++;
      continue;
    }

    const { slug, name, ext } = parsed;
    const inputPath = join(target.staging, file);
    const outputDir = join(target.output, slug);

    console.log(`  Processing: ${file}`);
    console.log(`    -> ${target.outputLabel}/${slug}/${name}${ext}`);

    if (!options.dryRun) {
      mkdirSync(outputDir, { recursive: true });
    }

    try {
      const result = await optimizeImage(
        inputPath,
        outputDir,
        name,
        ext,
        options
      );
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;

      if (!result.skipped) {
        const ratio = (
          (1 - result.outputSize / result.inputSize) *
          100
        ).toFixed(1);
        console.log(
          `    ${formatSize(result.inputSize)} -> ${formatSize(result.outputSize)} (${ratio}% reduction)`
        );

        // Remove from staging after successful processing
        rmSync(inputPath);
      }

      processed++;
    } catch (err) {
      console.error(`    ERROR: ${err.message}`);
      errors++;
    }

    console.log('');
  }

  console.log('--------------------');
  console.log(`Processed: ${processed} | Errors: ${errors}`);
  if (!options.dryRun && totalInputSize > 0) {
    const totalRatio = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(
      1
    );
    console.log(
      `Total: ${formatSize(totalInputSize)} -> ${formatSize(totalOutputSize)} (${totalRatio}% reduction)`
    );
  }
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

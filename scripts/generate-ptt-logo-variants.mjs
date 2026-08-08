#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * Generate Pereira Tech Talks vertical logo variants for light and dark surfaces.
 *
 * Input: vertical color mark (teal cup + gray wordmark on transparent).
 * Output:
 *   - logo-vertical-color.{png,webp}  — for light backgrounds
 *   - logo-vertical-white.{png,webp}  — all ink forced to white (dark backgrounds)
 *   - logo-color.{png,webp} / logo-white.{png,webp} — legacy aliases
 *
 * Usage:
 *   node scripts/generate-ptt-logo-variants.mjs
 *   node scripts/generate-ptt-logo-variants.mjs --src path/in.png --outdir public/images/pereira-tech-talks
 *   node scripts/generate-ptt-logo-variants.mjs --scale 2
 */
import { parseArgs } from 'node:util';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const { values } = parseArgs({
  options: {
    src: { type: 'string' },
    outdir: { type: 'string' },
    scale: { type: 'string', default: '2' },
  },
});

const defaultSrcCandidates = [
  'public/images/pereira-tech-talks/logo-vertical-color.source.png',
  'public/images/pereira-tech-talks/logo-vertical-color.png',
];

const resolvedDefaultSrc =
  values.src ??
  defaultSrcCandidates.find((candidate) =>
    fs.existsSync(path.resolve(ROOT, candidate))
  ) ??
  defaultSrcCandidates[0];

const SRC = path.resolve(ROOT, resolvedDefaultSrc);
const OUTDIR = path.resolve(
  ROOT,
  values.outdir ?? 'public/images/pereira-tech-talks'
);
const SCALE = Math.max(1, Number(values.scale) || 2);

/**
 * Recolor every non-transparent pixel to solid white, preserving alpha.
 * Soft anti-aliased edges stay soft (semi-transparent white).
 */
function toWhiteInk(rgba, byteLength) {
  const out = Buffer.from(rgba);
  let converted = 0;
  for (let i = 0; i < byteLength; i += 4) {
    const a = out[i + 3];
    if (a === 0) continue;
    out[i] = 255;
    out[i + 1] = 255;
    out[i + 2] = 255;
    converted += 1;
  }
  return { out, converted };
}

async function writePngAndWebp(basePath, image) {
  const pngPath = `${basePath}.png`;
  const webpPath = `${basePath}.webp`;
  await image.clone().png({ compressionLevel: 9 }).toFile(pngPath);
  await image
    .clone()
    .webp({ quality: 95, alphaQuality: 100, effort: 6 })
    .toFile(webpPath);
  return { pngPath, webpPath };
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source not found: ${SRC}`);
    process.exit(1);
  }

  await fs.promises.mkdir(OUTDIR, { recursive: true });

  const meta = await sharp(SRC).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) {
    console.error('Could not read source dimensions');
    process.exit(1);
  }

  const targetW = Math.round(width * SCALE);
  const targetH = Math.round(height * SCALE);

  // Master raster at target scale (lanczos keeps edges cleaner than default).
  const scaled = sharp(SRC).ensureAlpha().resize(targetW, targetH, {
    kernel: sharp.kernel.lanczos3,
    fit: 'fill',
  });

  const { data, info } = await scaled
    .clone()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { out: whiteRaw, converted } = toWhiteInk(data, data.length);

  const colorImage = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
  const whiteImage = sharp(whiteRaw, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });

  const verticalColor = path.join(OUTDIR, 'logo-vertical-color');
  const verticalWhite = path.join(OUTDIR, 'logo-vertical-white');
  const legacyColor = path.join(OUTDIR, 'logo-color');
  const legacyWhite = path.join(OUTDIR, 'logo-white');

  const written = [];
  written.push(await writePngAndWebp(verticalColor, colorImage));
  written.push(await writePngAndWebp(verticalWhite, whiteImage));
  written.push(await writePngAndWebp(legacyColor, colorImage));
  written.push(await writePngAndWebp(legacyWhite, whiteImage));

  console.log(
    `Generated PTT vertical logos @ ${info.width}×${info.height} (scale=${SCALE})`
  );
  console.log(`  white pixels converted: ${converted.toLocaleString()}`);
  for (const { pngPath, webpPath } of written) {
    console.log(`  → ${path.relative(ROOT, pngPath)}`);
    console.log(`  → ${path.relative(ROOT, webpPath)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * Generate a dark-mode Made for Germany sponsor logo from the light asset.
 *
 * Recolors the mustard wordmark to white while keeping the German-flag bar
 * (charcoal / red / gold). Slightly lifts the charcoal stripe so it still
 * reads on dark elevated cards.
 *
 * Usage:
 *   node scripts/generate-made-for-germany-dark-logo.mjs
 *   node scripts/generate-made-for-germany-dark-logo.mjs --src path/in.png --out path/out.png
 */
import { parseArgs } from 'node:util';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const { values } = parseArgs({
  options: {
    src: { type: 'string' },
    out: { type: 'string' },
  },
});

const SRC = path.resolve(
  ROOT,
  values.src ?? 'public/images/sponsors/made-for-germany.png'
);
const OUT = path.resolve(
  ROOT,
  values.out ?? 'public/images/sponsors/made-for-germany-dark.png'
);

function isGold(r, g, b, a) {
  if (a < 16) return false;
  return r > 90 && g > 70 && b < 50 && g > b + 30;
}

function isFlagRed(r, g, b, a) {
  if (a < 16) return false;
  return r > 120 && g < 40 && b < 40;
}

function isFlagGray(r, g, b, a) {
  if (a < 16) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return max - min <= 12 && luma > 20 && luma < 90;
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source not found: ${SRC}`);
    process.exit(1);
  }

  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);

  let barTop = -1;
  let barBottom = -1;
  for (let y = 0; y < info.height; y++) {
    let gold = 0;
    let red = 0;
    let gray = 0;
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (isGold(r, g, b, a)) gold += 1;
      else if (isFlagRed(r, g, b, a)) red += 1;
      else if (isFlagGray(r, g, b, a)) gray += 1;
    }
    if (gold > 50 && red > 50 && gray > 50) {
      if (barTop < 0) barTop = y;
      barBottom = y;
    }
  }

  if (barTop < 0) {
    console.error('Could not locate German-flag bar in source image');
    process.exit(1);
  }

  let textToWhite = 0;
  let grayAdjusted = 0;

  for (let y = 0; y < info.height; y++) {
    const inBar = y >= barTop && y <= barBottom;
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (!inBar && isGold(r, g, b, a)) {
        out[i] = 255;
        out[i + 1] = 255;
        out[i + 2] = 255;
        textToWhite += 1;
        continue;
      }

      if (inBar && isFlagGray(r, g, b, a)) {
        out[i] = 55;
        out[i + 1] = 55;
        out[i + 2] = 55;
        grayAdjusted += 1;
      }
    }
  }

  await fs.promises.mkdir(path.dirname(OUT), { recursive: true });
  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(
    `Wrote ${path.relative(ROOT, OUT)} (${kb} KB) — wordmark→white: ${textToWhite}, gray stripe: ${grayAdjusted} (bar rows ${barTop}–${barBottom})`
  );
}

await main();

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * Generate Factored sponsor logos from the black-ink transparent source.
 *
 * Source is black wordmark + mark on transparency with generous vertical
 * padding. Trim to content (+ small pad), keep black for light mode, and
 * recolor to white ink for dark mode.
 *
 * Usage:
 *   node scripts/generate-factored-logos.mjs
 *   node scripts/generate-factored-logos.mjs --src path/in.png
 */
import { parseArgs } from 'node:util';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const { values } = parseArgs({
  options: {
    src: { type: 'string' },
  },
});

const SRC = path.resolve(
  ROOT,
  values.src ?? 'public/images/sponsors/_source/factored-original.png'
);
const LIGHT_OUT = path.resolve(ROOT, 'public/images/sponsors/factored.png');
const DARK_OUT = path.resolve(ROOT, 'public/images/sponsors/factored-dark.png');

const PAD = 6;
const LIGHT_INK = [8, 8, 8];
const DARK_INK = [255, 255, 255];

function contentBBox(data, width, height) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let any = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a <= 10) continue;
      any += 1;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (!any) return null;
  return { minX, minY, maxX, maxY };
}

function cropRgba(data, width, height, box) {
  const left = Math.max(0, box.minX - PAD);
  const top = Math.max(0, box.minY - PAD);
  const right = Math.min(width - 1, box.maxX + PAD);
  const bottom = Math.min(height - 1, box.maxY + PAD);
  const w = right - left + 1;
  const h = bottom - top + 1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcI = ((top + y) * width + (left + x)) * 4;
      const destI = (y * w + x) * 4;
      out[destI] = data[srcI];
      out[destI + 1] = data[srcI + 1];
      out[destI + 2] = data[srcI + 2];
      out[destI + 3] = data[srcI + 3];
    }
  }
  return { out, width: w, height: h, left, top };
}

function recolor(data, inkRgb) {
  const out = Buffer.from(data);
  let ink = 0;
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    out[i] = inkRgb[0];
    out[i + 1] = inkRgb[1];
    out[i + 2] = inkRgb[2];
    ink += 1;
  }
  return { out, ink };
}

async function writePng(outPath, buf, width, height) {
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await sharp(buf, {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`Wrote ${path.relative(ROOT, outPath)} (${kb} KB)`);
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

  const box = contentBBox(data, info.width, info.height);
  if (!box) {
    console.error('No opaque content found in source');
    process.exit(1);
  }

  const cropped = cropRgba(data, info.width, info.height, box);
  const light = recolor(cropped.out, LIGHT_INK);
  const dark = recolor(cropped.out, DARK_INK);

  await writePng(LIGHT_OUT, light.out, cropped.width, cropped.height);
  await writePng(DARK_OUT, dark.out, cropped.width, cropped.height);

  console.log(
    `crop ${info.width}×${info.height} → ${cropped.width}×${cropped.height} (pad ${PAD}); ink ${light.ink}`
  );
}

await main();

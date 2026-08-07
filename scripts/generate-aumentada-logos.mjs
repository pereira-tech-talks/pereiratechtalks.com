#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * Generate light + dark Aumentada sponsor logos from the black-plate source.
 *
 * Source art is white "A" + near-black navy "UMENTADA" on a solid black plate.
 * The middle "A" is often crushed into the plate (near-zero contrast); this
 * script reconstructs it from the leading white "A", knocks out the plate,
 * and recolors all ink:
 *   - light → brand navy on transparent (readable on pale cards)
 *   - dark  → white on transparent (readable on dark cards)
 *
 * Usage:
 *   node scripts/generate-aumentada-logos.mjs
 *   node scripts/generate-aumentada-logos.mjs --src path/in.png
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
  values.src ?? 'public/images/sponsors/_source/aumentada-black-original.png'
);
const LIGHT_OUT = path.resolve(ROOT, 'public/images/sponsors/aumentada.png');
const DARK_OUT = path.resolve(
  ROOT,
  'public/images/sponsors/aumentada-dark.png'
);

const LIGHT_INK = [8, 18, 24];
const DARK_INK = [255, 255, 255];
const NAVY = [5, 12, 16];

/** First white "A" glyph bounds in the 212×43 source. */
const A_X0 = 11;
const A_X1 = 30;
/** Slot for the crushed middle "A" (between T and D). */
const MIDDLE_A_X0 = 145;

function isPlate(r, g, b, a) {
  if (a < 8) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Solid black / charcoal plate — achromatic and very dark (not navy ink)
  return chroma <= 6 && luma < 12;
}

function reconstructMiddleA(data, width, height) {
  const out = Buffer.from(data);
  const aWidth = A_X1 - A_X0 + 1;
  let painted = 0;

  for (let y = 0; y < height; y++) {
    for (let dx = 0; dx < aWidth; dx++) {
      const srcX = A_X0 + dx;
      const srcI = (y * width + srcX) * 4;
      const r = data[srcI];
      const g = data[srcI + 1];
      const b = data[srcI + 2];
      const a = data[srcI + 3];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const cov = Math.min(255, Math.round((luma / 255) * a));
      if (cov < 8) continue;

      const destX = MIDDLE_A_X0 + dx;
      if (destX < 0 || destX >= width) continue;
      const destI = (y * width + destX) * 4;
      out[destI] = NAVY[0];
      out[destI + 1] = NAVY[1];
      out[destI + 2] = NAVY[2];
      out[destI + 3] = cov;
      painted += 1;
    }
  }

  return { out, painted };
}

function convert(data, inkRgb) {
  const out = Buffer.alloc(data.length);
  let ink = 0;
  let cleared = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (isPlate(r, g, b, a)) {
      out[i] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 0;
      cleared += 1;
      continue;
    }
    out[i] = inkRgb[0];
    out[i + 1] = inkRgb[1];
    out[i + 2] = inkRgb[2];
    out[i + 3] = a;
    ink += 1;
  }
  return { out, ink, cleared };
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

  const repaired = reconstructMiddleA(data, info.width, info.height);
  const light = convert(repaired.out, LIGHT_INK);
  const dark = convert(repaired.out, DARK_INK);

  await writePng(LIGHT_OUT, light.out, info.width, info.height);
  await writePng(DARK_OUT, dark.out, info.width, info.height);

  console.log(
    `middle A painted: ${repaired.painted}; ink: ${light.ink}; plate cleared: ${light.cleared} (${info.width}×${info.height})`
  );
}

await main();

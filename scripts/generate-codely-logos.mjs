#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * Generate Codely sponsor logos from the navy-plate source.
 *
 * Source art is neon-green wordmark + pixel brackets on a solid navy plate
 * (~#1a2233). Knock out the plate; recolor ink with soft edges:
 *   - light → near-black on transparent (readable on pale cards)
 *   - dark  → brand neon green on transparent (readable on dark cards)
 *
 * Usage:
 *   node scripts/generate-codely-logos.mjs
 *   node scripts/generate-codely-logos.mjs --src path/in.png
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
  values.src ?? 'public/images/sponsors/_source/codely-original.png'
);
const LIGHT_OUT = path.resolve(ROOT, 'public/images/sponsors/codely.png');
const DARK_OUT = path.resolve(ROOT, 'public/images/sponsors/codely-dark.png');

/** Near-black for light-mode cards. */
const LIGHT_INK = [8, 8, 8];
/** Brand neon green sampled from the source ink peak. */
const DARK_INK = [30, 255, 87];

/**
 * Navy plate: dark, low-chroma blues around #1a2233.
 * Ink is high-green neon — never matches this.
 */
function isPlate(r, g, b, a) {
  if (a < 8) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Plate is dark navy; green ink has high green channel and high chroma
  if (g > 90) return false;
  return luma < 55 && chroma < 40;
}

/**
 * Coverage from green ink strength (preserves anti-aliased edges).
 */
function inkCoverage(r, g, b, a) {
  const greenDominance = Math.max(0, g - Math.max(r, b));
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Soft edges are dimmer greens blending into navy
  const strength = Math.min(1, (greenDominance / 80 + luma / 200) / 1.2);
  return Math.min(255, Math.round(strength * a));
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
    const cov = inkCoverage(r, g, b, a);
    if (cov < 8) {
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
    out[i + 3] = cov;
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

  const light = convert(data, LIGHT_INK);
  const dark = convert(data, DARK_INK);

  await writePng(LIGHT_OUT, light.out, info.width, info.height);
  await writePng(DARK_OUT, dark.out, info.width, info.height);

  console.log(
    `ink: ${light.ink}; plate cleared: ${light.cleared} (${info.width}×${info.height})`
  );
}

await main();

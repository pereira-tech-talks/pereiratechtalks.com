#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * Generate a dark-mode ASE-UTP sponsor logo from the light asset.
 *
 * Recolors the charcoal "ASE" / "UTP" wordmark to white while keeping:
 * - the yellow circular mark (and near-black arrow cutouts)
 * - the yellow subtitle + rule
 *
 * Usage:
 *   node scripts/generate-ase-utp-dark-logo.mjs
 *   node scripts/generate-ase-utp-dark-logo.mjs --src path/in.png --out path/out.png
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
  values.src ?? 'public/images/sponsors/ase-utp.png'
);
const OUT = path.resolve(
  ROOT,
  values.out ?? 'public/images/sponsors/ase-utp-dark.png'
);

function isCharcoalWordmark(r, g, b, a) {
  if (a < 16) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Mid-dark gray wordmark — not yellow (high chroma) and not pure-black cutouts.
  return chroma <= 18 && luma >= 40 && luma <= 140 && a > 200;
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
  let converted = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (!isCharcoalWordmark(r, g, b, a)) continue;
    out[i] = 255;
    out[i + 1] = 255;
    out[i + 2] = 255;
    converted += 1;
  }

  await fs.promises.mkdir(path.dirname(OUT), { recursive: true });
  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(
    `Wrote ${path.relative(ROOT, OUT)} (${kb} KB), converted ${converted} pixels from ${path.relative(ROOT, SRC)}`
  );
}

await main();

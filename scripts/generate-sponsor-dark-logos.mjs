#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * Generate white (dark-mode) sponsor logos from dark-ink light assets.
 *
 * Recolors every non-transparent pixel to solid white while preserving alpha
 * (anti-aliased edges stay soft). Intended for monochrome wordmarks that are
 * black/charcoal on a transparent background (GitHub, Gorilla Logic, etc.).
 *
 * Usage:
 *   node scripts/generate-sponsor-dark-logos.mjs
 *   node scripts/generate-sponsor-dark-logos.mjs --only github
 *   node scripts/generate-sponsor-dark-logos.mjs --src path/in.png --out path/out.png
 */
import { parseArgs } from 'node:util';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/** Default light → dark pairs under public/images/sponsors/ */
const DEFAULT_JOBS = [
  {
    id: 'github',
    src: 'public/images/sponsors/github-light.png',
    out: 'public/images/sponsors/github-dark.png',
  },
  {
    id: 'gorilla-logic',
    src: 'public/images/sponsors/gorilla-logic.png',
    out: 'public/images/sponsors/gorilla-logic-dark.png',
  },
  {
    id: 'vuetify',
    src: 'public/images/sponsors/vuetify.png',
    out: 'public/images/sponsors/vuetify-dark.png',
  },
];

const { values } = parseArgs({
  options: {
    src: { type: 'string' },
    out: { type: 'string' },
    only: { type: 'string' },
  },
});

/**
 * Recolor every non-transparent pixel to solid white, preserving alpha.
 */
function toWhiteInk(rgba) {
  const out = Buffer.from(rgba);
  let converted = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    if (out[i + 3] === 0) continue;
    out[i] = 255;
    out[i + 1] = 255;
    out[i + 2] = 255;
    converted += 1;
  }
  return { out, converted };
}

async function convertOne(srcRel, outRel) {
  const src = path.resolve(ROOT, srcRel);
  const outPath = path.resolve(ROOT, outRel);

  if (!fs.existsSync(src)) {
    throw new Error(`Source not found: ${src}`);
  }

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { out, converted } = toWhiteInk(data);

  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(
    `Wrote ${path.relative(ROOT, outPath)} (${kb} KB) — ${converted.toLocaleString()} pixels from ${path.relative(ROOT, src)}`
  );
}

async function main() {
  if (values.src || values.out) {
    if (!values.src || !values.out) {
      console.error('Both --src and --out are required when overriding paths.');
      process.exit(1);
    }
    await convertOne(values.src, values.out);
    return;
  }

  const only = values.only?.trim().toLowerCase();
  const jobs = only ? DEFAULT_JOBS.filter((j) => j.id === only) : DEFAULT_JOBS;

  if (jobs.length === 0) {
    console.error(
      `No jobs matched --only=${values.only}. Known ids: ${DEFAULT_JOBS.map((j) => j.id).join(', ')}`
    );
    process.exit(1);
  }

  for (const job of jobs) {
    await convertOne(job.src, job.out);
  }
}

await main();

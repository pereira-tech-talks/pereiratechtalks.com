#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * Generate light-mode PTT chrome logos in brand primary green.
 *
 * Sources are the archived black ink marks (`*-black.webp`). Non-transparent
 * pixels are recolored to `--color-ptt-primary-strong` (#155054) while alpha is
 * preserved (anti-aliased edges stay soft). Black assets are never overwritten.
 *
 * Output (default):
 *   - topbar-logo-primary.webp       — header / mobile menu (light)
 *   - logo-horizontal-primary.webp   — footer wordmark (light)
 *
 * Usage:
 *   node scripts/generate-ptt-light-logos.mjs
 *   node scripts/generate-ptt-light-logos.mjs --color 155054
 *   node scripts/generate-ptt-light-logos.mjs --only topbar
 *   node scripts/generate-ptt-light-logos.mjs --src path/in.webp --out path/out.webp
 */
import { parseArgs } from 'node:util';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/** Light-mode primary-strong from `src/styles/global.css` (`--color-ptt-primary-strong`). */
const DEFAULT_PRIMARY = '155054';

const DEFAULT_JOBS = [
  {
    id: 'topbar',
    src: 'public/images/pereira-tech-talks/topbar-logo-black.webp',
    out: 'public/images/pereira-tech-talks/topbar-logo-primary.webp',
  },
  {
    id: 'horizontal',
    src: 'public/images/pereira-tech-talks/logo-horizontal-black.webp',
    out: 'public/images/pereira-tech-talks/logo-horizontal-primary.webp',
  },
];

const { values } = parseArgs({
  options: {
    src: { type: 'string' },
    out: { type: 'string' },
    only: { type: 'string' },
    color: { type: 'string', default: DEFAULT_PRIMARY },
  },
});

/**
 * Parse #RGB / #RRGGBB / RRGGBB into { r, g, b }.
 */
function parseHexColor(input) {
  const hex = String(input).trim().replace(/^#/, '').toUpperCase();
  if (/^[0-9A-F]{3}$/.test(hex)) {
    return {
      r: Number.parseInt(hex[0] + hex[0], 16),
      g: Number.parseInt(hex[1] + hex[1], 16),
      b: Number.parseInt(hex[2] + hex[2], 16),
    };
  }
  if (/^[0-9A-F]{6}$/.test(hex)) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }
  throw new Error(
    `Invalid --color "${input}". Use 3- or 6-digit hex (e.g. 1F6F73).`
  );
}

/**
 * Recolor every non-transparent pixel to solid RGB, preserving alpha.
 */
function toSolidInk(rgba, { r, g, b }) {
  const out = Buffer.from(rgba);
  let converted = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    if (out[i + 3] === 0) continue;
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    converted += 1;
  }
  return { out, converted };
}

async function convertOne(srcRel, outRel, rgb) {
  const src = path.resolve(ROOT, srcRel);
  const outPath = path.resolve(ROOT, outRel);

  if (!fs.existsSync(src)) {
    throw new Error(`Source not found: ${src}`);
  }

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { out, converted } = toSolidInk(data, rgb);

  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });

  const image = sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });

  if (outPath.endsWith('.png')) {
    await image.png({ compressionLevel: 9 }).toFile(outPath);
  } else {
    await image
      .webp({ quality: 95, alphaQuality: 100, effort: 6 })
      .toFile(outPath);
  }

  const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
  const hex = [rgb.r, rgb.g, rgb.b]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  console.log(
    `Wrote ${path.relative(ROOT, outPath)} (${kb} KB, ${info.width}×${info.height}) — ${converted.toLocaleString()} pixels from ${path.relative(ROOT, src)} → #${hex}`
  );
}

async function main() {
  const rgb = parseHexColor(values.color ?? DEFAULT_PRIMARY);

  if (values.src || values.out) {
    if (!values.src || !values.out) {
      console.error('Both --src and --out are required when overriding paths.');
      process.exit(1);
    }
    await convertOne(values.src, values.out, rgb);
    return;
  }

  const jobs = values.only
    ? DEFAULT_JOBS.filter((job) => job.id === values.only)
    : DEFAULT_JOBS;

  if (jobs.length === 0) {
    console.error(
      `No jobs matched --only=${values.only}. Valid ids: ${DEFAULT_JOBS.map((j) => j.id).join(', ')}`
    );
    process.exit(1);
  }

  const hex = [rgb.r, rgb.g, rgb.b]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  console.log(
    `Generating light-mode PTT logos in #${hex} (ptt-primary-strong). Black sources kept as archives.`
  );

  for (const job of jobs) {
    await convertOne(job.src, job.out, rgb);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

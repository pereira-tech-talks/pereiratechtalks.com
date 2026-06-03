#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * Responsive screenshot capture harness.
 *
 * Reads viewports.json and urls.json, captures full-page screenshots to
 * tmp/responsive-audit/baseline/<viewport>/<slug>.png, and records overflow
 * detection + console errors to a CSV summary.
 *
 * Usage:
 *   pnpm run responsive:capture                  # all routes × all viewports
 *   pnpm run responsive:capture -- --viewport=phone-narrow
 *   pnpm run responsive:capture -- --template=blog-post-banner
 *   pnpm run responsive:capture -- --quick       # subset for fast smoke
 */
import { chromium } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const OUT_DIR = join(ROOT, 'tmp', 'responsive-audit', 'baseline');
const SUMMARY_OUT = join(
  ROOT,
  '.agent_commands',
  'agent_deep_work_plans',
  'results',
  'plans',
  'PLAN_full_responsive_audit',
  'analysis_results',
  '00_baseline',
  'capture_summary.csv'
);

const viewports = JSON.parse(
  readFileSync(join(__dirname, 'viewports.json'), 'utf8')
);
const urlsConfig = JSON.parse(
  readFileSync(join(__dirname, 'urls.json'), 'utf8')
);

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const quickMode = args.has('quick');
const viewportFilter = args.get('viewport');
const templateFilter = args.get('template');

const selectedViewports = viewportFilter
  ? viewports.filter((v) => v.name === viewportFilter)
  : quickMode
    ? viewports.filter((v) =>
        ['phone-standard', 'tablet-portrait', 'desktop-fhd'].includes(v.name)
      )
    : viewports;

const selectedRoutes = templateFilter
  ? urlsConfig.routes.filter((r) => r.template === templateFilter)
  : quickMode
    ? urlsConfig.routes.slice(0, 6)
    : urlsConfig.routes;

const slugify = (s) =>
  s
    .replace(/^\//, '')
    .replace(/\//g, '_')
    .replace(/[^a-z0-9_-]/gi, '_') || 'root';

const summary = [
  [
    'route',
    'template',
    'lang',
    'viewport',
    'width',
    'height',
    'overflow_px',
    'console_errors',
    'status',
  ],
];

console.log(
  `📸 Responsive capture — ${selectedRoutes.length} routes × ${selectedViewports.length} viewports = ${selectedRoutes.length * selectedViewports.length} screenshots`
);
console.log(`   Output: ${OUT_DIR}`);
console.log('');

const browser = await chromium.launch();

for (const vp of selectedViewports) {
  const vpDir = join(OUT_DIR, vp.name);
  mkdirSync(vpDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
  });

  for (const route of selectedRoutes) {
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) =>
      consoleErrors.push(`PAGEERROR: ${err.message}`)
    );

    const url = `${urlsConfig.baseUrl}${route.url}`;
    let overflowPx = 0;
    let status = 'ok';

    try {
      const resp = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30_000,
      });
      if (!resp?.ok()) {
        status = `http_${resp ? resp.status() : 'no_response'}`;
      } else {
        // Measure horizontal overflow
        const measurement = await page.evaluate(() => {
          const scrollW = document.documentElement.scrollWidth;
          const clientW = document.documentElement.clientWidth;
          return { scrollW, clientW, diff: scrollW - clientW };
        });
        overflowPx = Math.max(0, measurement.diff);

        const screenshotPath = join(vpDir, `${slugify(route.url)}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
      }
    } catch (err) {
      status = `error:${err.message.slice(0, 80)}`;
    } finally {
      summary.push([
        route.url,
        route.template,
        route.lang,
        vp.name,
        vp.width,
        vp.height,
        overflowPx,
        consoleErrors.length,
        status,
      ]);
      const overflowFlag = overflowPx > 0 ? `OVERFLOW+${overflowPx}px` : 'ok';
      const errFlag =
        consoleErrors.length > 0 ? `${consoleErrors.length} console err` : '';
      console.log(
        `  ${vp.name.padEnd(20)} ${route.url.padEnd(50)} ${overflowFlag.padEnd(18)} ${errFlag}`
      );
      await page.close();
    }
  }

  await context.close();
}

await browser.close();

mkdirSync(dirname(SUMMARY_OUT), { recursive: true });
writeFileSync(SUMMARY_OUT, summary.map((row) => row.join(',')).join('\n'));
console.log('');
console.log(`✓ Summary written to ${SUMMARY_OUT}`);

const overflowRows = summary.slice(1).filter((r) => Number(r[6]) > 0);
const errorRows = summary.slice(1).filter((r) => Number(r[7]) > 0);
console.log(`✓ Total captures: ${summary.length - 1}`);
console.log(`⚠ Overflow detected on: ${overflowRows.length} captures`);
console.log(`⚠ Console errors on: ${errorRows.length} captures`);

#!/usr/bin/env node
/**
 * Diagnostic: for a given URL + viewport, list DOM elements that overflow
 * the document's clientWidth. Useful for pinpointing root causes of
 * horizontal-scroll incidents found in capture_summary.csv.
 *
 * Usage:
 *   node scripts/responsive-audit/find-overflow.mjs --url=/conduct --width=320
 *   node scripts/responsive-audit/find-overflow.mjs --url=/conduct,/governance --width=280
 */
import { chromium } from '@playwright/test';

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const urls = (args.get('url') || '/').split(',');
const width = Number(args.get('width') || 320);
const height = Number(args.get('height') || 568);
const baseUrl = args.get('base') || 'http://localhost:4321';
const isMobile = width < 768;

const browser = await chromium.launch();

for (const path of urls) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    isMobile,
    hasTouch: isMobile,
  });
  const page = await ctx.newPage();
  await page.goto(baseUrl + path, { waitUntil: 'networkidle' });

  const offenders = await page.evaluate(() => {
    const items = [];
    const docW = document.documentElement.clientWidth;
    function walk(el) {
      const r = el.getBoundingClientRect();
      if (r.right > docW + 0.5) {
        items.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || '',
          cls: String(el.className || '').slice(0, 100),
          text: (el.innerText || '').slice(0, 80).replace(/\n/g, ' '),
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
      }
      for (const c of el.children) walk(c);
    }
    walk(document.body);
    return items.slice(0, 15);
  });

  console.log(`=== ${path} @ ${width}x${height} ===`);
  if (offenders.length === 0) console.log('  (no overflow detected)');
  for (const o of offenders) {
    const idStr = o.id ? `#${o.id}` : '';
    const clsStr = o.cls ? ` class="${o.cls}"` : '';
    const textStr = o.text ? `\n      text="${o.text}"` : '';
    console.log(
      `  <${o.tag}${idStr}${clsStr}> right=${o.right}px width=${o.width}px${textStr}`
    );
  }
  console.log('');
  await ctx.close();
}

await browser.close();

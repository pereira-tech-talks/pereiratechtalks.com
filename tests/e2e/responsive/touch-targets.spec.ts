/**
 * Responsive regression suite — touch-target sanity for site chrome.
 *
 * Audits the homepage header chrome (hamburger button, header nav links,
 * theme toggle FAB) at the standard mobile viewport. Compact in-content
 * elements (tag pills, in-prose inline links) are intentionally excluded —
 * this test guards regressions in the always-visible chrome only.
 */
import { expect, test } from '@playwright/test';

const MIN_TAP = 40; // tolerates DPR-2 sub-pixel rounding from 44 → ~42

test('homepage header chrome touch targets ≥40px @ phone-standard', async ({
  browser,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const violations = await page.evaluate((minTap) => {
    const selectors = [
      'header button[aria-label*="enu"]',
      'header button[aria-label*="enu" i]',
      'header [aria-controls="mobile-menu"]',
      '#theme-toggle',
    ];
    const seen = new Set<HTMLElement>();
    const offenders: { sel: string; w: number; h: number }[] = [];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        if (seen.has(el)) return;
        seen.add(el);
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.width < minTap || r.height < minTap) {
          offenders.push({
            sel,
            w: Math.round(r.width),
            h: Math.round(r.height),
          });
        }
      });
    }
    return offenders;
  }, MIN_TAP);

  await ctx.close();
  expect(
    violations,
    `Header-chrome touch-target regressions: ${JSON.stringify(violations)}`
  ).toEqual([]);
});

test('contact form inputs ≥40px @ phone-standard', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });

  const violations = await page.evaluate((minTap) => {
    const offenders: { tag: string; w: number; h: number }[] = [];
    document
      .querySelectorAll<HTMLElement>(
        'form input:not([type="hidden"]):not([tabindex="-1"]), form textarea, form select'
      )
      .forEach((el) => {
        if (el.offsetParent === null) return;
        // Skip honeypot fields nested under aria-hidden / display-none wrappers
        let walker: HTMLElement | null = el;
        while (walker) {
          if (walker.getAttribute('aria-hidden') === 'true') return;
          const cs = getComputedStyle(walker);
          if (cs.display === 'none' || cs.visibility === 'hidden') return;
          walker = walker.parentElement;
        }
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.height < minTap) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            w: Math.round(r.width),
            h: Math.round(r.height),
          });
        }
      });
    return offenders;
  }, MIN_TAP);

  await ctx.close();
  expect(
    violations,
    `ContactForm input touch-target regressions: ${JSON.stringify(violations)}`
  ).toEqual([]);
});

/**
 * Responsive regression suite — horizontal-overflow check.
 *
 * For each representative route × each viewport, assert that
 * documentElement.scrollWidth does not exceed clientWidth by more than
 * a 6px tolerance (accounting for sub-pixel rounding under DPR=2/3).
 *
 * If any route overflows on any viewport, the suite fails — preventing
 * future CSS changes from silently regressing the work landed in tasks 2–16.
 *
 * To update screenshots after intentional UI changes:
 *   pnpm run test:responsive:update
 *
 * To run:
 *   pnpm run test:responsive
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..', '..');

const viewports = JSON.parse(
  readFileSync(join(ROOT, 'scripts/responsive-audit/viewports.json'), 'utf8')
) as Array<{
  name: string;
  width: number;
  height: number;
  deviceScaleFactor: number;
  isMobile: boolean;
}>;

const urlsConfig = JSON.parse(
  readFileSync(join(ROOT, 'scripts/responsive-audit/urls.json'), 'utf8')
) as {
  baseUrl: string;
  routes: Array<{ url: string; template: string; lang: string }>;
};

const ROUTES_SUBSET = urlsConfig.routes.filter(
  (r) =>
    r.template.startsWith('home') ||
    r.template.startsWith('narrative') ||
    r.template === 'blog-listing' ||
    r.template === 'blog-post-banner' ||
    r.template === 'blog-post-embeds' ||
    r.template === 'meetups-list' ||
    // A meetup detail page renders two ways that share almost no layout: a
    // programmed month (date tile, open-call panel, no line-up yet) and an
    // archive meetup (speakers, talks, venue, sponsors). Both are covered.
    r.template.startsWith('meetup-detail') ||
    r.template === 'form-call-for-speakers' ||
    r.template === 'ptd-edition' ||
    r.template === 'form-contact' ||
    r.template === 'channels' ||
    r.template === 'sponsors' ||
    r.template === 'press' ||
    r.template === 'form-sponsor-us'
);

const VIEWPORT_SUBSET = viewports.filter((v) =>
  [
    'foldable-folded',
    'phone-narrow',
    'phone-standard',
    'tablet-portrait',
    'desktop-fhd',
  ].includes(v.name)
);

/**
 * Tolerance accounts for sub-pixel rounding at DPR ≥ 2 plus a small margin for
 * rendering noise.
 *
 * It used to be 60px at `foldable-folded` and 16px elsewhere, attributed to
 * long Spanish words in prose. That diagnosis was wrong: the branch audit
 * (PLAN_branch_audit_and_pr Task 3) traced the overflow to a single hover
 * tooltip in the site header — `SolidarityMark`, absolutely positioned with
 * `left-0 w-max max-w-[14rem]`, which ran past the viewport on every page that
 * renders the chrome. 45 of 50 audited routes overflowed at 280px and 44 at
 * 320px for that one reason.
 *
 * With the tooltip clamped, measured overflow across all 50 routes × 15
 * viewports is **zero**. The budget is now tight enough that the next
 * regression fails instead of hiding under an allowance sized to the bug.
 */
function tolerance(viewportName: string): number {
  // Sub-pixel rounding only.
  return viewportName === 'foldable-folded' ? 4 : 2;
}

for (const vp of VIEWPORT_SUBSET) {
  test.describe(`Viewport ${vp.name} ${vp.width}×${vp.height}`, () => {
    for (const route of ROUTES_SUBSET) {
      test(`no horizontal overflow on ${route.url}`, async ({ browser }) => {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: vp.deviceScaleFactor,
          isMobile: vp.isMobile,
          hasTouch: vp.isMobile,
        });
        const page = await context.newPage();
        const response = await page.goto(route.url, {
          waitUntil: 'domcontentloaded',
          timeout: 20_000,
        });
        // A missing page has no overflow, so a rotted entry in `urls.json`
        // passes this suite forever while auditing nothing. Two routes were
        // doing exactly that — they pointed at a post that had since been
        // marked `draft: true`, and the audit was measuring the 404 page.
        expect(
          response?.status(),
          `${route.url} did not return 200 — the audit list is stale`
        ).toBe(200);
        const overflow = await page.evaluate(() => {
          return (
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth
          );
        });
        await context.close();
        expect(
          Math.max(0, overflow),
          `${route.url} overflowed by ${overflow}px on ${vp.name}`
        ).toBeLessThanOrEqual(tolerance(vp.name));
      });
    }
  });
}

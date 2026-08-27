/**
 * The notification modal, at the widths people actually read it on.
 *
 * Nothing else covers it. It renders client-side inside `{#if openModalId}`,
 * so the static capture script — which screenshots server-rendered HTML —
 * never contains it, and no other spec in this directory opens it. Its layout
 * has therefore only ever been checked by eye, on screenshots.
 *
 * That is not a theoretical gap. The four-CTA grid in this modal was rebuilt
 * twice during the programming work: with `flex-wrap`, the lone item on a short
 * row stretched, so December's button rendered at twice the width of the other
 * three. A grid fixed it. This spec is what stops it coming back.
 *
 * Auto-open is deliberately skipped for lab user agents (so the hero cannot
 * steal LCP from Lighthouse), which makes this suite deterministic: we open the
 * modal the way a reader does, by clicking the bar.
 *
 * Part of PLAN_branch_audit_and_pr Task 3 (gap G3).
 */
import { expect, type Page, test } from '@playwright/test';

const NARROW = { width: 320, height: 720 };
const WIDE = { width: 1440, height: 900 };
/** Shortest realistic screen: a folded Galaxy Z Fold in landscape-ish height. */
const SHORT = { width: 360, height: 480 };

const bar = (page: Page) => page.getByTestId('top-notification-bar');
const dialog = (page: Page) => page.getByRole('dialog');

async function openModal(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const trigger = bar(page).getByRole('button').first();
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(dialog(page)).toBeVisible();
}

/** How far the page can be scrolled sideways. Zero is the only good answer. */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return Math.max(0, doc.scrollWidth - doc.clientWidth);
  });
}

test.describe('notification modal', () => {
  test('opens from the bar and closes on Escape, returning focus', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE);
    await openModal(page);

    await page.keyboard.press('Escape');
    await expect(dialog(page)).toBeHidden();

    // Focus belongs back on the control that opened the dialog, not on <body>.
    const focusedTag = await page.evaluate(
      () => document.activeElement?.tagName ?? ''
    );
    expect(focusedTag).not.toBe('BODY');
  });

  test('is labelled, modal, and closable by an explicitly named control', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE);
    await openModal(page);

    const d = dialog(page);
    await expect(d).toHaveAttribute('aria-modal', 'true');
    await expect(d).toHaveAttribute('aria-labelledby', /notify-title-/);
    await expect(d).toHaveAttribute('aria-describedby', /notify-desc-/);

    // The close control carries a real accessible name — it is an icon-only
    // button, so without one it is unusable by anyone not looking at it.
    const close = d.getByRole('button').first();
    const name = await close.getAttribute('aria-label');
    expect(name?.trim().length ?? 0).toBeGreaterThan(0);

    await close.click();
    await expect(d).toBeHidden();
  });

  for (const [name, size] of [
    ['narrow', NARROW],
    ['wide', WIDE],
  ] as const) {
    test(`adds no horizontal overflow at ${name}`, async ({ page }) => {
      await page.setViewportSize(size);
      await openModal(page);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });

    test(`every month CTA is the same width at ${name}`, async ({ page }) => {
      await page.setViewportSize(size);
      await openModal(page);

      // The month links, not the primary CTA below them: they share one grid.
      const ctas = dialog(page).locator('div.grid a');
      const count = await ctas.count();
      expect(count).toBeGreaterThan(1);

      const widths: number[] = [];
      for (let i = 0; i < count; i++) {
        const box = await ctas.nth(i).boundingBox();
        expect(box).not.toBeNull();
        widths.push(Math.round(box?.width ?? 0));
      }

      // This is the regression. A stretched last item was ~2x its siblings;
      // a 1px tolerance covers sub-pixel grid rounding and nothing else.
      const min = Math.min(...widths);
      const max = Math.max(...widths);
      expect(max - min, `CTA widths: ${widths.join(', ')}`).toBeLessThanOrEqual(
        1
      );
    });

    test(`every CTA clears the 44px touch target at ${name}`, async ({
      page,
    }) => {
      await page.setViewportSize(size);
      await openModal(page);

      const links = dialog(page).getByRole('link');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const box = await links.nth(i).boundingBox();
        expect(box, `link ${i} has no box`).not.toBeNull();
        expect(
          Math.round(box?.height ?? 0),
          `link ${i} is ${box?.height}px tall`
        ).toBeGreaterThanOrEqual(44);
      }
    });
  }

  test('stays inside a short viewport and keeps its actions reachable', async ({
    page,
  }) => {
    await page.setViewportSize(SHORT);
    await openModal(page);

    const d = dialog(page);
    const box = await d.boundingBox();
    expect(box).not.toBeNull();

    // The dialog itself must fit; its body scrolls internally. A dialog taller
    // than the screen puts the CTAs somewhere the reader cannot reach.
    expect(Math.round(box?.height ?? 0)).toBeLessThanOrEqual(SHORT.height);

    // And the last action is on screen, not below the fold of the dialog.
    const lastLink = d.getByRole('link').last();
    await expect(lastLink).toBeInViewport();
  });
});

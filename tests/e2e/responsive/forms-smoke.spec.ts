/**
 * Smoke: CFS + Sponsor form controls are present and touch-sized @ phone.
 */
import { expect, test } from '@playwright/test';

const MIN = 40;

test('CFS form fields render @ phone-standard', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto('/call-for-speakers', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#cfs-form')).toBeVisible();
  await expect(page.locator('#cfs-name')).toBeVisible();
  const box = await page.locator('#cfs-name').boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(MIN);
  await ctx.close();
});

test('Sponsor form fields render @ phone-standard', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto('/sponsor-us', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#sponsor-form')).toBeVisible();
  await expect(page.locator('#sponsor-name')).toBeVisible();
  const box = await page.locator('#sponsor-name').boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(MIN);
  await ctx.close();
});

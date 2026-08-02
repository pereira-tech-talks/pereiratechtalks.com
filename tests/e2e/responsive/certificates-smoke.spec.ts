/**
 * Smoke: diploma page renders + action buttons are touch-sized @ phone.
 */
import { expect, test } from '@playwright/test';

const DEMO_ID = 'ptd26_demo_a7k3m9qx';
const DIPLOMA = `/pereira-tech-days/2026/certificates/${DEMO_ID}`;
const MIN = 40;

test('diploma page renders @ phone-standard', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(DIPLOMA, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-testid="diploma-document"]')).toBeVisible();
  await expect(
    page.locator('[data-testid="certificate-actions"]')
  ).toBeVisible();
  const printBtn = page.locator('[data-testid="cert-action-print"]');
  await expect(printBtn).toBeVisible();
  const box = await printBtn.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(MIN);
  await ctx.close();
});

test('verify page shows valid status for demo id', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(`/certificates/verify?id=${DEMO_ID}`, {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator('[data-testid="verify-result"]')).toBeVisible();
  await expect(page.locator('[data-testid="verify-result"]')).toHaveAttribute(
    'data-valid',
    'true'
  );
  await ctx.close();
});

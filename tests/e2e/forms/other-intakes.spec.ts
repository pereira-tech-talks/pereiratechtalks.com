/**
 * The other five intake forms, checked for the same two things the Call for
 * Speakers suite checks in depth: that required fields are actually enforced,
 * and that a complete submission puts the right shape on the wire.
 *
 * Deliberately shallower than `cfs-form.spec.ts`. The Call for Speakers form is
 * where this branch changed things; these five are here so the audit covers
 * every intake rather than only the interesting one, and so a shared change to
 * `contact-form.ts` cannot quietly break four forms while one stays green.
 *
 * `/api/contact` is intercepted — see the note in `cfs-form.spec.ts`.
 *
 * Part of PLAN_branch_audit_and_pr Task 4.
 */
import { expect, type Page, test } from '@playwright/test';

type Captured = Array<Record<string, unknown>>;

async function stubIntake(page: Page): Promise<Captured> {
  const captured: Captured = [];
  await page.route('**/api/contact', async (route) => {
    captured.push(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, recordUuid: 'stub' }),
    });
  });
  return captured;
}

/** See `cfs-form.spec.ts` — the notification modal intercepts clicks. */
async function open(page: Page, path: string, anchorId: string) {
  await page.addInitScript(() => {
    try {
      for (const lang of ['es', 'en'])
        sessionStorage.setItem(`ptt:notify-auto:cfs-open-2026:${lang}`, '1');
    } catch {
      // Blocked storage: the component skips auto-open anyway.
    }
  });
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const anchor = page.locator(`#${anchorId}`);
  await anchor.scrollIntoViewIfNeeded();
  await expect(anchor).toBeVisible();
  await page.waitForFunction((id) => {
    const island = document.getElementById(id)?.closest('astro-island');
    return !!island && !island.hasAttribute('ssr');
  }, anchorId);
}

const FORMS = [
  {
    label: 'Contact',
    path: '/contact',
    anchor: 'contact-name',
    fill: {
      'contact-name': '[TEST] Ada',
      'contact-email': 'test@example.com',
      'contact-subject': '[TEST] Subject',
      'contact-message': '[TEST] A message long enough to pass validation.',
    },
    formType: 'contact',
  },
  {
    label: 'Sponsor inquiry',
    path: '/sponsor-us',
    anchor: 'sponsor-name',
    fill: {
      'sponsor-name': '[TEST] Ada',
      'sponsor-email': 'test@example.com',
      'sponsor-company': '[TEST] Acme',
      'sponsor-role': 'CMO',
      'sponsor-message': '[TEST] We would like to support Pereira Tech Day.',
    },
    formType: 'sponsor',
  },
] as const;

for (const form of FORMS) {
  test.describe(form.label, () => {
    test('refuses an empty submit and says which fields are missing', async ({
      page,
    }) => {
      const sent = await stubIntake(page);
      await open(page, form.path, form.anchor);
      await page
        .locator('form')
        .filter({ has: page.locator(`#${form.anchor}`) })
        .getByRole('button', { type: 'submit' })
        .click();

      const invalid = await page.$$eval('[aria-invalid="true"]', (els) =>
        els.map((e) => e.id).filter(Boolean)
      );
      expect(invalid.length).toBeGreaterThan(0);
      expect(invalid).toContain(form.anchor);
      expect(sent, 'nothing may reach the server').toHaveLength(0);
    });

    test('a complete submission reports success and sends its own form type', async ({
      page,
    }) => {
      const sent = await stubIntake(page);
      await open(page, form.path, form.anchor);
      for (const [id, value] of Object.entries(form.fill)) {
        await page.fill(`#${id}`, value);
      }
      const scope = page
        .locator('form')
        .filter({ has: page.locator(`#${form.anchor}`) });
      // Selects and radios differ per form; choose the first real option of any
      // required select rather than hard-coding values that will drift.
      for (const select of await scope.locator('select').all()) {
        const values = await select
          .locator('option')
          .evaluateAll((os) =>
            os
              .map((o) => (o as HTMLOptionElement).value)
              .filter((v) => v !== '')
          );
        if (values.length > 0) await select.selectOption(values[0]);
      }
      await scope.getByRole('button', { type: 'submit' }).click();

      await expect(page.getByRole('status')).toBeVisible({ timeout: 10_000 });
      expect(sent).toHaveLength(1);
      expect(sent[0]._form).toBe(form.formType);
      // The honeypot must always travel empty, or every submission is spam.
      expect(sent[0].website ?? '').toBe('');
    });
  });
}

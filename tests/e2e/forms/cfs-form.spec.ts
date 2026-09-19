/**
 * The Call for Speakers form, driven the way a speaker drives it.
 *
 * Before this suite, the form had been verified from both ends and never
 * through the middle: `tests/unit/functions/contact-dailybot.test.ts` calls the
 * Pages Function directly, and `tests/e2e/responsive/forms-smoke.spec.ts`
 * checks that the controls render without overflowing. Nothing had ever filled
 * a field, triggered a validation error, or pressed submit.
 *
 * `/api/contact` is a Cloudflare Pages Function, which `astro preview` does not
 * serve, so the request is intercepted here. That is deliberate rather than a
 * compromise: this suite is about the browser half — what the speaker sees,
 * what the form refuses, and **what it puts on the wire**. Delivery into
 * Dailybot is proven separately, against a real Wrangler server, and recorded
 * in `analysis_results/FORMS_AUDIT.md`.
 *
 * Part of PLAN_branch_audit_and_pr Task 4 (gap G4).
 */
import { readFileSync } from 'node:fs';

import { expect, type Locator, type Page, test } from '@playwright/test';

/**
 * The sitewide notification modal auto-opens on a first visit, sits over the
 * page, and intercepts every click until it is dismissed. Its lab-browser guard
 * only recognises Lighthouse user agents, so Playwright — correctly, since a
 * real visitor sees exactly this — gets the modal.
 *
 * It cannot simply be dismissed at the start of a test: the open is deferred
 * until after LCP settles, so it can appear *mid-test*, several actions in.
 * Instead the session flag the component itself checks is pre-set, which is the
 * same state a reader is in on their second navigation. That exercises the real
 * code path rather than disabling it.
 *
 * The modal's own behaviour is covered by
 * `tests/e2e/responsive/notification-modal.spec.ts`.
 */
async function quietTheNotificationModal(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      for (const lang of ['es', 'en']) {
        for (const id of ['cfs-open-2026']) {
          sessionStorage.setItem(`ptt:notify-auto:${id}:${lang}`, '1');
        }
      }
    } catch {
      // Blocked storage: the component skips auto-open anyway.
    }
  });
}

/**
 * Land on a page with the form visible, hydrated, and nothing on top of it.
 *
 * The form is a `client:visible` island, so the server-rendered markup is
 * interactive-looking before Svelte has taken over. Playwright's actionability
 * checks know nothing about hydration, so typing into a field a few
 * milliseconds early is silently discarded — which is exactly the intermittent
 * failure this waits out. Astro drops the `ssr` attribute from `<astro-island>`
 * once the component is live, so that is the signal.
 */
async function openForm(page: Page, path: string): Promise<void> {
  await quietTheNotificationModal(page);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.locator('#cfs-title').scrollIntoViewIfNeeded();
  await expect(page.locator('#cfs-title')).toBeVisible();
  await page.waitForFunction(() => {
    const island = document
      .querySelector('#cfs-title')
      ?.closest('astro-island');
    return !!island && !island.hasAttribute('ssr');
  });
  await expect(page.getByRole('dialog')).toHaveCount(0);
}

/**
 * The calls that are open *today*, read from the build the preview server is
 * about to serve.
 *
 * Naming a meetup here instead is a time bomb with a printed fuse: a call
 * auto-closes once its `closesAt` or the meetup date passes, so a suite pinned
 * to `september-meetup-2026` passes every day until 18 September 2026 and then
 * fails every day after, on a branch that changed nothing. That is exactly what
 * happened. `/api/cfs-open.json` is the same source the form itself renders
 * from, so deriving from it keeps the test and the page describing one world.
 */
type OpenCall = {
  slug: string;
  formats: string[];
  title: { en: string; es: string };
};

function readOpenCalls(): OpenCall[] {
  const at = new URL('../../../dist/api/cfs-open.json', import.meta.url);
  let raw: string;
  try {
    raw = readFileSync(at, 'utf8');
  } catch {
    throw new Error(
      `Cannot read ${at.pathname}. This suite runs against the built site — run \`pnpm run build\` first.`
    );
  }
  const calls = (JSON.parse(raw) as { calls?: OpenCall[] }).calls ?? [];
  if (calls.length === 0) {
    throw new Error(
      'No call for speakers is open, so the form has nothing to offer. Open one in src/content/meetups/, or retire this suite.'
    );
  }
  return calls;
}

const OPEN = readOpenCalls();

/** The call the meetup-scoped route is exercised against. */
const SCOPED = OPEN[0];

/**
 * A call that accepts exactly one format, for the branch that states the format
 * as a sentence instead of rendering a one-option select. Content decides
 * whether such a call is open, so the test that needs it skips when none is —
 * an honest skip beats a green assertion about a page nobody can reach.
 */
const SINGLE_FORMAT = OPEN.find((c) => c.formats.length === 1);

/** A proposal that should pass every rule. */
const GOOD = {
  name: '[TEST] Ada Lovelace',
  email: 'test-cfs@example.com',
  talkTitle: '[TEST] Compilers in production',
  abstract:
    '[TEST] A short, concrete tour of how we ship a compiler every single week.',
  takeaways: '[TEST] How to stage a risky release',
  slides: 'https://slides.example.com/test/deck',
  social: 'https://example.com/test-ada',
};

/** Requests the page actually sent to the intake endpoint. */
type Captured = Array<Record<string, unknown>>;

async function stubIntake(page: Page): Promise<Captured> {
  const captured: Captured = [];
  await page.route('**/api/contact', async (route) => {
    const body = route.request().postDataJSON() as Record<string, unknown>;
    captured.push(body);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, recordUuid: 'stub', formType: 'cfs' }),
    });
  });
  return captured;
}

const form = (page: Page): Locator =>
  page.locator('form').filter({
    has: page.locator('#cfs-title'),
  });
const submit = (page: Page): Locator =>
  form(page).getByRole('button', { type: 'submit' });

async function fillAll(page: Page, over: Partial<typeof GOOD> = {}) {
  const v = { ...GOOD, ...over };
  await page.fill('#cfs-name', v.name);
  await page.fill('#cfs-email', v.email);
  await page.fill('#cfs-title', v.talkTitle);
  await page.fill('#cfs-abstract', v.abstract);
  await page.fill('#cfs-takeaways', v.takeaways);
  await page.fill('#cfs-slides', v.slides);
  await page.fill('#cfs-social', v.social);
  // The format select is absent when the meetup accepts exactly one format —
  // it is stated as a sentence instead, which is the point of that branch.
  // When it is present, take whatever it actually offers: which formats a
  // meetup accepts is content, and hardcoding one here is the same time bomb
  // as hardcoding a slug.
  const select = page.locator('#cfs-format');
  if (await select.count()) {
    const first = await select
      .locator('option')
      .evaluateAll((os) =>
        os.map((o) => (o as HTMLOptionElement).value).find((v) => v !== '')
      );
    if (first) await select.selectOption(first);
  }
}

/** Ids of every control the form marks invalid. */
async function invalidIds(page: Page): Promise<string[]> {
  return page.$$eval('[aria-invalid="true"]', (els) =>
    els.map((e) => e.id).filter(Boolean)
  );
}

for (const [label, path] of [
  ['global', '/call-for-speakers'],
  ['meetup-scoped', `/meetups/${SCOPED.slug}`],
  ['global (en)', '/en/call-for-speakers'],
] as const) {
  test.describe(`Call for Speakers — ${label}`, () => {
    test.beforeEach(async ({ page }) => {
      await openForm(page, path);
    });

    test('an empty submit flags every required field, slides included', async ({
      page,
    }) => {
      await stubIntake(page);
      await submit(page).click();

      const invalid = await invalidIds(page);
      expect(invalid).toContain('cfs-name');
      expect(invalid).toContain('cfs-email');
      expect(invalid).toContain('cfs-title');
      expect(invalid).toContain('cfs-abstract');
      expect(invalid).toContain('cfs-takeaways');
      expect(invalid).toContain('cfs-social');
      // The rule this task added. Its absence is the regression to catch.
      expect(invalid, 'the slides link must be required').toContain(
        'cfs-slides'
      );
    });

    test('an empty submit moves focus to the first invalid field', async ({
      page,
    }) => {
      await stubIntake(page);
      await submit(page).click();
      await expect(page.locator('#cfs-name')).toBeFocused();
    });

    test('each error clears as its own field is fixed', async ({ page }) => {
      await stubIntake(page);
      await submit(page).click();
      expect(await invalidIds(page)).toContain('cfs-slides');

      await fillAll(page);
      await submit(page).click();
      expect(await invalidIds(page)).toEqual([]);
    });

    test('a malformed email is refused', async ({ page }) => {
      await stubIntake(page);
      await fillAll(page, { email: 'not-an-email' });
      await submit(page).click();
      expect(await invalidIds(page)).toContain('cfs-email');
    });

    for (const bad of [
      'not-a-url',
      'javascript:alert(1)',
      'ftp://example.com/deck.pdf',
      'todavía no las tengo',
    ]) {
      test(`a slides value of ${JSON.stringify(bad)} is refused`, async ({
        page,
      }) => {
        const sent = await stubIntake(page);
        await fillAll(page, { slides: bad });
        await submit(page).click();

        expect(await invalidIds(page)).toContain('cfs-slides');
        // And nothing was sent — the browser must not have to be trusted, but
        // it must also not waste the speaker's submission.
        expect(sent).toHaveLength(0);

        const error = page.locator('#cfs-slides-error');
        await expect(error).toBeVisible();
        expect((await error.innerText()).trim().length).toBeGreaterThan(0);
      });
    }

    test('a complete proposal submits and reports success', async ({
      page,
    }) => {
      const sent = await stubIntake(page);
      await fillAll(page);
      await submit(page).click();

      await expect(page.getByRole('status')).toBeVisible({ timeout: 10_000 });
      expect(sent).toHaveLength(1);
      expect(sent[0]).toMatchObject({
        _form: 'cfs',
        name: GOOD.name,
        email: GOOD.email,
        talkTitle: GOOD.talkTitle,
        slidesUrl: GOOD.slides,
        socialUrl: GOOD.social,
      });
    });

    test('locks the submit control while the request is in flight', async ({
      page,
    }) => {
      // A slow response makes the in-flight window observable. Without it the
      // stub resolves in the same tick and there is nothing to catch.
      const sent: Array<Record<string, unknown>> = [];
      let release: (() => void) | undefined;
      const held = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route('**/api/contact', async (route) => {
        sent.push(route.request().postDataJSON() as Record<string, unknown>);
        await held;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, recordUuid: 'stub' }),
        });
      });

      await fillAll(page);
      const button = submit(page);
      await button.click();

      // Disabled while submitting, so a second click cannot create a second
      // proposal — a real risk on a slow connection, where nothing visible
      // happens for a second or two.
      await expect(button).toBeDisabled();
      expect(sent).toHaveLength(1);

      release?.();
      await expect(page.getByRole('status')).toBeVisible({ timeout: 10_000 });
      expect(sent).toHaveLength(1);
    });
  });
}

test.describe('meetup-scoped mode', () => {
  test('states the meetup and tags the submission with it', async ({
    page,
  }) => {
    const sent = await stubIntake(page);
    await openForm(page, `/meetups/${SCOPED.slug}`);

    await fillAll(page);
    await submit(page).click();
    await expect(page.getByRole('status')).toBeVisible({ timeout: 10_000 });

    // The whole reason the field exists.
    expect(sent[0]).toMatchObject({ meetupSlug: SCOPED.slug });
  });

  test('a single-format meetup states the format instead of offering a select', async ({
    page,
  }) => {
    test.skip(
      !SINGLE_FORMAT,
      'no open call accepts exactly one format right now'
    );
    await openForm(page, `/meetups/${SINGLE_FORMAT?.slug}`);
    // A select with one real option is a worse experience than a sentence.
    await expect(page.locator('#cfs-format')).toHaveCount(0);
  });
});

test.describe('global mode', () => {
  test('offers the open calls and narrows the formats to the one chosen', async ({
    page,
  }) => {
    const sent = await stubIntake(page);
    await openForm(page, '/call-for-speakers');

    const selector = page.locator('#cfs-meetup');
    await expect(selector).toBeVisible();
    const values = await selector
      .locator('option')
      .evaluateAll((os) => os.map((o) => (o as HTMLOptionElement).value));
    // Every call the site publishes as open must be offered here, and nothing
    // else: a select that has drifted from /api/cfs-open.json either hides a
    // call speakers can still answer, or invites a proposal to one that closed.
    expect(values.filter((v) => v !== '').sort()).toEqual(
      OPEN.map((c) => c.slug).sort()
    );

    await selector.selectOption(SCOPED.slug);
    await fillAll(page);
    await submit(page).click();
    await expect(page.getByRole('status')).toBeVisible({ timeout: 10_000 });
    expect(sent[0]).toMatchObject({ meetupSlug: SCOPED.slug });
  });

  test('still accepts a proposal with no meetup chosen', async ({ page }) => {
    const sent = await stubIntake(page);
    await openForm(page, '/call-for-speakers');

    await fillAll(page);
    await submit(page).click();
    await expect(page.getByRole('status')).toBeVisible({ timeout: 10_000 });
    expect(sent).toHaveLength(1);
    expect(sent[0].meetupSlug ?? '').toBe('');
  });
});

test.describe('accessibility of the form', () => {
  test('every control has an associated label', async ({ page }) => {
    await openForm(page, '/call-for-speakers');

    const unlabelled = await page.$$eval(
      'form input:not([type="hidden"]), form select, form textarea',
      (els) =>
        els
          .filter((el) => {
            const id = el.id;
            const hasLabel = id
              ? !!document.querySelector(`label[for="${CSS.escape(id)}"]`)
              : false;
            const wrapped = !!el.closest('label');
            const aria =
              el.getAttribute('aria-label') ||
              el.getAttribute('aria-labelledby');
            return !hasLabel && !wrapped && !aria;
          })
          .map((el) => el.id || el.getAttribute('name') || el.tagName)
    );
    // The honeypot is deliberately unlabelled and hidden from humans.
    expect(unlabelled.filter((n) => n !== 'website')).toEqual([]);
  });

  test('the error message is wired to its field via aria-describedby', async ({
    page,
  }) => {
    await stubIntake(page);
    await openForm(page, '/call-for-speakers');
    await submit(page).click();

    const described = await page
      .locator('#cfs-slides')
      .getAttribute('aria-describedby');
    expect(described).toContain('cfs-slides-error');
    expect(described, 'the help text must stay reachable too').toContain(
      'cfs-slides-help'
    );
  });
});

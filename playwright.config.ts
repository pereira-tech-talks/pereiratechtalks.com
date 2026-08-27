import { defineConfig } from '@playwright/test';

// Prefer corepack so CI runners (which invoke `corepack pnpm …` and may not
// have a bare `pnpm` shim on PATH) can still spawn the preview server.
const pnpm = process.env.CI ? 'corepack pnpm' : 'pnpm';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    // Not `astro preview`: in Astro 7.2.x the CLI starts a background daemon and
    // the foreground process exits 0 immediately, which Playwright reports as
    // "Process from config.webServer exited early" before running a single
    // test. `scripts/preview-server.mjs` uses Astro's programmatic `preview()`
    // and holds it open — same routing, no daemon.
    command: `${pnpm} exec node scripts/preview-server.mjs --port 4321`,
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
});

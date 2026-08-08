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
    // Use `exec astro preview` (not `run astro:preview --port`) so the port
    // flag reaches Astro reliably under pnpm.
    command: `${pnpm} exec astro preview --port 4321`,
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

#!/usr/bin/env node
/**
 * A foreground preview server for the Playwright suites.
 *
 * `astro preview` (Astro 7.2.x) starts the server as a **background daemon** and
 * the foreground process exits 0 immediately — it prints "Preview server
 * running … Stop: astro preview stop" and returns. Playwright's `webServer`
 * reads that as `Process from config.webServer exited early` and aborts the
 * run before a single test executes.
 *
 * Locally that was invisible: `reuseExistingServer` picks up the daemon a
 * previous attempt left behind, so the second run always works and the first is
 * written off as a fluke. On a cold machine with nothing listening it fails
 * every time.
 *
 * Astro's programmatic `preview()` returns a server we can hold open, with
 * exactly the same routing as the CLI — same trailing-slash handling, same 404
 * page. So this is the CLI's own behaviour, minus the daemon.
 *
 * Usage: node scripts/preview-server.mjs [--port 4321]
 */
import { preview } from 'astro';

const args = process.argv.slice(2);
const portFlag = args.indexOf('--port');
const port = portFlag === -1 ? 4321 : Number(args[portFlag + 1]);

if (!Number.isInteger(port) || port <= 0) {
  console.error(`preview-server: invalid port "${args[portFlag + 1]}"`);
  process.exit(1);
}

const server = await preview({
  server: { port, host: false },
  logLevel: 'error',
});

console.log(`Preview server listening on http://localhost:${port}/`);

const shutdown = async () => {
  await server.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Hold the process open. `closed()` resolves only when the server stops, which
// is the whole point: Playwright must see a live child process.
await server.closed();

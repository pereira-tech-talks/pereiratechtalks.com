/**
 * Reads the build-time open-calls manifest (`/api/cfs-open.json`) so the intake
 * function can check a client-supplied `meetupSlug` against it.
 *
 * Three deliberate properties:
 *
 * 1. **Same-origin by construction.** The URL is derived from the incoming
 *    `request.url`, never from anything in the request body, so no caller can
 *    point this fetch at a host of their choosing. It also means the function
 *    works unchanged in production, in a preview deploy, and under
 *    `wrangler pages dev` with no configuration.
 * 2. **Bounded.** An `AbortController` caps the wait. A slow or hanging origin
 *    must never hold a speaker's submission open.
 * 3. **Never throws.** Every failure returns `null`. Availability of a JSON file
 *    is our problem, not the submitter's — the caller proceeds without the
 *    meetup tag rather than losing the proposal. See `docs/features/FORMS.md`.
 */

export interface OpenCallEntry {
  slug: string;
  url: string;
  title: { en: string; es: string };
  date: string;
  dateConfidence: string;
  formats: string[];
  closesAt?: string;
  slots?: number;
}

export interface CfsOpenManifest {
  version: number;
  generatedAt: string;
  calls: OpenCallEntry[];
}

const FETCH_TIMEOUT_MS = 3000;

/**
 * Isolate-local cache, the same shape the rate limiter already uses for its
 * `Map`. A Cloudflare isolate is short-lived, so this is a burst cache, not a
 * correctness-critical store: a stale entry can at worst tag a submission with
 * a meetup that closed in the last minute.
 */
const CACHE_TTL_MS = 60_000;
let cached: { at: number; manifest: CfsOpenManifest } | null = null;

/** Test seam — reset the isolate cache between cases. */
export function resetCfsManifestCache(): void {
  cached = null;
}

function isManifest(value: unknown): value is CfsOpenManifest {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { calls?: unknown };
  return Array.isArray(candidate.calls);
}

export async function fetchCfsOpenManifest(
  requestUrl: string,
  now: number = Date.now()
): Promise<CfsOpenManifest | null> {
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.manifest;

  let url: string;
  try {
    url = new URL('/api/cfs-open.json', requestUrl).toString();
  } catch {
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const parsed: unknown = await response.json();
    if (!isManifest(parsed)) return null;
    cached = { at: now, manifest: parsed };
    return parsed;
  } catch {
    // Network error, timeout, or malformed JSON. Never surfaces to the caller.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * A conservative slug shape, checked before the value is used anywhere —
 * including before it reaches a log line.
 */
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;

export function isWellFormedMeetupSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function findOpenCall(
  manifest: CfsOpenManifest,
  slug: string
): OpenCallEntry | undefined {
  return manifest.calls.find((call) => call.slug === slug);
}

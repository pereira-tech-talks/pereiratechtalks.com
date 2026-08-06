/**
 * Shared Umami first-party proxy helpers for Cloudflare Pages Functions.
 * Forwards script.js and api/send to Umami Cloud with method allowlist.
 */

export const UMAMI_CLOUD_ORIGIN = 'https://cloud.umami.is';

/** Paths allowed through the first-party proxy (no arbitrary forwarding). */
export const ALLOWED_UMAMI_PATHS = new Set(['script.js', 'api/send']);

export function isAllowedUmamiPath(path: string): boolean {
  return ALLOWED_UMAMI_PATHS.has(path);
}

/** Normalize Cloudflare Pages `[[path]]` params (string | string[] | undefined). */
export function resolveUmamiPath(raw: string | string[] | undefined): string {
  const joined = Array.isArray(raw) ? raw.join('/') : (raw ?? 'script.js');
  return String(joined).replace(/^\/+/, '');
}

export function buildUmamiUpstreamUrl(path: string): string {
  return `${UMAMI_CLOUD_ORIGIN}/${path}`;
}

/** Headers forwarded to Umami for geo / device attribution. */
export function buildUmamiProxyRequestHeaders(request: Request): Headers {
  const headers = new Headers();
  const contentType = request.headers.get('Content-Type');
  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  const clientIp = request.headers.get('CF-Connecting-IP');
  if (clientIp) {
    headers.set('x-forwarded-for', clientIp);
  }

  const userAgent = request.headers.get('User-Agent');
  if (userAgent) {
    headers.set('User-Agent', userAgent);
  }

  return headers;
}

export function getUmamiProxyCacheControl(path: string): string {
  return path === 'script.js'
    ? 'public, max-age=86400, stale-while-revalidate=604800'
    : 'no-store';
}

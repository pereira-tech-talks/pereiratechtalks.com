export interface ParsedLumaEvent {
  /** Public event page URL (as published on Luma). */
  viewUrl: string;
  /** Slug or evt-… id for checkout embed. */
  eventId: string;
}

/** Parse a Luma event URL from frontmatter (e.g. https://luma.com/q087gp2d). */
export function parseLumaEventUrl(url: string): ParsedLumaEvent {
  const trimmed = url.trim();
  const withProtocol = trimmed.startsWith('http')
    ? trimmed
    : `https://luma.com/${trimmed}`;
  const parsed = new URL(withProtocol);

  const parts = parsed.pathname.split('/').filter(Boolean);
  const eventId = parts[0] === 'event' ? parts[1] : parts[0];

  if (!eventId) {
    throw new Error(`Invalid Luma event URL: ${url}`);
  }

  const viewUrl =
    parts[0] === 'event'
      ? `https://luma.com/event/${eventId}`
      : `https://luma.com/${eventId}`;

  return { viewUrl, eventId };
}

export function getLumaCheckoutHref(eventId: string): string {
  return eventId.startsWith('evt-')
    ? `https://luma.com/event/${eventId}`
    : `https://luma.com/${eventId}`;
}

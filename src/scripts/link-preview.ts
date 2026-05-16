const HOVER_DELAY_MS = 1000;
const HIDE_DELAY_MS = 400;

const cache = new Map<string, Awaited<ReturnType<typeof resolvePreview>>>();

let hoverTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let activeAnchor: HTMLAnchorElement | null = null;
let requestId = 0;
let abortController: AbortController | null = null;

function getPopup() {
  return document.getElementById('link-preview');
}

function getPopupElements(popup: HTMLElement) {
  return {
    media: popup.querySelector<HTMLElement>('.link-preview__media'),
    imageEl: popup.querySelector<HTMLImageElement>('.link-preview__image'),
    loadingEl: popup.querySelector<HTMLElement>('.link-preview__loading'),
    siteEl: popup.querySelector<HTMLElement>('.link-preview__site'),
    titleEl: popup.querySelector<HTMLElement>('.link-preview__title'),
    descriptionEl: popup.querySelector<HTMLElement>(
      '.link-preview__description',
    ),
  };
}

function resetPopup(popup: HTMLElement) {
  const { media, imageEl, loadingEl, siteEl, titleEl, descriptionEl } =
    getPopupElements(popup);
  if (!loadingEl || !siteEl || !titleEl || !descriptionEl) return;

  loadingEl.hidden = false;
  siteEl.hidden = true;
  titleEl.hidden = true;
  descriptionEl.hidden = true;
  if (media) media.hidden = true;
  siteEl.textContent = '';
  titleEl.textContent = '';
  descriptionEl.textContent = '';
  if (imageEl) imageEl.removeAttribute('src');
}

function showPopupElement(popup: HTMLElement) {
  popup.removeAttribute('hidden');
  popup.setAttribute('aria-hidden', 'false');
}

function hidePopup() {
  const popup = getPopup();
  if (!popup) return;
  popup.hidden = true;
  popup.setAttribute('aria-hidden', 'true');
  resetPopup(popup);
}

function positionPopup(popup: HTMLElement, anchor: HTMLAnchorElement) {
  const rect = anchor.getBoundingClientRect();
  showPopupElement(popup);

  const popupWidth = popup.offsetWidth || 320;
  const popupHeight = popup.offsetHeight || 160;
  const margin = 12;
  const gap = 6;

  let top = rect.bottom + gap;
  let left = rect.left + rect.width / 2 - popupWidth / 2;

  if (left < margin) left = margin;
  if (left + popupWidth > window.innerWidth - margin) {
    left = window.innerWidth - popupWidth - margin;
  }
  if (top + popupHeight > window.innerHeight - margin) {
    top = rect.top - popupHeight - gap;
  }

  popup.style.top = `${Math.max(margin, top)}px`;
  popup.style.left = `${Math.max(margin, left)}px`;
}

function fillPopup(
  popup: HTMLElement,
  data: {
    site?: string;
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  },
) {
  const { media, imageEl, loadingEl, siteEl, titleEl, descriptionEl } =
    getPopupElements(popup);
  if (!loadingEl || !siteEl || !titleEl || !descriptionEl) return;

  loadingEl.hidden = true;

  const title = data.title || data.site || data.url || '';
  const description = data.description || '';

  if (data.site) {
    siteEl.textContent = data.site;
    siteEl.hidden = false;
  }

  titleEl.textContent = title;
  titleEl.hidden = false;

  if (description && description !== title) {
    descriptionEl.textContent = description;
    descriptionEl.hidden = false;
  }

  if (data.image && imageEl) {
    imageEl.src = data.image;
    imageEl.alt = title;
    if (media) media.hidden = false;
  }
}

function parseHtmlPreview(html: string, url: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const title =
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
    doc.querySelector('title')?.textContent?.trim() ||
    '';
  const description =
    doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
    doc
      .querySelector('meta[property="og:description"]')
      ?.getAttribute('content') ||
    '';
  let image =
    doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
    '';

  if (image) {
    try {
      image = new URL(image, url).href;
    } catch {
      image = '';
    }
  }

  return {
    site: new URL(url).hostname.replace(/^www\./, ''),
    title,
    description,
    image,
    url,
  };
}

function externalFallback(url: string) {
  let hostname = url;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    /* keep url */
  }
  return {
    site: hostname,
    title: hostname,
    description: url,
    image: '',
    url,
  };
}

async function resolvePreview(url: string) {
  const cached = cache.get(url);
  if (cached) return cached;

  let parsed: URL;
  try {
    parsed = new URL(url, window.location.origin);
  } catch {
    const data = externalFallback(url);
    cache.set(url, data);
    return data;
  }

  if (parsed.origin === window.location.origin) {
    try {
      const response = await fetch(parsed.href, {
        credentials: 'same-origin',
        headers: { Accept: 'text/html' },
      });
      if (response.ok) {
        const html = await response.text();
        const data = parseHtmlPreview(html, parsed.href);
        cache.set(url, data);
        return data;
      }
    } catch {
      /* fallback */
    }
  }

  const data = externalFallback(parsed.href);
  cache.set(url, data);
  return data;
}

function shouldPreview(
  anchor: HTMLAnchorElement | null,
): anchor is HTMLAnchorElement {
  if (!anchor?.href) return false;
  if (anchor.closest('[data-link-preview-root]')) return false;
  if (anchor.hasAttribute('data-no-link-preview')) return false;

  const href = anchor.getAttribute('href') || '';
  if (!href || href === '#' || href.startsWith('#')) return false;
  if (
    href.startsWith('javascript:') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return false;
  }

  try {
    const linkUrl = new URL(anchor.href);
    const current = new URL(window.location.href);
    if (
      linkUrl.pathname === current.pathname &&
      linkUrl.search === current.search &&
      linkUrl.hash
    ) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

async function showPreview(anchor: HTMLAnchorElement) {
  const popup = getPopup();
  if (!popup) return;

  const currentRequest = ++requestId;
  resetPopup(popup);
  positionPopup(popup, anchor);

  const data = await resolvePreview(anchor.href);
  if (currentRequest !== requestId || anchor !== activeAnchor) return;

  fillPopup(popup, data);
  positionPopup(popup, anchor);
}

function schedulePreview(anchor: HTMLAnchorElement) {
  if (hoverTimer) clearTimeout(hoverTimer);
  activeAnchor = anchor;
  hoverTimer = window.setTimeout(() => {
    if (activeAnchor === anchor) showPreview(anchor);
  }, HOVER_DELAY_MS);
}

function cancelPreview() {
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = null;
  requestId++;
  activeAnchor = null;
}

function scheduleHide() {
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = window.setTimeout(hidePopup, HIDE_DELAY_MS);
}

function onMouseOver(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest('a[href]');
  if (!shouldPreview(anchor)) return;

  const from = event.relatedTarget;
  if (from instanceof Node && anchor.contains(from)) return;
  if (activeAnchor === anchor) return;

  if (hideTimer) clearTimeout(hideTimer);
  cancelPreview();
  schedulePreview(anchor);
}

function onMouseOut(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest('a[href]');
  if (!anchor || anchor !== activeAnchor) return;

  const to = event.relatedTarget;
  if (to instanceof Node && anchor.contains(to)) return;

  const popup = getPopup();
  if (to instanceof Node && popup?.contains(to)) return;

  cancelPreview();
  scheduleHide();
}

export function initLinkPreview() {
  const popup = getPopup();
  if (!popup) return;

  abortController?.abort();
  abortController = new AbortController();
  const { signal } = abortController;

  cancelPreview();
  hidePopup();

  document.addEventListener('mouseover', onMouseOver, {
    capture: true,
    signal,
  });
  document.addEventListener('mouseout', onMouseOut, { capture: true, signal });

  popup.addEventListener(
    'mouseenter',
    () => {
      if (hideTimer) clearTimeout(hideTimer);
    },
    { signal },
  );

  popup.addEventListener(
    'mouseleave',
    () => {
      cancelPreview();
      scheduleHide();
    },
    { signal },
  );
}

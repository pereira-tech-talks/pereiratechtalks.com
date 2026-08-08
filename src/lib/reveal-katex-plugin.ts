/**
 * KaTeX math plugin for Reveal.js presentations.
 *
 * Matches reveal.js KaTeX behavior (CDN load + auto-render). We ship a local
 * plugin because reveal.js 6.0.1's `dist/plugin/math.mjs` references an
 * undeclared `Plugin` symbol, which breaks Vite pre-bundling and prevents
 * native decks with `math: true` from initializing.
 */

interface RevealDeckLike {
  getConfig(): { katex?: KaTeXPluginConfig };
  getSlidesElement(): HTMLElement;
  layout(): void;
  isReady(): boolean;
  on(event: string, callback: () => void): void;
}

interface KaTeXPluginConfig {
  local?: string;
  version?: string;
  extensions?: string[];
  delimiters?: Array<{ left: string; right: string; display: boolean }>;
  ignoredTags?: string[];
  [key: string]: unknown;
}

type AutoRenderOptions = Omit<
  KaTeXPluginConfig,
  'local' | 'version' | 'extensions'
>;

const DEFAULT_CONFIG: Required<
  Pick<KaTeXPluginConfig, 'version' | 'delimiters' | 'ignoredTags'>
> = {
  version: 'latest',
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
    { left: '\\[', right: '\\]', display: true },
  ],
  ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
};

function loadStylesheet(href: string): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    script.src = src;
    document.head.append(script);
  });
}

async function loadScripts(sources: string[]): Promise<void> {
  for (const src of sources) {
    await loadScript(src);
  }
}

declare global {
  interface Window {
    renderMathInElement?: (
      element: HTMLElement,
      options: AutoRenderOptions
    ) => void;
  }
}

/** Factory for the Reveal.js KaTeX plugin (`RevealMath.KaTeX` equivalent). */
export function createRevealKaTeXPlugin(): {
  id: string;
  init: (deck: RevealDeckLike) => void;
} {
  return {
    id: 'katex',
    init(deck) {
      const config = deck.getConfig().katex ?? {};
      const merged = { ...DEFAULT_CONFIG, ...config };
      const { local, version, extensions, ...autoRenderOptions } = merged;

      const baseUrl = local ?? 'https://cdn.jsdelivr.net/npm/katex';
      const versionSuffix = local ? '' : `@${version}`;
      const cssUrl = `${baseUrl}${versionSuffix}/dist/katex.min.css`;
      const katexUrl = `${baseUrl}${versionSuffix}/dist/katex.min.js`;
      const mhchemUrl = `${baseUrl}${versionSuffix}/dist/contrib/mhchem.min.js`;
      const autoRenderUrl = `${baseUrl}${versionSuffix}/dist/contrib/auto-render.min.js`;

      const scripts = [katexUrl];
      if (extensions?.includes('mhchem')) {
        scripts.push(mhchemUrl);
      }
      scripts.push(autoRenderUrl);

      const renderMath = (): void => {
        window.renderMathInElement?.(
          deck.getSlidesElement(),
          autoRenderOptions
        );
        deck.layout();
      };

      loadStylesheet(cssUrl);
      loadScripts(scripts)
        .then(() => {
          if (deck.isReady()) {
            renderMath();
          } else {
            deck.on('ready', renderMath);
          }
        })
        .catch((error: unknown) => {
          console.error('[RevealDeck] KaTeX failed to load:', error);
        });
    },
  };
}

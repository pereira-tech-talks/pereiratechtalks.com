/**
 * Sätteri HAST plugins (Astro 7).
 *
 * Sätteri — the Rust-powered Markdown/MDX compiler that is the default in
 * Astro 7 — does not run remark/rehype plugins. These plugins replace the
 * former `rehype-external-links` dependency and the in-repo
 * `rehype-image-defaults.mjs` transform, ported to Sätteri's HAST plugin API
 * (registered via `markdown.processor: satteri({ hastPlugins: [...] })`).
 *
 * The node/context shapes below are intentionally hand-rolled so we avoid
 * pulling in `@types/hast`. They mirror Sätteri's public
 * `HastPluginDefinition` / `HastVisitorContext` types closely enough to
 * register and to keep the visitors type-safe.
 */

/** Minimal HAST element shape — enough for these transforms. */
export interface HastElement {
  type: 'element';
  tagName: string;
  properties?: Record<string, unknown>;
  children: unknown[];
}

/**
 * Subset of Sätteri's `HastVisitorContext` used by the plugins below. Mutations
 * are applied through the context (not by reaching into the tree directly) so
 * the Rust side can mirror them back into the arena.
 */
export interface HastVisitorContext {
  setProperty(node: HastElement, key: string, value: unknown): void;
}

/** Shape accepted by `satteri({ hastPlugins })`. */
export interface SatteriHastPlugin {
  name: string;
  element: {
    filter: string[];
    visit(node: HastElement, ctx: HastVisitorContext): void;
  };
}

/**
 * Opens external (http/https) links in a new tab with safe `rel` attributes.
 * Sätteri replacement for `rehype-external-links`.
 */
export function satteriExternalLinks(): SatteriHastPlugin {
  return {
    name: 'external-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href === 'string' && /^https?:\/\//i.test(href)) {
          ctx.setProperty(node, 'target', '_blank');
          ctx.setProperty(node, 'rel', ['noopener', 'noreferrer']);
        }
      },
    },
  };
}

/**
 * Adds responsive-image defaults to every `<img>` in Markdown/MDX content that
 * doesn't already specify them:
 *
 * - `loading="lazy"` (when absent) — defers below-fold image loading
 * - `decoding="async"` (when absent) — decodes off the main thread
 *
 * Images authored with explicit attributes (e.g. heroes that want
 * `loading="eager"` + `fetchpriority="high"`) are left untouched. Sätteri port
 * of the former `rehypeImageDefaults` transform.
 */
export function satteriImageDefaults(): SatteriHastPlugin {
  return {
    name: 'image-defaults',
    element: {
      filter: ['img'],
      visit(node, ctx) {
        if (node.properties?.loading === undefined) {
          ctx.setProperty(node, 'loading', 'lazy');
        }
        if (node.properties?.decoding === undefined) {
          ctx.setProperty(node, 'decoding', 'async');
        }
      },
    },
  };
}

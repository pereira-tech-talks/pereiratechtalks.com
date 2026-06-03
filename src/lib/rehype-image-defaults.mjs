/**
 * Rehype plugin: add responsive-image default attributes to every <img>
 * found in markdown / MDX content that doesn't already specify them.
 *
 * - loading="lazy" (when absent) — defers below-fold image loading
 * - decoding="async" (when absent) — decodes off the main thread
 *
 * Images authored with explicit attributes (e.g., heroes that want
 * loading="eager" + fetchpriority="high") are left untouched.
 */
import { visit } from 'unist-util-visit';

export function rehypeImageDefaults() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      node.properties ??= {};
      if (node.properties.loading === undefined) {
        node.properties.loading = 'lazy';
      }
      if (node.properties.decoding === undefined) {
        node.properties.decoding = 'async';
      }
    });
  };
}

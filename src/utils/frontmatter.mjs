// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import lazyLoadPlugin from 'rehype-plugin-image-native-lazy-loading';

/** Plain-text preview for cards (excerpt fallback). */
function truncatePlainText(source, maxLen) {
  const t = source.replace(/\s+/g, ' ').trim();
  if (!t) return '';
  if (t.length <= maxLen) return t;
  return `${t.slice(0, Math.max(0, maxLen - 1)).trimEnd()}…`;
}

export function readingTimeRemarkPlugin() {
  return (tree, file) => {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    file.data.astro.frontmatter.readingTime = readingTime;
    file.data.astro.frontmatter.textPreview = truncatePlainText(textOnPage, 220);
  };
}

export function responsiveTablesRehypePlugin() {
  return (tree) => {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        const wrapper = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        tree.children[i] = wrapper;

        i++;
      }
    }
  };
}

export const lazyImagesRehypePlugin = lazyLoadPlugin;

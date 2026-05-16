// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import lazyLoadPlugin from 'rehype-plugin-image-native-lazy-loading';

const BLOCK_NODE_TYPES = new Set([
  'blockquote',
  'heading',
  'list',
  'paragraph',
  'table',
]);

/** Strip invisible Unicode (e.g. zero-width space in Meetup/Luma imports). */
function stripInvisibleChars(text) {
  return text.replace(/\u200B|\u200C|\u200D|\uFEFF/g, '');
}

/** Join block-level MDAST nodes with blank lines so card previews keep paragraph breaks. */
function extractBlockPlainText(tree) {
  const blocks = [];

  const visit = (node) => {
    if (!node) return;

    if (BLOCK_NODE_TYPES.has(node.type)) {
      const text = stripInvisibleChars(toString(node))
        .replace(/\s+/g, ' ')
        .trim();
      if (text) blocks.push(text);
      return;
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) visit(child);
    }
  };

  visit(tree);
  return blocks.join('\n');
}

/** Plain-text preview for cards (excerpt fallback). */
function truncatePlainText(source, maxLen) {
  const t = stripInvisibleChars(source).trim();
  if (!t) return '';
  if (t.length <= maxLen) return t;

  let slice = t.slice(0, maxLen - 1);
  const lastBreak = slice.lastIndexOf('\n');
  if (lastBreak > maxLen * 0.45) {
    slice = slice.slice(0, lastBreak);
  }

  return `${slice.trimEnd()}…`;
}

export function readingTimeRemarkPlugin() {
  return (tree, file) => {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    file.data.astro.frontmatter.readingTime = readingTime;
    file.data.astro.frontmatter.textPreview = truncatePlainText(
      extractBlockPlainText(tree),
      220,
    );
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

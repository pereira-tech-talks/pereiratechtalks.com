# Pages (`src/pages/`)

This directory contains all routes using Astro's file-based routing system. Each `.astro` or `.ts` file becomes a route based on its file path.

## Directory Structure

```
pages/
├── index.astro              # Homepage (/)
├── about.astro              # About page (/about)
├── contact.astro            # Contact page (/contact)
├── rss.xml.js               # RSS feed (/rss.xml)
├── api/
│   └── posts.json.ts        # Blog search API (/api/posts.json)
├── blog/
│   ├── index.astro          # Blog listing (/blog)
│   ├── [...slug].astro      # Individual posts (/blog/{slug})
│   ├── page/
│   │   └── [page].astro     # Blog pagination (/blog/page/{n})
│   └── tag/
│       ├── [tag].astro      # Tag page (/blog/tag/{tag})
│       └── [tag]/
│           └── page/
│               └── [page].astro  # Tag pagination (/blog/tag/{tag}/page/{n})
└── es/
    └── index.astro          # Spanish homepage (/es)
```

## Route Table

| File | Route | Description |
|------|-------|-------------|
| `index.astro` | `/` | English homepage |
| `about.astro` | `/about` | About page |
| `contact.astro` | `/contact` | Contact page |
| `rss.xml.js` | `/rss.xml` | RSS feed |
| `api/posts.json.ts` | `/api/posts.json` | Blog search API |
| `blog/index.astro` | `/blog` | Blog listing (page 1) |
| `blog/[...slug].astro` | `/blog/{slug}` | Individual blog post |
| `blog/page/[page].astro` | `/blog/page/{n}` | Blog pagination |
| `blog/tag/[tag].astro` | `/blog/tag/{tag}` | Posts by tag (page 1) |
| `blog/tag/[tag]/page/[page].astro` | `/blog/tag/{tag}/page/{n}` | Tag pagination |
| `es/index.astro` | `/es` | Spanish homepage |

## Route Patterns

### Static Routes

Files without brackets become static routes:

```
pages/about.astro → /about
pages/contact.astro → /contact
```

### Dynamic Routes

Files with brackets (`[]`) become dynamic routes:

```
pages/blog/[...slug].astro → /blog/any-slug-here
pages/blog/page/[page].astro → /blog/page/2
pages/blog/tag/[tag].astro → /blog/tag/tech
```

### Rest Parameters

The `[...slug]` syntax captures all segments:

```
pages/blog/[...slug].astro
→ /blog/my-post-slug
→ /blog/nested/path/here
```

## Page Patterns

### Page Wrapper Pattern (Standard)

All content pages use the **Page wrapper pattern**. Pages in `src/pages/` are ultra-minimal 3-line wrappers. The real logic (`MainLayout`, translations, content) lives inside `*Page.astro` components in `src/components/pages/`.

**Thin wrapper** (`src/pages/about.astro`):

```astro
---
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="en" />
```

**Shared component** (`src/components/pages/AboutPage.astro`):

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/lib/i18n';

interface Props { lang: Language; }
const { lang } = Astro.props;
const t = getTranslations(lang);
---
<MainLayout lang={lang} title={t.aboutPage.title} description={t.aboutPage.description}>
  <main class="main-container py-24">
    <!-- Content using t.* for text -->
  </main>
</MainLayout>
```

**Key rules:**
- Page wrappers never import `MainLayout` — the `*Page.astro` component handles it internally
- `lang` is passed as a string literal (`"en"`, `"es"`), not a variable

### Dynamic Page with `getStaticPaths`

For dynamic routes, you must export `getStaticPaths`:

```astro
---
import { getCollection } from 'astro:content';
import MainLayout from '@/layouts/MainLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<MainLayout title={post.data.title}>
  <Content />
</MainLayout>
```

### Paginated Page

```astro
---
import { getCollection } from 'astro:content';
import { BLOG_PAGE_SIZE } from '@/lib/constances';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const totalPages = Math.ceil(posts.length / BLOG_PAGE_SIZE);
  
  return Array.from({ length: totalPages }, (_, i) => ({
    params: { page: String(i + 1) },
    props: { 
      posts: posts.slice(i * BLOG_PAGE_SIZE, (i + 1) * BLOG_PAGE_SIZE),
      currentPage: i + 1,
      totalPages,
    },
  }));
}

const { posts, currentPage, totalPages } = Astro.props;
---
```

## API Routes

API routes use `.ts` files and export HTTP method handlers:

```typescript
// pages/api/posts.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const data = await fetchData();
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
```

### Available API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/posts.json` | GET | Blog posts search index |

See [API Reference](../../docs/API_REFERENCE.md) for details.

## RSS Feed

The RSS feed is generated at build time:

```javascript
// pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'My Blog',
    description: 'Blog description',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
```

## i18n Pattern

Currently using folder-based i18n:

- English: `/` (root)
- Spanish: `/es/`

See [i18n Guide](../../docs/I18N_GUIDE.md) for details.

## Creating a New Page

### Static Page (Page Wrapper Pattern)

1. **Create the shared component** in `src/components/pages/`:
   ```bash
   touch src/components/pages/NewPage.astro
   ```

   ```astro
   ---
   // src/components/pages/NewPage.astro
   import MainLayout from '@/layouts/MainLayout.astro';
   import { getTranslations } from '@/lib/translations';
   import type { Language } from '@/lib/i18n';

   interface Props { lang: Language; }
   const { lang } = Astro.props;
   const t = getTranslations(lang);
   ---
   <MainLayout lang={lang} title="New Page" description="Description">
     <main class="main-container py-24">
       <h1>New Page</h1>
     </main>
   </MainLayout>
   ```

2. **Create thin wrappers** for each language:
   ```astro
   ---
   // src/pages/new-page.astro
   import NewPage from '@/components/pages/NewPage.astro';
   ---
   <NewPage lang="en" />
   ```

   ```astro
   ---
   // src/pages/es/new-page.astro
   import NewPage from '@/components/pages/NewPage.astro';
   ---
   <NewPage lang="es" />
   ```

### Dynamic Page

1. Create file with brackets:
   ```bash
   touch src/pages/items/[id].astro
   ```

2. Export `getStaticPaths`:
   ```astro
   ---
   export async function getStaticPaths() {
     const items = await getItems();
     return items.map(item => ({
       params: { id: item.id },
       props: { item },
     }));
   }

   const { item } = Astro.props;
   ---
   ```

### API Endpoint

1. Create `.ts` file:
   ```bash
   touch src/pages/api/data.json.ts
   ```

2. Export handler:
   ```typescript
   import type { APIRoute } from 'astro';
   
   export const GET: APIRoute = async () => {
     return new Response(JSON.stringify({ data: [] }), {
       headers: { 'Content-Type': 'application/json' },
     });
   };
   ```

## Related Documentation

- [Layouts](../layouts/README.md)
- [Content Collections](../content/README.md)
- [API Reference](../../docs/API_REFERENCE.md)
- [i18n Guide](../../docs/I18N_GUIDE.md)
- [Architecture](../../docs/ARCHITECTURE.md)

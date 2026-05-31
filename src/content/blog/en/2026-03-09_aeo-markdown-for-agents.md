---
title: "Markdown for Agents: Making Your Content Speak AI's Language"
description: "Markdown for Agents: content negotiation meets AI—what the pattern means and a working Astro plus Cloudflare Pages implementation."
pubDate: "2026-03-09T14:00:00"
heroImage: "/images/blog/posts/aeo-markdown-for-agents/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "web-development", "ai"]
keywords: ["markdown for agents implementation", "content negotiation AI bots", "Accept text/markdown header", "Cloudflare markdown for agents", "AI-readable web content", "serve markdown to AI agents"]
series: "aeo-from-invisible-to-cited"
seriesOrder: 3
---

When an AI agent visits a web page, it gets the full HTTP response — the same thing a browser gets. Navigation markup, footer, theme-switching scripts, cookie banners, Tailwind utility classes, SVG icon definitions, JSON-LD schemas embedded as script tags. Then, somewhere inside all of that, the actual content.

Agents are good at extracting signal from noise. But every token — every chunk of text the model processes — spent on `class="text-gray-600 dark:text-gray-300"` or `<nav aria-label="Main navigation">` is a token not spent on understanding what the page actually says. For a short article, the ratio is fine. For a long post with a complex sidebar, you're burning a significant share of the context window — the amount of text a model can hold in memory at once — before reaching the first paragraph.

This is a structural problem with HTML-first delivery. And it's getting a name: **Markdown for Agents**.

---

## Content Negotiation: An Old Idea, a New Job

Content negotiation has been part of HTTP since version 1.1. The client sends an `Accept` header describing what format it wants. The server responds with the format that best matches. A browser requests `Accept: text/html`. A client that can work with plain text might request `Accept: text/plain`. The server decides what to send.

For most of the web's history, this mechanism was mainly used for language selection (`Accept-Language`) and compression (`Accept-Encoding`). Format negotiation between HTML and other types rarely came up in practice — browsers wanted HTML, and servers delivered HTML.

AI agents change that calculus. An agent that can read Markdown has no reason to prefer HTML. Markdown is cleaner, token-efficient, and carries all the semantic content without the presentation layer. If a server can detect that the client is an AI agent — or more precisely, if the client announces it can handle `text/markdown` — the server can skip the HTML entirely.

That's the idea behind Markdown for Agents. Send Markdown when the client wants Markdown.

---

## Cloudflare's Proposal

In February 2026, [Cloudflare published "Markdown for Agents"](https://blog.cloudflare.com/markdown-for-agents/) — a post that laid out the problem clearly and proposed an implementation: edge-based HTML-to-Markdown conversion. When a request includes `Accept: text/markdown`, Cloudflare Workers intercepts it, fetches the HTML, converts it on the fly, and returns clean Markdown to the agent. No changes to the origin server required. They also launched [`markdown.new`](https://markdown.new) — a public tool where you can paste any URL and get its Markdown version instantly, useful for testing how any site would look through an agent's eyes.

The post landed in developer circles and started a conversation that's still ongoing. It positioned the `Accept: text/markdown` header as the emerging standard for this class of request — which it probably will be, if the pattern takes hold.

Markdown for Agents sits alongside two other conventions in the AEO toolkit: `robots.txt` (access policy), `llms.txt` (site index for language models), and now content negotiation for on-demand clean content delivery. They solve different things. `robots.txt` says whether bots can visit. `llms.txt` gives them a map. Markdown for Agents gives them the content in a format that doesn't waste their attention.

Whether this becomes a formal web standard is an open question. The [IETF](https://www.ietf.org/) (Internet Engineering Task Force — the body that defines foundational Internet standards like HTTP, TLS, and DNS) hasn't standardized it. No major browser cares about it. But Cloudflare is one of the largest edge networks on the planet, and when they publish a "here's how agents should talk to web servers" post, the industry pays attention. I think this particular convention has legs — not because it's technically novel, but because it solves a real problem with minimal ceremony.

---

## How It Works

The pattern has two delivery paths:

**Content negotiation via `Accept` header:**
```
Agent → GET /about
        Accept: text/markdown
Server → 200 OK
         Content-Type: text/markdown; charset=utf-8
         Vary: Accept
         [Markdown content]
```

**Direct URL fallback:**
```
Agent → GET /about.md
Server → 200 OK
         Content-Type: text/markdown; charset=utf-8
         [Markdown content]
```

The header approach is cleaner — the agent uses the same URL it would use for HTML and announces its preference. The direct URL approach is simpler to implement and works even without middleware — it's just a static file at a predictable path.

Either way, what the agent receives is Markdown: the content without the chrome. A well-formatted Markdown response for a blog post looks like this:

```markdown
# Post Title

> Description text

Published: 2026-03-09
Language: en
Canonical: https://example.com/blog/post-slug

---

[post body as authored]
```

Title, metadata, body. That's it. No `<head>`, no navigation, no ads, no analytics pixels. For a 2,000-word post, this might be 8KB of Markdown versus 80KB of HTML with everything that comes along with a modern site.

### What About Images?

The `markdown.new` service mentioned above excludes images by default (`retain_images=false`) — and offers an opt-in flag to include them. The reasoning is straightforward: the whole point of Markdown for Agents is token efficiency. An image reference like `![hero](/images/hero.png)` is text the agent can't process directly — it would need to make an additional fetch and have multimodal capabilities to interpret it. Most agents today are text-first.

The industry convention reinforces this: never put critical information inside images. If a piece of data matters, it should be in text — Markdown tables, lists, structured data. Images are supplementary, not primary.

My approach is a middle ground. For blog posts, the hero image URL is included in the metadata header — a single line like `Hero Image: https://xergioalex.com/images/blog/posts/.../hero.png` that gives an agent with multimodal capabilities the option to fetch it, without bloating the body. And since blog posts are written in Markdown from the source, any images already referenced in the body (screenshots, diagrams) are passed through as-is — no additional processing needed. For static pages (About, Portfolio, Contact), images are excluded entirely — those endpoints are pure text.

If agents start routinely processing inline images, expanding coverage is trivial. For now, metadata reference for the hero plus whatever the author already included in the body feels like the right balance.

The `Vary: Accept` response header is important — it tells CDN caches that the same URL can return different content depending on the `Accept` header, so a cache doesn't accidentally serve Markdown to a browser or HTML to an agent.

---

## A Working Implementation

Cloudflare took the HTML-to-Markdown conversion path at the edge. I went with a hybrid approach: serve both formats — HTML and Markdown — from static files, with a middleware that decides which one to deliver based on what the client asks for.

This site is built with Astro — every blog post is already a `.md` file. The Markdown source exists from the origin. For blog posts I didn't need to do anything extra: they were already written in Markdown. For static pages (About, Portfolio, Contact, etc.) I did generate a `.md` version of each one as part of the build. The result: every URL on the site has an HTML version and a Markdown version ready to serve.

```
                    ┌─→ HTML page (browsers)
Source .md → [Astro build]
                    └─→ .md file  (agents)
```

Two outputs from one source. For example, a blog post and a static page:

| URL | Format |
|-----|--------|
| [/blog/astro-and-svelte-the-future-of-web-development](https://xergioalex.com/blog/astro-and-svelte-the-future-of-web-development/) | HTML (browsers) |
| [/blog/astro-and-svelte-the-future-of-web-development.md](https://xergioalex.com/blog/astro-and-svelte-the-future-of-web-development.md) | Markdown (agents) |
| [/about](https://xergioalex.com/about/) | HTML (browsers) |
| [/about.md](https://xergioalex.com/about.md) | Markdown (agents) |

No real-time conversion, no HTML→Markdown transformation artifacts. What the agent reads is what I wrote. And since this is a static site, I wanted to keep everything static — nothing needs to be computed at runtime, it's all built once and served from the CDN. The only piece that required implementation was the middleware, and since this site runs on Cloudflare Pages, that was straightforward to integrate.

Every page on the site gets a `.md` endpoint generated on every build — blog posts in both languages, static pages, and index pages:

Each file has a metadata header — title, description, author, canonical URL — followed by the body as written. Zero runtime processing. The `.md` files sit on Cloudflare's CDN like any other static asset.

### The Middleware

Content negotiation — the "return Markdown when asked" part — runs in a Cloudflare Pages middleware at [`functions/_middleware.ts`](https://github.com/xergioalex/xergioalex.com/blob/main/functions/_middleware.ts). The path-resolution logic handles trailing slashes, index routes, and the various URL patterns:

```typescript
function resolveMarkdownPath(pathname: string): string {
  let clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (clean === '/') return '/index.md';
  if (clean.endsWith('/index')) return `${clean}.md`;
  return `${clean}.md`;
}
```

When a request arrives with `Accept: text/markdown`, the middleware checks that it's not an excluded path (`/api/`, `/internal/`, static assets), resolves the `.md` path, and fetches it via `context.env.ASSETS.fetch()` — a Cloudflare Pages API that accesses static assets without making an external HTTP request:

```typescript
async function tryServeMarkdown(context: EventContext): Promise<Response | null> {
  const accept = context.request.headers.get('accept') || '';
  if (!accept.includes('text/markdown')) return null;

  // ... exclusion checks ...

  const mdPath = resolveMarkdownPath(pathname);
  let assetResponse = await context.env.ASSETS.fetch(new Request(mdUrl.toString()));

  // Fallback: /path.md → /path/index.md
  if (!assetResponse.ok && !mdPath.endsWith('/index.md')) {
    const indexMdPath = `${mdPath.replace(/\.md$/, '')}/index.md`;
    assetResponse = await context.env.ASSETS.fetch(new Request(indexMdUrl.toString()));
  }

  if (!assetResponse.ok) return null;

  return new Response(assetResponse.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Vary': 'Accept',
      'X-Content-Negotiation': 'markdown',
    },
  });
}
```

The fallback — trying `/path/index.md` if `/path.md` doesn't exist — matters because routes like `/es/` and `/blog/` resolve to `index.md` files, not `es.md` and `blog.md`. Without it, the most useful pages for an agent navigating the site would return 404s.

The [full middleware](https://github.com/xergioalex/xergioalex.com/blob/main/functions/_middleware.ts) also includes an AI bot analytics layer — server-side tracking of known AI crawlers like GPTBot, ClaudeBot, PerplexityBot, and others. Agents don't run JavaScript, so client-side analytics miss them entirely.

You can test the whole thing with a single curl:

```bash
# Content negotiation
curl -H "Accept: text/markdown" https://xergioalex.com/about

# Direct .md URL — no headers needed
curl https://xergioalex.com/about.md
```

---

## The Bet

The middleware also fires analytics events for every Markdown request — tracking which bots are asking for Markdown, whether they use content negotiation or direct `.md` URLs, and how often. The full measurement architecture is covered in the [next chapter](/blog/aeo-the-scorecard), where it fits alongside the rest of the AEO measurement story.

Is anyone reading these endpoints today? Probably not systematically. No major AI system has publicly said it sends `Accept: text/markdown` headers or preferentially reads `.md` URLs. Cloudflare proposed the pattern in February 2026; it hasn't become a standard yet.

But that's how these things start. `robots.txt` was informal before it was standard. `sitemap.xml` was a Google proposal before it was an industry convention.

The Markdown for Agents pattern costs almost nothing to maintain on a static site. The `.md` files add maybe a few hundred kilobytes to the build output. The middleware runs on every request but adds zero overhead to HTML responses. And if the convention takes hold — if agents start sending `Accept: text/markdown` the way browsers send `Accept: text/html` — the infrastructure is already in place.

I think the bigger question isn't whether Markdown for Agents works today, but what happens if it becomes a web standard. If the W3C or IETF formalizes content negotiation for AI agents, sites without `.md` endpoints become second-class citizens in the agent web. Sites with them get clean delivery from day one. The cost of being early is negligible. The cost of being late, if this takes off, is a migration project.

I'm willing to make that bet.

In fact, this very post you're reading has its Markdown version ready for agents. You can see it directly at <a href="/blog/aeo-markdown-for-agents.md" target="_blank">/blog/aeo-markdown-for-agents.md</a>, or request it via content negotiation:

```bash
# Content negotiation — same URL, different format
curl -H "Accept: text/markdown" https://xergioalex.com/blog/aeo-markdown-for-agents

# Direct URL — no headers needed
curl https://xergioalex.com/blog/aeo-markdown-for-agents.md
```

Let's keep building.

---

## Resources

**Markdown for Agents**
- [Cloudflare: Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/) — the post that started the conversation
- [markdown.new](https://markdown.new) — Cloudflare's tool to convert any URL to Markdown instantly
- [xergioalex.com/about.md](https://xergioalex.com/about.md) — example Markdown endpoint (direct URL)

**Standards**
- [HTTP Content Negotiation — RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-5.3.2)
- [llms.txt Specification](https://llmstxt.org/)

**Implementation**
- [Source code: `functions/_middleware.ts`](https://github.com/xergioalex/xergioalex.com/blob/main/functions/_middleware.ts) — the full middleware (content negotiation + AI bot analytics)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)

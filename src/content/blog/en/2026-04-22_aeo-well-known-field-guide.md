---
title: "The .well-known Explosion: A Field Guide to the New Agent Standards"
description: "A developer field guide to the .well-known family: RFC 8288 Link headers, 9727 API Catalog, 9728 Protected Resource, MCP Server Card, WebMCP."
pubDate: "2026-04-22T16:00:00"
heroImage: "/images/blog/posts/aeo-well-known-field-guide/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "web-development", "ai-agents", "cloudflare", "mcp"]
keywords: ["well-known endpoints", "agent standards 2026", "RFC 8288 Link headers", "RFC 9727 API Catalog", "RFC 9728 OAuth Protected Resource Metadata", "MCP Server Card SEP-1649", "Agent Skills Discovery RFC", "WebMCP browser API"]
series: "aeo-from-invisible-to-cited"
seriesOrder: 6
draft: true
---

If you already shipped these `.well-known/` endpoints on your site, you built most of what this post explains. You don't need this reference to make your site agent-ready. You might want it the next time a spec changes — or the next time you're asked what any of this is actually for.

What follows is a field guide to the `.well-known/` family and its neighbours, in the order you'd adopt them on a new site. Cheapest first. Each section is self-contained: *what it is / why it exists / minimum valid example / common pitfalls / where to learn more.* Skip around.

## 1. robots.txt Content Signals

### What it is

A single-line directive added to `robots.txt` that declares your preferences for three AI content-use categories: training, search indexing, and use-as-input to an LLM answer.

### Why it exists

`robots.txt` traditionally told crawlers whether to *fetch*. Content Signals extends it to what crawlers can *do* with what they fetch. It formalizes the difference between "please index me" and "please don't train on me" — a distinction `noindex` and allow/disallow can't express.

### Minimum valid example

```text
User-agent: *
Content-Signal: ai-train=no, search=yes, ai-input=yes
```

All three signals (`ai-train`, `search`, `ai-input`) must appear. Values are `yes` or `no`.

### Common pitfalls

- Placing `Content-Signal:` outside a `User-agent:` block — invisible to crawlers.
- Omitting one of the three signals.
- Comma separator must have a space: `ai-train=no, search=yes`, not `ai-train=no,search=yes`.

### Where to learn more

- [contentsignals.org](https://contentsignals.org/)
- IETF draft `draft-romm-aipref-contentsignals`

## 2. Link response headers (RFC 8288)

### What it is

HTTP `Link:` headers on HTML responses pointing at machine-readable companion documents. Think of them as HTML's `<link rel>` tags promoted to the response header so clients that never parse the HTML can find the site's metadata.

### Why it exists

Agents don't always render the page — sometimes they `HEAD /` and make decisions from response headers alone. Link headers let them discover your API catalog, MCP server card, or skills index without fetching the HTML.

### Minimum valid example

```text
Link: </.well-known/api-catalog>; rel="api-catalog"
```

Accepted `rel` values by the Agent Readiness scorecard: `api-catalog`, `service-desc`, `service-doc`, `describedby`. One header is enough. Multiple are fine.

### Common pitfalls

- Missing angle brackets around the URL.
- Missing semicolon before `rel=`.
- Pointing `rel` at a URL that returns 404.
- Only emitting on `/` and not on language subpaths like `/es/`.

### Where to learn more

- [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) (Web Linking)
- [RFC 9727 §3](https://www.rfc-editor.org/rfc/rfc9727#section-3) (rel registration for `api-catalog`)
- [IANA Link Relations registry](https://www.iana.org/assignments/link-relations/)

## 3. API Catalog (RFC 9727 + Linkset RFC 9264)

### What it is

A JSON document at `/.well-known/api-catalog` that lists your public APIs, each with links to machine-readable description (OpenAPI) and human documentation.

### Why it exists

A single pointer to your OpenAPI spec isn't enough — larger sites have multiple APIs, each with different docs. The catalog uses the *linkset* format (RFC 9264) so tooling can consume a list of API descriptions uniformly.

### Minimum valid example

```json
{
  "linkset": [
    {
      "anchor": "https://api.example.com/users",
      "links": [
        { "rel": "service-desc", "href": "https://api.example.com/openapi.json" },
        { "rel": "service-doc", "href": "https://api.example.com/docs" }
      ]
    }
  ]
}
```

### Common pitfalls

- **Wrong Content-Type.** Must be `application/linkset+json`, *not* `application/json`. This one silently fails the scorecard.
- Empty `linkset` array.
- Omitting either `service-desc` or `service-doc`.
- Linking at an OpenAPI spec you haven't actually written.

### Where to learn more

- [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727) (The Linkset API Catalog)
- [RFC 9264](https://www.rfc-editor.org/rfc/rfc9264) (Linksets)
- Appendix A of RFC 9727 has full worked examples.

## 4. OAuth Authorization Server Metadata (RFC 8414) / OIDC Discovery 1.0

### What it is

Publishing the configuration of your OAuth 2.0 authorization server (or OpenID Connect provider) at a well-known path so clients can discover endpoints programmatically.

### Why it exists

Agents can't be hard-coded to know where your authorization endpoint lives. RFC 8414 and OIDC Discovery 1.0 let them fetch one JSON and know exactly how to begin an auth flow.

### Minimum valid example

```json
{
  "issuer": "https://your-domain.com",
  "authorization_endpoint": "https://your-domain.com/authorize",
  "token_endpoint": "https://your-domain.com/token",
  "jwks_uri": "https://your-domain.com/.well-known/jwks.json",
  "grant_types_supported": ["authorization_code"],
  "response_types_supported": ["code"]
}
```

Six required fields. Served at `/.well-known/openid-configuration` (OIDC) or `/.well-known/oauth-authorization-server` (OAuth 2.0). The two paths are conventionally equivalent for the scorecard's purposes.

### Common pitfalls

- Publishing endpoints that don't exist (even stubs should be documented as such — a `_comment` field is spec-compliant).
- Missing one of the six required fields.
- Serving under the wrong Content-Type (must be `application/json`).
- On a static content site with no real OAuth, the honest shape is still six valid-looking URLs plus a `_comment` explaining the situation. Fabricating working endpoints is worse than documenting reserved paths.

### Where to learn more

- [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414) (OAuth 2.0 Authorization Server Metadata)
- [OpenID Connect Discovery 1.0](http://openid.net/specs/openid-connect-discovery-1_0.html)
- Reference implementation in a product: Cloudflare's [Managed OAuth for Access](https://blog.cloudflare.com/managed-oauth-for-access/) (a one-click RFC 7591 + 7636 + 9728 stack).

## 5. OAuth Protected Resource Metadata (RFC 9728)

### What it is

A companion document to the authorization-server metadata, declaring which *resources* are protected and which authorization servers issue tokens for them.

### Why it exists

Authorization server metadata answers "where do I get a token?" Protected resource metadata answers "what can I do with one here?" Agents that discover both can plan an auth flow end-to-end.

### Minimum valid example

```json
{
  "resource": "https://your-domain.com",
  "authorization_servers": ["https://your-oauth-provider.com"]
}
```

Two required fields. Optionally add `scopes_supported`, `bearer_methods_supported`, and a `WWW-Authenticate: resource_metadata` header on 401 responses.

### Common pitfalls

- Listing authorization servers that aren't reachable or don't exist.
- On a content site with no protected resources, a self-reference (`resource = authorization_servers[0] = your site`) is a valid honest tautology.
- Wrong well-known path (must be exactly `/.well-known/oauth-protected-resource`, no `.json` extension required).

### Where to learn more

- [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728) (OAuth 2.0 Protected Resource Metadata)
- Paired with the Managed OAuth for Access post above.

## 6. MCP Server Card (SEP-1649 / SEP-2127)

### What it is

A JSON document at `/.well-known/mcp/server-card.json` that declares your site as an MCP-compatible agent surface — telling agents what kind of capabilities you support and where to connect.

### Why it exists

MCP (Model Context Protocol) is rapidly becoming the shared language for agents to talk to external tools. The server card makes MCP-compatible sites discoverable at a known path, without hand-configuring every agent.

### Minimum valid example

```json
{
  "serverInfo": {
    "name": "example-server",
    "version": "1.0.0"
  },
  "transport": {
    "endpoint": "/mcp"
  },
  "capabilities": ["tools", "resources"]
}
```

`capabilities` is a string array — values from `tools`, `resources`, `prompts`. It's the category list, not the per-tool definitions.

### Common pitfalls

- Wrong nested path — must be `/.well-known/mcp/server-card.json`, not `/.well-known/mcp.json` (though some scorecards also look for the latter).
- Empty `capabilities` array.
- Thinking of `capabilities` as an object; the spec wants a flat string array.
- Declaring capabilities your site doesn't actually serve via MCP.

### Where to learn more

- [Model Context Protocol — main spec](https://modelcontextprotocol.io/)
- [SEP-1649 / PR #2127](https://github.com/modelcontextprotocol/modelcontextprotocol) (server card proposal)
- Cloudflare's [Enterprise MCP reference architecture](https://blog.cloudflare.com/enterprise-mcp/) shows how organizations stitch multiple MCP servers together.

## 7. Agent Skills Discovery (Cloudflare RFC v0.2.0)

### What it is

A JSON index at `/.well-known/agent-skills/index.json` listing machine-executable or machine-readable skills your site offers, each pointing at a SKILL.md (or archive) with a SHA-256 digest of the served bytes.

### Why it exists

Skills are a layer above tools. A *tool* is something an agent can call. A *skill* is a composable, documentable procedure the agent can read, cache, and follow. The index lets agents discover skills at a well-known path and verify their integrity via digest.

### Minimum valid example

```json
{
  "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  "skills": []
}
```

`$schema` is an **opaque identifier** — it's the version declaration, not a resolvable URL. An empty `skills[]` is valid; a populated one looks like:

```json
{
  "name": "git-workflow",
  "type": "skill-md",
  "description": "A reusable Git workflow for the site.",
  "url": "https://example.com/.well-known/agent-skills/git-workflow/SKILL.md",
  "digest": "sha256:abc123..."
}
```

Each SKILL.md is YAML frontmatter (`name`, `description`) plus Markdown prose.

### Common pitfalls

- Missing `$schema` field.
- Skill `name` with uppercase or spaces (must be lowercase, alphanumeric, hyphens, 1–64 chars).
- `digest` missing the `sha256:` prefix, or computed on local bytes instead of the bytes actually served at the `url`. The two differ if your server re-compresses or normalizes content.
- Confusing `type: "skill-md"` with `type: "archive"` — archives are `.tar.gz` files for complex multi-file skills; SKILL.md is for single-file skills.

### Where to learn more

- [Cloudflare Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc) (Apache 2.0)
- [agentskills.io](https://agentskills.io/)

## 8. WebMCP (browser)

### What it is

A browser API — `navigator.modelContext.registerTool()` — that lets a web page publish tools an agent running *in the browser itself* can call. Think of MCP over a page context instead of over a server.

### Why it exists

When the agent is running inside the user's browser (a Chrome extension, an integrated assistant, a WebMCP-aware tab), it has full access to the user's session with your site — cookies, OAuth state, the works. WebMCP gives the page a way to say "here are the actions I expose," without exposing those actions as public APIs.

### Minimum valid example

```js
navigator.modelContext.registerTool({
  name: 'search',
  description: 'Search site content',
  inputSchema: {
    type: 'object',
    properties: { q: { type: 'string' } },
    required: ['q'],
  },
  execute: async ({ q }) => { /* ... */ },
}, { signal: abortController.signal });
```

Four required properties per tool: `name`, `description`, `inputSchema` (valid JSON Schema), `execute` (async callback). Pass an `AbortController` signal so the registration can be revoked on unmount.

### Common pitfalls

- Registering tools in a deferred script that runs after the scorecard's snapshot. Use an idle/load hydration directive that runs soon enough.
- Missing the `AbortController` signal — the tool leaks when the component should have unmounted.
- Exposing write operations (DELETE, POST that mutates) without user consent. Keep the tool surface read-only by default.
- `inputSchema` that isn't valid JSON Schema.

### Where to learn more

- [WebMCP spec](https://webmachinelearning.github.io/webmcp/)
- [Chrome WebMCP explainer](https://developer.chrome.com/blog/webmcp-epp)

## 9. Bonus: HTTP Message Signatures Directory / Web Bot Auth

### What it is

A `/.well-known/http-message-signatures-directory` document identifying cryptographic public keys agents use to sign their HTTP requests. Lets sites verify "this request is really from the AI agent it claims to be."

### Why it exists

Bot identification today is IP-based and User-Agent-based — both spoofable. Web Bot Auth proposes HTTP Message Signatures so agents can *prove* their identity. The directory at the well-known path is how sites publish their trusted signers.

### Notes

Not one of the eight items checked by isitagentready.com's current scorecard (as of April 2026), but listed in the tool's roadmap. Cloudflare's ["The age of agents" post (Aug 2025)](https://blog.cloudflare.com/signed-agents/) is the origin story. Worth implementing in the next iteration, not required today.

## What I'd implement if I were doing it again

The order above is the order you'd ship on a new site:

1. **Afternoon one:** robots.txt Content Signals + Link headers. Two files, two lines each. You're at 67 → 100 on the Discoverability + Bot Access Control axes.
2. **Weekend one:** The six `.well-known/*` JSON files. Most are under 1 KB. The OpenAPI spec takes the longest — budget half a day for it.
3. **Weekend two (optional):** WebMCP bridge component. Depends on your site's tool surface; keep it read-only the first time.

You don't need to read every RFC end-to-end. You need to read each SKILL.md at `isitagentready.com/.well-known/agent-skills/<skill>/SKILL.md` — those are the binding examples. Copy their JSON payloads into your files and adjust the URLs. The RFCs explain *why* each field exists; the SKILL.md tells you *what* to put there.

I'll keep building.

## Resources

- [RFC 8288 — Link headers](https://www.rfc-editor.org/rfc/rfc8288)
- [RFC 9264 — Linksets](https://www.rfc-editor.org/rfc/rfc9264)
- [RFC 9727 — API Catalog](https://www.rfc-editor.org/rfc/rfc9727)
- [RFC 8414 — OAuth Authorization Server Metadata](https://www.rfc-editor.org/rfc/rfc8414)
- [OpenID Connect Discovery 1.0](http://openid.net/specs/openid-connect-discovery-1_0.html)
- [RFC 9728 — OAuth Protected Resource Metadata](https://www.rfc-editor.org/rfc/rfc9728)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Server Card — SEP-1649 / PR #2127](https://github.com/modelcontextprotocol/modelcontextprotocol)
- [Cloudflare Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc)
- [agentskills.io](https://agentskills.io/)
- [WebMCP spec](https://webmachinelearning.github.io/webmcp/)
- [Content Signals](https://contentsignals.org/)
- [isitagentready.com](https://isitagentready.com/)

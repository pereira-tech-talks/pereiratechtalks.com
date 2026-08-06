# auth.md

You are an agent. **Pereira Tech Talks** (`pereiratechtalks.org`) is a bilingual static community website. Almost all public surfaces are readable **without registration or credentials**.

## auth.md Registration

This site publishes OAuth Protected Resource Metadata and Authorization Server metadata for agent discovery. Live **agent registration that issues privileged credentials is not open** — community content is already public under the `public:read` scope.

### What needs no registration

Agents may freely:

- Fetch `/.well-known/api-catalog`, `/llms.txt`, `/llms-full.txt`, and `robots.txt`
- Read Markdown twin endpoints (`Accept: text/markdown` or `*.md` URLs)
- Call public JSON indexes under `/api/` (posts, series, search)
- Use in-browser WebMCP tools registered via `navigator.modelContext.registerTool()`

### Discovery

1. Fetch Protected Resource Metadata:

```http
GET /.well-known/oauth-protected-resource
```

Expect `resource` to match this origin, `authorization_servers` listing this origin, `scopes_supported: ["public:read"]`, and `bearer_methods_supported: ["header"]`.

2. Fetch Authorization Server metadata:

```http
GET /.well-known/oauth-authorization-server
```

Read the `agent_auth` block. `agent_auth.skill` points at this file. `agent_auth.register_uri` is `POST|GET /agent/register` and documents that public content needs no credentials.

### Supported identity type (discovery only)

- **anonymous** — advertised for agent-readiness scanners. Calling `/agent/register` returns `public_no_auth_required` and does **not** create accounts or mint privileged tokens.

### Privileged / human workflows

For write access (event forms, sponsorship, speaking):

- Contact form: `/contact/`
- Call for speakers: `/call-for-speakers/`
- Sponsor us: `/sponsor-us/`
- Email: `hello@pereiratechtalks.org`

Do **not** invent OAuth client credentials, scrape private admin routes, or ask humans to paste API secrets into chat.

## Product links

- Home: `/`
- Meetups: `/meetups/`
- Pereira Tech Days: `/pereira-tech-days/`
- Blog: `/blog/`
- Agent skills index: `/.well-known/agent-skills/index.json`
- MCP server card: `/.well-known/mcp/server-card.json`

## Legal

- Code of Conduct: `/conduct/`
- Governance: `/governance/`
- Contributing: `/contributing/`

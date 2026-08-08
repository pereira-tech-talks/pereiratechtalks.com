# auth.md

You are an agent. **Pereira Tech Talks** is a static community website available in Spanish and English. Public content is readable under the `public:read` scope **without privileged credentials**.

## auth.md Registration

Discover registration metadata, then call the advertised endpoints. Live privileged account creation is not open — the endpoints below document the anonymous discovery contract and return `public_no_auth_required` / `not_applicable` for this static site.

### Audience

AI agents and tools that need to discover how (or whether) to register before reading Pereira Tech Talks content.

### Discovery

1. Fetch Protected Resource Metadata:

```http
GET /.well-known/oauth-protected-resource
```

Required fields: `resource` (this origin), `authorization_servers`, `scopes_supported` (`public:read`), `bearer_methods_supported` (`header`).

2. Fetch Authorization Server metadata from `authorization_servers[0]`:

```http
GET /.well-known/oauth-authorization-server
```

Read the `agent_auth` block. It includes:

- `skill` — this file
- `register_uri` / `identity_endpoint` — `POST|GET /agent/register`
- `claim_uri` / `claim_endpoint` — `POST|GET /agent/claim`
- `claim_complete_uri` — `POST|GET /agent/claim/complete`
- `revocation_uri` — `POST /oauth/revoke`
- `identity_types_supported` — includes `anonymous`
- `anonymous.credential_types_supported` — `access_token`

### Supported method: anonymous

1. **Register** — `POST /agent/register` with `{ "type": "anonymous" }`.
2. **Response** — JSON with `status: "public_no_auth_required"`. No account is created; public Markdown/JSON endpoints need no bearer token.
3. **Claim (optional discovery only)** — `POST /agent/claim` and `POST /agent/claim/complete` return `not_applicable`. There is no OTP ceremony for `public:read`.
4. **Credentials** — do not invent client secrets. For public reads, call `/llms.txt`, `/.well-known/api-catalog`, `/api/*`, and Markdown twin URLs without `Authorization`.
5. **Revocation** — `revocation_uri` is reserved; there are no issued privileged tokens to revoke today.

### What needs no registration

- `/.well-known/api-catalog`, `/llms.txt`, `/llms-full.txt`, `robots.txt`
- Markdown twin endpoints (`Accept: text/markdown` or `*.md` URLs)
- Public JSON indexes under `/api/`
- In-browser WebMCP tools via `navigator.modelContext.registerTool()`

### Privileged / human workflows

Write access (forms, sponsorship, speaking) stays human-mediated:

- Contact: `/contact/`
- Call for speakers: `/call-for-speakers/`
- Sponsor us: `/sponsor-us/`
- Email: `pereiratechtalks@gmail.com`

Do not ask humans to paste API secrets into chat.

## Product links

- Home: `/`
- Meetups: `/meetups/`
- Pereira Tech Days: `/pereira-tech-days/`
- Blog: `/blog/`
- Agent skills: `/.well-known/agent-skills/index.json`
- MCP server card: `/.well-known/mcp/server-card.json`

## Legal

- Code of Conduct: `/conduct/`
- Governance: `/governance/`
- Contributing: `/contributing/`

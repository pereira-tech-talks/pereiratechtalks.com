# DNS for AI Discovery (DNS-AID)

Publish HTTPS/SVCB records under the `_agents` namespace so AI agents can discover Pereira Tech Talks before the first HTTP round-trip. Required for [isitagentready.com](https://isitagentready.com/) Discoverability → DNS-AID.

**Specs:** [draft-mozleywilliams-dnsop-dnsaid](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/) · [RFC 9460](https://www.rfc-editor.org/rfc/rfc9460) · [Skill](https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md)

## Why both apex and `v3`

The scanner queries `_index._agents.<scanned-host>`. Scanning `https://pereiratechtalks.org` looks up `_index._agents.pereiratechtalks.org`. Scanning the apex looks up `_index._agents.pereiratechtalks.org`. Publish both while `v3` is the public preview hostname.

## Cloudflare DNS UI (manual)

In the **pereiratechtalks.org** zone → DNS → Records → Add record:

| Type | Name | Priority | Target | Value / SvcParams |
|------|------|----------|--------|-------------------|
| HTTPS | `_index._agents` | 1 | `pereiratechtalks.org` | `alpn="h2,h3" port=443` |
| HTTPS | `_mcp._agents` | 1 | `pereiratechtalks.org` | `alpn="h2,h3" port=443` |
| HTTPS | `_index._agents.v3` | 1 | `pereiratechtalks.org` | `alpn="h2,h3" port=443` |
| HTTPS | `_mcp._agents.v3` | 1 | `pereiratechtalks.org` | `alpn="h2,h3" port=443` |

Use **ServiceMode** (priority ≥ 1), not AliasMode (priority 0).

### DNSSEC

1. DNS → Settings → enable **DNSSEC**.
2. If nameservers are Cloudflare, the DS record is usually automatic at the registry.
3. If the registrar is external, copy the DS values from Cloudflare into the registrar.

Without DNSSEC the scanner may still detect records (`serviceRecordCount > 0`) but `dnssecValidated` stays false.

## Script (API)

```bash
export CF_API_TOKEN='…'          # Zone.DNS Edit (+ DNSSEC Edit optional)
export CF_ZONE_NAME='pereiratechtalks.org'   # or CF_ZONE_ID=…
# Preview payloads only:
DNS_AID_DRY_RUN=1 node scripts/publish-dns-aid.mjs
# Publish:
node scripts/publish-dns-aid.mjs
```

## Verify

```bash
dig +short HTTPS _index._agents.pereiratechtalks.org
dig +short HTTPS _index._agents.pereiratechtalks.org

curl -s 'https://cloudflare-dns.com/dns-query?name=_index._agents.pereiratechtalks.org&type=HTTPS' \
  -H 'accept: application/dns-json' | jq .

curl -s https://isitagentready.com/api/scan \
  -H 'content-type: application/json' \
  -d '{"url":"https://pereiratechtalks.org"}' | jq '.checks.discoverability.dnsAid'
```

Expect `status: "pass"` and at least one ServiceMode HTTPS/SVCB answer.

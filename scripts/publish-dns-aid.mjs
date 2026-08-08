#!/usr/bin/env node
/**
 * Publish DNS for AI Discovery (DNS-AID) HTTPS/SVCB records via Cloudflare DNS API.
 *
 * Requirements:
 *   CF_API_TOKEN   — token with Zone.DNS Edit (and Zone.DNSSEC Edit to enable DNSSEC)
 *   CF_ZONE_ID     — zone id for pereiratechtalks.org
 *                    (or set CF_ZONE_NAME=pereiratechtalks.org to look it up)
 *
 * Optional:
 *   DNS_AID_HOSTS  — comma-separated hosts to advertise (default: apex + v3)
 *   DNS_AID_DRY_RUN=1 — print planned records without calling the API
 *
 * Spec: https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/
 * Scanner: https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md
 *
 * Usage:
 *   node scripts/publish-dns-aid.mjs
 *   DNS_AID_DRY_RUN=1 node scripts/publish-dns-aid.mjs
 */

const ZONE_NAME = process.env.CF_ZONE_NAME || 'pereiratechtalks.org';
const API = 'https://api.cloudflare.com/client/v4';
const DRY_RUN = process.env.DNS_AID_DRY_RUN === '1';

/** Hostnames that agents / scanners resolve (FQDN without trailing dot). */
const TARGET_HOSTS = (
  process.env.DNS_AID_HOSTS || 'pereiratechtalks.org,pereiratechtalks.org'
)
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);

/**
 * For zone pereiratechtalks.org:
 *   apex scan → name `_index._agents`
 *   v3 scan   → name `_index._agents.v3`
 */
function indexRecordName(targetHost, zoneName) {
  if (targetHost === zoneName) return '_index._agents';
  if (targetHost.endsWith(`.${zoneName}`)) {
    const sub = targetHost.slice(0, -(zoneName.length + 1));
    return `_index._agents.${sub}`;
  }
  throw new Error(`Target ${targetHost} is not under zone ${zoneName}`);
}

function mcpRecordName(targetHost, zoneName) {
  if (targetHost === zoneName) return '_mcp._agents';
  if (targetHost.endsWith(`.${zoneName}`)) {
    const sub = targetHost.slice(0, -(zoneName.length + 1));
    return `_mcp._agents.${sub}`;
  }
  throw new Error(`Target ${targetHost} is not under zone ${zoneName}`);
}

async function cf(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    const err = JSON.stringify(json.errors || json, null, 2);
    throw new Error(`Cloudflare API ${method} ${path} failed:\n${err}`);
  }
  return json;
}

async function resolveZoneId(token) {
  if (process.env.CF_ZONE_ID) return process.env.CF_ZONE_ID;
  const json = await cf(
    `/zones?name=${encodeURIComponent(ZONE_NAME)}&status=active`,
    { token }
  );
  const zone = json.result?.[0];
  if (!zone?.id) {
    throw new Error(`Zone not found for ${ZONE_NAME}`);
  }
  return zone.id;
}

function httpsRecordPayload(name, targetHost) {
  // Cloudflare DNS HTTPS (type 65) ServiceMode record.
  // data: priority + target + SvcParams (alpn, port).
  return {
    type: 'HTTPS',
    name,
    ttl: 3600,
    data: {
      priority: 1,
      target: targetHost,
      value: 'alpn="h2,h3" port=443',
    },
    comment: 'DNS-AID (draft-mozleywilliams-dnsop-dnsaid) — isitagentready',
  };
}

/**
 * Cloudflare's HTTPS record shape has varied by API version. Prefer the
 * structured `data` object; if create fails, retry with zone-file style content.
 */
function httpsRecordFallback(name, targetHost) {
  return {
    type: 'HTTPS',
    name,
    ttl: 3600,
    content: `1 ${targetHost}. alpn="h2,h3" port=443`,
    comment: 'DNS-AID (draft-mozleywilliams-dnsop-dnsaid) — isitagentready',
  };
}

async function upsertHttps(zoneId, token, name, targetHost) {
  const primary = httpsRecordPayload(name, targetHost);
  const fallback = httpsRecordFallback(name, targetHost);

  if (DRY_RUN) {
    console.log(`[dry-run] UPSERT HTTPS ${name} → ${targetHost}`);
    console.log(JSON.stringify(primary, null, 2));
    return;
  }

  const list = await cf(
    `/zones/${zoneId}/dns_records?type=HTTPS&name=${encodeURIComponent(
      `${name}.${ZONE_NAME}`
    )}`,
    { token }
  );
  const existing = list.result?.[0];

  try {
    if (existing?.id) {
      await cf(`/zones/${zoneId}/dns_records/${existing.id}`, {
        method: 'PUT',
        token,
        body: primary,
      });
      console.log(`Updated HTTPS ${name}.${ZONE_NAME}`);
    } else {
      await cf(`/zones/${zoneId}/dns_records`, {
        method: 'POST',
        token,
        body: primary,
      });
      console.log(`Created HTTPS ${name}.${ZONE_NAME}`);
    }
  } catch (err) {
    console.warn(
      `Primary payload failed (${err.message}); retrying fallback shape…`
    );
    if (existing?.id) {
      await cf(`/zones/${zoneId}/dns_records/${existing.id}`, {
        method: 'PUT',
        token,
        body: fallback,
      });
      console.log(`Updated HTTPS ${name}.${ZONE_NAME} (fallback)`);
    } else {
      await cf(`/zones/${zoneId}/dns_records`, {
        method: 'POST',
        token,
        body: fallback,
      });
      console.log(`Created HTTPS ${name}.${ZONE_NAME} (fallback)`);
    }
  }
}

async function ensureDnssec(zoneId, token) {
  if (DRY_RUN) {
    console.log('[dry-run] Would GET/PATCH DNSSEC status');
    return;
  }
  const status = await cf(`/zones/${zoneId}/dnssec`, { token });
  const state = status.result?.status;
  console.log(`DNSSEC status: ${state}`);
  if (state === 'disabled' || state === 'pending-disabled') {
    await cf(`/zones/${zoneId}/dnssec`, {
      method: 'PATCH',
      token,
      body: { status: 'active' },
    });
    console.log(
      'DNSSEC enabled. If the registrar is outside Cloudflare, publish the DS record shown in the dashboard.'
    );
  }
}

async function main() {
  const token = process.env.CF_API_TOKEN;
  if (!token && !DRY_RUN) {
    console.error(
      'Missing CF_API_TOKEN. Export a token with Zone.DNS Edit, or run with DNS_AID_DRY_RUN=1.'
    );
    console.error('Manual Cloudflare DNS UI steps: docs/aeo/DNS_AID.md');
    process.exit(1);
  }

  const zoneId =
    DRY_RUN && !token ? 'dry-run-zone' : await resolveZoneId(token);
  console.log(`Zone ${ZONE_NAME} (${zoneId})`);
  console.log(`Targets: ${TARGET_HOSTS.join(', ')}`);

  for (const host of TARGET_HOSTS) {
    await upsertHttps(zoneId, token, indexRecordName(host, ZONE_NAME), host);
    await upsertHttps(zoneId, token, mcpRecordName(host, ZONE_NAME), host);
  }

  if (token) {
    await ensureDnssec(zoneId, token);
  }

  console.log('\nVerify:');
  for (const host of TARGET_HOSTS) {
    const name = `${indexRecordName(host, ZONE_NAME)}.${ZONE_NAME}`;
    console.log(`  dig +short HTTPS ${name}`);
    console.log(
      `  curl -s "https://cloudflare-dns.com/dns-query?name=${name}&type=HTTPS" -H 'accept: application/dns-json'`
    );
  }
  console.log(
    '\nRe-scan: POST https://isitagentready.com/api/scan {"url":"https://pereiratechtalks.org"}'
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

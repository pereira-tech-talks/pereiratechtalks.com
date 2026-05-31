#!/usr/bin/env node
/**
 * Generate /.well-known/agent-skills/index.json per the Cloudflare Agent Skills
 * Discovery RFC v0.2.0. The index lists the agent-readiness skills the site
 * adopts, each with a SHA-256 digest of the SKILL.md bytes served at the URL.
 *
 * Spec: https://github.com/cloudflare/agent-skills-discovery-rfc
 * Schema: https://schemas.agentskills.io/discovery/0.2.0/schema.json
 *
 * Pointer-mode strategy (current): skills point at Cloudflare's canonical
 * SKILL.md files at isitagentready.com. We fetch the served bytes at build
 * time to compute the SHA-256 digest so the index stays in sync with what
 * Cloudflare actually serves.
 *
 * Run: `node scripts/generate-agent-skills-index.mjs` or via `pnpm run generate:agent-skills-index`.
 */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(
  __dirname,
  '..',
  'public',
  '.well-known',
  'agent-skills',
  'index.json'
);
const SCHEMA_URL = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';

const SKILLS = [
  {
    name: 'link-headers',
    description:
      'Advertise machine-readable resources via HTTP Link response headers per RFC 8288 and RFC 9727.',
  },
  {
    name: 'content-signals',
    description:
      'Declare AI content usage preferences (ai-train, search, ai-input) in robots.txt.',
  },
  {
    name: 'api-catalog',
    description:
      'Publish an API catalog at /.well-known/api-catalog per RFC 9727, using the linkset+json format.',
  },
  {
    name: 'oauth-discovery',
    description:
      'Publish OAuth 2.0 or OIDC discovery metadata so agents can discover authentication endpoints.',
  },
  {
    name: 'oauth-protected-resource',
    description:
      'Publish OAuth 2.0 protected resource metadata per RFC 9728 so agents know which authorization servers govern this resource.',
  },
  {
    name: 'mcp-server-card',
    description:
      'Publish an MCP server card at /.well-known/mcp/server-card.json so agents can discover this site as an MCP-compatible surface.',
  },
  {
    name: 'agent-skills',
    description:
      'Publish an agent skills discovery index at /.well-known/agent-skills/index.json per the Cloudflare Agent Skills Discovery RFC v0.2.0.',
  },
  {
    name: 'webmcp',
    description:
      'Expose site tools to in-browser AI agents via the WebMCP navigator.modelContext.registerTool() API.',
  },
];

const CLOUDFLARE_ROOT = 'https://isitagentready.com/.well-known/agent-skills';

async function sha256OfUrl(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  const hex = createHash('sha256').update(bytes).digest('hex');
  return `sha256:${hex}`;
}

async function main() {
  const entries = [];
  for (const skill of SKILLS) {
    const url = `${CLOUDFLARE_ROOT}/${skill.name}/SKILL.md`;
    let digest;
    try {
      digest = await sha256OfUrl(url);
    } catch (err) {
      console.warn(
        `[agent-skills-index] Skipping ${skill.name} — ${err.message}`
      );
      continue;
    }
    entries.push({
      name: skill.name,
      type: 'skill-md',
      description: skill.description,
      url,
      digest,
    });
  }

  const index = {
    $schema: SCHEMA_URL,
    skills: entries,
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

  console.log(
    `[agent-skills-index] Wrote ${entries.length} skills to ${OUT_PATH}`
  );
}

main().catch((err) => {
  console.error('[agent-skills-index] FAILED:', err);
  process.exit(1);
});

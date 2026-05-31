#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');

const HTML_BUDGET_BYTES = 320_000;
const SHARD_GZIP_BUDGET_BYTES = 120_000;

const htmlTargets = [
  'blog/index.html',
  'es/blog/index.html',
  'blog/tag/tech/index.html',
  'es/blog/tag/tech/index.html',
];

const shardTargets = ['api/posts-en.json', 'api/posts-es.json'];

function readBytes(relativePath) {
  const fullPath = join(DIST, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing build artifact: ${relativePath}`);
  }
  return statSync(fullPath).size;
}

function readGzipBytes(relativePath) {
  const fullPath = join(DIST, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing build artifact: ${relativePath}`);
  }
  const raw = readFileSync(fullPath);
  return gzipSync(raw).length;
}

let hasFailures = false;

console.log('Search Performance Budgets');
console.log('==========================');

for (const relativePath of htmlTargets) {
  const bytes = readBytes(relativePath);
  const ok = bytes <= HTML_BUDGET_BYTES;
  console.log(
    `${ok ? 'PASS' : 'FAIL'} HTML ${relativePath}: ${bytes}B (budget ${HTML_BUDGET_BYTES}B)`
  );
  if (!ok) hasFailures = true;
}

for (const relativePath of shardTargets) {
  const gzipBytes = readGzipBytes(relativePath);
  const ok = gzipBytes <= SHARD_GZIP_BUDGET_BYTES;
  console.log(
    `${ok ? 'PASS' : 'FAIL'} GZIP ${relativePath}: ${gzipBytes}B (budget ${SHARD_GZIP_BUDGET_BYTES}B)`
  );
  if (!ok) hasFailures = true;
}

if (hasFailures) {
  console.error('\nBudget check failed.');
  process.exit(1);
}

console.log('\nAll search performance budgets passed.');

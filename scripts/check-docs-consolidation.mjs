#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const sidebar = readFileSync(new URL('docs-site/sidebars.js', root), 'utf8');
const catalog = JSON.parse(readFileSync(new URL('DOCS_CONSOLIDATION_MAP.json', root), 'utf8'));
const ids = new Set([
  ...[...sidebar.matchAll(/"id": "([^"]+)"/g)].map((x) => x[1]),
  ...[...sidebar.matchAll(/^\s{8,}"([^"]+)",?$/gm)].map((x) => x[1]),
]);
const pages = catalog.sections.flatMap((section) => section.pages);
const sources = pages.flatMap((page) => page.sources);
const targets = pages.map((page) => page.target);
assert.deepEqual(pages.filter((page) => page.createdAfterConsolidation).map((page) => page.target),
  catalog.addedAfterOriginalConsolidation, 'new canonical pages must be explicitly registered');

assert.equal(catalog.sections.length, 8, 'expected eight sections');
assert.equal(pages.length, catalog.targetPageCount, 'unexpected change to canonical page inventory');
assert.equal(sources.length, catalog.originalPageCount);
assert.equal(new Set(sources).size, sources.length, 'duplicate source mapping');
assert.equal(new Set(targets).size, targets.length, 'duplicate canonical destination');
assert.equal(catalog.previewRoutes.length, sources.length, 'missing preview routes');

for (const page of pages) {
  if (page.createdAfterConsolidation) {
    assert.equal(page.sources.length, 0, 'new canonical page must have no historical source: ' + page.target);
    assert(catalog.addedAfterOriginalConsolidation.includes(page.target),
      'unregistered page added after consolidation: ' + page.target);
  } else {
    assert(page.sources.includes(page.target), 'canonical page missing own source: ' + page.target);
  }
  const file = new URL('content/en/docs-next/' + page.target + '.md', root);
  assert(existsSync(file), 'canonical Markdown file missing: ' + page.target);
}

if (ids.size === catalog.originalPageCount) {
  // PR1: current, unconsolidated sidebar.
  for (const id of ids) assert(sources.includes(id), 'source absent from mapping: ' + id);
} else if (ids.size === catalog.targetPageCount) {
  // PR2+: after sidebar consolidation.
  for (const id of ids) assert(targets.includes(id), 'unexpected retained page: ' + id);
  for (const id of targets) assert(ids.has(id), 'missing retained sidebar page: ' + id);
} else {
  assert.fail('unexpected sidebar size: ' + ids.size);
}

const previewFrom = new Set();
for (const route of catalog.previewRoutes) {
  assert(!previewFrom.has(route.from), 'duplicate preview URL: ' + route.from);
  previewFrom.add(route.from);
  assert(route.to.startsWith('/docs-next/'), 'invalid preview destination: ' + route.to);
}
for (const route of catalog.legacyEnglishRoutes) {
  assert(sources.includes(route.source), 'unknown legacy source: ' + route.legacy);
  assert(route.newCanonical.startsWith('/docs/'), 'invalid public destination: ' + route.legacy);
}

console.log('OK: ' + sources.length + ' original pages -> ' + targets.length +
  ' canonical pages, ' + catalog.sections.length + ' sections, ' +
  catalog.legacyEnglishRoutes.length + ' legacy English routes.');

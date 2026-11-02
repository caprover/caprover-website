#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const sidebar = readFileSync(new URL('docs-site/sidebars-next.js', root), 'utf8');
const catalog = JSON.parse(readFileSync(new URL('DOCS_CONSOLIDATION_MAP.json', root), 'utf8'));
const ids = new Set([
  ...[...sidebar.matchAll(/"id": "([^"]+)"/g)].map(x => x[1]),
  ...[...sidebar.matchAll(/^\\s{8,}"([^"]+)",?$/gm)].map(x => x[1]),
]);
const pages = catalog.sections.flatMap(x => x.pages);
const sources = pages.flatMap(p => p.sources);
assert.equal(catalog.sections.length, 8);
assert.equal(pages.length, 47);
assert.equal(sources.length, ids.size);
assert.equal(new Set(sources).size, sources.length, 'duplicate source');
assert.equal(new Set(pages.map(p => p.target)).size, pages.length, 'duplicate destination');
for (const id of ids) assert(sources.includes(id), 'missing source ' + id);
for (const page of pages) {
  assert(ids.has(page.target), 'unknown retained target ' + page.target);
  assert(page.sources.includes(page.target), 'retained page missing itself ' + page.target);
}
assert.equal(catalog.previewRoutes.length, ids.size);
for (const r of catalog.legacyEnglishRoutes) {
  assert(ids.has(r.source), 'unknown legacy source ' + r.legacy);
  assert(r.newCanonical.startsWith('/docs/'), 'bad legacy destination ' + r.legacy);
}
console.log('OK: ' + ids.size + ' source pages -> ' + pages.length +
  ' canonical pages; ' + catalog.sections.length + ' sections; ' +
  catalog.legacyEnglishRoutes.length + ' historical English routes.');

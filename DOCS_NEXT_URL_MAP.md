# Documentation cutover routes

The consolidated 48-page documentation is served at `/docs/*`. The original
preview URL `/docs-next/*` redirects to the corresponding page in `/docs/*`.

The original English documentation paths under `/docs/*` redirect to their
consolidated destinations. The Spanish and Chinese translations from the old
site remain available at `/es-ES/docs-legacy/*` and `/zh-CN/docs-legacy/*`.
Old translated routes that were superseded redirect to the matching archive
page. Paths that are also current canonical pages show the new English page
with an archive link.

`docs-legacy` is intentionally excluded from search indexing and the sitemap.

**Authoritative URL inventory:** [`DOCS_CONSOLIDATION_MAP.json`](DOCS_CONSOLIDATION_MAP.json)

- `previewRoutes`: all 141 original preview paths, mapped to the retained 47 pages.
- `addedAfterOriginalConsolidation`: the 48th page, `installation/manual`.
- `legacyEnglishRoutes`: all 36 historical English documentation paths.

The combined-site composer writes static HTML redirects for legacy paths,
preview paths, and historical `/docs/<locale>/*.html` aliases. Its smoke
tests check paths in all enabled locales. Query strings and existing fragments
are preserved where the redirect destination supports them.

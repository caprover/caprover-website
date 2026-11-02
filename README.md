# CapRover Website

Source for [caprover.com](https://caprover.com), containing two independently built applications:

- `marketing-site/`: Next.js marketing site
- `docs-site/`: Docusaurus 3 documentation site
- `content/`: English source content and translations, grouped by locale
- `scripts/`: composition and production smoke checks

The production build uses Docusaurus as the base, then overlays the marketing
site's `index.html`, `_next/`, and `homepage-assets/` output.

## Marketing site development

Requires Node.js 22.13 or newer.

```sh
cd marketing-site
npm ci
npm run dev
```

Run checks:

```sh
npm run lint
npm run format:check
npm test
```

## Documentation development

The documentation site requires Node.js 20 or newer. Use Node.js 22 to match
the production workflow.

```sh
cd docs-site
npm ci
npm start
```

The canonical 48-page documentation is maintained in `content/en/docs-next/`
and published at `/docs/*`, using `docs-site/sidebars.js`. The source directory
keeps its historical name to keep this routing cutover small.

The older translated documentation remains in `content/<locale>/docs/` and
is published at `/<locale>/docs-legacy/*` using `sidebars-legacy.js`.
Spanish/Chinese `/docs/*` pages currently show English with a link to the
archived translation. Archived pages are excluded from search indexing and
the sitemap. See [cutover route policy](DOCS_NEXT_URL_MAP.md).

Site commands validate the locale content and generate Docusaurus i18n inputs
before every build.

### Documentation translations

Docusaurus internationalization is configured by `content/locales.json`. English
is the source language. English documentation is served from `/docs/*`. Current documentation under
`/es-ES/docs/*` and `/zh-CN/docs/*` is an explicitly labeled English fallback.
The existing Spanish and Chinese translations are available under
`/es-ES/docs-legacy/*` and `/zh-CN/docs-legacy/*`.
Compatibility redirects preserve historical `/docs/<locale>/*.html` URLs.

Each locale is complete and self-contained under `content/<locale>/`:

- `docs/` contains the archived documentation Markdown; the 48 new English docs live under `en/docs-next/`.
- `marketing.json` contains the flat Next.js marketing-site message catalog.
- `docs-ui.json` contains Docusaurus navigation, sidebar, document-title, and
  interface strings.
- Add a locale to `content/locales.json` after all three surfaces are complete.

Spanish and Simplified Chinese remain enabled. The Docusaurus language menu
switches locale prefixes. The new pages are untranslated; the archived
`docs-legacy` pages retain their original Spanish and Chinese content.

On an unprefixed page view, the combined static site uses a saved language-menu
choice or selects a supported locale from the browser's preferences. On current docs pages, a visible notice identifies the English fallback and
links to the corresponding language's previous documentation.

## Translation guidelines

Follow the repository-wide authoring and translation rules in
[`content/README.md`](content/README.md).

## Build the combined site

From the repository root:

```sh
(cd docs-site && npm ci && npm run clean-build)
(cd marketing-site && npm ci && npm run lint && npm run format:check && npm test)
node scripts/compose-site.mjs
node scripts/smoke-combined-site.mjs
```

The deployable artifact is written to `build/combined-site/`.

## Deployment

Pushes to `master` run `.github/workflows/website-publish.yml`, build both applications, compose and smoke-test the artifact, then publish it to GitHub Pages. Do not publish either framework's output directly.

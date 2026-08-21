# CapRover Website

Source for [caprover.com](https://caprover.com), containing two independently built applications:

- `marketing-site/`: Next.js marketing site
- `docs-site/`: Docusaurus v1 documentation site
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

The legacy Docusaurus build currently requires Node.js 10.

```sh
cd docs-site
npm install
npm start
```

Add English Markdown files in `content/en/docs/` and register them in
`docs-site/sidebars.json`. The documentation commands generate the framework's
legacy input directories from `content/` before starting or building.

### Documentation translations

Docusaurus internationalization is configured by `content/locales.json`. English
is the source language. Docusaurus serves it from `/docs/en/*.html` and keeps the
existing `/docs/*.html` URLs as redirects.

Each locale is complete and self-contained under `content/<locale>/`:

- `docs/` contains documentation Markdown.
- `marketing.json` contains the flat Next.js marketing-site message catalog.
- `docs-ui.json` contains Docusaurus navigation, sidebar, document-title, and
  interface strings.
- Add a locale to `content/locales.json` after all three surfaces are complete.

Spanish is enabled in `content/locales.json`. Its documentation is published at
`/docs/es-ES/*.html`, and the Docusaurus language menu switches between English
and Spanish versions of the current document.

## Translation guidelines

Follow the repository-wide authoring and translation rules in
[`content/README.md`](content/README.md).

## Build the combined site

From the repository root:

```sh
(cd docs-site && npm install && npm run clean-build)
(cd marketing-site && npm ci && npm run lint && npm run format:check && npm test)
node scripts/compose-site.mjs
node scripts/smoke-combined-site.mjs
```

The deployable artifact is written to `build/combined-site/`.

## Deployment

Pushes to `master` run `.github/workflows/website-publish.yml`, build both applications, compose and smoke-test the artifact, then publish it to GitHub Pages. Do not publish either framework's output directly.

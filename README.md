# CapRover Website

Source for [caprover.com](https://caprover.com), containing two independently built applications:

- `homepage/`: Next.js static homepage
- `website/`: Docusaurus v1 documentation
- `content/`: English source content and translations, grouped by locale
- `scripts/`: composition and production smoke checks

The production build uses Docusaurus as the base, then overlays the homepage's `index.html`, `_next/`, and `homepage-assets/` output. `homepage/` is the source of truth for the root homepage.

## Homepage development

Requires Node.js 22.13 or newer.

```sh
cd homepage
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
cd website
npm install
npm start
```

Add English Markdown files in `content/en/docs/` and register them in
`website/sidebars.json`. The documentation commands generate the framework's
legacy input directories from `content/` before starting or building.

### Documentation translations

Docusaurus internationalization is configured by `content/locales.json`. English
is the source language. Docusaurus serves it from `/docs/en/*.html` and keeps the
existing `/docs/*.html` URLs as redirects.

Each locale is complete and self-contained under `content/<locale>/`:

- `docs/` contains documentation Markdown.
- `website.json` contains the flat Next.js website message catalog.
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
(cd website && npm install && npm run clean-build)
(cd homepage && npm ci && npm run lint && npm run format:check && npm test)
node scripts/compose-site.mjs
node scripts/smoke-combined-site.mjs
```

The deployable artifact is written to `build/combined-site/`.

## Deployment

Pushes to `master` run `.github/workflows/website-publish.yml`, build both applications, compose and smoke-test the artifact, then publish it to GitHub Pages. Do not publish either framework's output directly.

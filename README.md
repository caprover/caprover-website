# CapRover Website

Source for [caprover.com](https://caprover.com), containing two independently built applications:

- `homepage/`: Next.js static homepage
- `website/`: Docusaurus v1 documentation
- `docs/`: documentation Markdown
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
npm test
```

## Documentation development

The legacy Docusaurus build currently requires Node.js 10.

```sh
cd website
npm install
npm start
```

Add Markdown files in `docs/` and register them in `website/sidebars.json`.

### Documentation translations

Docusaurus internationalization is configured in `website/languages.js`. English
is the source language. Docusaurus serves it from `/docs/en/*.html` and keeps the
existing `/docs/*.html` URLs as redirects.

Translations are committed directly to the repository:

- Add translated Markdown under `website/translated_docs/<locale>/`, preserving
  the source layout from `docs/`.
- Add translated navigation, sidebar, and document-title strings in
  `website/i18n/<locale>.json`, using `website/i18n/en.json` as the source.
- Add a locale to `website/languages.js` only after its documents and UI strings
  are complete.

`website/translated_docs/es-ES/` is reserved for the first Spanish translation.
Until that translation is complete, Spanish is intentionally not enabled in
`website/languages.js`.

## Build the combined site

From the repository root:

```sh
(cd website && npm install && npm run clean-build)
(cd homepage && npm ci && npm run lint && npm test)
node scripts/compose-site.mjs
node scripts/smoke-combined-site.mjs
```

The deployable artifact is written to `build/combined-site/`.

## Deployment

Pushes to `master` run `.github/workflows/website-publish.yml`, build both applications, compose and smoke-test the artifact, then publish it to GitHub Pages. Do not publish either framework's output directly.

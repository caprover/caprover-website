# CapRover Website

Source for [caprover.com](https://caprover.com), containing two independently built applications:

- `marketing-site/`: Next.js marketing site
- `docs-site/`: Docusaurus 3 documentation site
- `content/`: English source content and translations, grouped by locale
- `docs-compat/`: historical documentation routes, anchors, and destinations
- `scripts/`: localization, composition, and site validation

The production build uses Docusaurus as the base, adds the localized marketing
homepages, comparison pages, and static assets, and generates the combined
sitemap and documentation redirects.

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

The canonical documentation is maintained in `content/en/docs/` and published at
`/docs/*`, using `docs-site/sidebars.js`. The combined build generates compatibility
redirects from `docs-compat/` for historical pages and section links. Git history
contains the retired documentation.

Site commands validate the locale content and generate Docusaurus i18n inputs
before every build.

### Documentation translations

Docusaurus internationalization is configured by `content/locales.json`. English
is the source language. English documentation is served from `/docs/*`. Spanish and Chinese
translations are published under `/es-ES/docs/*` and `/zh-CN/docs/*`.
Compatibility redirects cover historical URLs under `/docs/`, `/docs-next/`, and
`/docs-legacy/`, including localized URLs and `.html` variants.

Each locale is complete and self-contained under `content/<locale>/`:

- `docs/` contains documentation Markdown for the locale.
- `marketing.json` contains the flat Next.js marketing-site message catalog.
- `docs-ui.json` contains Docusaurus navigation, sidebar, and footer strings.
- Add a locale to `content/locales.json` after all three surfaces are complete.

Spanish and Simplified Chinese remain enabled. The Docusaurus language menu
switches between translated current pages, preserving the route across locales.

On an unprefixed page view, the combined static site uses a saved language-menu
choice or selects a supported locale from the browser's preferences. An anchored
documentation link stays in the requested language. Source translations are
tracked under `content/`, and the build generates Docusaurus inputs under
`docs-site/i18n/`. Review new technical content in every enabled locale.

## Translation guidelines

Follow the repository-wide authoring and translation rules in
[`content/README.md`](content/README.md).

## Build the combined site

From the repository root:

```sh
node scripts/check-docs-translations.mjs
(cd docs-site && npm ci && npm run clean-build)
(cd marketing-site && npm ci && npm run lint && npm run format:check && npm test)
node scripts/compose-site.mjs
node scripts/smoke-combined-site.mjs
```

The deployable artifact is written to `build/combined-site/`.
The pull request workflow also runs the historical redirect audit and Chromium
navigation tests against this artifact.

## Deployment

Pushes to `master` run `.github/workflows/website-publish.yml`, build both applications, compose and smoke-test the artifact, then publish it to GitHub Pages. Do not publish either framework's output directly.

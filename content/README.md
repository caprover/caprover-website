# Localized content

All reader-facing content is organized by locale:

- `<locale>/docs/`: documentation Markdown
- `<locale>/marketing.json`: flat Next.js marketing-site message catalog
- `<locale>/docs-ui.json`: flat Docusaurus navigation, sidebar, and footer strings
- `locales.json`: shared locale configuration

English (`en`) is the source locale. Add a locale to `locales.json` only after all three content surfaces are complete. Docusaurus build inputs are generated from this directory by `scripts/prepare-localized-content.js`.

After changing navigation, sidebar categories, or footer strings, run
`npm run write-translations` from `docs-site/`. The command refreshes the canonical
English `docs-ui.json`; update the corresponding keys in every enabled locale
before building. Document titles and sidebar labels live in each Markdown file's
frontmatter.

## Common workflows

### Add a language

1. Copy `content/en/` to `content/<locale>/` and translate all three surfaces:
   `docs/`, `marketing.json`, and `docs-ui.json`.
2. Preserve documentation paths and frontmatter IDs. Preserve all marketing and
   documentation UI catalog keys. Values ending in `.key` or `.status` must
   remain equal to their English values. Record locale-specific terminology in
   `content/glossaries/<locale>.md` when a shared decision is useful.
3. Import its marketing catalog and register it in `messagesByLocale` in
   `marketing-site/i18n/messages.ts`.
4. Mirror `marketing-site/app/(spanish)/` as a new locale route group. Copy its
   `layout.tsx` at the group root, then mirror the `es-ES/` route tree under
   `<locale>/`, including the homepage, comparison hub, and Coolify, Dokploy,
   and Dokku comparison pages. Replace every hardcoded `es-ES` value in the
   copied files with the new locale.
5. Add the completed locale to `content/locales.json` with its public path
   prefix. Metadata, sitemap entries, composition, and route smoke coverage are
   derived from this manifest.
6. Run the full validation sequence below before publishing the locale.

The locale switcher reads enabled locales from `content/locales.json`. Verify
font coverage, translated metadata, documentation links, `hreflang` values, and
every homepage and comparison route for the new language.

### Add a documentation page

1. Add the English Markdown file under `content/en/docs/`.
2. Add the same relative file under every enabled locale's `docs/` directory.
   Keep the filename, directory structure, and frontmatter ID identical.
3. Add the document's relative path without `.md` to `docs-site/sidebars.js`.
   For example, use `ci-cd-integration/deploy-from-github` for
   `content/en/docs/ci-cd-integration/deploy-from-github.md`.
4. Run the full validation sequence below.

### Add a marketing-site string

1. Add a flat dotted key and English value to `content/en/marketing.json`.
2. Add the same key to every enabled locale's `marketing.json` and translate its
   value. Structural values ending in `.key` or `.status` stay in English.
   Numbered groups use contiguous indexes starting at `0`.
3. Read the value through the typed messages object in the relevant Next.js
   component. The English catalog automatically defines the TypeScript message
   shape.
4. Run the Next.js checks and the full validation sequence below.

### Refresh documentation UI strings

Run the following after changing sidebar category labels, navigation, footer,
or other custom Docusaurus reader-facing strings:

```sh
cd docs-site
npm run write-translations
```

The command updates `content/en/docs-ui.json`. Apply the corresponding changes
to every enabled locale's `docs-ui.json`. The `docs-site/i18n/` directory contains
generated build inputs and should not be edited directly.

### Validate localized content

Use Node.js 22.13 or newer for both applications.

From the repository root:

```sh
node scripts/prepare-localized-content.js
(cd docs-site && npm run clean-build)
(cd marketing-site && npm run lint && npm run format:check && npm test)
node scripts/compose-site.mjs
node scripts/smoke-combined-site.mjs
git diff --check
```

`npm start`, `npm run build`, and `npm run clean-build` in `docs-site/` invoke the
content preparation script automatically.

The preparation script validates locale codes and URL prefixes, catalog key and
value shapes, contiguous list indexes, sidebar coverage, documentation file and
frontmatter parity, and protected structural values. Review preservation of
code, links, anchors, Markdown structure, and translation fluency manually.

Locale-specific terminology guidance may be recorded under `glossaries/`.

## Translation guidelines

- Write natural technical prose for software engineers. Prefer terminology commonly used by engineers in the target language over literal translation.
- Keep product, project, company, and technology names unchanged, including CapRover, Docker, Docker Swarm, nginx, GitHub, GitLab, and DigitalOcean.
- Keep established English engineering terms when that is the target-language convention. Use one term consistently across the locale.
- Preserve fenced code, inline code, commands, flags, environment variables, identifiers, config keys and values, file paths, URLs, domains, image names, tags, protocols, and acronyms exactly.
- Preserve filenames, directory structure, frontmatter IDs, anchors, link destinations, and Markdown or HTML structure. Translate reader-facing titles, headings, link text, alt text, and prose.
- Match UI labels to the language currently shown by the product. Keep the source label when the corresponding UI has not been localized.
- Preserve the source meaning, examples, warnings, emphasis, and level of technical detail.
- Before enabling a locale, verify source-file parity, matching IDs and structure, unchanged code and link targets, consistent terminology, and fluent review by a target-language speaker familiar with software engineering.

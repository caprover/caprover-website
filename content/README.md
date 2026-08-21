# Localized content

All reader-facing content is organized by locale:

- `<locale>/docs/`: documentation Markdown
- `<locale>/homepage.json`: flat Next.js message catalog
- `<locale>/docs-ui.json`: Docusaurus navigation, sidebar, document-title, and interface strings
- `locales.json`: shared locale configuration

English (`en`) is the source locale. Add a locale to `locales.json` only after all three content surfaces are complete. Docusaurus build inputs are generated from this directory by `scripts/prepare-localized-content.js`.

After changing documentation titles or navigation strings, run
`npm run write-translations` from `website/`. The command refreshes the canonical
English `docs-ui.json`; update the corresponding keys in every enabled locale
before building.

## Common workflows

### Add a language

1. Copy `content/en/` to `content/<locale>/` and translate all three surfaces:
   `docs/`, `homepage.json`, and `docs-ui.json`.
2. Preserve documentation paths and frontmatter IDs. Preserve all homepage and
   documentation UI keys. Values ending in `.key` or `.status` must remain equal
   to their English values.
3. Add the completed locale to `content/locales.json` with its public path
   prefix.
4. Add its code to `supportedLocaleCodes` in `homepage/i18n/config.ts`.
5. Import its homepage catalog and register it in `messagesByLocale` in
   `homepage/i18n/messages.ts`.
6. Add thin localized route files and a locale layout under
   `homepage/app/(<language>)/<locale>/`, following the existing Spanish route
   group.
7. Add the locale's canonical and alternate URLs in
   `homepage/i18n/metadata.ts` and `homepage/app/sitemap.ts`.
8. Extend `scripts/compose-site.mjs`, `scripts/smoke-combined-site.mjs`, and the
   homepage static-export tests to cover the new routes.
9. Run the full validation sequence below before enabling or publishing the
   locale.

The locale switcher reads enabled locales from `content/locales.json`. Verify
font coverage, translated metadata, documentation links, `hreflang` values, and
every homepage and comparison route for the new language.

### Add a documentation page

1. Add the English Markdown file under `content/en/docs/`.
2. Add the same relative file under every enabled locale's `docs/` directory.
   Keep the filename, directory structure, and frontmatter ID identical.
3. Register the document ID in `website/sidebars.json`.
4. From `website/`, run `npm run write-translations`. This refreshes
   `content/en/docs-ui.json` with the document title and sidebar label.
5. Add translations for the new keys to every enabled locale's `docs-ui.json`.
6. Run the full validation sequence below.

### Add a homepage string

1. Add a flat dotted key and English value to `content/en/homepage.json`.
2. Add the same key to every enabled locale's `homepage.json` and translate its
   value. Structural values ending in `.key` or `.status` stay in English.
3. Read the value through the typed messages object in the relevant Next.js
   component. The English catalog automatically defines the TypeScript message
   shape.
4. Run the homepage checks and the full validation sequence below.

### Refresh documentation UI strings

Run the following after changing document titles, sidebar labels, navigation,
or other Docusaurus reader-facing strings:

```sh
cd website
npm run write-translations
```

The command updates `content/en/docs-ui.json`. Apply the corresponding changes
to every enabled locale's `docs-ui.json`. The `docs/`,
`website/translated_docs/`, and `website/i18n/` directories are generated build
inputs and should not be edited directly.

### Validate localized content

From the repository root:

```sh
node scripts/prepare-localized-content.js
(cd website && npm run clean-build)
(cd homepage && npm run lint && npm test)
node scripts/compose-site.mjs
node scripts/smoke-combined-site.mjs
git diff --check
```

`npm start`, `npm run build`, and `npm run clean-build` in `website/` invoke the
content preparation script automatically.

## Translation guidelines

- Write natural technical prose for software engineers. Prefer terminology commonly used by engineers in the target language over literal translation.
- Keep product, project, company, and technology names unchanged, including CapRover, Docker, Docker Swarm, nginx, GitHub, GitLab, and DigitalOcean.
- Keep established English engineering terms when that is the target-language convention. Use one term consistently across the locale.
- Preserve fenced code, inline code, commands, flags, environment variables, identifiers, config keys and values, file paths, URLs, domains, image names, tags, protocols, and acronyms exactly.
- Preserve filenames, directory structure, frontmatter IDs, anchors, link destinations, and Markdown or HTML structure. Translate reader-facing titles, headings, link text, alt text, and prose.
- Match UI labels to the language currently shown by the product. Keep the source label when the corresponding UI has not been localized.
- Preserve the source meaning, examples, warnings, emphasis, and level of technical detail.
- Before enabling a locale, verify source-file parity, matching IDs and structure, unchanged code and link targets, consistent terminology, and fluent review by a target-language speaker familiar with software engineering.

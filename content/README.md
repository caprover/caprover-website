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

## Translation guidelines

- Write natural technical prose for software engineers. Prefer terminology commonly used by engineers in the target language over literal translation.
- Keep product, project, company, and technology names unchanged, including CapRover, Docker, Docker Swarm, nginx, GitHub, GitLab, and DigitalOcean.
- Keep established English engineering terms when that is the target-language convention. Use one term consistently across the locale.
- Preserve fenced code, inline code, commands, flags, environment variables, identifiers, config keys and values, file paths, URLs, domains, image names, tags, protocols, and acronyms exactly.
- Preserve filenames, directory structure, frontmatter IDs, anchors, link destinations, and Markdown or HTML structure. Translate reader-facing titles, headings, link text, alt text, and prose.
- Match UI labels to the language currently shown by the product. Keep the source label when the corresponding UI has not been localized.
- Preserve the source meaning, examples, warnings, emphasis, and level of technical detail.
- Before enabling a locale, verify source-file parity, matching IDs and structure, unchanged code and link targets, consistent terminology, and fluent review by a target-language speaker familiar with software engineering.

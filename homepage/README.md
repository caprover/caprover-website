# CapRover website

The redesigned landing page for [CapRover](https://caprover.com/).

## Development

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

## Checks

```sh
npm run lint
npm test
```

`npm run build` exports the complete static website to `out/`.

## Internationalization

Locale configuration and URL helpers live in `i18n/config.ts`. English remains
the default locale and keeps the existing unprefixed public routes. The static
`/en/` homepage alias exists for compatibility with Docusaurus v1 localized
documentation and has `/` as its canonical URL.

User-facing copy, including metadata and accessibility labels, lives in the
English JSON catalogs under `i18n/messages/en/`. Components load those catalogs
through `i18n/messages.ts`, whose `Messages` type defines the required shape for
every future locale. URLs, code samples, commands, and product names remain in
the application where they are not translation content.

Only complete translations should be added to `ENABLED_LOCALES`. A localized
site should use its locale as the first path segment, such as `/es-ES/` and
`/es-ES/compare/`, add a complete catalog to the locale map in
`i18n/messages.ts`, and link to documentation through `docsUrl`.

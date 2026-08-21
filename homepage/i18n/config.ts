import localeManifest from "../../content/locales.json";

export const DEFAULT_LOCALE = "en" as const;

const supportedLocaleCodes = ["en", "es-ES"] as const;
export type Locale = (typeof supportedLocaleCodes)[number];

function isLocale(code: string): code is Locale {
  return supportedLocaleCodes.includes(code as Locale);
}

export const ENABLED_LOCALES = localeManifest
  .filter((entry) => entry.enabled)
  .map((entry) => {
    if (!isLocale(entry.code)) {
      throw new Error(`Unsupported enabled locale: ${entry.code}`);
    }
    return { code: entry.code, label: entry.label, pathPrefix: entry.pathPrefix };
  });

const configuredDefault = localeManifest.find((entry) => entry.enabled && entry.default)?.code;
if (configuredDefault !== DEFAULT_LOCALE) {
  throw new Error(`Expected ${DEFAULT_LOCALE} to be the enabled default locale`);
}

export function localizedPath(path: string, locale: Locale = DEFAULT_LOCALE) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const prefix = ENABLED_LOCALES.find((entry) => entry.code === locale)?.pathPrefix;

  if (prefix === undefined) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  return `${prefix}${normalizedPath}`;
}

export function docsUrl(documentId: string, locale: Locale = DEFAULT_LOCALE) {
  return `https://caprover.com/docs/${locale}/${documentId}.html`;
}

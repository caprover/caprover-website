import localeManifest from "../../content/locales.json";
import { messagesByLocale, type Locale } from "./messages";

export type { Locale } from "./messages";

function isLocale(code: string): code is Locale {
  return code in messagesByLocale;
}

export const ENABLED_LOCALES = localeManifest
  .filter((entry) => entry.enabled)
  .map((entry) => {
    if (!isLocale(entry.code)) {
      throw new Error(`Unsupported enabled locale: ${entry.code}`);
    }
    return {
      code: entry.code,
      label: entry.label,
      pathPrefix: entry.pathPrefix,
    };
  });

const configuredDefault = localeManifest.find(
  (entry) => entry.enabled && entry.default,
);

if (!configuredDefault || !isLocale(configuredDefault.code)) {
  throw new Error(
    "An enabled default locale with a registered marketing catalog is required",
  );
}

export const DEFAULT_LOCALE: Locale = configuredDefault.code;

export function localizedPath(path: string, locale: Locale = DEFAULT_LOCALE) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const prefix = ENABLED_LOCALES.find(
    (entry) => entry.code === locale,
  )?.pathPrefix;

  if (prefix === undefined) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  return `${prefix}${normalizedPath}`;
}

export function docsUrl(documentId: string, locale: Locale = DEFAULT_LOCALE) {
  const configuredLocale = ENABLED_LOCALES.find(
    (entry) => entry.code === locale,
  );

  if (!configuredLocale) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  return `https://caprover.com${configuredLocale.pathPrefix}/docs/${documentId}`;
}

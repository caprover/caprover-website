export const DEFAULT_LOCALE = "en";

export const ENABLED_LOCALES = [
  { code: "en", label: "English", pathPrefix: "" },
] as const;

export type Locale = (typeof ENABLED_LOCALES)[number]["code"];

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

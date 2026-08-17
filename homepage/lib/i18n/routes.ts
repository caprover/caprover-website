import { defaultLocale, getLocaleConfig, localeCatalog, type Locale } from "./locales";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_ORIGIN = "https://caprover.com";
export const GITHUB = "https://github.com/caprover/caprover";
export const SLACK =
  "https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA";
export const LIVE_DEMO = "https://captain.server.demo.caprover.com/?demo=true";
export const TUTORIAL = "https://www.youtube.com/watch?v=VPHEXPfsvyQ";
export const ASSET_PATH = "/homepage-assets";

export function withBase(path: string) {
  return `${BASE_PATH}${path}`;
}

export function asset(path: string) {
  return withBase(`${ASSET_PATH}${path}`);
}

export function homePath(locale: Locale) {
  const prefix = getLocaleConfig(locale).prefix;
  return prefix ? `${prefix}/` : "/";
}

export function comparePath(locale: Locale, slug = "") {
  const prefix = getLocaleConfig(locale).prefix;
  return `${prefix}/compare/${slug}`;
}

export function docsPath(locale: Locale, doc = "get-started") {
  const prefix = getLocaleConfig(locale).prefix;
  return prefix ? `/docs${prefix}/${doc}.html` : `/docs/${doc}.html`;
}

export function localizedPath(locale: Locale, path: string) {
  const normalized = !path || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const prefix = getLocaleConfig(locale).prefix;

  if (!prefix) {
    return normalized;
  }

  return normalized === "/" ? `${prefix}/` : `${prefix}${normalized}`;
}

export function languageSwitchHref(locale: Locale, path: string) {
  return withBase(localizedPath(locale, path));
}

export function alternateLanguages(path: string) {
  const languages: Record<string, string> = {
    "x-default": `${SITE_ORIGIN}${localizedPath(defaultLocale, path)}`,
  };

  for (const locale of localeCatalog) {
    languages[locale.htmlLang] = `${SITE_ORIGIN}${localizedPath(locale.code, path)}`;
  }

  return languages;
}

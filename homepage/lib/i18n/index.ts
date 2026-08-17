import { enCompareChrome, enCompareHub, enHome } from "./en";
import { defaultLocale, getLocaleConfig, type Locale } from "./locales";
import type { CompareChromeMessages, CompareHubMessages, HomeMessages } from "./types";
import { zhCompareChrome, zhCompareHub, zhHome } from "./zh";

export type { Locale } from "./locales";
export {
  defaultLocale,
  getLocaleConfig,
  isDefaultLocale,
  localeCatalog,
  locales,
} from "./locales";
export {
  ASSET_PATH,
  GITHUB,
  LIVE_DEMO,
  SITE_ORIGIN,
  SLACK,
  TUTORIAL,
  alternateLanguages,
  asset,
  comparePath,
  docsPath,
  homePath,
  languageSwitchHref,
  localizedPath,
  withBase,
} from "./routes";

const homeMessages: Record<Locale, HomeMessages> = {
  en: enHome,
  "zh-CN": zhHome,
};

const compareChrome: Record<Locale, CompareChromeMessages> = {
  en: enCompareChrome,
  "zh-CN": zhCompareChrome,
};

const compareHub: Record<Locale, CompareHubMessages> = {
  en: enCompareHub,
  "zh-CN": zhCompareHub,
};

export function getHomeMessages(locale: Locale) {
  return homeMessages[locale] ?? homeMessages[defaultLocale];
}

export function getCompareChrome(locale: Locale) {
  return compareChrome[locale] ?? compareChrome[defaultLocale];
}

export function getCompareHub(locale: Locale) {
  return compareHub[locale] ?? compareHub[defaultLocale];
}

export function htmlLang(locale: Locale) {
  return getLocaleConfig(locale).htmlLang;
}

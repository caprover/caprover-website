// Add a locale here, then add message files, Next.js routes, and Docusaurus translations.
export const localeCatalog = [
  {
    code: "en",
    htmlLang: "en",
    label: "English",
    prefix: "",
    default: true,
    switcherAria: "Language",
  },
  {
    code: "zh-CN",
    htmlLang: "zh-CN",
    label: "中文",
    prefix: "/zh-CN",
    default: false,
    switcherAria: "语言",
  },
] as const;

export type Locale = (typeof localeCatalog)[number]["code"];

export type LocaleConfig = (typeof localeCatalog)[number];

export const locales = localeCatalog.map((locale) => locale.code);

export const defaultLocale = localeCatalog.find((locale) => locale.default)?.code ?? "en";

export function getLocaleConfig(code: string): LocaleConfig {
  return localeCatalog.find((locale) => locale.code === code) ?? localeCatalog[0];
}

export function isDefaultLocale(code: string) {
  return getLocaleConfig(code).default;
}

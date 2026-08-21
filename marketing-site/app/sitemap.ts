import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, ENABLED_LOCALES, localizedPath } from "@/i18n/config";
import routes from "@/routes.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://caprover.com";
  const lastModified = new Date("2026-08-20");
  return Object.values(routes).flatMap(({ path, sitemapPriority }) => {
    const defaultUrl = `${base}${localizedPath(path, DEFAULT_LOCALE)}`;
    const languages = Object.fromEntries(
      ENABLED_LOCALES.map((locale) => [
        locale.code,
        `${base}${localizedPath(path, locale.code)}`,
      ]),
    );
    const alternates = { languages: { ...languages, "x-default": defaultUrl } };

    return ENABLED_LOCALES.map((locale) => ({
      url: `${base}${localizedPath(path, locale.code)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: sitemapPriority,
      alternates,
    }));
  });
}

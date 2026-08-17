import type { MetadataRoute } from "next";
import { SITE_ORIGIN, alternateLanguages, localeCatalog, localizedPath, type Locale } from "@/lib/i18n";

export const dynamic = "force-static";

const lastModified = new Date("2026-08-18");

const pages: Array<{ path: string; priority: number; localizedPriority: number }> = [
  { path: "/", priority: 1, localizedPriority: 0.9 },
  { path: "/compare/", priority: 0.7, localizedPriority: 0.6 },
  { path: "/compare/coolify/", priority: 0.7, localizedPriority: 0.6 },
  { path: "/compare/dokploy/", priority: 0.7, localizedPriority: 0.6 },
  { path: "/compare/dokku/", priority: 0.6, localizedPriority: 0.5 },
];

function entry(path: string, locale: Locale, priority: number): MetadataRoute.Sitemap[number] {
  const localized = localizedPath(locale, path);
  return {
    url: `${SITE_ORIGIN}${localized === "/" ? "" : localized}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
    alternates: { languages: alternateLanguages(path) },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    localeCatalog.map((locale) =>
      entry(page.path, locale.code, locale.default ? page.priority : page.localizedPriority),
    ),
  );
}

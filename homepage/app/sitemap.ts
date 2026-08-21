import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://caprover.com";
  const lastModified = new Date("2026-08-20");
  const paths = [
    { path: "/", priority: 1 },
    { path: "/compare/", priority: 0.7 },
    { path: "/compare/coolify/", priority: 0.7 },
    { path: "/compare/dokploy/", priority: 0.7 },
    { path: "/compare/dokku/", priority: 0.6 },
  ];

  return paths.flatMap(({ path, priority }) => {
    const english = `${base}${path}`;
    const spanish = `${base}/es-ES${path}`;
    const alternates = { languages: { en: english, "es-ES": spanish, "x-default": english } };
    return [
      { url: english, lastModified, changeFrequency: "monthly" as const, priority, alternates },
      { url: spanish, lastModified, changeFrequency: "monthly" as const, priority, alternates },
    ];
  });
}

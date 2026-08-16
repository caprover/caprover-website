import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://caprover.com";
  const lastModified = new Date("2026-08-15");

  return [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/compare/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/coolify/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/dokploy/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/dokku/`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}

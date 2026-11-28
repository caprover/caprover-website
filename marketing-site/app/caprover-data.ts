import https from "node:https";
import oneClickAppsFallback from "../data/one-click-apps-fallback.json";
import releaseFallback from "../data/release-fallback.json";

type ReleaseInfo = {
  tag: string;
  url: string;
};

export type OneClickAppEntry = {
  id: string;
  name: string;
  description: string;
};

export type OneClickCatalog = {
  count: number;
  apps: OneClickAppEntry[];
};

export type CuratedOneClickApp = {
  id: string;
  name: string;
  logo: string;
};

export const CURATED_ONE_CLICK_APPS: CuratedOneClickApp[] = [
  { id: "postgres", name: "PostgreSQL", logo: "postgres.svg" },
  { id: "redis", name: "Redis", logo: "redis.svg" },
  { id: "wordpress", name: "WordPress", logo: "wordpress.svg" },
  { id: "n8n-io", name: "n8n", logo: "n8n-io.svg" },
  { id: "nextcloud", name: "Nextcloud", logo: "nextcloud.svg" },
  { id: "uptime-kuma", name: "Uptime Kuma", logo: "uptime-kuma.svg" },
  { id: "pocketbase", name: "PocketBase", logo: "pocketbase.svg" },
  { id: "grafana", name: "Grafana", logo: "grafana.svg" },
  { id: "gitea", name: "Gitea", logo: "gitea.svg" },
  { id: "ghost", name: "Ghost", logo: "ghost.svg" },
  { id: "plausible", name: "Plausible", logo: "plausible.svg" },
  { id: "umami-postgresql", name: "Umami", logo: "umami-postgresql.svg" },
  { id: "minio", name: "MinIO", logo: "minio.svg" },
  { id: "meilisearch", name: "Meilisearch", logo: "meilisearch.svg" },
  { id: "metabase", name: "Metabase", logo: "metabase.svg" },
  { id: "mongodb", name: "MongoDB", logo: "mongodb.svg" },
];

export const COMPACT_FEATURED_APPS: CuratedOneClickApp[] =
  CURATED_ONE_CLICK_APPS.slice(0, 6);

const RELEASE_API_URL =
  "https://api.github.com/repos/caprover/caprover/releases/latest";
const ONE_CLICK_MANIFEST_URL = "https://oneclickapps.caprover.com/v4/list";

let releasePromise: Promise<ReleaseInfo> | undefined;
let catalogPromise: Promise<OneClickCatalog> | undefined;

function fetchJsonWithTimeout<T>(
  url: string,
  timeoutMs: number,
  headers?: Record<string, string>,
): Promise<T | null> {
  return new Promise((resolve) => {
    const request = https.get(url, { headers, timeout: timeoutMs }, (res) => {
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        resolve(null);
        return;
      }

      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")) as T);
        } catch {
          resolve(null);
        }
      });
      res.on("error", () => resolve(null));
    });

    request.on("timeout", () => {
      request.destroy();
      resolve(null);
    });
    request.on("error", () => resolve(null));
  });
}

export function getLatestRelease(): Promise<ReleaseInfo> {
  releasePromise ??= (async () => {
    const fallback: ReleaseInfo = {
      tag: releaseFallback.tag,
      url: releaseFallback.url,
    };

    if (process.env.CAPROVER_OFFLINE_BUILD === "1") {
      return fallback;
    }

    const payload = await fetchJsonWithTimeout<{
      tag_name?: string;
      html_url?: string;
    }>(RELEASE_API_URL, 4000, {
      Accept: "application/vnd.github+json",
      "User-Agent": "caprover-website-build",
    });

    const tag = payload?.tag_name?.trim();
    const url = payload?.html_url?.trim();
    if (tag && /^v?\d+\.\d+/.test(tag) && url?.startsWith("https://")) {
      return { tag, url };
    }

    return fallback;
  })();

  return releasePromise;
}

function cleanDescription(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getOneClickCatalog(): Promise<OneClickCatalog> {
  catalogPromise ??= (async () => {
    const fallback: OneClickCatalog = {
      count: oneClickAppsFallback.apps.length,
      apps: oneClickAppsFallback.apps,
    };

    if (process.env.CAPROVER_OFFLINE_BUILD === "1") {
      return fallback;
    }

    const payload = await fetchJsonWithTimeout<{
      oneClickApps?: Array<{
        name?: string;
        displayName?: string;
        description?: string;
      }>;
    }>(ONE_CLICK_MANIFEST_URL, 5000, {
      Accept: "application/json",
      "User-Agent": "caprover-website-build",
    });

    const rawList = payload?.oneClickApps;
    if (!Array.isArray(rawList) || rawList.length < 200) {
      return fallback;
    }

    const apps = rawList
      .map((entry) => ({
        id: typeof entry.name === "string" ? entry.name.trim() : "",
        name:
          typeof entry.displayName === "string" && entry.displayName.trim()
            ? entry.displayName.trim()
            : typeof entry.name === "string"
              ? entry.name.trim()
              : "",
        description: cleanDescription(entry.description),
      }))
      .filter((entry) => entry.id.length > 0 && entry.name.length > 0);

    if (apps.length < 200) {
      return fallback;
    }

    return { count: apps.length, apps };
  })();

  return catalogPromise;
}

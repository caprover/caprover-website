"use client";

import { useMemo, useState } from "react";
import type { CuratedOneClickApp, OneClickAppEntry } from "./caprover-data";

const MAX_SEARCH_RESULTS = 12;
const CATALOG_REPO_BASE =
  "https://github.com/caprover/one-click-apps/blob/master/public/v4/apps";

export type OneClickCatalogLabels = {
  searchPlaceholder: string;
  searchAriaLabel: string;
  clearSearchAriaLabel: string;
  matchesSummary: string;
  showingTop: string;
  emptyState: string;
  browseAll: string;
};

function formatTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}

function scoreMatch(app: OneClickAppEntry, query: string): number {
  const id = app.id.toLowerCase();
  const name = app.name.toLowerCase();
  const desc = app.description.toLowerCase();

  if (id === query || name === query) return 100;
  if (name.startsWith(query) || id.startsWith(query)) return 80;
  if (name.includes(query) || id.includes(query)) return 60;
  if (desc.includes(query)) return 30;
  return 0;
}

export function OneClickCatalog({
  apps,
  curated,
  assetBasePath,
  catalogUrl,
  labels,
}: {
  apps: OneClickAppEntry[];
  curated: CuratedOneClickApp[];
  assetBasePath: string;
  catalogUrl: string;
  labels: OneClickCatalogLabels;
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const curatedById = useMemo(() => {
    const map = new Map<string, CuratedOneClickApp>();
    for (const item of curated) {
      map.set(item.id.toLowerCase(), item);
    }
    return map;
  }, [curated]);

  const searchState = useMemo(() => {
    if (!trimmed) return null;
    const ranked = apps
      .map((app) => ({ app, score: scoreMatch(app, trimmed) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.app.name.localeCompare(b.app.name);
      });
    return {
      total: ranked.length,
      items: ranked.slice(0, MAX_SEARCH_RESULTS).map((item) => item.app),
    };
  }, [apps, trimmed]);

  const placeholder = formatTemplate(labels.searchPlaceholder, {
    count: apps.length,
  });

  return (
    <div className="one-click-catalog">
      <div className="one-click-search-bar">
        <label className="sr-only" htmlFor="one-click-search-input">
          {labels.searchAriaLabel}
        </label>
        <svg
          className="one-click-search-icon"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="5.75" />
          <path d="m13.5 13.5 3.25 3.25" />
        </svg>
        <input
          id="one-click-search-input"
          type="search"
          className="one-click-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label={labels.searchAriaLabel}
          autoComplete="off"
          spellCheck={false}
        />
        {query ? (
          <button
            type="button"
            className="one-click-search-clear"
            onClick={() => setQuery("")}
            aria-label={labels.clearSearchAriaLabel}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5" />
            </svg>
          </button>
        ) : null}
      </div>

      {searchState ? (
        <div className="one-click-search-results" aria-live="polite">
          <div className="one-click-results-meta">
            <span>
              {formatTemplate(labels.matchesSummary, {
                matches: searchState.total,
                total: apps.length,
              })}
            </span>
            {searchState.total > MAX_SEARCH_RESULTS ? (
              <span className="one-click-results-cap">
                {formatTemplate(labels.showingTop, {
                  shown: MAX_SEARCH_RESULTS,
                })}
              </span>
            ) : null}
          </div>

          {searchState.items.length > 0 ? (
            <ul className="one-click-results-grid">
              {searchState.items.map((app) => {
                const curatedMatch = curatedById.get(app.id.toLowerCase());
                const initials = app.name
                  .replace(/[^a-zA-Z0-9\s]/g, "")
                  .trim()
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <li key={app.id}>
                    <a
                      className="one-click-result-card"
                      href={`${CATALOG_REPO_BASE}/${encodeURIComponent(app.id)}.yml`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span
                        className="one-click-icon-tile one-click-icon-tile-sm"
                        aria-hidden="true"
                      >
                        {curatedMatch ? (
                          <img
                            src={`${assetBasePath}/one-click/${curatedMatch.logo}`}
                            width={24}
                            height={24}
                            alt=""
                          />
                        ) : (
                          <span className="one-click-monogram">
                            {initials || "AP"}
                          </span>
                        )}
                      </span>
                      <span className="one-click-result-body">
                        <span className="one-click-result-name">
                          {app.name}
                        </span>
                        {app.description ? (
                          <span className="one-click-result-desc">
                            {app.description}
                          </span>
                        ) : null}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="one-click-empty-state">
              <p>
                {formatTemplate(labels.emptyState, { query: query.trim() })}
              </p>
              <a
                className="text-link"
                href={catalogUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {labels.browseAll}
              </a>
            </div>
          )}
        </div>
      ) : (
        <ul className="one-click-grid">
          {curated.map(({ id, name, logo }) => (
            <li key={id}>
              <a
                className="one-click-app-tile"
                href={`${CATALOG_REPO_BASE}/${encodeURIComponent(id)}.yml`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="one-click-icon-tile" aria-hidden="true">
                  <img
                    src={`${assetBasePath}/one-click/${logo}`}
                    width={28}
                    height={28}
                    alt=""
                  />
                </span>
                <span className="one-click-app-name">{name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

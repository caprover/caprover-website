"use client";

import { useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./theme-script";

const THEME_EVENT = "caprover-theme-change";

export type ThemeMode = "light" | "dark";

function readDomTheme(): ThemeMode {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.dataset.theme;
  if (attr === "dark" || attr === "light") return attr;
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

function applyTheme(theme: ThemeMode, persist: boolean) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Theme still switches for the current page session if storage is blocked.
    }
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribeTheme(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    if (event.newValue === "dark" || event.newValue === "light") {
      document.documentElement.dataset.theme = event.newValue;
      document.documentElement.style.colorScheme = event.newValue;
    }
    onChange();
  };
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function ThemeToggle({
  labels,
}: {
  labels: {
    ariaLabel: string;
    switchToDark: string;
    switchToLight: string;
  };
}) {
  const theme = useSyncExternalStore<ThemeMode>(
    subscribeTheme,
    readDomTheme,
    () => "light",
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_STORAGE_KEY);
      } catch {}
      if (stored === "dark" || stored === "light") return;
      applyTheme(event.matches ? "dark" : "light", false);
    };
    media.addEventListener("change", onMediaChange);
    return () => media.removeEventListener("change", onMediaChange);
  }, []);

  const isDark = theme === "dark";
  const nextTheme: ThemeMode = isDark ? "light" : "dark";
  const title = isDark ? labels.switchToLight : labels.switchToDark;

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={labels.ariaLabel}
      aria-pressed={isDark}
      title={title}
      onClick={() => applyTheme(nextTheme, true)}
    >
      <svg
        className="theme-icon theme-icon-sun"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="3.4" />
        <path d="M10 2.2v1.8M10 16v1.8M2.2 10H4M16 10h1.8M4.5 4.5l1.3 1.3M14.2 14.2l1.3 1.3M15.5 4.5l-1.3 1.3M5.8 14.2l-1.3 1.3" />
      </svg>
      <svg
        className="theme-icon theme-icon-moon"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M15.6 12.6A6.5 6.5 0 0 1 7.4 4.4a6.5 6.5 0 1 0 8.2 8.2Z" />
      </svg>
    </button>
  );
}

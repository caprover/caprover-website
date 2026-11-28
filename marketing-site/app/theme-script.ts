export const THEME_STORAGE_KEY = "caprover.theme";

export const THEME_INIT_SCRIPT = `(() => {
  let stored = null;
  try {
    stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  } catch {}
  const theme =
    stored === "dark" || stored === "light"
      ? stored
      : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();`;

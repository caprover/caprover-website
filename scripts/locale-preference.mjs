export function renderLocalePreferenceScript(locales, defaultLocale) {
  const localeConfig = locales.map(({ code, pathPrefix }) => ({
    code,
    pathPrefix,
  }));

  return `(() => {
  const locales = ${JSON.stringify(localeConfig)};
  const defaultLocale = ${JSON.stringify(defaultLocale.code)};
  const storageKey = "caprover.locale";

  function findLocale(language) {
    if (!language) return undefined;
    const normalized = language.toLowerCase();
    return (
      locales.find((locale) => locale.code.toLowerCase() === normalized) ??
      locales.find(
        (locale) =>
          locale.code.toLowerCase().split("-")[0] === normalized.split("-")[0],
      )
    );
  }

  function preferredBrowserLocale() {
    const browserLanguages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    for (const language of browserLanguages) {
      const locale = findLocale(language);
      if (locale) return locale;
    }
    return locales.find((locale) => locale.code === defaultLocale);
  }

  function readSavedLocale() {
    try {
      return findLocale(localStorage.getItem(storageKey));
    } catch {
      return undefined;
    }
  }

  function saveLocale(locale) {
    try {
      localStorage.setItem(storageKey, locale.code);
    } catch {
      // Language detection still works when storage is unavailable.
    }
  }

  function localeForPath(pathname) {
    return (
      locales.find(
        (locale) =>
          locale.pathPrefix &&
          (pathname === locale.pathPrefix ||
            pathname.startsWith(\`\${locale.pathPrefix}/\`)),
      ) ?? locales.find((locale) => locale.code === defaultLocale)
    );
  }

  const currentLocale = localeForPath(location.pathname);
  if (currentLocale.code === defaultLocale) {
    const preferredLocale = readSavedLocale() ?? preferredBrowserLocale();
    if (preferredLocale && preferredLocale.code !== defaultLocale) {
      saveLocale(preferredLocale);
      location.replace(
        \`\${preferredLocale.pathPrefix}\${location.pathname}\${location.search}\${location.hash}\`,
      );
      return;
    }
  }

  document.addEventListener("click", (event) => {
    const link = event.target?.closest?.("a[lang], a[hreflang]");
    if (!link) return;
    const selectedLocale = findLocale(
      link.getAttribute("lang") ?? link.getAttribute("hreflang"),
    );
    if (!selectedLocale) return;
    const destination = new URL(link.href, location.href);
    if (
      destination.origin === location.origin &&
      localeForPath(destination.pathname).code === selectedLocale.code
    ) {
      saveLocale(selectedLocale);
    }
  });
})();
`;
}

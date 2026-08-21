import { ENABLED_LOCALES, localizedPath, type Locale } from "@/i18n/config";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function LocaleSwitcher({
  locale,
  path,
  ariaLabel,
}: {
  locale: Locale;
  path: string;
  ariaLabel: string;
}) {
  const current = ENABLED_LOCALES.find((entry) => entry.code === locale)!;

  return (
    <details className="locale-switcher">
      <summary aria-label={ariaLabel}>{current.label}</summary>
      <div>
        {ENABLED_LOCALES.map((entry) => (
          <a
            aria-current={entry.code === locale ? "page" : undefined}
            href={`${BASE_PATH}${localizedPath(path, entry.code)}`}
            hrefLang={entry.code}
            key={entry.code}
            lang={entry.code}
          >
            {entry.label}
          </a>
        ))}
      </div>
    </details>
  );
}

import {
  getLocaleConfig,
  languageSwitchHref,
  localeCatalog,
  type Locale,
} from "@/lib/i18n";

export function LanguageSwitch({
  locale,
  path,
  className = "language-switch",
}: {
  locale: Locale;
  path: string;
  className?: string;
}) {
  const current = getLocaleConfig(locale);

  return (
    <details className={className}>
      <summary aria-label={current.switcherAria}>
        <span>{current.label}</span>
      </summary>
      <ul>
        {localeCatalog.map((item) => (
          <li key={item.code}>
            <a
              href={languageSwitchHref(item.code, path)}
              hrefLang={item.htmlLang}
              lang={item.htmlLang}
              aria-current={item.code === locale ? "page" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

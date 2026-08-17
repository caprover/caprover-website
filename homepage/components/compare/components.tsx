import type { ReactNode } from "react";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import {
  GITHUB,
  asset,
  comparePath,
  docsPath,
  getCompareChrome,
  getCompareHub,
  homePath,
  withBase,
  type Locale,
} from "@/lib/i18n";
import {
  comparisonRows,
  products,
  verifiedDateByLocale,
  zhComparisonRows,
  type ComparisonRow,
  type ComparisonValue,
  type PairwiseRow,
  type Product,
} from "./data";

export function internal(path: string) {
  return withBase(path);
}

export function comparisonRowsFor(locale: Locale) {
  return locale === "zh-CN" ? zhComparisonRows : comparisonRows;
}

function Logo({ locale }: { locale: Locale }) {
  const t = getCompareChrome(locale);
  return (
    <a className="compare-logo" href={withBase(homePath(locale))} aria-label={t.homeAria}>
      <img src={asset("/caprover-logo.png")} alt="" aria-hidden="true" />
      <span>CapRover</span>
    </a>
  );
}

export function CompareHeader({ locale, path }: { locale: Locale; path: string }) {
  const t = getCompareChrome(locale);
  return (
    <header className="compare-header compare-shell">
      <Logo locale={locale} />
      <div className="compare-header-links" role="navigation" aria-label={t.navAria}>
        <a href={withBase(comparePath(locale))}>{t.hubLink}</a>
        <a href={withBase(docsPath(locale))}>{t.docs}</a>
        <a href={GITHUB}>{t.github}</a>
        <LanguageSwitch locale={locale} path={path} className="language-switch compare-language-switch" />
      </div>
    </header>
  );
}

export function CompareFooter({ locale }: { locale: Locale }) {
  const t = getCompareChrome(locale);
  return (
    <footer className="compare-footer">
      <div className="compare-shell compare-footer-grid">
        <Logo locale={locale} />
        <p>{t.tagline}</p>
        <div>
          <a href={withBase(docsPath(locale))}>{t.getStarted}</a>
          <a href={GITHUB}>{t.github}</a>
        </div>
        <small>
          {t.lastVerified} {verifiedDateByLocale[locale]}
        </small>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="compare-hero compare-shell">
      <p className="compare-kicker">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="compare-lead">{intro}</p>
      {children}
    </section>
  );
}

export function ProofStrip({ locale }: { locale: Locale }) {
  const t = getCompareChrome(locale);
  return (
    <div className="proof-strip" aria-label={t.proofAria}>
      <div>
        <strong>{t.proofYear}</strong>
        <span>{t.proofYearText}</span>
      </div>
      <div>
        <strong>{t.proofStars}</strong>
        <span>{t.proofStarsText}</span>
      </div>
      <div>
        <strong>{t.proofRam}</strong>
        <span>{t.proofRamText}</span>
      </div>
      <div>
        <strong>{t.proofSimple}</strong>
        <span>{t.proofSimpleText}</span>
      </div>
    </div>
  );
}

function StatusCell({ locale, value }: { locale: Locale; value: ComparisonValue }) {
  const t = getCompareChrome(locale);
  const labels = { yes: t.statusYes, partial: t.statusPartial, no: t.statusNo };
  const marks = { yes: "✓", partial: "◐", no: "×" };

  return (
    <div className={`status-cell status-${value.status}`}>
      <span className="status-mark" aria-label={labels[value.status]}>
        {marks[value.status]}
      </span>
      {value.note && <span className="status-note">{value.note}</span>}
    </div>
  );
}

function TableDisclaimer({ locale }: { locale: Locale }) {
  const t = getCompareChrome(locale);
  return (
    <p className="comparison-table-disclaimer">
      {t.disclaimer}{" "}
      <a href="mailto:marketing@caprover.com">marketing@caprover.com</a>.
    </p>
  );
}

export function ComparisonTable({
  locale,
  rows,
  focus,
}: {
  locale: Locale;
  rows?: ComparisonRow[];
  focus?: Product;
}) {
  const t = getCompareChrome(locale);
  const tableRows = rows ?? comparisonRowsFor(locale);
  return (
    <>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col">{t.capability}</th>
              {products.map((product) => (
                <th scope="col" className={product.key === focus ? "is-focus" : ""} key={product.key}>
                  {product.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.feature}>
                <th scope="row">{row.feature}</th>
                {products.map((product) => (
                  <td className={product.key === focus ? "is-focus" : ""} key={product.key}>
                    <StatusCell locale={locale} value={row[product.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TableDisclaimer locale={locale} />
    </>
  );
}

export function PairwiseTable({
  locale,
  competitorName,
  rows,
}: {
  locale: Locale;
  competitorName: string;
  rows: PairwiseRow[];
}) {
  const t = getCompareChrome(locale);
  return (
    <>
      <div className="two-column-table-wrap">
        <table className="two-column-table pairwise-status-table">
          <thead>
            <tr>
              <th scope="col">{t.capability}</th>
              <th scope="col">CapRover</th>
              <th scope="col">{competitorName}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <th scope="row">{row.feature}</th>
                <td className="is-focus">
                  <StatusCell locale={locale} value={row.caprover} />
                </td>
                <td>
                  <StatusCell locale={locale} value={row.competitor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TableDisclaimer locale={locale} />
    </>
  );
}

export function SimplicityPower({ locale }: { locale: Locale }) {
  const t = getCompareChrome(locale);
  return (
    <div className="simplicity-power">
      <article>
        <p className="compare-kicker">{t.simpleKicker}</p>
        <h2>{t.simpleTitle}</h2>
        <p>{t.simpleText}</p>
      </article>
      <article>
        <p className="compare-kicker">{t.powerfulKicker}</p>
        <h2>{t.powerfulTitle}</h2>
        <p>{t.powerfulText}</p>
      </article>
    </div>
  );
}

export function ResourceCallout({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const t = getCompareChrome(locale);
  return (
    <aside className="resource-callout">
      <div className="resource-number">1 GB</div>
      <div>
        <p className="compare-kicker">{t.resourceKicker}</p>
        {children}
        <small>{t.resourceNote}</small>
      </div>
    </aside>
  );
}

export function ComparisonPrinciples({ locale }: { locale: Locale }) {
  const t = getCompareChrome(locale);
  return (
    <aside className="method-note">
      <strong>{t.methodTitle}</strong>
      <p>{t.methodText}</p>
    </aside>
  );
}

export function MatchupLinks({ locale, current }: { locale: Locale; current?: Product }) {
  const t = getCompareChrome(locale);
  const hub = getCompareHub(locale);
  const links: Array<{ key: Product; label: string; slug: string; text: string }> = [
    { key: "coolify", label: "CapRover vs Coolify", slug: "coolify/", text: hub.coolifyCard },
    { key: "dokploy", label: "CapRover vs Dokploy", slug: "dokploy/", text: hub.dokployCard },
    { key: "dokku", label: "CapRover vs Dokku", slug: "dokku/", text: hub.dokkuCard },
  ];

  return (
    <div className="matchup-grid">
      {links
        .filter((link) => link.key !== current)
        .map((link) => (
          <a className="matchup-card" href={withBase(comparePath(locale, link.slug))} key={link.key}>
            <span>{t.matchupKicker}</span>
            <h3>{link.label}</h3>
            <p>{link.text}</p>
            <b>{t.matchupRead}</b>
          </a>
        ))}
    </div>
  );
}

export function ChoiceGrid({
  locale,
  caprover,
  competitorName,
  competitor,
}: {
  locale: Locale;
  caprover: string[];
  competitorName: string;
  competitor: string[];
}) {
  const t = getCompareChrome(locale);
  return (
    <div className="choice-grid">
      <article className="is-caprover-choice">
        <p className="compare-kicker">{t.whyCaprover}</p>
        <ul>
          {caprover.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <article>
        <p className="compare-kicker">{t.considerIf.replace("{name}", competitorName.toUpperCase())}</p>
        <ul>
          {competitor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}

export function MarketingCta({ locale }: { locale: Locale }) {
  const t = getCompareChrome(locale);
  return (
    <section className="compare-cta">
      <div>
        <p className="compare-kicker">{t.ctaKicker}</p>
        <h2>{t.ctaTitle}</h2>
        <p>{t.ctaText}</p>
      </div>
      <div className="compare-cta-links">
        <a className="compare-button compare-button-primary" href={withBase(docsPath(locale))}>
          {t.install}
        </a>
        <a className="compare-button" href={withBase(docsPath(locale, "one-click-apps"))}>
          {t.exploreApps}
        </a>
      </div>
    </section>
  );
}

export function SourceLinks({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getCompareChrome(locale);
  return (
    <div className="source-links">
      <h2>{t.sourcesTitle}</h2>
      <p>
        {t.lastVerified} {verifiedDateByLocale[locale]}. {t.sourcesLead}
      </p>
      <ul>{children}</ul>
    </div>
  );
}

export function ComparePage({
  locale,
  path,
  children,
}: {
  locale: Locale;
  path: string;
  children: ReactNode;
}) {
  return (
    <main className="compare-page">
      <CompareHeader locale={locale} path={path} />
      {children}
      <CompareFooter locale={locale} />
    </main>
  );
}

export function docsHref(locale: Locale, doc = "get-started") {
  return withBase(docsPath(locale, doc));
}

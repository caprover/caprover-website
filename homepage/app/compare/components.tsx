import type { ReactNode } from "react";
import { DEFAULT_LOCALE, docsUrl, localizedPath, type Locale } from "../../i18n/config";
import { getMessages, messageList } from "../../i18n/messages";
import {
  getComparisonData,
  type ComparisonRow,
  type ComparisonValue,
  type PairwiseRow,
  type Product,
} from "./data";

const GITHUB = "https://github.com/caprover/caprover";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ASSET_PATH = "/homepage-assets";

export function internal(path: string, locale: Locale = DEFAULT_LOCALE) {
  return `${BASE_PATH}${localizedPath(path, locale)}`;
}

function Logo({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).comparisonCommon;
  return (
    <a className="compare-logo" href={internal("/", locale)} aria-label={copy.brandAriaLabel}>
      <img src={`${BASE_PATH}${ASSET_PATH}/caprover-logo.png`} alt="" aria-hidden="true" />
      <span>CapRover</span>
    </a>
  );
}

export function CompareHeader({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon;
  return (
    <header className="compare-header compare-shell">
      <Logo locale={locale} />
      <div className="compare-header-links" role="navigation" aria-label={copy.navigationAriaLabel}>
        <a href={internal("/compare/", locale)}>{copy.navigation.hub}</a>
        <a href={docsUrl("get-started", locale)}>{copy.navigation.docs}</a>
        <a href={GITHUB}>{copy.navigation.github}</a>
      </div>
    </header>
  );
}

export function CompareFooter({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon;
  return (
    <footer className="compare-footer">
      <div className="compare-shell compare-footer-grid">
        <Logo locale={locale} />
        <p>{copy.footer.tagline}</p>
        <div>
          <a href={docsUrl("get-started", locale)}>{copy.footer.getStarted}</a>
          <a href={GITHUB}>{copy.footer.github}</a>
        </div>
        <small>{copy.footer.lastVerified} {copy.verifiedDate}</small>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: ReactNode }) {
  return <section className="compare-hero compare-shell"><p className="compare-kicker">{eyebrow}</p><h1>{title}</h1><p className="compare-lead">{intro}</p>{children}</section>;
}

export function ProofStrip({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon;
  return <div className="proof-strip" aria-label={copy.proofsAriaLabel}>{messageList(copy.proofs).map((proof) => <div key={proof.value}><strong>{proof.value}</strong><span>{proof.label}</span></div>)}</div>;
}

function StatusCell({ value, locale }: { value: ComparisonValue; locale: Locale }) {
  const labels = getMessages(locale).comparisonCommon.statusLabels;
  const marks = { yes: "✓", partial: "◐", no: "×" };
  return <div className={`status-cell status-${value.status}`}><span className="status-mark" aria-label={labels[value.status]}>{marks[value.status]}</span>{value.note && <span className="status-note">{value.note}</span>}</div>;
}

function TableDisclaimer({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).comparisonCommon.table;
  return <p className="comparison-table-disclaimer">{copy.disclaimerBeforeEmail}{" "}<a href={`mailto:${copy.disclaimerEmail}`}>{copy.disclaimerEmail}</a>.</p>;
}

export function ComparisonTable({ rows, focus, locale = DEFAULT_LOCALE }: { rows?: ComparisonRow[]; focus?: Product; locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon;
  const data = getComparisonData(locale);
  const tableRows = rows ?? data.rows;
  return (
    <>
      <div className="comparison-table-wrap"><table className="comparison-table">
        <thead><tr><th scope="col">{copy.table.capability}</th>{data.products.map((product) => <th scope="col" className={product.key === focus ? "is-focus" : ""} key={product.key}>{product.label}</th>)}</tr></thead>
        <tbody>{tableRows.map((row) => <tr key={row.feature}><th scope="row">{row.feature}</th>{data.products.map((product) => <td className={product.key === focus ? "is-focus" : ""} key={product.key}><StatusCell value={row[product.key]} locale={locale} /></td>)}</tr>)}</tbody>
      </table></div>
      <TableDisclaimer locale={locale} />
    </>
  );
}

export function PairwiseTable({ competitorName, rows, locale = DEFAULT_LOCALE }: { competitorName: string; rows: PairwiseRow[]; locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon;
  return (
    <>
      <div className="two-column-table-wrap"><table className="two-column-table pairwise-status-table">
        <thead><tr><th scope="col">{copy.table.capability}</th><th scope="col">CapRover</th><th scope="col">{competitorName}</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.feature}><th scope="row">{row.feature}</th><td className="is-focus"><StatusCell value={row.caprover} locale={locale} /></td><td><StatusCell value={row.competitor} locale={locale} /></td></tr>)}</tbody>
      </table></div>
      <TableDisclaimer locale={locale} />
    </>
  );
}

export function SimplicityPower({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon.simplicity;
  return <div className="simplicity-power"><article><p className="compare-kicker">{copy.simpleKicker}</p><h2>{copy.simpleTitle}</h2><p>{copy.simpleDescription}</p></article><article><p className="compare-kicker">{copy.powerfulKicker}</p><h2>{copy.powerfulTitle}</h2><p>{copy.powerfulDescription}</p></article></div>;
}

export function ResourceCallout({ children, locale = DEFAULT_LOCALE }: { children: ReactNode; locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon.resource;
  return <aside className="resource-callout"><div className="resource-number">1 GB</div><div><p className="compare-kicker">{copy.kicker}</p>{children}<small>{copy.disclaimer}</small></div></aside>;
}

export function ComparisonPrinciples({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon.principles;
  return <aside className="method-note"><strong>{copy.title}</strong><p>{copy.description}</p></aside>;
}

export function MatchupLinks({ current, locale = DEFAULT_LOCALE }: { current?: Product; locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon.matchups;
  return <div className="matchup-grid">{messageList(copy.items).filter((link) => link.key !== current).map((link) => <a className="matchup-card" href={internal(`/compare/${link.key}/`, locale)} key={link.key}><span>{copy.kicker}</span><h3>{link.label}</h3><p>{link.description}</p><b>{copy.read}</b></a>)}</div>;
}

export function ChoiceGrid({ caprover, competitorName, competitor, locale = DEFAULT_LOCALE }: { caprover: string[]; competitorName: string; competitor: string[]; locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon.choice;
  return <div className="choice-grid"><article className="is-caprover-choice"><p className="compare-kicker">{copy.caproverKicker}</p><ul>{caprover.map((item) => <li key={item}>{item}</li>)}</ul></article><article><p className="compare-kicker">{copy.competitorBeforeName} {competitorName.toUpperCase()} {copy.competitorAfterName}</p><ul>{competitor.map((item) => <li key={item}>{item}</li>)}</ul></article></div>;
}

export function MarketingCta({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon.cta;
  return <section className="compare-cta"><div><p className="compare-kicker">{copy.kicker}</p><h2>{copy.title}</h2><p>{copy.description}</p></div><div className="compare-cta-links"><a className="compare-button compare-button-primary" href={docsUrl("get-started", locale)}>{copy.install}</a><a className="compare-button" href={docsUrl("one-click-apps", locale)}>{copy.oneClickApps}</a></div></section>;
}

export function SourceLinks({ children, locale = DEFAULT_LOCALE }: { children: ReactNode; locale?: Locale }) {
  const copy = getMessages(locale).comparisonCommon;
  return <div className="source-links"><h2>{copy.sources.title}</h2><p>{copy.sources.lastVerified} {copy.verifiedDate}. {copy.sources.description}</p><ul>{children}</ul></div>;
}

export function ComparePage({ children, locale = DEFAULT_LOCALE }: { children: ReactNode; locale?: Locale }) {
  return <main className="compare-page"><CompareHeader locale={locale} />{children}<CompareFooter locale={locale} /></main>;
}

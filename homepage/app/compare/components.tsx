import type { ReactNode } from "react";
import { comparisonRows, products, type ComparisonRow, type Product, verifiedDate } from "./data";

const DOCS = "https://caprover.com/docs/get-started.html";
const GITHUB = "https://github.com/caprover/caprover";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ASSET_PATH = "/homepage-assets";

export function internal(path: string) {
  return `${BASE_PATH}${path}`;
}

function Logo() {
  return (
    <a className="compare-logo" href={internal("/")} aria-label="CapRover home">
      <img src={`${BASE_PATH}${ASSET_PATH}/caprover-logo.png`} alt="" aria-hidden="true" />
      <span>CapRover</span>
    </a>
  );
}

export function CompareHeader() {
  return (
    <header className="compare-header compare-shell">
      <Logo />
      <div className="compare-header-links" role="navigation" aria-label="Comparison navigation">
        <a href={internal("/compare/")}>Comparison hub</a>
        <a href={DOCS}>Docs</a>
        <a href={GITHUB}>GitHub</a>
      </div>
    </header>
  );
}

export function CompareFooter() {
  return (
    <footer className="compare-footer">
      <div className="compare-shell compare-footer-grid">
        <Logo />
        <p>Scalable, free, and self-hosted PaaS.</p>
        <div><a href={DOCS}>Get started</a><a href={GITHUB}>GitHub</a></div>
        <small>Last verified {verifiedDate}</small>
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

export function ComparisonTable({
  rows = comparisonRows,
  focus,
}: {
  rows?: ComparisonRow[];
  focus?: Product;
}) {
  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <thead>
          <tr>
            <th scope="col">Capability</th>
            {products.map((product) => (
              <th scope="col" className={product.key === focus ? "is-focus" : ""} key={product.key}>
                {product.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature}>
              <th scope="row">{row.feature}</th>
              {products.map((product) => (
                <td className={product.key === focus ? "is-focus" : ""} key={product.key}>
                  {row[product.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComparisonPrinciples() {
  return (
    <aside className="method-note">
      <strong>How this comparison is maintained</strong>
      <p>
        Capability names are deliberately narrow. “Partial” means a useful subset exists, not that
        the products are equivalent. Plugin-based and manual approaches are identified instead of
        receiving an unexplained checkmark. Claims are based on official product documentation and
        are dated because these projects change quickly. Unless a row says otherwise, the scope
        is the current self-hosted open-source edition; paid or enterprise additions are named.
      </p>
    </aside>
  );
}

export function MatchupLinks({ current }: { current?: Product }) {
  const links: Array<{ key: Product; label: string; path: string; text: string }> = [
    { key: "coolify", label: "CapRover vs Coolify", path: "/compare/coolify/", text: "Compare architecture, deployment workflows and operations." },
    { key: "dokploy", label: "CapRover vs Dokploy", path: "/compare/dokploy/", text: "Compare two Docker and Swarm-oriented control planes." },
    { key: "dokku", label: "CapRover vs Dokku", path: "/compare/dokku/", text: "Compare dashboard-driven and CLI-first approaches." },
  ];

  return (
    <div className="matchup-grid">
      {links.filter((link) => link.key !== current).map((link) => (
        <a className="matchup-card" href={internal(link.path)} key={link.key}>
          <span>DETAILED COMPARISON</span>
          <h3>{link.label}</h3>
          <p>{link.text}</p>
          <b>Read comparison →</b>
        </a>
      ))}
    </div>
  );
}

export function ChoiceGrid({
  caprover,
  competitorName,
  competitor,
}: {
  caprover: string[];
  competitorName: string;
  competitor: string[];
}) {
  return (
    <div className="choice-grid">
      <article>
        <p className="compare-kicker">CHOOSE CAPROVER IF</p>
        <ul>{caprover.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>
      <article>
        <p className="compare-kicker">CHOOSE {competitorName.toUpperCase()} IF</p>
        <ul>{competitor.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>
    </div>
  );
}

export function SourceLinks({ children }: { children: ReactNode }) {
  return <div className="source-links"><h2>Sources and verification</h2><p>Last verified {verifiedDate}. Links below point to official project documentation.</p><ul>{children}</ul></div>;
}

export function ComparePage({ children }: { children: ReactNode }) {
  return <main className="compare-page"><CompareHeader />{children}<CompareFooter /></main>;
}

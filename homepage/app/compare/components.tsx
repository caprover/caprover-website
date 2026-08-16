import type { ReactNode } from "react";
import { comparisonRows, products, type ComparisonRow, type Product, verifiedDate } from "./data";

const DOCS = "https://caprover.com/docs/get-started.html";
const GITHUB = "https://github.com/caprover/caprover";
const ONE_CLICK_APPS = "https://caprover.com/docs/one-click-apps.html";
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

export function ProofStrip() {
  return (
    <div className="proof-strip" aria-label="CapRover project highlights">
      <div><strong>Since 2017</strong><span>Open-source project</span></div>
      <div><strong>15,000+</strong><span>GitHub stars</span></div>
      <div><strong>Docker + NGINX</strong><span>Familiar foundations</span></div>
      <div><strong>One-Click Apps</strong><span>Apps and databases</span></div>
    </div>
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
        Claims use narrow, documented capability descriptions instead of unexplained checkmarks.
        Unless stated otherwise, the scope is each product&apos;s current self-hosted open-source
        edition. Paid additions are named, and official documentation is linked below.
      </p>
    </aside>
  );
}

export function MatchupLinks({ current }: { current?: Product }) {
  const links: Array<{ key: Product; label: string; path: string; text: string }> = [
    { key: "coolify", label: "CapRover vs Coolify", path: "/compare/coolify/", text: "Compare a focused Docker workflow with a broader resource platform." },
    { key: "dokploy", label: "CapRover vs Dokploy", path: "/compare/dokploy/", text: "Compare two Swarm-based platforms with different priorities." },
    { key: "dokku", label: "CapRover vs Dokku", path: "/compare/dokku/", text: "Compare an open-source dashboard with a CLI-first workflow." },
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
      <article className="is-caprover-choice">
        <p className="compare-kicker">WHY CHOOSE CAPROVER</p>
        <ul>{caprover.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>
      <article>
        <p className="compare-kicker">CONSIDER {competitorName.toUpperCase()} IF YOU SPECIFICALLY NEED</p>
        <ul>{competitor.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>
    </div>
  );
}

export function MarketingCta() {
  return (
    <section className="compare-cta">
      <div>
        <p className="compare-kicker">READY TO DEPLOY?</p>
        <h2>Run your first app with CapRover.</h2>
        <p>Install CapRover on your own server, then deploy source, a Dockerfile, or an existing image.</p>
      </div>
      <div className="compare-cta-links">
        <a className="compare-button compare-button-primary" href={DOCS}>Install CapRover</a>
        <a className="compare-button" href={ONE_CLICK_APPS}>Explore One-Click Apps</a>
      </div>
    </section>
  );
}

export function SourceLinks({ children }: { children: ReactNode }) {
  return <div className="source-links"><h2>Sources and verification</h2><p>Last verified {verifiedDate}. Links below point to official project documentation.</p><ul>{children}</ul></div>;
}

export function ComparePage({ children }: { children: ReactNode }) {
  return <main className="compare-page"><CompareHeader />{children}<CompareFooter /></main>;
}

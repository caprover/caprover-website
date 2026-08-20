import { DEFAULT_LOCALE, docsUrl, type Locale } from "../../../i18n/config";
import { getMessages } from "../../../i18n/messages";
import { ChoiceGrid, ComparePage, ComparisonPrinciples, MarketingCta, MatchupLinks, PageHero, PairwiseTable, ProofStrip, ResourceCallout, SimplicityPower, SourceLinks } from "../components";
import type { PairwiseRow } from "../data";

export function DokployComparisonPage({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = getMessages(locale).comparisonPages.dokploy;
  const sources = copy.sourceLabels;
  return (
    <ComparePage locale={locale}>
      <PageHero {...copy.hero}><div className="verdict"><strong>{copy.hero.verdictTitle}</strong><p>{copy.hero.verdict}</p></div><ProofStrip locale={locale} /></PageHero>
      <section className="compare-section compare-shell"><SimplicityPower locale={locale} /><ResourceCallout locale={locale}><p>{copy.resourceDescription}</p></ResourceCallout></section>
      <section className="compare-section compare-soft"><div className="compare-shell"><div className="compare-heading"><p className="compare-kicker">{copy.capabilityKicker}</p><h2>{copy.capabilityTitle}</h2></div><ComparisonPrinciples locale={locale} /><PairwiseTable competitorName={copy.competitorName} rows={copy.rows as PairwiseRow[]} locale={locale} /></div></section>
      <section className="compare-section compare-shell"><div className="article-layout">{copy.articles.map((article) => <article key={article.title}><h2>{article.title}</h2>{article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>)}</div></section>
      <section className="compare-section compare-shell"><ChoiceGrid caprover={copy.choice.caprover} competitorName={copy.competitorName} competitor={copy.choice.competitor} locale={locale} /></section>
      <section className="compare-section compare-shell"><h2>{copy.migrationTitle}</h2><div className="migration-grid migration-single"><p>{copy.migrationDescription}</p></div><MarketingCta locale={locale} /></section>
      <section className="compare-section compare-shell"><MatchupLinks current="dokploy" locale={locale} /><SourceLinks locale={locale}>
        <li><a href={docsUrl("get-started", locale)}>{sources.installation}</a></li>
        <li><a href={docsUrl("deployment-methods", locale)}>{sources.deploymentMethods}</a></li>
        <li><a href={docsUrl("service-update-override", locale)}>{sources.serviceOverrides}</a></li>
        <li><a href={docsUrl("nginx-customization", locale)}>{sources.nginx}</a></li>
        <li><a href={docsUrl("app-scaling-and-cluster", locale)}>{sources.clustering}</a></li>
        <li><a href="https://docs.dokploy.com/docs/core/installation">{sources.competitorInstallation}</a></li>
        <li><a href="https://docs.dokploy.com/docs/cli">{sources.cli}</a></li>
        <li><a href="https://docs.dokploy.com/docs/core/docker-compose">{sources.compose}</a></li>
        <li><a href="https://docs.dokploy.com/docs/core/cluster">{sources.clusters}</a></li>
        <li><a href="https://docs.dokploy.com/docs/core/permissions">{sources.permissions}</a></li>
      </SourceLinks></section>
    </ComparePage>
  );
}

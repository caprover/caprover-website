import { DEFAULT_LOCALE, docsUrl, type Locale } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";
import {
  ComparePage,
  ComparisonPrinciples,
  ComparisonTable,
  MarketingCta,
  MatchupLinks,
  PageHero,
  ProofStrip,
  ResourceCallout,
  SimplicityPower,
  SourceLinks,
} from "./components";

export function ComparisonHubPage({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = getMessages(locale).comparisonPages.hub;
  const sources = copy.sourceLabels;
  return (
    <ComparePage locale={locale}>
      <PageHero {...copy.hero}><ProofStrip locale={locale} /></PageHero>

      <section className="compare-section compare-shell">
        <SimplicityPower locale={locale} />
        <ResourceCallout locale={locale}><p>{copy.resourceDescription}</p></ResourceCallout>
      </section>

      <section className="compare-section compare-soft"><div className="compare-shell">
        <div className="compare-heading"><p className="compare-kicker">{copy.shortVersion.kicker}</p><h2>{copy.shortVersion.title}</h2><p>{copy.shortVersion.description}</p></div>
        <ComparisonPrinciples locale={locale} />
        <ComparisonTable focus="caprover" locale={locale} />
      </div></section>

      <section className="compare-section compare-shell">
        <div className="compare-heading"><p className="compare-kicker">{copy.oneOnOne.kicker}</p><h2>{copy.oneOnOne.title}</h2><p>{copy.oneOnOne.description}</p></div>
        <MatchupLinks locale={locale} />
        <MarketingCta locale={locale} />
      </section>

      <section className="compare-section compare-shell"><SourceLinks locale={locale}>
        <li><a href={docsUrl("deployment-methods", locale)}>{sources.deploymentMethods}</a></li>
        <li><a href={docsUrl("one-click-apps", locale)}>{sources.oneClickApps}</a></li>
        <li><a href={docsUrl("app-scaling-and-cluster", locale)}>{sources.clustering}</a></li>
        <li><a href={docsUrl("nginx-customization", locale)}>{sources.nginx}</a></li>
        <li><a href={docsUrl("service-update-override", locale)}>{sources.serviceOverrides}</a></li>
        <li><a href={docsUrl("get-started", locale)}>{sources.installation}</a></li>
        <li><a href="https://docs.dokploy.com/docs/core">{sources.dokployDocs}</a></li>
        <li><a href="https://docs.dokploy.com/docs/core/installation">{sources.dokployInstallation}</a></li>
        <li><a href="https://dokku.com/docs/">{sources.dokkuDocs}</a></li>
        <li><a href="https://dokku.com/docs/getting-started/installation/">{sources.dokkuInstallation}</a></li>
        <li><a href="https://pro.dokku.com/docs/getting-started/">{sources.dokkuPro}</a></li>
        <li><a href="https://coolify.io/docs">{sources.coolifyDocs}</a></li>
        <li><a href="https://coolify.io/docs/get-started/installation">{sources.coolifyInstallation}</a></li>
      </SourceLinks></section>
    </ComparePage>
  );
}

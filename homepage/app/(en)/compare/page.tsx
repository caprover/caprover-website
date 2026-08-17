import type { Metadata } from "next";
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
  docsHref,
} from "@/components/compare/components";
import { alternateLanguages, getCompareHub } from "@/lib/i18n";

const locale = "en" as const;
const copy = getCompareHub(locale);

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: "https://caprover.com/compare/",
    languages: alternateLanguages("/compare/"),
  },
};

export default function ComparisonHub() {
  return (
    <ComparePage locale={locale} path="/compare/">
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro}>
        <ProofStrip locale={locale} />
      </PageHero>

      <section className="compare-section compare-shell">
        <SimplicityPower locale={locale} />
        <ResourceCallout locale={locale}>
          <p>{copy.resourceText}</p>
        </ResourceCallout>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell">
          <div className="compare-heading">
            <p className="compare-kicker">{copy.shortKicker}</p>
            <h2>{copy.shortTitle}</h2>
            <p>{copy.shortText}</p>
          </div>
          <ComparisonPrinciples locale={locale} />
          <ComparisonTable locale={locale} focus="caprover" />
        </div>
      </section>

      <section className="compare-section compare-shell">
        <div className="compare-heading">
          <p className="compare-kicker">{copy.oneOnOneKicker}</p>
          <h2>{copy.oneOnOneTitle}</h2>
          <p>{copy.oneOnOneText}</p>
        </div>
        <MatchupLinks locale={locale} />
        <MarketingCta locale={locale} />
      </section>

      <section className="compare-section compare-shell">
        <SourceLinks locale={locale}>
          <li><a href={docsHref(locale, "deployment-methods")}>CapRover deployment methods and rollback</a></li>
          <li><a href={docsHref(locale, "one-click-apps")}>CapRover One-Click Apps</a></li>
          <li><a href={docsHref(locale, "app-scaling-and-cluster")}>CapRover Docker Swarm clustering</a></li>
          <li><a href={docsHref(locale, "nginx-customization")}>CapRover NGINX customization</a></li>
          <li><a href={docsHref(locale, "service-update-override")}>CapRover Docker service overrides</a></li>
          <li><a href={docsHref(locale)}>CapRover installation requirements</a></li>
          <li><a href="https://docs.dokploy.com/docs/core">Dokploy documentation</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/installation">Dokploy installation requirements</a></li>
          <li><a href="https://dokku.com/docs/">Dokku documentation</a></li>
          <li><a href="https://dokku.com/docs/getting-started/installation/">Dokku installation requirements</a></li>
          <li><a href="https://pro.dokku.com/docs/getting-started/">Dokku Pro web UI and API</a></li>
          <li><a href="https://coolify.io/docs">Coolify documentation</a></li>
          <li><a href="https://coolify.io/docs/get-started/installation">Coolify installation requirements</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

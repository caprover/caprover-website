import { DEFAULT_LOCALE, docsUrl, type Locale } from "@/i18n/config";
import { getMessages, messageList } from "@/i18n/messages";
import routes from "@/routes.json";
import {
  ChoiceGrid,
  ComparePage,
  ComparisonPrinciples,
  MarketingCta,
  MatchupLinks,
  PageHero,
  PairwiseTable,
  ProofStrip,
  ResourceCallout,
  SimplicityPower,
  SourceLinks,
} from "../components";
import type { PairwiseRow } from "../data";

export function CoolifyComparisonPage({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const copy = getMessages(locale).comparisonPages.coolify;
  const sources = copy.sourceLabels;
  return (
    <ComparePage locale={locale} path={routes.coolify.path}>
      <PageHero {...copy.hero}>
        <div className="verdict">
          <strong>{copy.hero.verdictTitle}</strong>
          <p>{copy.hero.verdict}</p>
        </div>
        <ProofStrip locale={locale} />
      </PageHero>
      <section className="compare-section compare-shell">
        <SimplicityPower locale={locale} />
        <ResourceCallout locale={locale}>
          <p>{copy.resourceDescription}</p>
        </ResourceCallout>
      </section>
      <section className="compare-section compare-soft">
        <div className="compare-shell">
          <div className="compare-heading">
            <p className="compare-kicker">{copy.capabilityKicker}</p>
            <h2>{copy.capabilityTitle}</h2>
          </div>
          <ComparisonPrinciples locale={locale} />
          <PairwiseTable
            competitorName={copy.competitorName}
            rows={messageList(copy.rows) as PairwiseRow[]}
            locale={locale}
          />
        </div>
      </section>
      <section className="compare-section compare-shell">
        <div className="article-layout">
          {messageList(copy.articles).map((article) => (
            <article key={article.title}>
              <h2>{article.title}</h2>
              {messageList(article.paragraphs).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
      <section className="compare-section compare-shell">
        <ChoiceGrid
          caprover={messageList(copy.choice.caprover)}
          competitorName={copy.competitorName}
          competitor={messageList(copy.choice.competitor)}
          locale={locale}
        />
      </section>
      <section className="compare-section compare-shell">
        <h2>{copy.migrationTitle}</h2>
        <div className="migration-grid migration-single">
          <p>{copy.migrationDescription}</p>
        </div>
        <MarketingCta locale={locale} />
      </section>
      <section className="compare-section compare-shell">
        <MatchupLinks current="coolify" locale={locale} />
        <SourceLinks locale={locale}>
          <li>
            <a href={docsUrl("get-started", locale)}>{sources.installation}</a>
          </li>
          <li>
            <a href={docsUrl("deployment-methods", locale)}>
              {sources.deploymentMethods}
            </a>
          </li>
          <li>
            <a href={docsUrl("app-scaling-and-cluster", locale)}>
              {sources.clustering}
            </a>
          </li>
          <li>
            <a href={docsUrl("nginx-customization", locale)}>{sources.nginx}</a>
          </li>
          <li>
            <a href={docsUrl("service-update-override", locale)}>
              {sources.serviceOverrides}
            </a>
          </li>
          <li>
            <a href="https://coolify.io/docs/get-started/installation">
              {sources.competitorInstallation}
            </a>
          </li>
          <li>
            <a href="https://coolify.io/docs/applications/build-packs/docker-compose">
              {sources.compose}
            </a>
          </li>
          <li>
            <a href="https://coolify.io/docs/knowledge-base/server/openssh">
              {sources.servers}
            </a>
          </li>
          <li>
            <a href="https://coolify.io/docs/knowledge-base/docker/swarm">
              {sources.swarm}
            </a>
          </li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

import { DEFAULT_LOCALE, docsUrl, type Locale } from "@/i18n/config";
import { getMessages, messageList } from "@/i18n/messages";
import routes from "@/routes.json";
import {
  CapRoverDeploymentSources,
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

export function DokployComparisonPage({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const messages = getMessages(locale);
  const copy = messages.comparisonPages.dokploy;
  const sources = copy.sourceLabels;
  return (
    <ComparePage locale={locale} path={routes.dokploy.path}>
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
        <MatchupLinks current="dokploy" locale={locale} />
        <SourceLinks locale={locale}>
          <CapRoverDeploymentSources locale={locale} />
          <li>
            <a href={docsUrl("get-started", locale)}>{sources.installation}</a>
          </li>
          <li>
            <a href={docsUrl("deployments", locale)}>
              {sources.deploymentMethods}
            </a>
          </li>
          <li>
            <a href={docsUrl("applications/advanced", locale)}>
              {sources.serviceOverrides}
            </a>
          </li>
          <li>
            <a href={docsUrl("domains/advanced-nginx", locale)}>
              {sources.nginx}
            </a>
          </li>
          <li>
            <a href={docsUrl("scaling/multi-node", locale)}>
              {sources.clustering}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/core/installation">
              {sources.competitorInstallation}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/cli/application">
              {sources.cli}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/core/docker-compose">
              {sources.compose}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/core/cluster">
              {sources.clusters}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/core/permissions">
              {sources.permissions}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/core/applications/rollbacks">
              {messages.comparisonCommon.sources.dokployRollback}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/core/registry">
              {messages.comparisonCommon.sources.dokployRegistry}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/core/applications/advanced">
              {messages.comparisonCommon.sources.dokployAdvanced}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/core/deployment-options">
              {messages.comparisonCommon.sources.dokployServers}
            </a>
          </li>
          <li>
            <a href="https://docs.dokploy.com/docs/core/volume-backups">
              {messages.comparisonCommon.sources.dokployBackups}
            </a>
          </li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

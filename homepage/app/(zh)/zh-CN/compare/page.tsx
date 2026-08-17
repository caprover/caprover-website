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

const locale = "zh-CN" as const;
const copy = getCompareHub(locale);

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: "https://caprover.com/zh-CN/compare/",
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
          <li><a href={docsHref(locale, "deployment-methods")}>CapRover 部署方式与回滚</a></li>
          <li><a href={docsHref(locale, "one-click-apps")}>CapRover 一键应用</a></li>
          <li><a href={docsHref(locale, "app-scaling-and-cluster")}>CapRover Docker Swarm 集群</a></li>
          <li><a href={docsHref(locale, "nginx-customization")}>CapRover NGINX 自定义</a></li>
          <li><a href={docsHref(locale, "service-update-override")}>CapRover Docker 服务覆盖</a></li>
          <li><a href={docsHref(locale)}>CapRover 安装要求</a></li>
          <li><a href="https://docs.dokploy.com/docs/core">Dokploy 文档</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/installation">Dokploy 安装要求</a></li>
          <li><a href="https://dokku.com/docs/">Dokku 文档</a></li>
          <li><a href="https://dokku.com/docs/getting-started/installation/">Dokku 安装要求</a></li>
          <li><a href="https://pro.dokku.com/docs/getting-started/">Dokku Pro Web UI 和 API</a></li>
          <li><a href="https://coolify.io/docs">Coolify 文档</a></li>
          <li><a href="https://coolify.io/docs/get-started/installation">Coolify 安装要求</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

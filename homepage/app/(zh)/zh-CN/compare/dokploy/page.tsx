import type { Metadata } from "next";
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
  docsHref,
} from "@/components/compare/components";
import type { PairwiseRow } from "@/components/compare/data";
import { alternateLanguages } from "@/lib/i18n";

const locale = "zh-CN" as const;

export const metadata: Metadata = {
  title: "CapRover 对比 Dokploy：经过验证的简单，以及深入控制",
  description:
    "从易用性、服务器要求、Docker Swarm、部署、NGINX、Traefik、registry、回滚和 Compose 对比 CapRover 与 Dokploy。",
  alternates: {
    canonical: "https://caprover.com/zh-CN/compare/dokploy/",
    languages: alternateLanguages("/compare/dokploy/"),
  },
};

const rows: PairwiseRow[] = [
  {
    feature: "开源控制台，覆盖日常运维",
    caprover: { status: "yes" },
    competitor: { status: "yes" },
  },
  {
    feature: "官方文档写明最低 1 GB RAM",
    caprover: { status: "yes", note: "1 GB" },
    competitor: { status: "no", note: "2 GB RAM" },
  },
  {
    feature: "为本地 CLI 设计的部署方式",
    caprover: { status: "yes", note: "caprover deploy" },
    competitor: { status: "yes", note: "dokploy app deploy" },
  },
  {
    feature: "一键应用和数据库目录",
    caprover: { status: "yes", note: "开源目录" },
    competitor: { status: "yes", note: "开源模板" },
  },
  {
    feature: "以 Docker Swarm 作为标准运行时",
    caprover: { status: "yes" },
    competitor: { status: "yes" },
  },
  {
    feature: "无需外部 registry 的一键回滚",
    caprover: { status: "yes", note: "来自部署历史" },
    competitor: { status: "partial", note: "必须先配置 registry" },
  },
  {
    feature: "由平台提供的私有本地 registry",
    caprover: { status: "yes" },
    competitor: { status: "no", note: "连接已有 registry" },
  },
  {
    feature: "简单控制台，并提供代理层高级出口",
    caprover: { status: "yes" },
    competitor: { status: "no", note: "使用 Traefik 配置" },
  },
  {
    feature: "简单控制台，并提供编排器原生高级出口",
    caprover: { status: "yes", note: "Docker 服务设置" },
    competitor: { status: "partial", note: "结构化 Swarm 设置" },
  },
  {
    feature: "2017 年或更早的公开项目",
    caprover: { status: "yes", note: "始于 2017" },
    competitor: { status: "no", note: "始于 2024" },
  },
];

export default function DokployComparison() {
  return (
    <ComparePage locale={locale} path="/compare/dokploy/">
      <PageHero
        eyebrow="CAPROVER VS DOKPLOY"
        title="选择通往 Docker Swarm 的成熟、专注路径。"
        intro="从 2017 年起，CapRover 就通过以应用为中心的控制台，让 Docker Swarm 和 NGINX 更容易上手。常见部署保持简单，高级负载仍可使用原生基础设施控制。"
      >
        <div className="verdict">
          <strong>为什么选择 CapRover</strong>
          <p>
            选择 CapRover，是因为它的文档起步要求更低，项目历史更长，回滚自包含，能提供本地 registry，并把简单默认值与深入的 NGINX、Docker 控制结合在一起。当你需要一等公民的 Compose、独立远程服务器或多用户工作流时，再考虑 Dokploy。
          </p>
        </div>
        <ProofStrip locale={locale} />
      </PageHero>

      <section className="compare-section compare-shell">
        <SimplicityPower locale={locale} />
        <ResourceCallout locale={locale}>
          <p>CapRover 文档写明最低 1 GB RAM。Dokploy 文档写明至少 2 GB RAM 和 30 GB 可用存储，以便获得更顺畅的安装体验。</p>
        </ResourceCallout>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell">
          <div className="compare-heading">
            <p className="compare-kicker">能力核对</p>
            <h2>两个 Swarm 平台，设计优先级不同。</h2>
          </div>
          <ComparisonPrinciples locale={locale} />
          <PairwiseTable locale={locale} competitorName="Dokploy" rows={rows} />
        </div>
      </section>

      <section className="compare-section compare-shell">
        <div className="article-layout">
          <article>
            <h2>小而完整的应用模型</h2>
            <p>CapRover 把核心词汇保持得很紧凑：应用、域名、环境变量、持久化目录和副本。</p>
            <p>这套专注模型从单机安装一直延续到多节点 Swarm，减少了日常运维需要理解的平台概念。</p>
          </article>
          <article>
            <h2>自包含的部署流程</h2>
            <p>可以从 CLI 或控制台部署源码，使用预构建镜像，或用通用 Git webhook 触发部署。CapRover 会保存源码部署历史，便于一键重建和重新部署。</p>
            <p>当多节点集群需要 registry 时，CapRover 可以提供并管理 Swarm 使用的本地 registry。</p>
          </article>
          <article>
            <h2>强大，但不把复杂度提前摊开</h2>
            <p>CapRover 会自动创建可用的 NGINX 和 Docker 服务配置，因此普通部署不必接触这两者。</p>
            <p>高级负载仍可在控制台编辑完整的按应用 NGINX 模板，并覆盖原生 Docker 服务设置。</p>
          </article>
          <article>
            <h2>实际差异</h2>
            <p>Dokploy 把 Compose、远程服务器和多用户组织放在产品模型更中心的位置。</p>
            <p>CapRover 专注于在一个 Docker Swarm 中运行应用。当那些更宽的抽象并不是真实需求时，更窄的常见路径反而是优势。</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          locale={locale}
          caprover={[
            "你想要一个更成熟的应用平台，以及更低的文档服务器最低要求。",
            "你看重简单默认值，以及直接访问 NGINX 和原生 Docker 设置。",
            "回滚应该在不配置外部 registry 的情况下可用。",
            "平台应能提供 Swarm 使用的本地 registry。",
            "你的部署模型就是一个容易理解的 Docker Swarm。",
          ]}
          competitorName="Dokploy"
          competitor={[
            "Docker Compose 和 Docker Stack 是主要部署格式。",
            "你需要组织、多用户或基于角色的访问控制。",
            "你需要独立的远程部署服务器或专用构建服务器。",
          ]}
        />
      </section>

      <section className="compare-section compare-shell">
        <h2>迁移到 CapRover</h2>
        <div className="migration-grid migration-single">
          <p>把复杂的 Compose 项目拆成 CapRover 应用，或对照受支持的一键字段进行验证。映射域名和环境变量，然后用数据库或存储系统自己的迁移工具转移持久化数据。</p>
        </div>
        <MarketingCta locale={locale} />
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks locale={locale} current="dokploy" />
        <SourceLinks locale={locale}>
          <li><a href={docsHref(locale)}>CapRover 安装要求</a></li>
          <li><a href={docsHref(locale, "deployment-methods")}>CapRover 部署方式与回滚</a></li>
          <li><a href={docsHref(locale, "service-update-override")}>CapRover Docker 服务覆盖</a></li>
          <li><a href={docsHref(locale, "nginx-customization")}>CapRover NGINX 自定义</a></li>
          <li><a href={docsHref(locale, "app-scaling-and-cluster")}>CapRover Swarm 集群和 registry</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/installation">Dokploy 安装要求</a></li>
          <li><a href="https://docs.dokploy.com/docs/cli">Dokploy CLI</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/docker-compose">Dokploy Docker Compose</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/cluster">Dokploy 集群</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/permissions">Dokploy 角色与权限</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

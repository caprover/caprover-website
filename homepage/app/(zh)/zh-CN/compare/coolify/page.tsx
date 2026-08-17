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
  title: "CapRover 对比 Coolify：简单，同时不放弃控制",
  description:
    "从易用性、服务器要求、部署、Docker Swarm、NGINX、registry、回滚和高级控制对比 CapRover 与 Coolify。",
  alternates: {
    canonical: "https://caprover.com/zh-CN/compare/coolify/",
    languages: alternateLanguages("/compare/coolify/"),
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
    competitor: { status: "no", note: "2 GB RAM 和 2 核" },
  },
  {
    feature: "为本地 CLI 设计的部署方式",
    caprover: { status: "yes", note: "caprover deploy" },
    competitor: { status: "partial", note: "API 或 webhook 触发" },
  },
  {
    feature: "一键应用和数据库目录",
    caprover: { status: "yes", note: "开源目录" },
    competitor: { status: "yes", note: "服务模板" },
  },
  {
    feature: "标准运行时中的多节点编排",
    caprover: { status: "yes", note: "安装即带 Docker Swarm" },
    competitor: { status: "partial", note: "Swarm 支持仍是实验性" },
  },
  {
    feature: "无需外部 registry 的一键回滚",
    caprover: { status: "yes", note: "来自部署历史" },
    competitor: { status: "partial", note: "需要保留本地镜像" },
  },
  {
    feature: "由平台提供的私有本地 registry",
    caprover: { status: "yes" },
    competitor: { status: "partial", note: "作为服务部署" },
  },
  {
    feature: "简单控制台，并提供代理层高级出口",
    caprover: { status: "yes", note: "可编辑的 NGINX 模板" },
    competitor: { status: "partial", note: "标签和代理配置" },
  },
  {
    feature: "简单控制台，并提供编排器原生高级出口",
    caprover: { status: "yes", note: "Docker 服务设置" },
    competitor: { status: "partial", note: "Docker 选项和 Compose" },
  },
  {
    feature: "2017 年或更早的公开项目",
    caprover: { status: "yes", note: "始于 2017" },
    competitor: { status: "no", note: "始于 2021" },
  },
];

export default function CoolifyComparison() {
  return (
    <ComparePage locale={locale} path="/compare/coolify/">
      <PageHero
        eyebrow="CAPROVER VS COOLIFY"
        title="选择更简单的路径，同时不放弃控制。"
        intro="CapRover 把日常工作集中在应用、域名和部署上。当出现边缘场景时，你可以直接访问底层的 NGINX 和 Docker 配置，而不必一开始就接受一套更宽的平台模型。"
      >
        <div className="verdict">
          <strong>为什么选择 CapRover</strong>
          <p>
            选择 CapRover，是因为它的文档起步要求更低，标准运行时是 Docker Swarm，支持直接本地部署，并提供深入的基础设施出口。当你必须使用一等公民的 Compose、独立远程服务器、预览部署或细粒度团队工作流时，再考虑 Coolify。
          </p>
        </div>
        <ProofStrip locale={locale} />
      </PageHero>

      <section className="compare-section compare-shell">
        <SimplicityPower locale={locale} />
        <ResourceCallout locale={locale}>
          <p>CapRover 文档写明最低 1 GB RAM。Coolify 文档写明至少 2 GB RAM、2 个 CPU 核心和 30 GB 可用存储。</p>
        </ResourceCallout>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell">
          <div className="compare-heading">
            <p className="compare-kicker">能力核对</p>
            <h2>默认路径专注，关键时刻仍能控制。</h2>
          </div>
          <ComparisonPrinciples locale={locale} />
          <PairwiseTable locale={locale} competitorName="Coolify" rows={rows} />
        </div>
      </section>

      <section className="compare-section compare-shell">
        <div className="article-layout">
          <article>
            <h2>一套容易理解的运行时</h2>
            <p>即使只有一台服务器，CapRover 也从 Docker Swarm 开始。应用、副本、路由和工作节点会随着安装规模一起留在同一套模型里。</p>
            <p>日常工作围绕应用展开，而不是项目、环境、资源和已连接服务器的层级结构。</p>
          </article>
          <article>
            <h2>方便，但不锁定</h2>
            <p>用控制台管理域名、HTTPS、变量、卷、日志和副本。也可以直接运行 caprover deploy、上传压缩包、使用镜像，或连接通用 Git webhook。</p>
            <p>简单路径不会在负载需要特殊行为时，拿走对 Docker 或 NGINX 的访问。</p>
          </article>
          <article>
            <h2>只有在你要求时才进入高级模式</h2>
            <p>CapRover 会自动生成可用的 NGINX 配置。如果需要，可以编辑完整的按应用模板，处理重定向、响应头、缓存、认证和其他指令。</p>
            <p>原生 Docker 服务设置也可以作为高级覆盖使用，对普通部署保持不可见。</p>
          </article>
          <article>
            <h2>实际差异</h2>
            <p>Coolify 覆盖更宽的项目、环境、Compose 负载和独立连接的服务器。</p>
            <p>CapRover 有意把常见路径收窄。当你的目标是简单地部署容器化应用、保留深入控制，并且不想运营超出负载所需的控制平面时，它更合适。</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          locale={locale}
          caprover={[
            "你想要简单的应用模型，以及更低的文档服务器最低要求。",
            "你想要容易的默认设置，同时不失去对 NGINX 和原生 Docker 设置的访问。",
            "你希望直接从自己的电脑部署，而不依赖 Git 托管集成。",
            "你的扩展路径是一个标准 Docker Swarm，而不是多台互不相关的主机。",
            "你看重由平台提供的本地 registry 和自包含回滚。",
          ]}
          competitorName="Coolify"
          competitor={[
            "一等公民的 Docker Compose 是主要需求。",
            "一个控制平面必须管理多台独立服务器。",
            "你需要项目、环境、预览部署或细粒度团队角色。",
          ]}
        />
      </section>

      <section className="compare-section compare-shell">
        <h2>迁移到 CapRover</h2>
        <div className="migration-grid migration-single">
          <p>把 Compose 服务转换成 CapRover 应用或兼容的一键模板，映射域名和环境变量，并用数据库或存储系统自己的备份工具迁移持久化数据。</p>
        </div>
        <MarketingCta locale={locale} />
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks locale={locale} current="coolify" />
        <SourceLinks locale={locale}>
          <li><a href={docsHref(locale)}>CapRover 安装要求</a></li>
          <li><a href={docsHref(locale, "deployment-methods")}>CapRover 部署方式与回滚</a></li>
          <li><a href={docsHref(locale, "app-scaling-and-cluster")}>CapRover 扩展与集群</a></li>
          <li><a href={docsHref(locale, "nginx-customization")}>CapRover NGINX 自定义</a></li>
          <li><a href={docsHref(locale, "service-update-override")}>CapRover Docker 服务覆盖</a></li>
          <li><a href="https://coolify.io/docs/get-started/installation">Coolify 安装要求</a></li>
          <li><a href="https://coolify.io/docs/applications/build-packs/docker-compose">Coolify Docker Compose 部署</a></li>
          <li><a href="https://coolify.io/docs/knowledge-base/server/openssh">Coolify 服务器连接</a></li>
          <li><a href="https://coolify.io/docs/knowledge-base/docker/swarm">Coolify 实验性 Docker Swarm 支持</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

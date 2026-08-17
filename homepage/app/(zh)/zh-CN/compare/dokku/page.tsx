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
  title: "CapRover 对比 Dokku：开源控制台与 CLI",
  description:
    "从易用性、服务器要求、开源控制台、部署、Docker 编排、NGINX、一键应用和回滚对比 CapRover 与 Dokku。",
  alternates: {
    canonical: "https://caprover.com/zh-CN/compare/dokku/",
    languages: alternateLanguages("/compare/dokku/"),
  },
};

const rows: PairwiseRow[] = [
  {
    feature: "开源控制台，覆盖日常运维",
    caprover: { status: "yes" },
    competitor: { status: "no", note: "Dokku Pro 另提供" },
  },
  {
    feature: "官方文档写明最低 1 GB RAM",
    caprover: { status: "yes", note: "1 GB" },
    competitor: { status: "yes", note: "配合 Docker 为 1 GB" },
  },
  {
    feature: "为本地 CLI 设计的部署方式",
    caprover: { status: "yes", note: "caprover deploy" },
    competitor: { status: "yes", note: "git push 或 archive" },
  },
  {
    feature: "一键应用和数据库目录",
    caprover: { status: "yes", note: "开源目录" },
    competitor: { status: "partial", note: "插件，没有对等目录" },
  },
  {
    feature: "标准运行时中的多节点编排",
    caprover: { status: "yes", note: "安装即带 Docker Swarm" },
    competitor: { status: "partial", note: "可选 K3s scheduler" },
  },
  {
    feature: "一键应用回滚",
    caprover: { status: "yes", note: "来自部署历史" },
    competitor: { status: "no", note: "手动重新部署" },
  },
  {
    feature: "简单控制台，并提供代理层高级出口",
    caprover: { status: "yes", note: "可编辑的 NGINX 模板" },
    competitor: { status: "no", note: "开源版使用 CLI 和模板" },
  },
  {
    feature: "简单控制台，并提供编排器原生高级出口",
    caprover: { status: "yes", note: "Docker 服务设置" },
    competitor: { status: "no", note: "开源版使用 CLI 和插件" },
  },
  {
    feature: "2017 年或更早的公开项目",
    caprover: { status: "yes", note: "始于 2017" },
    competitor: { status: "yes", note: "始于 2013" },
  },
];

export default function DokkuComparison() {
  return (
    <ComparePage locale={locale} path="/compare/dokku/">
      <PageHero
        eyebrow="CAPROVER VS DOKKU"
        title="获得完整的开源控制台，同时不必放弃命令行。"
        intro="CapRover 让常规路径可视化、直接，同时在需要时保留 CLI、API、NGINX 和 Docker 控制。你不必在易用性和基础设施访问之间二选一。"
      >
        <div className="verdict">
          <strong>为什么选择 CapRover</strong>
          <p>
            当控制台运维、一键应用、回滚和多节点编排应当包含在开源产品里时，选择 CapRover。当以 CLI 为主的工作流、广泛的 builder 选择、cron 和可组合插件系统是核心需求时，再考虑 Dokku。
          </p>
        </div>
        <ProofStrip locale={locale} />
      </PageHero>

      <section className="compare-section compare-shell">
        <SimplicityPower locale={locale} />
        <ResourceCallout locale={locale}>
          <p>
            CapRover 和 Dokku 在默认的 Docker 运行时下，都把最低要求写为 1 GB。CapRover 在这一公开起步要求上，已经包含 Web 控制台和 Docker Swarm 模型。
          </p>
        </ResourceCallout>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell">
          <div className="compare-heading">
            <p className="compare-kicker">能力核对</p>
            <h2>可视化运维和 CLI 部署，出现在同一个开源产品里。</h2>
          </div>
          <ComparisonPrinciples locale={locale} />
          <PairwiseTable locale={locale} competitorName="Dokku OSS" rows={rows} />
        </div>
      </section>

      <section className="compare-section compare-shell">
        <div className="article-layout">
          <article>
            <h2>控制台就是简单路径</h2>
            <p>域名、证书、环境变量、持久化目录、副本、日志和部署历史都可以看见、可以编辑，不必先拼命令。</p>
            <p>这让每个能打开 CapRover 控制台的开发者，都能完成日常操作。</p>
          </article>
          <article>
            <h2>命令行仍然在</h2>
            <p>可以从本地项目运行 caprover deploy，上传压缩包，部署镜像，或触发通用 Git webhook。控制台本身也使用 CapRover 的 HTTP API。</p>
            <p>CapRover 增加了可视化流程，但没有拿走自动化或终端部署。</p>
          </article>
          <article>
            <h2>简单并不等于受限</h2>
            <p>大多数应用会原样使用生成的 NGINX 和 Docker 配置。高级负载可以编辑完整的按应用 NGINX 模板，并覆盖原生 Docker 服务设置。</p>
            <p>这些控制会留在常见路径之外，直到运维人员明确需要它们。</p>
          </article>
          <article>
            <h2>实际差异</h2>
            <p>Dokku 的开源核心有意以 CLI 为主，并通过 builder、命令和插件保持高度可组合。Dokku Pro 另外提供官方 Web 界面和 API。</p>
            <p>CapRover 把可视化运维、一键目录和 Swarm 管理直接放进开源平台。</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          locale={locale}
          caprover={[
            "完整的 Web 控制台应当包含在开源平台中。",
            "你希望同时拥有简单的可视化流程和直接的本地部署。",
            "你希望深入的 NGINX 和 Docker 控制可用，但不要成为默认工作流。",
            "Docker Swarm 集群和回滚应当由同一个产品管理。",
            "你依赖可部署应用和数据库的一键目录。",
          ]}
          competitorName="Dokku"
          competitor={[
            "SSH 命令和 Git push 应当是主要界面。",
            "Buildpack 和可组合插件系统是必需的。",
            "你需要内置 cron 任务定义或全局环境变量。",
          ]}
        />
      </section>

      <section className="compare-section compare-shell">
        <h2>迁移到 CapRover</h2>
        <div className="migration-grid migration-single">
          <p>把 Dokku 配置转换成 CapRover 环境变量和应用设置，添加 captain-definition 文件，映射域名，并用数据库自己的备份恢复工具迁移数据。</p>
        </div>
        <MarketingCta locale={locale} />
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks locale={locale} current="dokku" />
        <SourceLinks locale={locale}>
          <li><a href={docsHref(locale)}>CapRover 安装要求</a></li>
          <li><a href={docsHref(locale, "cli-commands")}>CapRover CLI 部署</a></li>
          <li><a href={docsHref(locale, "one-click-apps")}>CapRover 一键应用</a></li>
          <li><a href={docsHref(locale, "nginx-customization")}>CapRover NGINX 自定义</a></li>
          <li><a href={docsHref(locale, "service-update-override")}>CapRover Docker 服务覆盖</a></li>
          <li><a href={docsHref(locale, "app-scaling-and-cluster")}>CapRover 扩展与集群</a></li>
          <li><a href="https://dokku.com/docs/getting-started/installation/">Dokku 架构和安装要求</a></li>
          <li><a href="https://dokku.com/docs/deployment/methods/git/">Dokku Git 部署</a></li>
          <li><a href="https://dokku.com/docs/deployment/schedulers/k3s/">Dokku K3s scheduler</a></li>
          <li><a href="https://pro.dokku.com/docs/getting-started/">Dokku Pro Web UI 和 API</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

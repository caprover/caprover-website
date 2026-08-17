export type Product = "caprover" | "dokploy" | "dokku" | "coolify";

export type ComparisonStatus = "yes" | "partial" | "no";

export type ComparisonValue = {
  status: ComparisonStatus;
  note?: string;
};

export type ComparisonRow = {
  feature: string;
  caprover: ComparisonValue;
  dokploy: ComparisonValue;
  dokku: ComparisonValue;
  coolify: ComparisonValue;
};

export type PairwiseRow = {
  feature: string;
  caprover: ComparisonValue;
  competitor: ComparisonValue;
};

export const products: Array<{ key: Product; label: string }> = [
  { key: "caprover", label: "CapRover" },
  { key: "dokploy", label: "Dokploy" },
  { key: "dokku", label: "Dokku OSS" },
  { key: "coolify", label: "Coolify" },
];

export const comparisonRows: ComparisonRow[] = [
  {
    feature: "Open-source dashboard for daily operations",
    caprover: { status: "yes" },
    dokploy: { status: "yes" },
    dokku: { status: "no", note: "Dokku Pro adds one" },
    coolify: { status: "yes" },
  },
  {
    feature: "Officially documented minimum of 1 GB RAM",
    caprover: { status: "yes", note: "1 GB" },
    dokploy: { status: "no", note: "2 GB" },
    dokku: { status: "yes", note: "1 GB with Docker" },
    coolify: { status: "no", note: "2 GB and 2 cores" },
  },
  {
    feature: "Purpose-built deployment from a local CLI",
    caprover: { status: "yes", note: "caprover deploy" },
    dokploy: { status: "yes", note: "dokploy app deploy" },
    dokku: { status: "yes", note: "git push or archive" },
    coolify: { status: "partial", note: "API or webhook trigger" },
  },
  {
    feature: "One-click application and database catalog",
    caprover: { status: "yes", note: "Open-source catalog" },
    dokploy: { status: "yes", note: "Open-source templates" },
    dokku: { status: "partial", note: "Plugins, no comparable catalog" },
    coolify: { status: "yes", note: "Service templates" },
  },
  {
    feature: "Automatic HTTPS with Let’s Encrypt",
    caprover: { status: "yes" },
    dokploy: { status: "yes" },
    dokku: { status: "partial", note: "Official plugin" },
    coolify: { status: "yes" },
  },
  {
    feature: "Multi-node orchestration in the standard runtime",
    caprover: { status: "yes", note: "Docker Swarm from installation" },
    dokploy: { status: "yes", note: "Docker Swarm" },
    dokku: { status: "partial", note: "Optional K3s scheduler" },
    coolify: { status: "partial", note: "Swarm support is experimental" },
  },
  {
    feature: "One-click rollback without an external registry",
    caprover: { status: "yes", note: "From deployment history" },
    dokploy: { status: "partial", note: "Registry must be configured" },
    dokku: { status: "no", note: "Manual redeploy" },
    coolify: { status: "partial", note: "Requires a retained local image" },
  },
  {
    feature: "Platform-provisioned private local registry",
    caprover: { status: "yes" },
    dokploy: { status: "no", note: "Connect an existing registry" },
    dokku: { status: "no", note: "Manual or plugin-based" },
    coolify: { status: "partial", note: "Deploy as a service" },
  },
  {
    feature: "Simple dashboard with an advanced proxy escape hatch",
    caprover: { status: "yes", note: "Complete per-app NGINX template" },
    dokploy: { status: "yes", note: "Traefik configuration" },
    dokku: { status: "no", note: "CLI and templates in OSS" },
    coolify: { status: "partial", note: "Labels and proxy configuration" },
  },
  {
    feature: "Simple dashboard with a native orchestrator escape hatch",
    caprover: { status: "yes", note: "Docker service settings" },
    dokploy: { status: "partial", note: "Structured Swarm settings" },
    dokku: { status: "no", note: "CLI and plugins in OSS" },
    coolify: { status: "partial", note: "Docker options and Compose" },
  },
  {
    feature: "Public project since 2017 or earlier",
    caprover: { status: "yes", note: "Since 2017" },
    dokploy: { status: "no", note: "Since 2024" },
    dokku: { status: "yes", note: "Since 2013" },
    coolify: { status: "no", note: "Since 2021" },
  },
];

export const zhComparisonRows: ComparisonRow[] = [
  {
    feature: "开源控制台，覆盖日常运维",
    caprover: { status: "yes" },
    dokploy: { status: "yes" },
    dokku: { status: "no", note: "Dokku Pro 另提供" },
    coolify: { status: "yes" },
  },
  {
    feature: "官方文档写明最低 1 GB RAM",
    caprover: { status: "yes", note: "1 GB" },
    dokploy: { status: "no", note: "2 GB" },
    dokku: { status: "yes", note: "配合 Docker 为 1 GB" },
    coolify: { status: "no", note: "2 GB 和 2 核" },
  },
  {
    feature: "为本地 CLI 设计的部署方式",
    caprover: { status: "yes", note: "caprover deploy" },
    dokploy: { status: "yes", note: "dokploy app deploy" },
    dokku: { status: "yes", note: "git push 或 archive" },
    coolify: { status: "partial", note: "API 或 webhook 触发" },
  },
  {
    feature: "一键应用和数据库目录",
    caprover: { status: "yes", note: "开源目录" },
    dokploy: { status: "yes", note: "开源模板" },
    dokku: { status: "partial", note: "插件，没有对等目录" },
    coolify: { status: "yes", note: "服务模板" },
  },
  {
    feature: "使用 Let’s Encrypt 自动配置 HTTPS",
    caprover: { status: "yes" },
    dokploy: { status: "yes" },
    dokku: { status: "partial", note: "官方插件" },
    coolify: { status: "yes" },
  },
  {
    feature: "标准运行时中的多节点编排",
    caprover: { status: "yes", note: "安装即带 Docker Swarm" },
    dokploy: { status: "yes", note: "Docker Swarm" },
    dokku: { status: "partial", note: "可选 K3s scheduler" },
    coolify: { status: "partial", note: "Swarm 支持仍是实验性" },
  },
  {
    feature: "无需外部 registry 的一键回滚",
    caprover: { status: "yes", note: "来自部署历史" },
    dokploy: { status: "partial", note: "必须先配置 registry" },
    dokku: { status: "no", note: "手动重新部署" },
    coolify: { status: "partial", note: "需要保留本地镜像" },
  },
  {
    feature: "由平台提供的私有本地 registry",
    caprover: { status: "yes" },
    dokploy: { status: "no", note: "连接已有 registry" },
    dokku: { status: "no", note: "手动或基于插件" },
    coolify: { status: "partial", note: "作为服务部署" },
  },
  {
    feature: "简单控制台，并提供代理层高级出口",
    caprover: { status: "yes", note: "完整的按应用 NGINX 模板" },
    dokploy: { status: "yes", note: "Traefik 配置" },
    dokku: { status: "no", note: "开源版使用 CLI 和模板" },
    coolify: { status: "partial", note: "标签和代理配置" },
  },
  {
    feature: "简单控制台，并提供编排器原生高级出口",
    caprover: { status: "yes", note: "Docker 服务设置" },
    dokploy: { status: "partial", note: "结构化 Swarm 设置" },
    dokku: { status: "no", note: "开源版使用 CLI 和插件" },
    coolify: { status: "partial", note: "Docker 选项和 Compose" },
  },
  {
    feature: "2017 年或更早的公开项目",
    caprover: { status: "yes", note: "始于 2017" },
    dokploy: { status: "no", note: "始于 2024" },
    dokku: { status: "yes", note: "始于 2013" },
    coolify: { status: "no", note: "始于 2021" },
  },
];

export const verifiedDateByLocale = {
  en: "August 16, 2026",
  "zh-CN": "2026 年 8 月 16 日",
} as const;

export const verifiedDate = verifiedDateByLocale.en;

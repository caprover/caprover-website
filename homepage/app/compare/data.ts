export type Product = "caprover" | "dokploy" | "dokku" | "coolify";

export type ComparisonRow = {
  feature: string;
  caprover: string;
  dokploy: string;
  dokku: string;
  coolify: string;
};

export const products: Array<{ key: Product; label: string }> = [
  { key: "caprover", label: "CapRover" },
  { key: "dokploy", label: "Dokploy" },
  { key: "dokku", label: "Dokku" },
  { key: "coolify", label: "Coolify" },
];

export const comparisonRows: ComparisonRow[] = [
  {
    feature: "Web dashboard",
    caprover: "Built in",
    dokploy: "Built in",
    dokku: "No built-in OSS dashboard; Dokku Pro adds one",
    coolify: "Built in",
  },
  {
    feature: "Dockerfile and prebuilt image deployments",
    caprover: "Supported",
    dokploy: "Supported",
    dokku: "Supported",
    coolify: "Supported",
  },
  {
    feature: "Git provider support",
    caprover: "Generic Git plus webhooks",
    dokploy: "GitHub, GitLab, Bitbucket, Gitea and generic Git",
    dokku: "Git push or sync from any Git remote",
    coolify: "GitHub, GitLab, Bitbucket, Gitea and generic Git",
  },
  {
    feature: "Docker Compose",
    caprover: "Partial parser for common fields",
    dokploy: "First-class support",
    dokku: "Not an application deployment format",
    coolify: "First-class support",
  },
  {
    feature: "Application template catalog",
    caprover: "Open-source One-Click Apps",
    dokploy: "Open-source templates",
    dokku: "Plugin ecosystem, no comparable catalog",
    coolify: "Open-source service templates",
  },
  {
    feature: "Automatic HTTPS",
    caprover: "Let's Encrypt",
    dokploy: "Let's Encrypt through Traefik",
    dokku: "Official Let’s Encrypt plugin",
    coolify: "Let's Encrypt through its proxy",
  },
  {
    feature: "Multi-node orchestration",
    caprover: "Native Docker Swarm",
    dokploy: "Native Docker Swarm",
    dokku: "Optional K3s scheduler",
    coolify: "Docker Swarm supported",
  },
  {
    feature: "Reverse proxy",
    caprover: "NGINX",
    dokploy: "Traefik",
    dokku: "NGINX by default, alternatives available",
    coolify: "Traefik by default; Caddy is experimental",
  },
  {
    feature: "Per-app proxy editing in the dashboard",
    caprover: "Full NGINX template editor",
    dokploy: "Domain UI; Traefik labels or dynamic config",
    dokku: "CLI and template customization",
    coolify: "Domain UI; labels or dynamic proxy config",
  },
  {
    feature: "Platform-managed local registry",
    caprover: "Built-in provisioning option",
    dokploy: "Connect an external registry",
    dokku: "Manual or plugin-based",
    coolify: "Deployable as a service template",
  },
  {
    feature: "Application rollback",
    caprover: "Rebuilds and redeploys a selected prior version",
    dokploy: "Optional registry-backed version rollback",
    dokku: "Manual redeploy or retained image",
    coolify: "Rollback to a locally retained application image",
  },
  {
    feature: "Low-level container override",
    caprover: "Docker ServiceUpdate object",
    dokploy: "Structured Swarm settings",
    dokku: "Docker options and plugins",
    coolify: "Custom Docker options or raw Compose",
  },
  {
    feature: "Platform configuration backup",
    caprover: "Dashboard download; restore during installation",
    dokploy: "Scheduled S3 backup and restore",
    dokku: "Documented manual backup",
    coolify: "Scheduled and manual instance backup",
  },
  {
    feature: "Resource monitoring",
    caprover: "Integrated Netdata",
    dokploy: "Built-in metrics",
    dokku: "External tooling or plugins",
    coolify: "Built-in monitoring",
  },
];

export const verifiedDate = "August 15, 2026";

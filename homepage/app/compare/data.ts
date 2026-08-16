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
    feature: "Web interface for daily operations",
    caprover: "Built-in open-source dashboard",
    dokploy: "Built-in dashboard",
    dokku: "CLI-first in OSS; Dokku Pro adds a dashboard",
    coolify: "Built-in dashboard",
  },
  {
    feature: "Deploy from a developer machine",
    caprover: "caprover deploy or dashboard archive upload",
    dokploy: "Git repository, Docker image or Compose workflows",
    dokku: "git push, Git sync or archive import",
    coolify: "Git repository, Docker image or Compose workflows",
  },
  {
    feature: "Application and database catalog",
    caprover: "Built-in open-source One-Click Apps",
    dokploy: "Built-in open-source templates",
    dokku: "Plugin ecosystem, without a comparable app catalog",
    coolify: "Built-in open-source service templates",
  },
  {
    feature: "Automatic domains and HTTPS",
    caprover: "Built in with Let's Encrypt",
    dokploy: "Built in through Traefik and Let's Encrypt",
    dokku: "Available through the official Let's Encrypt plugin",
    coolify: "Built in through its proxy and Let's Encrypt",
  },
  {
    feature: "Scaling path from one server to a cluster",
    caprover: "Docker Swarm is the standard runtime",
    dokploy: "Docker Swarm plus independent remote servers",
    dokku: "Local Docker by default; optional K3s scheduler",
    coolify: "Standalone Docker by default; Docker Swarm is experimental",
  },
  {
    feature: "Per-app reverse-proxy customization",
    caprover: "Full NGINX template editor in the dashboard",
    dokploy: "Domain UI with Traefik labels or dynamic config",
    dokku: "NGINX configuration through CLI and templates",
    coolify: "Domain UI with labels or proxy configuration",
  },
  {
    feature: "Private registry provisioning",
    caprover: "CapRover can provision and manage a local registry",
    dokploy: "Connect a registry",
    dokku: "Manual or plugin-based",
    coolify: "Use an external registry or deploy one as a service",
  },
  {
    feature: "Application rollback",
    caprover: "One-click rebuild and redeploy of a prior version",
    dokploy: "Registry-backed rollback when configured",
    dokku: "Manual redeploy or retained image",
    coolify: "Rollback to a locally retained image",
  },
  {
    feature: "Advanced container control",
    caprover: "Raw Docker ServiceUpdate override in YAML or JSON",
    dokploy: "Structured Swarm settings and Compose",
    dokku: "Docker options and plugins",
    coolify: "Docker options and raw Compose",
  },
  {
    feature: "Public GitHub project history",
    caprover: "Since 2017",
    dokploy: "Since 2024",
    dokku: "Since 2013",
    coolify: "Since 2021",
  },
];

export const verifiedDate = "August 15, 2026";

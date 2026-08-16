import type { Metadata } from "next";
import {
  ChoiceGrid,
  ComparePage,
  ComparisonPrinciples,
  MarketingCta,
  MatchupLinks,
  PageHero,
  ProofStrip,
  SourceLinks,
} from "../components";

export const metadata: Metadata = {
  title: "CapRover vs Dokku: Open-Source Dashboard or CLI?",
  description:
    "Compare CapRover and Dokku across dashboards, deployment workflows, Docker orchestration, NGINX, one-click apps, build methods and scheduled jobs.",
  alternates: { canonical: "https://caprover.com/compare/dokku/" },
};

const rows = [
  ["Daily interface", "Open-source web dashboard plus CLI and API", "SSH and CLI in OSS core; Dokku Pro adds a web UI and API"],
  ["App and database catalog", "Built-in open-source One-Click Apps", "Plugins and datastore plugins, without a comparable app catalog"],
  ["Deploy from your computer", "caprover deploy or dashboard archive upload", "git push, Git sync or archive import"],
  ["Scaling path", "Docker Swarm from the initial installation", "Local Docker by default; optional K3s scheduler"],
  ["Reverse-proxy control", "Complete per-app NGINX template editor in the dashboard", "NGINX by default, configured through CLI and templates"],
  ["Application rollback", "One-click rebuild and redeploy of a prior version", "Manual redeploy or retained image"],
  ["Advanced Docker control", "Raw Docker ServiceUpdate override in YAML or JSON", "Docker options and plugins"],
  ["Build methods", "Dockerfile, One-Click template or prebuilt image", "Dockerfile, Herokuish, buildpacks, Nixpacks, Railpack or image"],
];

export default function DokkuComparison() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="CAPROVER VS DOKKU"
        title="Get a complete open-source dashboard, not just a command-line workflow."
        intro="CapRover brings deployments, domains, HTTPS, persistence, replicas, logs, NGINX configuration and Docker Swarm management into one open-source web interface, while retaining CLI and API access."
      >
        <div className="verdict"><strong>Why CapRover</strong><p>Choose CapRover when a visual operations workflow, One-Click Apps and built-in Docker Swarm management should be part of the open-source product. Consider Dokku when SSH commands, buildpacks, cron and a deep plugin system are central requirements.</p></div>
        <ProofStrip />
      </PageHero>

      <section className="compare-section compare-shell">
        <ComparisonPrinciples />
        <div className="two-column-table-wrap">
          <table className="two-column-table">
            <thead><tr><th>Area</th><th>CapRover</th><th>Dokku</th></tr></thead>
            <tbody>{rows.map(([area, caprover, dokku]) => <tr key={area}><th>{area}</th><td>{caprover}</td><td>{dokku}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell article-layout">
          <article>
            <h2>A dashboard included in the open-source product</h2>
            <p>CapRover makes application and server operations visible without requiring operators to assemble commands. Domains, certificates, environment variables, persistent directories, replicas, logs and deployment history are managed in the dashboard.</p>
            <p>Its CLI remains available for setup, login and direct local deployment, and the dashboard itself uses CapRover&apos;s HTTP API.</p>
          </article>
          <article>
            <h2>Deploy apps and databases</h2>
            <p>Run caprover deploy from a project, upload an archive, deploy an existing image or trigger a build from Git. The captain-definition file keeps the deployment contract small and explicit.</p>
            <p>For supporting services, One-Click Apps can install databases, dashboards and complete applications directly from the CapRover UI.</p>
          </article>
          <article>
            <h2>Clustering is part of the standard model</h2>
            <p>CapRover enables Docker Swarm during installation, even on one machine. Adding worker nodes extends the same scheduler, service model and dashboard across the cluster.</p>
            <p>Replica counts are changed from the application settings, and NGINX distributes traffic across the service replicas.</p>
          </article>
          <article>
            <h2>Where Dokku takes a different approach</h2>
            <p>Dokku&apos;s open-source core is intentionally CLI-first and highly composable. It offers more buildpack choices, built-in cron task definitions and a mature plugin-trigger system.</p>
            <p>Dokku Pro adds an official web interface and API. CapRover includes its dashboard and application operations in the open-source platform itself.</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          caprover={[
            "A web dashboard should be included in the open-source platform.",
            "You want Docker Swarm clustering managed through the same product.",
            "You rely on a catalog of deployable applications and databases.",
            "You want per-app NGINX editing without installing or building a plugin.",
            "Local CLI deployment and visual day-to-day operations should coexist.",
          ]}
          competitorName="Dokku"
          competitor={[
            "SSH commands and Git push should be the primary interface.",
            "Buildpacks and a composable plugin system are essential.",
            "You need built-in cron task definitions or global environment variables.",
          ]}
        />
      </section>

      <section className="compare-section compare-shell">
        <h2>Moving to CapRover</h2>
        <div className="migration-grid migration-single">
          <p>Convert Dokku configuration into CapRover environment variables and application settings, add captain-definition files, map domains, and migrate datastore contents with the database&apos;s own backup and restore tools.</p>
        </div>
        <MarketingCta />
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks current="dokku" />
        <SourceLinks>
          <li><a href="https://caprover.com/docs/cli-commands.html">CapRover CLI deployment</a></li>
          <li><a href="https://caprover.com/docs/one-click-apps.html">CapRover One-Click Apps</a></li>
          <li><a href="https://caprover.com/docs/nginx-customization.html">CapRover NGINX customization</a></li>
          <li><a href="https://caprover.com/docs/app-scaling-and-cluster.html">CapRover scaling and clusters</a></li>
          <li><a href="https://dokku.com/docs/getting-started/installation/">Dokku architecture and installation</a></li>
          <li><a href="https://dokku.com/docs/deployment/methods/git/">Dokku Git deployment</a></li>
          <li><a href="https://dokku.com/docs/deployment/schedulers/k3s/">Dokku K3s scheduler</a></li>
          <li><a href="https://pro.dokku.com/docs/getting-started/">Dokku Pro web UI and API</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

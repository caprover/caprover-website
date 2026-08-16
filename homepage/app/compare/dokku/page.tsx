import type { Metadata } from "next";
import {
  ChoiceGrid,
  ComparePage,
  ComparisonPrinciples,
  MatchupLinks,
  PageHero,
  SourceLinks,
} from "../components";

export const metadata: Metadata = {
  title: "CapRover vs Dokku: Dashboard or CLI-First PaaS?",
  description:
    "Compare CapRover and Dokku across deployment workflow, Docker orchestration, NGINX, buildpacks, plugins, templates and operations.",
  alternates: { canonical: "https://caprover.com/compare/dokku/" },
};

const rows = [
  ["Primary interface", "Web dashboard plus CLI and API", "SSH and CLI"],
  ["Default scheduler", "Docker Swarm", "Local Docker scheduler"],
  ["Optional multi-node scheduler", "Additional Docker Swarm nodes", "K3s scheduler"],
  ["Source deployment", "caprover deploy, archive upload or webhook", "git push, git sync or archive import"],
  ["Build methods", "Dockerfile, CapRover templates or image", "Dockerfile, Herokuish, Cloud Native Buildpacks or image"],
  ["Reverse proxy", "NGINX with dashboard editor", "NGINX by default, configurable through CLI and templates"],
  ["App catalog", "Open-source One-Click Apps", "Plugins and datastore plugins, no comparable app catalog"],
  ["Scheduled jobs", "Run as an application or external scheduler", "Built-in cron task support"],
];

export default function DokkuComparison() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="CAPROVER VS DOKKU"
        title="A visual Docker control plane or a composable CLI?"
        intro="CapRover and Dokku both provide a Heroku-like path from source code to a running application. CapRover packages common infrastructure operations into a web dashboard and Docker Swarm. Dokku favors SSH commands, Git push and a deep plugin system."
      >
        <div className="verdict"><strong>Short answer</strong><p>Choose CapRover when a dashboard, One-Click Apps and Swarm management should be part of the product. Choose Dokku when you prefer an automation-friendly CLI, buildpacks, cron and a modular plugin architecture.</p></div>
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
            <h2>Interaction model</h2>
            <p>CapRover is designed to make application and server operations visible. Domains, certificates, environment variables, persistence, replicas, logs, NGINX configuration and Swarm nodes are available through its dashboard. Its CLI focuses on setup, login and application deployment.</p>
            <p>Dokku treats the command line as the product interface. Applications are created and configured through SSH commands, making the workflow easy to script and compose with existing Unix tooling. There is no official Dokku web dashboard.</p>
          </article>
          <article>
            <h2>Deployment and builds</h2>
            <p>CapRover commonly builds a Dockerfile described by captain-definition, deploys a prebuilt image, or receives source through its CLI and webhooks. Its One-Click format can define multiple related services using a Compose-like subset.</p>
            <p>Dokku's traditional workflow is a Git push to the server. It can build with Dockerfiles, Herokuish or Cloud Native Buildpacks, and it can initialize applications from remote Git repositories, images or archives.</p>
          </article>
          <article>
            <h2>Scaling architecture</h2>
            <p>CapRover enables Docker Swarm during installation, even for a single machine. Adding workers extends the same scheduling model across servers, and the dashboard can change application replica counts.</p>
            <p>Dokku uses its local Docker scheduler by default. Its official K3s scheduler adds a Kubernetes-based multi-node path. This is a real cluster option, but it is architecturally different from CapRover's Swarm model.</p>
          </article>
          <article>
            <h2>Extensibility</h2>
            <p>CapRover exposes advanced behavior through NGINX templates, pre-deploy scripts and a raw Docker ServiceUpdate override. Its One-Click Apps repository focuses on deployable applications and databases.</p>
            <p>Dokku is itself assembled from plugins and offers a mature plugin-trigger system. Official and community plugins add datastores, schedulers, proxies and other capabilities. Dokku also supports global environment variables and scheduled cron tasks directly.</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          caprover={[
            "A web dashboard is important for daily operations.",
            "You want Docker Swarm clustering managed as part of the platform.",
            "You rely on an open-source catalog of deployable applications and databases.",
            "You want per-app NGINX editing without building a plugin.",
          ]}
          competitorName="Dokku"
          competitor={[
            "You prefer SSH commands and Git push as the primary interface.",
            "Buildpacks and a composable plugin system are important.",
            "You need built-in cron task definitions or global environment variables.",
            "You want an optional Kubernetes-based scheduler rather than Docker Swarm.",
          ]}
        />
      </section>

      <section className="compare-section compare-shell">
        <h2>Migration considerations</h2>
        <div className="migration-grid">
          <p><strong>Moving to CapRover:</strong> convert Dokku configuration into CapRover environment variables and app settings, add captain-definition files, map domains, and migrate datastore contents independently.</p>
          <p><strong>Moving to Dokku:</strong> create applications and domains through the CLI, translate captain-definition into Dockerfiles or buildpack settings, install required datastore plugins, and replace Swarm-specific behavior.</p>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks current="dokku" />
        <SourceLinks>
          <li><a href="https://caprover.com/docs/cli-commands.html">CapRover CLI deployment</a></li>
          <li><a href="https://caprover.com/docs/one-click-apps.html">CapRover One-Click Apps</a></li>
          <li><a href="https://caprover.com/docs/nginx-customization.html">CapRover NGINX customization</a></li>
          <li><a href="https://dokku.com/docs/getting-started/installation/">Dokku architecture and installation</a></li>
          <li><a href="https://dokku.com/docs/deployment/methods/git/">Dokku Git deployment</a></li>
          <li><a href="https://dokku.com/docs/deployment/schedulers/k3s/">Dokku K3s scheduler</a></li>
          <li><a href="https://dokku.com/docs/configuration/environment-variables/">Dokku global and app environment variables</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

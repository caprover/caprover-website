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
  title: "CapRover vs Coolify: Self-Hosted PaaS Comparison",
  description:
    "Compare CapRover and Coolify across architecture, Docker Compose, Git deployment, networking, clustering, rollback and operational control.",
  alternates: { canonical: "https://caprover.com/compare/coolify/" },
};

const rows = [
  ["Primary operating model", "One CapRover installation managing a Docker Swarm", "A control plane managing connected Docker servers over SSH"],
  ["Default proxy", "NGINX", "Traefik, with Caddy also supported"],
  ["Docker Compose", "Partial parser for common fields", "First-class application and service support"],
  ["Git deployment", "Generic Git credentials, SSH keys and webhooks", "Provider integrations, deploy keys and webhooks"],
  ["Multi-node applications", "Docker Swarm replicas", "Standalone servers or Docker Swarm"],
  ["Proxy customization", "Per-app NGINX template editor", "Proxy configuration, labels and raw Compose"],
  ["Local registry", "CapRover can provision and manage one", "Can be deployed as a service or supplied externally"],
  ["Platform backup", "Downloadable configuration backup", "Scheduled or manual instance backup"],
];

export default function CoolifyComparison() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="CAPROVER VS COOLIFY"
        title="Docker-native simplicity or a broader application platform?"
        intro="CapRover and Coolify both run applications on infrastructure you control. CapRover stays close to Docker Swarm and NGINX, while Coolify provides a broader resource model with first-class Compose, projects, environments and Git-provider workflows."
      >
        <div className="verdict"><strong>Short answer</strong><p>Choose CapRover when you value a compact application model, NGINX control and a Swarm-first path from one server to several. Choose Coolify when Compose, multiple independent servers, preview deployments and team workflows are central requirements.</p></div>
      </PageHero>

      <section className="compare-section compare-shell">
        <ComparisonPrinciples />
        <div className="two-column-table-wrap">
          <table className="two-column-table">
            <thead><tr><th>Area</th><th>CapRover</th><th>Coolify</th></tr></thead>
            <tbody>{rows.map(([area, caprover, coolify]) => <tr key={area}><th>{area}</th><td>{caprover}</td><td>{coolify}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell article-layout">
          <article>
            <h2>Architecture</h2>
            <p>CapRover installs its control plane, NGINX and certificate services on a Docker Swarm manager. Additional nodes join that Swarm, and stateless replicas can be distributed across it. Persistent applications are pinned to a node unless their storage is externalized.</p>
            <p>Coolify separates its control plane from connected deployment servers. It uses SSH to build and operate Docker resources on those servers. This makes independent-server management a natural part of its model, while Docker Swarm remains available when workloads need a cluster.</p>
          </article>
          <article>
            <h2>Deployment workflow</h2>
            <p>CapRover accepts local CLI deployments, dashboard uploads, Git webhooks, Dockerfiles and prebuilt images. Its captain-definition file gives the deployment a small, explicit contract. GitHub, GitLab, Bitbucket and other Git-compatible services can trigger deployments without requiring a provider-specific application.</p>
            <p>Coolify invests more heavily in source integrations and build choices. It supports Docker Compose directly and offers Nixpacks, Railpack, Dockerfile and static builds. This is more flexible for repositories that already treat Compose as their deployment definition.</p>
          </article>
          <article>
            <h2>Networking and control</h2>
            <p>CapRover’s main distinction is editable NGINX configuration. Operators can change an individual application’s generated NGINX template or override the global template for newly created applications. Advanced container behavior can be expressed through Docker’s ServiceUpdate schema.</p>
            <p>Coolify uses Traefik by default and supports Caddy. Routing is managed through domains, proxy configuration and generated labels. Raw Compose provides an escape hatch when an operator wants to own the complete Compose definition and proxy labels.</p>
          </article>
          <article>
            <h2>Operations</h2>
            <p>Both products provide HTTPS automation, application logs, health checks, rollbacks, backups of platform state and monitoring. CapRover’s backup intentionally excludes application images and persistent volumes. Coolify likewise distinguishes control-plane backups from workload data, databases and volumes.</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          caprover={[
            "You prefer NGINX and want to edit its per-app configuration in the dashboard.",
            "Your scaling model is a Docker Swarm cluster rather than several unrelated hosts.",
            "You want a small application abstraction with direct Docker escape hatches.",
            "Local CLI deployment and a platform-managed registry are valuable.",
          ]}
          competitorName="Coolify"
          competitor={[
            "Full Docker Compose compatibility is a primary requirement.",
            "You want one control plane for multiple independent servers.",
            "Projects, environments, preview deployments and team roles are important.",
            "You prefer deeper source-provider and build-pack workflows.",
          ]}
        />
      </section>

      <section className="compare-section compare-shell">
        <h2>Migration considerations</h2>
        <div className="migration-grid">
          <p><strong>Moving to CapRover:</strong> convert Compose services into CapRover applications or a compatible One-Click template, map domains and environment variables, and migrate persistent data separately.</p>
          <p><strong>Moving to Coolify:</strong> recreate resources and source connections, translate CapRover settings into applications or Compose, and move databases and volumes using workload-specific backup tools.</p>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks current="coolify" />
        <SourceLinks>
          <li><a href="https://caprover.com/docs/app-scaling-and-cluster.html">CapRover scaling and clusters</a></li>
          <li><a href="https://caprover.com/docs/nginx-customization.html">CapRover NGINX customization</a></li>
          <li><a href="https://caprover.com/docs/deployment-methods.html">CapRover deployment methods</a></li>
          <li><a href="https://coolify.io/docs">Coolify product documentation</a></li>
          <li><a href="https://coolify.io/docs/applications/build-packs/docker-compose">Coolify Docker Compose deployments</a></li>
          <li><a href="https://coolify.io/docs/knowledge-base/how-to/backup-restore-coolify">Coolify backup and restore</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

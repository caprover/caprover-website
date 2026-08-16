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
  title: "CapRover vs Coolify: Self-Hosted PaaS Comparison",
  description:
    "Compare CapRover and Coolify, including deployment workflows, NGINX, Docker Swarm, Compose, registries, rollback and operational complexity.",
  alternates: { canonical: "https://caprover.com/compare/coolify/" },
};

const rows = [
  ["Core operating model", "A focused application model running directly on Docker Swarm", "A broader control plane managing connected Docker servers over SSH"],
  ["Deploy from your computer", "caprover deploy or dashboard archive upload", "Git provider, Docker image or Compose workflows"],
  ["Reverse-proxy control", "Complete per-app NGINX template editor", "Traefik by default; Caddy is available but experimental"],
  ["Cluster path", "Add nodes to the same Docker Swarm used from initial installation", "Standalone servers; Docker Swarm support is experimental"],
  ["Local registry", "CapRover can provision and manage one", "Use an external registry or deploy one as a service"],
  ["Rollback", "One-click rebuild and redeploy of a prior version", "Rollback to a locally retained application image"],
  ["Advanced Docker control", "Raw Docker ServiceUpdate override in YAML or JSON", "Custom Docker options or raw Compose"],
  ["Docker Compose", "Partial parser for common One-Click App fields", "First-class application and service support"],
];

export default function CoolifyComparison() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="CAPROVER VS COOLIFY"
        title="Choose a focused Docker workflow over a broader platform model."
        intro="CapRover is built for developers who want to deploy and operate Dockerized applications through a straightforward dashboard, with NGINX control and a natural path from one server to a Docker Swarm cluster."
      >
        <div className="verdict"><strong>Why CapRover</strong><p>Choose CapRover when you want a compact app-centric platform, local CLI deployment, editable NGINX configuration and direct Docker controls. Consider Coolify when first-class Compose, multiple unrelated servers, preview deployments or team workflows are mandatory.</p></div>
        <ProofStrip />
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
            <h2>A smaller operational model</h2>
            <p>CapRover organizes daily work around applications. Domains, certificates, environment variables, persistent directories, replicas, logs and deployment history are available from the same dashboard.</p>
            <p>It runs directly on a Docker Swarm manager, so the control plane and application scheduler share one understandable model instead of treating each server as a separate deployment target.</p>
          </article>
          <article>
            <h2>Deploy without a provider integration</h2>
            <p>Run caprover deploy from a local project, upload a source archive in the dashboard, deploy a prebuilt image or trigger a build through a generic Git webhook. A provider-specific application is optional.</p>
            <p>Previous source deployments remain in the deployment history and can be rebuilt and redeployed from the dashboard.</p>
          </article>
          <article>
            <h2>NGINX and Docker escape hatches</h2>
            <p>CapRover exposes an application&apos;s complete generated NGINX template in the dashboard. Operators can add redirects, headers, caching, authentication or other NGINX directives without replacing the platform proxy.</p>
            <p>For container behavior, a ServiceUpdate override accepts YAML or JSON matching Docker&apos;s service update API.</p>
          </article>
          <article>
            <h2>Where Coolify goes broader</h2>
            <p>Coolify models projects, environments, applications, services and connected servers. It also provides first-class Compose and deeper Git-provider workflows.</p>
            <p>Those capabilities matter when they are requirements. For a team primarily deploying Dockerized apps to one server or one Swarm, CapRover keeps the operational surface more focused.</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          caprover={[
            "You want a small app-centric control plane with fewer resource types.",
            "You deploy directly from a local machine and do not want to connect a Git provider.",
            "You prefer NGINX and want to edit complete per-app templates in the dashboard.",
            "Your scaling model is one Docker Swarm rather than several unrelated hosts.",
            "A platform-managed local registry and direct ServiceUpdate overrides are valuable.",
          ]}
          competitorName="Coolify"
          competitor={[
            "First-class Docker Compose is a primary requirement.",
            "One control plane must manage several independent servers.",
            "Projects, environments, preview deployments or granular team roles are required.",
          ]}
        />
      </section>

      <section className="compare-section compare-shell">
        <h2>Moving to CapRover</h2>
        <div className="migration-grid migration-single">
          <p>Convert Compose services into CapRover applications or a compatible One-Click template, map domains and environment variables, and migrate persistent data with the database or storage system&apos;s own backup tooling.</p>
        </div>
        <MarketingCta />
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks current="coolify" />
        <SourceLinks>
          <li><a href="https://caprover.com/docs/deployment-methods.html">CapRover deployment methods and rollback</a></li>
          <li><a href="https://caprover.com/docs/app-scaling-and-cluster.html">CapRover scaling and clusters</a></li>
          <li><a href="https://caprover.com/docs/nginx-customization.html">CapRover NGINX customization</a></li>
          <li><a href="https://caprover.com/docs/service-update-override.html">CapRover Docker service overrides</a></li>
          <li><a href="https://coolify.io/docs">Coolify product documentation</a></li>
          <li><a href="https://coolify.io/docs/applications/build-packs/docker-compose">Coolify Docker Compose deployments</a></li>
          <li><a href="https://coolify.io/docs/knowledge-base/server/openssh">Coolify server connections</a></li>
          <li><a href="https://coolify.io/docs/knowledge-base/docker/swarm">Coolify experimental Docker Swarm support</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

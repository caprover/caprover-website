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
  title: "CapRover vs Dokploy: Self-Hosted PaaS Comparison",
  description:
    "Compare CapRover and Dokploy across Docker Swarm, NGINX, Traefik, deployment workflows, registries, rollback, Compose and team features.",
  alternates: { canonical: "https://caprover.com/compare/dokploy/" },
};

const rows = [
  ["Project history", "Public GitHub project since 2017", "Public GitHub project since 2024"],
  ["Core operating model", "Focused applications running on Docker Swarm", "Applications, Compose projects and remote servers"],
  ["Deploy from your computer", "caprover deploy or dashboard archive upload", "Git repository, Docker image or Compose workflows"],
  ["Reverse-proxy control", "Complete per-app NGINX template editor", "Traefik domains, labels and dynamic configuration"],
  ["Local registry", "CapRover can provision and manage one", "Connect a Docker registry"],
  ["Rollback", "One-click rebuild and redeploy of a prior version", "Registry-backed version rollback"],
  ["Advanced Docker control", "Raw Docker ServiceUpdate override in YAML or JSON", "Structured Swarm configuration and Compose"],
  ["Docker Compose", "Partial parser for common One-Click App fields", "First-class Compose and Docker Stack support"],
];

export default function DokployComparison() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="CAPROVER VS DOKPLOY"
        title="Choose the established, focused path to running apps on Docker Swarm."
        intro="CapRover has provided an app-centric dashboard for Docker and NGINX since 2017. It is designed for operators who want straightforward deployments and scaling, with direct access to the underlying proxy and Docker service when needed."
      >
        <div className="verdict"><strong>Why CapRover</strong><p>Choose CapRover for its focused application model, local CLI deployment, complete NGINX editing, managed registry option and direct Docker service overrides. Consider Dokploy when first-class Compose, independent remote servers or multi-user workflows are required.</p></div>
        <ProofStrip />
      </PageHero>

      <section className="compare-section compare-shell">
        <ComparisonPrinciples />
        <div className="two-column-table-wrap">
          <table className="two-column-table">
            <thead><tr><th>Area</th><th>CapRover</th><th>Dokploy</th></tr></thead>
            <tbody>{rows.map(([area, caprover, dokploy]) => <tr key={area}><th>{area}</th><td>{caprover}</td><td>{dokploy}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell article-layout">
          <article>
            <h2>An established app-centric model</h2>
            <p>CapRover has used the same core model from one server through multi-node deployments: applications run as Docker services inside a Swarm, while the dashboard manages deployments, domains, certificates, persistence, replicas and logs.</p>
            <p>This focused boundary keeps common operations together and leaves Docker responsible for scheduling and service lifecycle.</p>
          </article>
          <article>
            <h2>Local deployment and rollback</h2>
            <p>CapRover can receive source directly from its CLI or dashboard, build a Dockerfile, deploy a prebuilt image or respond to a generic Git webhook.</p>
            <p>Its deployment history supports one-click rebuilding and redeployment of a prior application version without requiring a separately configured external registry on a single-node installation.</p>
          </article>
          <article>
            <h2>NGINX and Docker control</h2>
            <p>Operators can edit the complete generated NGINX template for an individual application in the CapRover dashboard. Global defaults and files mounted into the NGINX container can also be customized.</p>
            <p>At the container layer, ServiceUpdate overrides expose Docker&apos;s own service update schema in YAML or JSON.</p>
          </article>
          <article>
            <h2>Where Dokploy goes broader</h2>
            <p>Dokploy treats Compose as a first-class resource, supports additional source-build strategies and can manage independent deployment or build servers. It also provides organizations, users and roles.</p>
            <p>Those features are valuable when they match a concrete requirement. CapRover stays centered on deploying and operating applications within one Docker Swarm.</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          caprover={[
            "You want an established app-centric platform with a deliberately small resource model.",
            "You deploy directly from a local CLI or dashboard source upload.",
            "You prefer NGINX and need complete per-app proxy templates.",
            "You want CapRover to provision the local registry used by your Swarm.",
            "Direct Docker ServiceUpdate overrides are useful for advanced workloads.",
          ]}
          competitorName="Dokploy"
          competitor={[
            "Docker Compose and Docker Stack are primary deployment formats.",
            "You need organizations, multiple users or role-based access.",
            "Independent remote deployment servers or dedicated build servers are required.",
          ]}
        />
      </section>

      <section className="compare-section compare-shell">
        <h2>Moving to CapRover</h2>
        <div className="migration-grid migration-single">
          <p>Split complex Compose projects into CapRover applications or validate them against the supported One-Click fields. Recreate routing in NGINX, map environment variables and transfer persistent data separately.</p>
        </div>
        <MarketingCta />
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks current="dokploy" />
        <SourceLinks>
          <li><a href="https://caprover.com/docs/deployment-methods.html">CapRover deployment methods and rollback</a></li>
          <li><a href="https://caprover.com/docs/service-update-override.html">CapRover Docker service overrides</a></li>
          <li><a href="https://caprover.com/docs/docker-compose.html">CapRover Compose compatibility</a></li>
          <li><a href="https://caprover.com/docs/app-scaling-and-cluster.html">CapRover Swarm clustering and registry</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/docker-compose">Dokploy Docker Compose</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/cluster">Dokploy clusters</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/permissions">Dokploy roles and permissions</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

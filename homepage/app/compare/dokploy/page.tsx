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
  title: "CapRover vs Dokploy: Technical Comparison",
  description:
    "Compare CapRover and Dokploy across Docker Swarm, NGINX, Traefik, Compose, Git deployments, registries, backups and team workflows.",
  alternates: { canonical: "https://caprover.com/compare/dokploy/" },
};

const rows = [
  ["Container orchestration", "Docker Swarm", "Docker Swarm"],
  ["Default proxy", "NGINX", "Traefik"],
  ["Docker Compose", "Partial parser for common fields", "First-class Compose and Docker Stack"],
  ["Application builds", "Dockerfile, templates or prebuilt image", "Dockerfile, Nixpacks, buildpacks or prebuilt image"],
  ["Remote servers", "Additional nodes join the CapRover Swarm", "Swarm nodes plus independent remote deploy servers"],
  ["Rollback", "Rebuild or redeploy a previous application version", "Registry-backed deployment images"],
  ["User model", "Single administrator", "Organizations, users and roles"],
  ["Low-level control", "Raw Docker ServiceUpdate override", "Structured Swarm configuration and Compose"],
];

export default function DokployComparison() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="CAPROVER VS DOKPLOY"
        title="Two Swarm-oriented platforms with different priorities."
        intro="CapRover and Dokploy both use Docker Swarm and provide web dashboards, HTTPS automation, application replicas and open-source templates. The largest differences are proxy choice, Compose support, build workflows and how much platform surface area each product exposes."
      >
        <div className="verdict"><strong>Short answer</strong><p>Choose CapRover for a focused application model, NGINX control, local CLI deployment and direct Docker service overrides. Choose Dokploy for full Compose, more build strategies, remote deployment servers and multi-user workflows.</p></div>
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
            <h2>Shared foundation</h2>
            <p>Both products run their own services in Docker and can schedule application replicas across a Swarm. Both expect a registry when nodes need to pull a built image. Both can automate domains, certificates, health checks, rolling updates and application rollback.</p>
            <p>This shared foundation makes the comparison more about product boundaries than basic container capability.</p>
          </article>
          <article>
            <h2>NGINX versus Traefik</h2>
            <p>CapRover generates NGINX configuration and exposes the per-app template in its dashboard. Operators can also override the global server-block template and mount supporting files into the NGINX container.</p>
            <p>Dokploy uses Traefik and manages domains through generated dynamic configuration or Compose labels. This is a better fit for operators already standardized on Traefik, while CapRover is a better fit when explicit NGINX directives are required.</p>
          </article>
          <article>
            <h2>Application and Compose models</h2>
            <p>CapRover’s primary abstraction is an application backed by a Docker service. It can import a useful subset of Compose through the One-Click parser, but unsupported Compose fields are ignored. Complex definitions should be reviewed rather than assumed compatible.</p>
            <p>Dokploy treats Compose as a first-class resource and can deploy it through Docker Compose or Docker Stack. It also offers more source-build options, including Nixpacks and buildpacks, and can separate build servers from deployment servers.</p>
          </article>
          <article>
            <h2>Operations and teams</h2>
            <p>CapRover intentionally uses one administrative security boundary. Dokploy provides organizations, users and roles, with additional governance features in its enterprise offering. Dokploy also provides scheduled S3 platform backups, database backups and named-volume backups.</p>
            <p>CapRover provides downloadable platform configuration backups, integrated Netdata monitoring and a managed local registry option. Persistent data still needs an application-aware or volume-level backup plan.</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          caprover={[
            "You want NGINX and dashboard-level access to its generated configuration.",
            "You prefer a smaller app-centric control plane with fewer resource types.",
            "You deploy from a local CLI and want direct Docker ServiceUpdate overrides.",
            "A CapRover-managed registry is useful for your Swarm.",
          ]}
          competitorName="Dokploy"
          competitor={[
            "Docker Compose and Docker Stack are central deployment formats.",
            "You need organizations, multiple users or role-based access.",
            "You want independent remote deployment servers or dedicated build servers.",
            "Built-in scheduled database and named-volume backups are priorities.",
          ]}
        />
      </section>

      <section className="compare-section compare-shell">
        <h2>Migration considerations</h2>
        <div className="migration-grid">
          <p><strong>Moving to CapRover:</strong> split complex Compose stacks into CapRover apps or validate them against the supported One-Click fields. Recreate routing in NGINX and transfer persistent data separately.</p>
          <p><strong>Moving to Dokploy:</strong> express each CapRover app as an application or Compose service, replace NGINX-specific directives with Traefik configuration, and configure a registry for clustered rollbacks.</p>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks current="dokploy" />
        <SourceLinks>
          <li><a href="https://caprover.com/docs/service-update-override.html">CapRover Docker service overrides</a></li>
          <li><a href="https://caprover.com/docs/docker-compose.html">CapRover Compose compatibility</a></li>
          <li><a href="https://caprover.com/docs/app-scaling-and-cluster.html">CapRover Swarm clustering and registry</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/docker-compose">Dokploy Docker Compose</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/cluster">Dokploy clusters</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/backups">Dokploy platform backups</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/volume-backups">Dokploy named-volume backups</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

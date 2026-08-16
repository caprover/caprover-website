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
} from "../components";
import type { PairwiseRow } from "../data";

export const metadata: Metadata = {
  title: "CapRover vs Dokploy: Proven Simplicity and Deep Control",
  description:
    "Compare CapRover and Dokploy across simplicity, server requirements, Docker Swarm, deployment, NGINX, Traefik, registries, rollback and Compose.",
  alternates: { canonical: "https://caprover.com/compare/dokploy/" },
};

const rows: PairwiseRow[] = [
  {
    feature: "Open-source dashboard for daily operations",
    caprover: { status: "yes" },
    competitor: { status: "yes" },
  },
  {
    feature: "Officially documented minimum of 1 GB RAM",
    caprover: { status: "yes", note: "1 GB" },
    competitor: { status: "no", note: "2 GB RAM" },
  },
  {
    feature: "Purpose-built deployment from a local CLI",
    caprover: { status: "yes", note: "caprover deploy" },
    competitor: { status: "yes", note: "dokploy app deploy" },
  },
  {
    feature: "One-click application and database catalog",
    caprover: { status: "yes", note: "Open-source catalog" },
    competitor: { status: "yes", note: "Open-source templates" },
  },
  {
    feature: "Docker Swarm as the standard runtime",
    caprover: { status: "yes" },
    competitor: { status: "yes" },
  },
  {
    feature: "One-click rollback without an external registry",
    caprover: { status: "yes", note: "From deployment history" },
    competitor: { status: "partial", note: "Registry must be configured" },
  },
  {
    feature: "Platform-provisioned private local registry",
    caprover: { status: "yes" },
    competitor: { status: "no", note: "Connect an existing registry" },
  },
  {
    feature: "Simple dashboard with an advanced proxy escape hatch",
    caprover: { status: "yes" },
    competitor: { status: "no", note: "Uses Traefik configuration" },
  },
  {
    feature: "Simple dashboard with a native orchestrator escape hatch",
    caprover: { status: "yes", note: "Docker service settings" },
    competitor: { status: "partial", note: "Structured Swarm settings" },
  },
  {
    feature: "Public project since 2017 or earlier",
    caprover: { status: "yes", note: "Since 2017" },
    competitor: { status: "no", note: "Since 2024" },
  },
];

export default function DokployComparison() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="CAPROVER VS DOKPLOY"
        title="Choose the proven, focused path to Docker Swarm."
        intro="CapRover has made Docker Swarm and NGINX approachable through an app-centric dashboard since 2017. Common deployments stay simple, while native infrastructure controls remain available for advanced workloads."
      >
        <div className="verdict">
          <strong>Why CapRover</strong>
          <p>
            Choose CapRover for a lower documented starting requirement, established project
            history, self-contained rollback, a provisioned local registry and the combination of
            simple defaults with deep NGINX and Docker control. Consider Dokploy when first-class
            Compose, independent remote servers or multi-user workflows are required.
          </p>
        </div>
        <ProofStrip />
      </PageHero>

      <section className="compare-section compare-shell">
        <SimplicityPower />
        <ResourceCallout>
          <p>
            CapRover documents a 1 GB RAM minimum. Dokploy documents at least 2 GB RAM and 30 GB of
            free storage for a smooth installation experience.
          </p>
        </ResourceCallout>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell">
          <div className="compare-heading">
            <p className="compare-kicker">CAPABILITY CHECK</p>
            <h2>Two Swarm platforms, with different design priorities.</h2>
          </div>
          <ComparisonPrinciples />
          <PairwiseTable competitorName="Dokploy" rows={rows} />
        </div>
      </section>

      <section className="compare-section compare-shell">
        <div className="article-layout">
          <article>
            <h2>A small application model</h2>
            <p>CapRover keeps the core vocabulary compact: applications, domains, environment variables, persistent directories and replicas.</p>
            <p>That focused model has remained consistent from single-server installations to multi-node Swarms, reducing the number of platform concepts required for daily operations.</p>
          </article>
          <article>
            <h2>Self-contained deployment workflow</h2>
            <p>Deploy source from the CLI or dashboard, use a prebuilt image, or trigger a deployment with a generic Git webhook. CapRover stores source deployment history for one-click rebuild and redeployment.</p>
            <p>When a multi-node cluster needs a registry, CapRover can provision and manage the local registry used by the Swarm.</p>
          </article>
          <article>
            <h2>Power without upfront complexity</h2>
            <p>CapRover creates working NGINX and Docker service configuration automatically, so normal deployments never need to touch either.</p>
            <p>Advanced workloads can still edit the complete per-app NGINX template and override native Docker service settings from the dashboard.</p>
          </article>
          <article>
            <h2>The practical difference</h2>
            <p>Dokploy makes Compose, remote servers and multi-user organizations more central to its product model.</p>
            <p>CapRover stays focused on operating applications inside one Docker Swarm. That narrower common path is an advantage when those broader abstractions are not actual requirements.</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          caprover={[
            "You want an established application platform with a lower documented server minimum.",
            "You value simple defaults and direct access to NGINX and native Docker settings.",
            "Rollback should work without configuring an external registry.",
            "The platform should be able to provision the local registry used by its Swarm.",
            "Your deployment model is one understandable Docker Swarm.",
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
          <p>Split complex Compose projects into CapRover applications or validate them against the supported One-Click fields. Map domains and environment variables, then transfer persistent data with the database or storage system&apos;s own migration tooling.</p>
        </div>
        <MarketingCta />
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks current="dokploy" />
        <SourceLinks>
          <li><a href="https://caprover.com/docs/get-started.html">CapRover installation requirements</a></li>
          <li><a href="https://caprover.com/docs/deployment-methods.html">CapRover deployment methods and rollback</a></li>
          <li><a href="https://caprover.com/docs/service-update-override.html">CapRover Docker service overrides</a></li>
          <li><a href="https://caprover.com/docs/nginx-customization.html">CapRover NGINX customization</a></li>
          <li><a href="https://caprover.com/docs/app-scaling-and-cluster.html">CapRover Swarm clustering and registry</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/installation">Dokploy installation requirements</a></li>
          <li><a href="https://docs.dokploy.com/docs/cli">Dokploy CLI</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/docker-compose">Dokploy Docker Compose</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/cluster">Dokploy clusters</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/permissions">Dokploy roles and permissions</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

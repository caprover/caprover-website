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
  docsHref,
} from "@/components/compare/components";
import type { PairwiseRow } from "@/components/compare/data";
import { alternateLanguages } from "@/lib/i18n";

const locale = "en" as const;

export const metadata: Metadata = {
  title: "CapRover vs Coolify: Simple Without Giving Up Control",
  description:
    "Compare CapRover and Coolify across simplicity, server requirements, deployment, Docker Swarm, NGINX, registries, rollback and advanced control.",
  alternates: {
    canonical: "https://caprover.com/compare/coolify/",
    languages: alternateLanguages("/compare/coolify/"),
  },
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
    competitor: { status: "no", note: "2 GB RAM and 2 cores" },
  },
  {
    feature: "Purpose-built deployment from a local CLI",
    caprover: { status: "yes", note: "caprover deploy" },
    competitor: { status: "partial", note: "API or webhook trigger" },
  },
  {
    feature: "One-click application and database catalog",
    caprover: { status: "yes", note: "Open-source catalog" },
    competitor: { status: "yes", note: "Service templates" },
  },
  {
    feature: "Multi-node orchestration in the standard runtime",
    caprover: { status: "yes", note: "Docker Swarm from installation" },
    competitor: { status: "partial", note: "Swarm support is experimental" },
  },
  {
    feature: "One-click rollback without an external registry",
    caprover: { status: "yes", note: "From deployment history" },
    competitor: { status: "partial", note: "Requires a retained local image" },
  },
  {
    feature: "Platform-provisioned private local registry",
    caprover: { status: "yes" },
    competitor: { status: "partial", note: "Deploy as a service" },
  },
  {
    feature: "Simple dashboard with an advanced proxy escape hatch",
    caprover: { status: "yes", note: "Editable NGINX template" },
    competitor: { status: "partial", note: "Labels and proxy configuration" },
  },
  {
    feature: "Simple dashboard with a native orchestrator escape hatch",
    caprover: { status: "yes", note: "Docker service settings" },
    competitor: { status: "partial", note: "Docker options and Compose" },
  },
  {
    feature: "Public project since 2017 or earlier",
    caprover: { status: "yes", note: "Since 2017" },
    competitor: { status: "no", note: "Since 2021" },
  },
];

export default function CoolifyComparison() {
  return (
    <ComparePage locale={locale} path="/compare/coolify/">
      <PageHero
        eyebrow="CAPROVER VS COOLIFY"
        title="Choose the simpler path without giving up control."
        intro="CapRover keeps the everyday workflow focused on apps, domains and deployments. When an edge case appears, it lets you reach the underlying NGINX and Docker configuration instead of forcing you to adopt a broader platform model upfront."
      >
        <div className="verdict">
          <strong>Why CapRover</strong>
          <p>
            Choose CapRover for a lighter documented starting requirement, a standard Docker Swarm
            runtime, direct local deployment and deep infrastructure escape hatches. Consider
            Coolify when first-class Compose, independent remote servers, preview deployments or
            granular team workflows are mandatory.
          </p>
        </div>
        <ProofStrip locale={locale} />
      </PageHero>

      <section className="compare-section compare-shell">
        <SimplicityPower locale={locale} />
        <ResourceCallout locale={locale}>
          <p>
            CapRover documents a 1 GB RAM minimum. Coolify documents at least 2 GB RAM, 2 CPU cores
            and 30 GB of free storage.
          </p>
        </ResourceCallout>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell">
          <div className="compare-heading">
            <p className="compare-kicker">CAPABILITY CHECK</p>
            <h2>Focused defaults, with control available when it matters.</h2>
          </div>
          <ComparisonPrinciples locale={locale} />
          <PairwiseTable locale={locale} competitorName="Coolify" rows={rows} />
        </div>
      </section>

      <section className="compare-section compare-shell">
        <div className="article-layout">
          <article>
            <h2>One understandable runtime</h2>
            <p>CapRover starts with Docker Swarm even on one server. Applications, replicas, routing and worker nodes remain part of the same model as the installation grows.</p>
            <p>Daily work stays centered on applications rather than a hierarchy of projects, environments, resources and connected servers.</p>
          </article>
          <article>
            <h2>Convenience without lock-in</h2>
            <p>Use the dashboard for domains, HTTPS, variables, volumes, logs and replicas. Deploy directly with caprover deploy, upload an archive, use an image or connect a generic Git webhook.</p>
            <p>The easy path does not remove access to Docker or NGINX when a workload needs specialized behavior.</p>
          </article>
          <article>
            <h2>Advanced only when you ask for it</h2>
            <p>CapRover generates working NGINX configuration automatically. If needed, the complete per-app template can be edited for redirects, headers, caching, authentication and other directives.</p>
            <p>Native Docker service settings are also available as an advanced override, while remaining invisible to ordinary deployments.</p>
          </article>
          <article>
            <h2>The practical difference</h2>
            <p>Coolify covers a broader collection of projects, environments, Compose workloads and independently connected servers.</p>
            <p>CapRover is intentionally narrower on the common path. It is a strong fit when the goal is to deploy Dockerized applications simply, retain deep control and avoid operating a larger control plane than the workload requires.</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          locale={locale}
          caprover={[
            "You want a simple application model with a lower documented server minimum.",
            "You want easy defaults without losing access to NGINX and native Docker settings.",
            "You deploy directly from your computer without requiring a Git-provider integration.",
            "Your scaling path is one standard Docker Swarm rather than several unrelated hosts.",
            "A platform-provisioned local registry and self-contained rollback are valuable.",
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
        <MarketingCta locale={locale} />
      </section>

      <section className="compare-section compare-shell">
        <MatchupLinks locale={locale} current="coolify" />
        <SourceLinks locale={locale}>
          <li><a href={docsHref(locale)}>CapRover installation requirements</a></li>
          <li><a href={docsHref(locale, "deployment-methods")}>CapRover deployment methods and rollback</a></li>
          <li><a href={docsHref(locale, "app-scaling-and-cluster")}>CapRover scaling and clusters</a></li>
          <li><a href={docsHref(locale, "nginx-customization")}>CapRover NGINX customization</a></li>
          <li><a href={docsHref(locale, "service-update-override")}>CapRover Docker service overrides</a></li>
          <li><a href="https://coolify.io/docs/get-started/installation">Coolify installation requirements</a></li>
          <li><a href="https://coolify.io/docs/applications/build-packs/docker-compose">Coolify Docker Compose deployments</a></li>
          <li><a href="https://coolify.io/docs/knowledge-base/server/openssh">Coolify server connections</a></li>
          <li><a href="https://coolify.io/docs/knowledge-base/docker/swarm">Coolify experimental Docker Swarm support</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

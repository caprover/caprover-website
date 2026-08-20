import type { Metadata } from "next";
import { docsUrl } from "../../../i18n/config";
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
  title: "CapRover vs Dokku: Open-Source Dashboard and CLI",
  description:
    "Compare CapRover and Dokku across simplicity, server requirements, open-source dashboards, deployment, Docker orchestration, NGINX, one-click apps and rollback.",
  alternates: { canonical: "https://caprover.com/compare/dokku/" },
};

const rows: PairwiseRow[] = [
  {
    feature: "Open-source dashboard for daily operations",
    caprover: { status: "yes" },
    competitor: { status: "no", note: "Dokku Pro adds one separately" },
  },
  {
    feature: "Officially documented minimum of 1 GB RAM",
    caprover: { status: "yes", note: "1 GB" },
    competitor: { status: "yes", note: "1 GB with Docker" },
  },
  {
    feature: "Purpose-built deployment from a local CLI",
    caprover: { status: "yes", note: "caprover deploy" },
    competitor: { status: "yes", note: "git push or archive" },
  },
  {
    feature: "One-click application and database catalog",
    caprover: { status: "yes", note: "Open-source catalog" },
    competitor: { status: "partial", note: "Plugins, no comparable catalog" },
  },
  {
    feature: "Multi-node orchestration in the standard runtime",
    caprover: { status: "yes", note: "Docker Swarm from installation" },
    competitor: { status: "partial", note: "Optional K3s scheduler" },
  },
  {
    feature: "One-click application rollback",
    caprover: { status: "yes", note: "From deployment history" },
    competitor: { status: "no", note: "Manual redeploy" },
  },
  {
    feature: "Simple dashboard with an advanced proxy escape hatch",
    caprover: { status: "yes", note: "Editable NGINX template" },
    competitor: { status: "no", note: "CLI and templates in OSS" },
  },
  {
    feature: "Simple dashboard with a native orchestrator escape hatch",
    caprover: { status: "yes", note: "Docker service settings" },
    competitor: { status: "no", note: "CLI and plugins in OSS" },
  },
  {
    feature: "Public project since 2017 or earlier",
    caprover: { status: "yes", note: "Since 2017" },
    competitor: { status: "yes", note: "Since 2013" },
  },
];

export default function DokkuComparison() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="CAPROVER VS DOKKU"
        title="Get a complete open-source dashboard without giving up the command line."
        intro="CapRover makes the normal path visual and straightforward, while keeping CLI, API, NGINX and Docker controls available when needed. You do not have to choose between ease of use and infrastructure access."
      >
        <div className="verdict">
          <strong>Why CapRover</strong>
          <p>
            Choose CapRover when dashboard operations, One-Click Apps, rollback and multi-node
            orchestration should be included in the open-source product. Consider Dokku when a
            CLI-first workflow, broad builder selection, cron and a composable plugin system are
            central requirements.
          </p>
        </div>
        <ProofStrip />
      </PageHero>

      <section className="compare-section compare-shell">
        <SimplicityPower />
        <ResourceCallout>
          <p>
            Both CapRover and Dokku document a 1 GB minimum with their default Docker-based
            runtimes. CapRover includes its web dashboard and Docker Swarm model at that published
            starting requirement.
          </p>
        </ResourceCallout>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell">
          <div className="compare-heading">
            <p className="compare-kicker">CAPABILITY CHECK</p>
            <h2>Visual operations and CLI deployment in the same open-source product.</h2>
          </div>
          <ComparisonPrinciples />
          <PairwiseTable competitorName="Dokku OSS" rows={rows} />
        </div>
      </section>

      <section className="compare-section compare-shell">
        <div className="article-layout">
          <article>
            <h2>The dashboard is the simple path</h2>
            <p>Domains, certificates, environment variables, persistent directories, replicas, logs and deployment history are visible and editable without assembling commands.</p>
            <p>That makes routine operations approachable for every developer who can access the CapRover dashboard.</p>
          </article>
          <article>
            <h2>The command line is still there</h2>
            <p>Run caprover deploy from a local project, upload an archive, deploy an image or trigger a generic Git webhook. The dashboard itself uses CapRover&apos;s HTTP API.</p>
            <p>CapRover adds a visual workflow without taking away automation or terminal-based deployment.</p>
          </article>
          <article>
            <h2>Simple does not mean limited</h2>
            <p>Most apps use the generated NGINX and Docker configuration unchanged. Advanced workloads can edit the complete per-app NGINX template and override native Docker service settings.</p>
            <p>These controls stay out of the common path until an operator deliberately needs them.</p>
          </article>
          <article>
            <h2>The practical difference</h2>
            <p>Dokku&apos;s open-source core is intentionally CLI-first and highly composable through builders, commands and plugins. Dokku Pro adds its official web interface and API separately.</p>
            <p>CapRover includes its visual operations workflow, One-Click catalog and Swarm management directly in the open-source platform.</p>
          </article>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <ChoiceGrid
          caprover={[
            "A full web dashboard should be included in the open-source platform.",
            "You want a simple visual workflow and direct local deployment together.",
            "You want deep NGINX and Docker controls available without making them the default workflow.",
            "Docker Swarm clustering and rollback should be managed through the same product.",
            "You rely on a one-click catalog of deployable applications and databases.",
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
          <li><a href={docsUrl("get-started")}>CapRover installation requirements</a></li>
          <li><a href={docsUrl("cli-commands")}>CapRover CLI deployment</a></li>
          <li><a href={docsUrl("one-click-apps")}>CapRover One-Click Apps</a></li>
          <li><a href={docsUrl("nginx-customization")}>CapRover NGINX customization</a></li>
          <li><a href={docsUrl("service-update-override")}>CapRover Docker service overrides</a></li>
          <li><a href={docsUrl("app-scaling-and-cluster")}>CapRover scaling and clusters</a></li>
          <li><a href="https://dokku.com/docs/getting-started/installation/">Dokku architecture and installation requirements</a></li>
          <li><a href="https://dokku.com/docs/deployment/methods/git/">Dokku Git deployment</a></li>
          <li><a href="https://dokku.com/docs/deployment/schedulers/k3s/">Dokku K3s scheduler</a></li>
          <li><a href="https://pro.dokku.com/docs/getting-started/">Dokku Pro web UI and API</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

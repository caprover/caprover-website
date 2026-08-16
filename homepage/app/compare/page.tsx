import type { Metadata } from "next";
import {
  ComparePage,
  ComparisonPrinciples,
  ComparisonTable,
  MarketingCta,
  MatchupLinks,
  PageHero,
  ProofStrip,
  ResourceCallout,
  SimplicityPower,
  SourceLinks,
} from "./components";

export const metadata: Metadata = {
  title: "CapRover vs Coolify, Dokploy and Dokku",
  description:
    "See why developers choose CapRover for a focused, self-hosted Docker platform with a web dashboard, NGINX control, one-click apps and Docker Swarm scaling.",
  alternates: { canonical: "https://caprover.com/compare/" },
};

export default function ComparisonHub() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="CAPROVER VS THE ALTERNATIVES"
        title="Start simple. Never hit a ceiling."
        intro="CapRover gives you the easy path for everyday deployments and direct access to the underlying NGINX and Docker configuration when an advanced workload needs it. Run your apps, not a platform team."
      >
        <ProofStrip />
      </PageHero>

      <section className="compare-section compare-shell">
        <SimplicityPower />
        <ResourceCallout>
          <p>
            CapRover documents a 1 GB RAM minimum. Coolify and Dokploy each document 2 GB RAM and
            30 GB of free storage, leaving CapRover with a lower published starting requirement.
          </p>
        </ResourceCallout>
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell">
          <div className="compare-heading">
            <p className="compare-kicker">THE SHORT VERSION</p>
            <h2>CapRover keeps the common path easy without removing advanced control.</h2>
            <p>
              The table emphasizes concrete capabilities that support that promise. Short notes
              identify prerequisites and important limitations without turning every cell into a
              competitor brochure.
            </p>
          </div>
          <ComparisonPrinciples />
          <ComparisonTable focus="caprover" />
        </div>
      </section>

      <section className="compare-section compare-shell">
        <div className="compare-heading">
          <p className="compare-kicker">ONE-ON-ONE COMPARISONS</p>
          <h2>Compare CapRover with the alternative you are considering.</h2>
          <p>Each page highlights CapRover&apos;s strengths, documents the meaningful tradeoffs and links every technical claim to official documentation.</p>
        </div>
        <MatchupLinks />
        <MarketingCta />
      </section>

      <section className="compare-section compare-shell">
        <SourceLinks>
          <li><a href="https://caprover.com/docs/deployment-methods.html">CapRover deployment methods and rollback</a></li>
          <li><a href="https://caprover.com/docs/one-click-apps.html">CapRover One-Click Apps</a></li>
          <li><a href="https://caprover.com/docs/app-scaling-and-cluster.html">CapRover Docker Swarm clustering</a></li>
          <li><a href="https://caprover.com/docs/nginx-customization.html">CapRover NGINX customization</a></li>
          <li><a href="https://caprover.com/docs/service-update-override.html">CapRover Docker service overrides</a></li>
          <li><a href="https://caprover.com/docs/get-started.html">CapRover installation requirements</a></li>
          <li><a href="https://docs.dokploy.com/docs/core">Dokploy documentation</a></li>
          <li><a href="https://docs.dokploy.com/docs/core/installation">Dokploy installation requirements</a></li>
          <li><a href="https://dokku.com/docs/">Dokku documentation</a></li>
          <li><a href="https://dokku.com/docs/getting-started/installation/">Dokku installation requirements</a></li>
          <li><a href="https://pro.dokku.com/docs/getting-started/">Dokku Pro web UI and API</a></li>
          <li><a href="https://coolify.io/docs">Coolify documentation</a></li>
          <li><a href="https://coolify.io/docs/get-started/installation">Coolify installation requirements</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

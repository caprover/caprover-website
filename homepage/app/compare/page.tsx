import type { Metadata } from "next";
import {
  ComparePage,
  ComparisonPrinciples,
  ComparisonTable,
  MatchupLinks,
  PageHero,
  SourceLinks,
} from "./components";

export const metadata: Metadata = {
  title: "Compare CapRover, Coolify, Dokploy and Dokku",
  description:
    "A sourced technical comparison of CapRover, Coolify, Dokploy and Dokku across deployment, networking, clustering, rollback and operations.",
  alternates: { canonical: "https://caprover.com/compare/" },
};

export default function ComparisonHub() {
  return (
    <ComparePage>
      <PageHero
        eyebrow="SELF-HOSTED PAAS COMPARISON"
        title="Choose the deployment model that fits your infrastructure."
        intro="CapRover, Coolify, Dokploy and Dokku can all deploy containerized applications, but they make different architectural and operational tradeoffs. This comparison uses specific capability descriptions instead of unexplained checkmarks."
      />
      <section className="compare-section compare-shell">
        <ComparisonPrinciples />
        <ComparisonTable focus="caprover" />
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell prose-grid">
          <div>
            <p className="compare-kicker">CAPROVER’S DESIGN CENTER</p>
            <h2>Simple application management with Docker controls underneath.</h2>
          </div>
          <div className="prose-copy">
            <p>
              CapRover is centered on a straightforward application model: deploy source or an
              image, attach domains, configure persistence, and let Docker Swarm and NGINX handle
              the runtime. The dashboard covers common operations while NGINX templates and Docker
              service overrides remain available when the defaults are not enough.
            </p>
            <p>
              That focus means CapRover does not attempt to provide every workflow found in newer
              platforms. Teams that require first-class Compose, preview environments or granular
              roles should evaluate those needs directly rather than treating every feature as
              equally important.
            </p>
          </div>
        </div>
      </section>

      <section className="compare-section compare-shell">
        <div className="compare-heading">
          <p className="compare-kicker">ONE-ON-ONE COMPARISONS</p>
          <h2>Go deeper on the products you are considering.</h2>
          <p>Each page discusses architecture, strengths, limitations and migration considerations specific to that matchup.</p>
        </div>
        <MatchupLinks />
      </section>

      <section className="compare-section compare-shell">
        <SourceLinks>
          <li><a href="https://caprover.com/docs/deployment-methods.html">CapRover deployment methods and rollback</a></li>
          <li><a href="https://caprover.com/docs/docker-compose.html">CapRover Docker Compose compatibility</a></li>
          <li><a href="https://caprover.com/docs/app-scaling-and-cluster.html">CapRover Docker Swarm clustering</a></li>
          <li><a href="https://caprover.com/docs/nginx-customization.html">CapRover NGINX customization</a></li>
          <li><a href="https://docs.dokploy.com/docs/core">Dokploy documentation</a></li>
          <li><a href="https://dokku.com/docs/">Dokku documentation</a></li>
          <li><a href="https://coolify.io/docs">Coolify documentation</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

import type { Metadata } from "next";
import {
  ComparePage,
  ComparisonPrinciples,
  ComparisonTable,
  MarketingCta,
  MatchupLinks,
  PageHero,
  ProofStrip,
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
        title="Deploy apps on your own servers without building a platform team."
        intro="CapRover turns Docker, NGINX, HTTPS, application deployments, scaling and one-click services into a focused web workflow. You keep control of your infrastructure without managing every container and proxy configuration by hand."
      >
        <ProofStrip />
      </PageHero>

      <section className="compare-section compare-shell">
        <div className="compare-heading">
          <p className="compare-kicker">WHY CAPROVER</p>
          <h2>Simple for everyday deployment. Docker-native when you need more control.</h2>
          <p>
            This table focuses on the workflows CapRover is designed to make straightforward,
            while keeping every comparison narrow and verifiable.
          </p>
        </div>
        <ComparisonPrinciples />
        <ComparisonTable focus="caprover" />
      </section>

      <section className="compare-section compare-soft">
        <div className="compare-shell prose-grid">
          <div>
            <p className="compare-kicker">CAPROVER&apos;S DESIGN CENTER</p>
            <h2>Opinionated where it saves time. Flexible where it matters.</h2>
          </div>
          <div className="prose-copy">
            <p>
              CapRover deliberately keeps its core model small: applications, domains,
              environment variables, persistent directories and replicas. Deploy source or an
              image, attach a domain, enable HTTPS and scale from the same dashboard.
            </p>
            <p>
              The simplicity does not hide the underlying infrastructure. Operators can edit an
              application&apos;s complete NGINX template or pass supported Docker ServiceUpdate fields
              directly to the Docker API when the standard settings are not enough.
            </p>
          </div>
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
          <li><a href="https://docs.dokploy.com/docs/core">Dokploy documentation</a></li>
          <li><a href="https://dokku.com/docs/">Dokku documentation</a></li>
          <li><a href="https://pro.dokku.com/docs/getting-started/">Dokku Pro web UI and API</a></li>
          <li><a href="https://coolify.io/docs">Coolify documentation</a></li>
        </SourceLinks>
      </section>
    </ComparePage>
  );
}

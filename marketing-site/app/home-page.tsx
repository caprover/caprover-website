import { DeploymentTabs } from "./deployment-tabs";
import {
  DEFAULT_LOCALE,
  docsUrl,
  localizedPath,
  type Locale,
} from "../i18n/config";
import routes from "../routes.json";
import { getMessages, messageList, type Messages } from "../i18n/messages";
import { KitSubscribeForm } from "./kit-subscribe-form";
import { LocaleSwitcher } from "./locale-switcher";

const GITHUB = "https://github.com/caprover/caprover";
const SLACK =
  "https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA";
const LIVE_DEMO = "https://captain.server.demo.caprover.com/?demo=true";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ASSET_PATH = "/homepage-assets";

type HomeMessages = Messages["homepage"];

const featuredApps = [
  { name: "WordPress", logo: "wordpress" },
  { name: "PostgreSQL", logo: "postgres" },
  { name: "Redis", logo: "redis" },
  { name: "Nextcloud", logo: "nextcloud" },
  { name: "n8n", logo: "n8n-io" },
  { name: "Uptime Kuma", logo: "uptime-kuma" },
];

const controlExamples = [
  {
    code: "client_max_body_size 1g;\nadd_header X-Frame-Options SAMEORIGIN;\nproxy_read_timeout 300s;",
    docSlug: "domains/advanced-nginx",
  },
  {
    code: "TaskTemplate:\n  Resources:\n    Limits:\n      MemoryBytes: 536870912",
    docSlug: "applications/advanced",
  },
  {
    code: "$ docker node ls\n$ docker service ls",
    docSlug: "scaling/multi-node",
  },
];

function asset(path: string) {
  return `${BASE_PATH}${ASSET_PATH}${path}`;
}

function internal(path: string, locale: Locale) {
  return `${BASE_PATH}${localizedPath(path, locale)}`;
}

function Mark() {
  return (
    <img
      className="brand-mark"
      src={asset("/caprover-logo.png")}
      alt=""
      aria-hidden="true"
    />
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      className="nav-icon github-mark"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.91c-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.34 9.34 0 0 1 12 6.92a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.89v2.8c0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function SlackIcon() {
  return (
    <img
      className="nav-icon slack-mark"
      src={asset("/slack-icon.png")}
      alt=""
      aria-hidden="true"
    />
  );
}

function LiveDeployment({ messages }: { messages: HomeMessages["hero"] }) {
  return (
    <figure className="live-deployment">
      <picture>
        <source
          media="(max-width: 660px)"
          srcSet={asset("/caprover-active-deployment-mobile.webp")}
          width={506}
          height={256}
        />
        <img
          src={asset("/caprover-active-deployment.webp")}
          width={804}
          height={256}
          alt={messages.deploymentAlt}
          fetchPriority="high"
        />
      </picture>
    </figure>
  );
}

function CapabilityStrip({ messages }: { messages: HomeMessages }) {
  return (
    <section className="shell" aria-label={messages.proofsAriaLabel}>
      <dl className="capability-strip">
        {messageList(messages.proofs).map(({ value, label }) => (
          <div key={value}>
            <dt>{value}</dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CommunitySupport({
  messages,
}: {
  messages: HomeMessages["community"];
}) {
  return (
    <section className="community shell" aria-labelledby="community-title">
      <h2 id="community-title" className="sr-only">
        {messages.title}
      </h2>
      <div className="community-grid">
        <article className="support-card">
          <h3>{messages.supportTitle}</h3>
          <a
            className="collective-widget"
            href="https://opencollective.com/caprover"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              src="https://opencollective.com/caprover/donate/button@2x.png?color=blue"
              width="300"
              height="50"
              alt={messages.donateAlt}
            />
          </a>
        </article>
        <article className="subscribe-card">
          <h3>{messages.subscribeTitle}</h3>
          <KitSubscribeForm
            emailLabel={messages.emailLabel}
            emailPlaceholder={messages.emailPlaceholder}
            subscribeButton={messages.subscribeButton}
          />
        </article>
      </div>
    </section>
  );
}

function FeaturedApps() {
  return (
    <ul className="featured-apps">
      {featuredApps.map(({ name, logo }) => (
        <li key={logo}>
          <img
            src={asset(`/one-click/${logo}.png`)}
            width={88}
            height={56}
            alt=""
          />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}

function DeploymentSnippet({
  filename,
  source,
  step,
}: {
  filename: string;
  source: string;
  step: string;
}) {
  return (
    <div className="deployment-snippet">
      <div className="deployment-filename">{filename}</div>
      <pre>
        <code>{source}</code>
      </pre>
      <div className="deployment-step">{step}</div>
    </div>
  );
}

function DeploymentExamples({
  messages,
  locale,
}: {
  messages: HomeMessages["deploymentExamples"];
  locale: Locale;
}) {
  const { staticSite, worker, catalog, compose } = messages;
  return (
    <DeploymentTabs
      title={messages.title}
      footer={
        <div className="deployment-workflow-note">
          <p>{messages.workflows}</p>
          <a href={docsUrl("deployments", locale)}>
            {messages.guide} <ArrowIcon />
          </a>
        </div>
      }
      methods={[
        {
          id: "worker",
          label: worker.label,
          summary: worker.summary,
          preview: (
            <>
              <h3>{worker.title}</h3>
              <p>{worker.description}</p>
              <DeploymentSnippet
                filename="Dockerfile"
                source={
                  'FROM python:3.13-slim\nWORKDIR /app\nCOPY worker.py .\nCMD ["python", "worker.py"]'
                }
                step="$ caprover deploy"
              />
              <p className="deployment-example-note">
                {messages.definitionNote}
              </p>
            </>
          ),
        },
        {
          id: "static",
          label: staticSite.label,
          summary: staticSite.summary,
          preview: (
            <>
              <h3>{staticSite.title}</h3>
              <p>{staticSite.description}</p>
              <DeploymentSnippet
                filename="Dockerfile"
                source={
                  "FROM nginx:alpine\nCOPY ./public/ /usr/share/nginx/html/"
                }
                step="$ caprover deploy"
              />
              <p className="deployment-example-note">
                {messages.definitionNote}
              </p>
            </>
          ),
        },
        {
          id: "compose",
          label: compose.label,
          summary: compose.summary,
          preview: (
            <>
              <h3>{compose.title}</h3>
              <p>{compose.description}</p>
              <DeploymentSnippet
                filename="compose.yaml"
                source={
                  "services:\n  web:\n    image: nginx:alpine\n  cache:\n    image: redis:7-alpine"
                }
                step={compose.step}
              />
            </>
          ),
        },
        {
          id: "catalog",
          label: catalog.label,
          summary: catalog.summary,
          preview: (
            <>
              <h3>{catalog.title}</h3>
              <p>{catalog.description}</p>
              <FeaturedApps />
            </>
          ),
        },
      ]}
    />
  );
}

function OneClickApps({ messages }: { messages: HomeMessages["oneClick"] }) {
  return (
    <section
      id="one-click-apps"
      className="one-click-showcase shell"
      aria-labelledby="one-click-title"
    >
      <div className="one-click-heading">
        <h2 id="one-click-title">{messages.title}</h2>
        <a
          className="catalog-link"
          href="https://github.com/caprover/one-click-apps/tree/master/public/v4/apps"
        >
          {messages.browse} <ArrowIcon />
        </a>
      </div>
      <FeaturedApps />
    </section>
  );
}

export function HomePage({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const allMessages = getMessages(locale);
  const messages = allMessages.homepage;
  const docs = docsUrl("get-started", locale);
  const compareHub = internal(routes.comparisonHub.path, locale);
  const compareCoolify = internal(routes.coolify.path, locale);
  const compareDokploy = internal(routes.dokploy.path, locale);
  const controlItems = messageList(messages.controls.items);

  return (
    <main lang={locale}>
      <header className="nav shell">
        <a className="logo" href="#top" aria-label={messages.brandAriaLabel}>
          <Mark />
          <span>CapRover</span>
        </a>
        <nav aria-label={messages.navigationAriaLabel}>
          <a href={docs}>{messages.navigation.docs}</a>
          <a href={compareHub}>{messages.navigation.compare}</a>
          <a href={GITHUB}>
            <GitHubIcon />
            {messages.navigation.github}
          </a>
          <a href={SLACK}>
            <SlackIcon />
            {messages.navigation.slack}
          </a>
        </nav>
        <div className="nav-actions">
          <LocaleSwitcher
            locale={locale}
            path="/"
            ariaLabel={allMessages.common.languageSelectorAriaLabel}
          />
        </div>
      </header>

      <section className="hero shell" id="top">
        <div>
          <p className="hero-label">{messages.hero.eyebrow}</p>
          <h1>
            {messages.hero.titleLine1}
            <br />
            {messages.hero.titleLine2}
          </h1>
          <p className="hero-text">{messages.hero.description}</p>
          <div className="actions">
            <a className="primary" href={docs}>
              {messages.hero.getStarted} <ArrowIcon />
            </a>
            <a className="secondary" href={LIVE_DEMO}>
              {messages.hero.liveDemo}
            </a>
          </div>
          <div className="hero-meta">
            <p className="demo-access">
              {messages.hero.demoPasswordLabel} <code>captain42</code>
            </p>
            <a className="hero-compare-link" href={compareHub}>
              {messages.hero.compareLink} <ArrowIcon />
            </a>
          </div>
        </div>
        <LiveDeployment messages={messages.hero} />
      </section>

      <CapabilityStrip messages={messages} />

      <OneClickApps messages={messages.oneClick} />

      <section className="app-controls" aria-labelledby="app-controls-title">
        <div className="shell">
          <div className="controls-header">
            <h2 id="app-controls-title">{messages.controls.title}</h2>
            <p className="controls-subtitle">{messages.controls.subtitle}</p>
          </div>
          <div className="control-cards">
            {controlItems.map(
              ({ title, description, snippetLabel, link }, index) => {
                const example = controlExamples[index];
                return (
                  <article className="control-card" key={title}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <div className="control-snippet">
                      <div className="control-snippet-label">
                        {snippetLabel}
                      </div>
                      <pre>
                        <code>{example.code}</code>
                      </pre>
                    </div>
                    <a
                      className="text-link"
                      href={docsUrl(example.docSlug, locale)}
                    >
                      {link} <ArrowIcon />
                    </a>
                  </article>
                );
              },
            )}
          </div>
        </div>
      </section>

      <DeploymentExamples
        messages={messages.deploymentExamples}
        locale={locale}
      />

      <section
        className="operations-section shell"
        id="features"
        aria-labelledby="operations-title"
      >
        <h2 id="operations-title">{messages.operations.title}</h2>
        <div className="operations-layout">
          <dl className="operations-list">
            {messageList(messages.operations.items).map(
              ({ title, description }) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{description}</dd>
                </div>
              ),
            )}
          </dl>
          <figure className="deployment-result">
            <img
              src={asset("/caprover-runtime-status.webp")}
              width={440}
              height={480}
              loading="lazy"
              alt={messages.operations.runtimeAlt}
            />
            <figcaption>{messages.operations.runtimeCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section
        className="compare-callout shell"
        aria-labelledby="compare-callout-title"
      >
        <div className="compare-callout-box">
          <div>
            <p className="compare-callout-kicker">
              {messages.compareSection.kicker}
            </p>
            <h2 id="compare-callout-title">{messages.compareSection.title}</h2>
            <p>{messages.compareSection.description}</p>
          </div>
          <div className="compare-callout-links">
            <a className="compare-pill" href={compareCoolify}>
              {messages.compareSection.coolifyLink} <ArrowIcon />
            </a>
            <a className="compare-pill" href={compareDokploy}>
              {messages.compareSection.dokployLink} <ArrowIcon />
            </a>
            <a className="compare-pill is-subtle" href={compareHub}>
              {messages.compareLink} <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      <section className="final-cta shell">
        <div>
          <h2>{messages.finalCta.title}</h2>
          <p>{messages.finalCta.description}</p>
          <div className="actions">
            <a className="primary" href={docs}>
              {messages.finalCta.getStarted} <ArrowIcon />
            </a>
            <a className="secondary" href={LIVE_DEMO}>
              {messages.finalCta.liveDemo}
            </a>
          </div>
        </div>
      </section>

      <CommunitySupport messages={messages.community} />

      <footer>
        <div className="shell footer-grid">
          <a className="logo" href="#top">
            <Mark />
            <span>CapRover</span>
          </a>
          <p>{messages.footer.tagline}</p>
          <div>
            <a href={docs}>{messages.footer.docs}</a>
            <a href={compareHub}>{messages.footer.compare}</a>
            <a href={GITHUB}>{messages.footer.github}</a>
            <a href={SLACK}>{messages.footer.slack}</a>
          </div>
          <small>{messages.footer.copyright}</small>
        </div>
      </footer>
    </main>
  );
}

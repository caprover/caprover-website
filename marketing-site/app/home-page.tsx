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

function asset(path: string) {
  return `${BASE_PATH}${ASSET_PATH}${path}`;
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
          width={672}
          height={592}
        />
        <img
          src={asset("/caprover-active-deployment.webp")}
          width={1239}
          height={507}
          alt={messages.deploymentAlt}
          fetchPriority="high"
        />
      </picture>
    </figure>
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

function OneClickApps({ messages }: { messages: HomeMessages["oneClick"] }) {
  return (
    <section
      id="one-click-apps"
      className="one-click-showcase shell"
      aria-labelledby="one-click-title"
    >
      <div className="one-click-heading">
        <div>
          <h2 id="one-click-title">{messages.title}</h2>
          <p>{messages.description}</p>
        </div>
        <a
          className="catalog-link"
          href="https://github.com/caprover/one-click-apps/tree/master/public/v4/apps"
        >
          {messages.browse} <ArrowIcon />
        </a>
      </div>
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
    </section>
  );
}

function DeploymentWorkflows({
  messages,
  locale,
}: {
  messages: HomeMessages["deploymentWorkflows"];
  locale: Locale;
}) {
  return (
    <section
      className="deployment-workflows shell"
      aria-labelledby="deployment-workflows-title"
    >
      <h2 id="deployment-workflows-title">{messages.title}</h2>
      <dl className="workflow-grid">
        {messageList(messages.items).map(({ title, description }) => (
          <div key={title}>
            <dt>{title}</dt>
            <dd>{description}</dd>
          </div>
        ))}
      </dl>
      <a className="text-link" href={docsUrl("deployments", locale)}>
        {messages.guide} <ArrowIcon />
      </a>
    </section>
  );
}

export function HomePage({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const allMessages = getMessages(locale);
  const messages = allMessages.homepage;
  const docs = docsUrl("get-started", locale);

  return (
    <main lang={locale}>
      <header className="nav shell">
        <a className="logo" href="#top" aria-label={messages.brandAriaLabel}>
          <Mark />
          <span>CapRover</span>
        </a>
        <nav aria-label={messages.navigationAriaLabel}>
          <a href={docs}>{messages.navigation.docs}</a>
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
          <p className="demo-access">
            {messages.hero.demoPasswordLabel} <code>captain42</code>
          </p>
        </div>
        <LiveDeployment messages={messages.hero} />
      </section>

      <OneClickApps messages={messages.oneClick} />

      <DeploymentWorkflows
        messages={messages.deploymentWorkflows}
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
              src={asset("/caprover-deployment-history.png")}
              width={836}
              height={458}
              loading="lazy"
              alt={messages.operations.historyAlt}
            />
            <figcaption>{messages.operations.historyCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="app-controls" aria-labelledby="app-controls-title">
        <div className="shell">
          <h2 id="app-controls-title">{messages.controls.title}</h2>
          <dl className="app-control-list">
            {messageList(messages.controls.items).map(
              ({ title, description }) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{description}</dd>
                </div>
              ),
            )}
          </dl>
          <div className="app-control-links">
            <a
              className="text-link"
              href={`${BASE_PATH}${localizedPath(routes.comparisonHub.path, locale)}`}
            >
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
            <a href={GITHUB}>{messages.footer.github}</a>
            <a href={SLACK}>{messages.footer.slack}</a>
          </div>
          <small>{messages.footer.copyright}</small>
        </div>
      </footer>
    </main>
  );
}

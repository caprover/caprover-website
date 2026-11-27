import { CodeBlock, type SupportedCodeLang } from "./code-block";
import type { CopyButtonLabels } from "./copy-button";
import { DeploymentTabs } from "./deployment-tabs";
import { DEFAULT_LOCALE, docsUrl, type Locale } from "../i18n/config";
import { getMessages, messageList, type Messages } from "../i18n/messages";
import { LocaleSwitcher } from "./locale-switcher";
import { NewsletterForm } from "./newsletter-form";

const GITHUB = "https://github.com/caprover/caprover";
const SLACK =
  "https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA";
const LIVE_DEMO = "https://captain.server.demo.caprover.com/?demo=true";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ASSET_PATH = "/homepage-assets";

type HomeMessages = Messages["homepage"];

const featuredApps = [
  { name: "WordPress", logo: "wordpress.svg" },
  { name: "PostgreSQL", logo: "postgres.png" },
  { name: "Redis", logo: "redis.png" },
  { name: "Nextcloud", logo: "nextcloud.png" },
  { name: "n8n", logo: "n8n-io.png" },
  { name: "Uptime Kuma", logo: "uptime-kuma.png" },
];

const controlExamples: {
  code: string;
  lang: SupportedCodeLang;
  docSlug: string;
  showPrompt?: boolean;
}[] = [
  {
    code: "client_max_body_size 1g;\nadd_header X-Frame-Options\n  SAMEORIGIN;\nproxy_read_timeout 300s;",
    lang: "nginx",
    docSlug: "domains/advanced-nginx",
  },
  {
    code: "TaskTemplate:\n  Resources:\n    Limits:\n      MemoryBytes: 536870912",
    lang: "yaml",
    docSlug: "applications/advanced",
  },
  {
    code: "docker node ls\ndocker service ls",
    lang: "bash",
    docSlug: "scaling/multi-node",
    showPrompt: true,
  },
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

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg className="external-arrow" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7 13 13 7M8 7h5v5" />
    </svg>
  );
}

function OpenCollectiveIcon() {
  return (
    <svg className="opencollective-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        fillOpacity="0.42"
        d="M20.032 5.44a10 10 0 0 1 0 13.12l-2.548-2.548a6.4 6.4 0 0 0 0-8.024L20.032 5.44Z"
      />
      <path
        fill="currentColor"
        d="M17.484 18.56a10 10 0 1 1 0-13.12l-2.548 2.548a6.4 6.4 0 1 0 0 8.024l2.548 2.548Z"
      />
    </svg>
  );
}

function InlineArrowLabel({ text }: { text: string }) {
  const lastSpace = text.lastIndexOf(" ");
  if (lastSpace > 0) {
    return (
      <>
        {text.slice(0, lastSpace)}{" "}
        <span className="link-tail">
          {text.slice(lastSpace + 1)}
          {"\u00A0"}
          <ArrowIcon className="inline-arrow" />
        </span>
      </>
    );
  }

  const chars = Array.from(text);
  if (chars.length > 2) {
    return (
      <>
        {chars.slice(0, -2).join("")}
        <span className="link-tail">
          {chars.slice(-2).join("")}
          {"\u00A0"}
          <ArrowIcon className="inline-arrow" />
        </span>
      </>
    );
  }

  return (
    <span className="link-tail">
      {text}
      {"\u00A0"}
      <ArrowIcon className="inline-arrow" />
    </span>
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
            className="collective-button"
            href="https://opencollective.com/caprover"
            target="_blank"
            rel="noreferrer noopener"
          >
            <OpenCollectiveIcon />
            <span>{messages.sponsorButton}</span>
            <ExternalArrowIcon />
          </a>
        </article>
        <article className="subscribe-card">
          <h3>{messages.subscribeTitle}</h3>
          <NewsletterForm
            emailLabel={messages.emailLabel}
            emailPlaceholder={messages.emailPlaceholder}
            subscribeButton={messages.subscribeButton}
            submittingButton={messages.submittingButton}
            subscribeSuccess={messages.subscribeSuccess}
            subscribeVerifyPrompt={messages.subscribeVerifyPrompt}
            subscribeVerifyAction={messages.subscribeVerifyAction}
            subscribeError={messages.subscribeError}
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
            src={asset(`/one-click/${logo}`)}
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

function DeploymentExamples({
  messages,
  copyLabels,
  locale,
}: {
  messages: HomeMessages["deploymentExamples"];
  copyLabels: CopyButtonLabels;
  locale: Locale;
}) {
  const { staticSite, worker, catalog, compose } = messages;
  return (
    <DeploymentTabs
      title={messages.title}
      footer={
        <div className="deployment-workflow-note">
          <p>{messages.workflows}</p>
          <a className="text-link" href={docsUrl("deployments", locale)}>
            <InlineArrowLabel text={messages.guide} />
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
              <CodeBlock
                className="deployment-code-block"
                label="Dockerfile"
                lang="dockerfile"
                code={
                  'FROM python:3.13-slim\nWORKDIR /app\nCOPY worker.py .\nCMD ["python", "worker.py"]'
                }
                footerStep="$ caprover deploy"
                copyLabels={copyLabels}
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
              <CodeBlock
                className="deployment-code-block"
                label="Dockerfile"
                lang="dockerfile"
                code={
                  "FROM nginx:alpine\nCOPY ./public/ /usr/share/nginx/html/"
                }
                footerStep="$ caprover deploy"
                copyLabels={copyLabels}
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
              <CodeBlock
                className="deployment-code-block"
                label="compose.yaml"
                lang="yaml"
                code={
                  "services:\n  web:\n    image: nginx:alpine\n  cache:\n    image: redis:7-alpine"
                }
                footerStep={compose.step}
                copyLabels={copyLabels}
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
          className="catalog-link text-link"
          href="https://github.com/caprover/one-click-apps/tree/master/public/v4/apps"
        >
          <InlineArrowLabel text={messages.browse} />
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
  const controlItems = messageList(messages.controls.items);
  const copyLabels: CopyButtonLabels = {
    copy: messages.code.copy,
    copied: messages.code.copied,
    ariaLabel: messages.code.copyAriaLabel,
  };

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
                    <CodeBlock
                      className="control-code-block"
                      label={snippetLabel}
                      lang={example.lang}
                      code={example.code}
                      showPrompt={example.showPrompt}
                      copyLabels={copyLabels}
                    />
                    <a
                      className="text-link"
                      href={docsUrl(example.docSlug, locale)}
                    >
                      <InlineArrowLabel text={link} />
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
        copyLabels={copyLabels}
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
            <a href={GITHUB}>{messages.footer.github}</a>
            <a href={SLACK}>{messages.footer.slack}</a>
          </div>
          <small>{messages.footer.copyright}</small>
        </div>
      </footer>
    </main>
  );
}

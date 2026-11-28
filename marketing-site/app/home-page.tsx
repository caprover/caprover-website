import {
  COMPACT_FEATURED_APPS,
  CURATED_ONE_CLICK_APPS,
  getLatestRelease,
  getOneClickCatalog,
  type OneClickCatalog as OneClickCatalogData,
} from "./caprover-data";
import { CodeBlock, type SupportedCodeLang } from "./code-block";
import {
  ControlsArchitecture,
  type ArchitectureStage,
} from "./controls-architecture";
import type { CopyButtonLabels } from "./copy-button";
import { DemoPasswordCopy } from "./demo-password-copy";
import { DeploymentTabs } from "./deployment-tabs";
import { DEFAULT_LOCALE, docsUrl, type Locale } from "../i18n/config";
import { getMessages, messageList, type Messages } from "../i18n/messages";
import { LocaleSwitcher } from "./locale-switcher";
import { NewsletterForm } from "./newsletter-form";
import { OneClickCatalog } from "./one-click-catalog";
import { OperationsShowcase, type OperationsItem } from "./operations-showcase";
import { ThemeToggle } from "./theme-toggle";

const GITHUB = "https://github.com/caprover/caprover";
const SLACK =
  "https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA";
const LIVE_DEMO = "https://captain.server.demo.caprover.com/?demo=true";
const ONE_CLICK_CATALOG_URL =
  "https://github.com/caprover/one-click-apps/tree/master/public/v4/apps";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ASSET_PATH = "/homepage-assets";

type HomeMessages = Messages["homepage"];

const RAM_SEGMENTS = [
  { key: "os", percent: 21.5 },
  { key: "caprover", percent: 12.7 },
  { key: "headroom", percent: 65.8 },
] as const;

const OPERATIONS_CAPTURES = [
  {
    id: "runtime",
    file: "/caprover-ops-runtime.webp",
    width: 1520,
    height: 1130,
  },
  {
    id: "rollback",
    file: "/caprover-ops-rollback.webp",
    width: 1520,
    height: 835,
  },
  {
    id: "https",
    file: "/caprover-ops-https.webp",
    width: 1140,
    height: 1060,
  },
] as const;

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

function formatMessage(
  template: string,
  values: Record<string, string | number>,
) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
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

function ServerNodeIcon() {
  return (
    <svg className="vps-mark" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.25" y="2.75" width="11.5" height="4.25" rx="1.2" />
      <rect x="2.25" y="9" width="11.5" height="4.25" rx="1.2" />
      <path d="M5 4.88h.01M5 11.12h.01" />
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

function HeroSpecimen({ messages }: { messages: HomeMessages["hero"] }) {
  return (
    <div className="hero-specimen">
      <figure className="hero-dashboard-frame">
        <div className="specimen-bar">
          <span className="specimen-bar-title">
            <span className="specimen-status-dot" aria-hidden="true" />
            {messages.specimenDashboardLabel}
          </span>
          <code className="specimen-bar-meta">captain.apps.example.com</code>
        </div>
        <div className="hero-dashboard-surface">
          <img
            src={asset("/caprover-hero-dashboard.webp")}
            width={1420}
            height={778}
            alt={messages.deploymentAlt}
            fetchPriority="high"
          />
        </div>
      </figure>

      <div
        className="hero-terminal-frame"
        role="region"
        aria-label={messages.specimenTerminalAriaLabel}
      >
        <div className="specimen-bar">
          <span className="specimen-bar-title">
            {messages.specimenTerminalLabel}
          </span>
          <code className="specimen-bar-meta">~/web-api</code>
        </div>
        <pre className="hero-terminal-pre">
          <code>
            <span className="term-line">
              <span className="terminal-prompt" aria-hidden="true">
                $
              </span>{" "}
              <span className="term-cmd">
                caprover deploy -a web-api -b main
              </span>
            </span>
            <span className="term-line term-muted">
              {"  "}Using ./captain-definition (Dockerfile)
            </span>
            <span className="term-line term-muted">
              {"  "}Building img-captain--web-api:14 on VPS...
            </span>
            <span className="term-line term-success">
              ✓ Swarm service srv-captain--web-api updated
            </span>
            <span className="term-line term-success">
              ✓ Live at https://api.example.com
            </span>
          </code>
        </pre>
      </div>
    </div>
  );
}

function CapabilityProofSection({ messages }: { messages: HomeMessages }) {
  const ramSegments = messageList(messages.ramBudget.segments);
  const providers = [
    "Hetzner",
    "DigitalOcean",
    "AWS",
    "Vultr",
    "Linode",
    messages.vpsCompatibility.bareMetal,
  ];

  return (
    <section
      className="capability-section shell"
      aria-labelledby="capabilities-title"
    >
      <h2 id="capabilities-title" className="sr-only">
        {messages.proofsAriaLabel}
      </h2>
      <div className="proof-panel">
        <dl className="capability-strip">
          {messageList(messages.proofs).map(({ value, label }) => (
            <div key={value}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>

        <div className="ram-budget">
          <div className="ram-budget-header">
            <div>
              <h3 className="ram-budget-title">{messages.ramBudget.title}</h3>
              <p className="ram-budget-subtitle">
                {messages.ramBudget.subtitle}
              </p>
            </div>
            <span className="ram-budget-total">{messages.ramBudget.total}</span>
          </div>

          <div
            className="ram-budget-bar"
            role="img"
            aria-label={messages.ramBudget.barAriaLabel}
          >
            {RAM_SEGMENTS.map((segment) => (
              <span
                key={segment.key}
                className={`ram-segment ram-segment-${segment.key}`}
                style={{ width: `${segment.percent}%` }}
              />
            ))}
          </div>

          <ul className="ram-budget-legend">
            {ramSegments.map((segment, index) => (
              <li key={segment.label}>
                <span
                  className={`ram-swatch ram-swatch-${RAM_SEGMENTS[index]?.key ?? "headroom"}`}
                  aria-hidden="true"
                />
                <span className="ram-legend-label">{segment.label}</span>
                <code className="ram-legend-value">{segment.value}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="vps-compatibility">
        <span className="vps-compatibility-label">
          <ServerNodeIcon />
          {messages.vpsCompatibility.label}
        </span>
        <ul className="vps-providers">
          {providers.map((provider) => (
            <li key={provider}>{provider}</li>
          ))}
        </ul>
      </div>
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
      {COMPACT_FEATURED_APPS.map(({ id, name, logo }) => (
        <li key={id}>
          <span className="one-click-icon-tile" aria-hidden="true">
            <img
              src={asset(`/one-click/${logo}`)}
              width={28}
              height={28}
              alt=""
            />
          </span>
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
                footerStatus={messages.deployConfirm}
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
                footerStatus={messages.deployConfirm}
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
                footerStatus={messages.composeConfirm}
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

function OneClickApps({
  messages,
  catalog,
}: {
  messages: HomeMessages["oneClick"];
  catalog: OneClickCatalogData;
}) {
  const subtitle = formatMessage(messages.subtitle, { count: catalog.count });
  const browseLabel = formatMessage(messages.browse, { count: catalog.count });

  return (
    <section
      id="one-click-apps"
      className="one-click-showcase shell"
      aria-labelledby="one-click-title"
    >
      <div className="one-click-heading">
        <div>
          <h2 id="one-click-title">{messages.title}</h2>
          <p className="one-click-subtitle">{subtitle}</p>
        </div>
        <a
          className="catalog-link text-link"
          href={ONE_CLICK_CATALOG_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          <InlineArrowLabel text={browseLabel} />
        </a>
      </div>

      <OneClickCatalog
        apps={catalog.apps}
        curated={CURATED_ONE_CLICK_APPS}
        assetBasePath={asset("")}
        catalogUrl={ONE_CLICK_CATALOG_URL}
        labels={{
          searchPlaceholder: messages.searchPlaceholder,
          searchAriaLabel: messages.searchAriaLabel,
          clearSearchAriaLabel: messages.clearSearchAriaLabel,
          matchesSummary: messages.matchesSummary,
          showingTop: messages.showingTop,
          emptyState: messages.emptyState,
          browseAll: browseLabel,
        }}
      />
    </section>
  );
}

export async function HomePage({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const [release, oneClickCatalog] = await Promise.all([
    getLatestRelease(),
    getOneClickCatalog(),
  ]);

  const allMessages = getMessages(locale);
  const messages = allMessages.homepage;
  const docs = docsUrl("get-started", locale);
  const controlItems = messageList(messages.controls.items);
  const architectureStageCopy = messageList(
    messages.controls.architecture.stages,
  );
  const architectureStages: ArchitectureStage[] = [
    {
      id: "https",
      label: "HTTPS",
      meta: architectureStageCopy[0]?.meta ?? "Let’s Encrypt TLS",
      icon: "https",
    },
    {
      id: "nginx",
      label: "CapRover NGINX",
      meta: architectureStageCopy[1]?.meta ?? "TLS + Custom Template",
      icon: "nginx",
      cardIndex: 0,
    },
    {
      id: "swarm",
      label: "Docker Swarm Overlay",
      meta: architectureStageCopy[2]?.meta ?? "Service Update + Hooks",
      icon: "swarm",
      cardIndex: 1,
    },
    {
      id: "replicas",
      label: "App Replicas",
      secondaryLabel: "Private Registry",
      meta: architectureStageCopy[3]?.meta ?? "Private Registry",
      icon: "replicas",
      cardIndex: 2,
    },
  ];
  const operationsItems: OperationsItem[] = messageList(
    messages.operations.items,
  ).map((item, index) => {
    const capture = OPERATIONS_CAPTURES[index] ?? OPERATIONS_CAPTURES[0];
    return {
      id: capture.id,
      title: item.title,
      description: item.description,
      viewTitle: item.viewTitle,
      viewMeta: item.viewMeta,
      imageSrc: asset(capture.file),
      imageWidth: capture.width,
      imageHeight: capture.height,
      imageAlt: item.imageAlt,
      caption: item.caption,
    };
  });
  const copyLabels: CopyButtonLabels = {
    copy: messages.code.copy,
    copied: messages.code.copied,
    ariaLabel: messages.code.copyAriaLabel,
  };

  return (
    <div className="page-frame" id="top">
      <a className="skip-link" href="#main-content">
        {allMessages.common.skipToContent}
      </a>

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
          <ThemeToggle
            labels={{
              ariaLabel: allMessages.common.themeToggle.ariaLabel,
              switchToDark: allMessages.common.themeToggle.switchToDark,
              switchToLight: allMessages.common.themeToggle.switchToLight,
            }}
          />
          <LocaleSwitcher
            locale={locale}
            path="/"
            ariaLabel={allMessages.common.languageSelectorAriaLabel}
          />
        </div>
      </header>

      <main lang={locale} id="main-content" tabIndex={-1}>
        <section className="hero shell">
          <div className="hero-copy">
            <a
              className="hero-release-link"
              href={release.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={formatMessage(messages.hero.releaseLinkAriaLabel, {
                tag: release.tag,
              })}
            >
              <span className="hero-release-dot" aria-hidden="true" />
              <span className="hero-release-tag">{release.tag}</span>
              <span className="hero-release-sep" aria-hidden="true">
                ·
              </span>
              <span>{messages.hero.eyebrow}</span>
              <ArrowIcon className="hero-release-arrow" />
            </a>

            <h1>
              {messages.hero.titleLine1}
              <br />
              {messages.hero.titleLine2}
            </h1>
            <p className="hero-text">{messages.hero.description}</p>
            <div className="hero-cta-group">
              <div className="actions">
                <a className="primary" href={docs}>
                  {messages.hero.getStarted} <ArrowIcon />
                </a>
                <a className="secondary" href={LIVE_DEMO}>
                  {messages.hero.liveDemo}
                </a>
              </div>
              <DemoPasswordCopy
                label={messages.hero.demoPasswordLabel}
                password="captain42"
                copiedLabel={messages.hero.demoPasswordCopied}
                copyAriaLabel={messages.hero.demoPasswordCopyAriaLabel}
              />
            </div>
          </div>
          <HeroSpecimen messages={messages.hero} />
        </section>

        <CapabilityProofSection messages={messages} />

        <OneClickApps messages={messages.oneClick} catalog={oneClickCatalog} />

        <section className="app-controls" aria-labelledby="app-controls-title">
          <div className="shell">
            <div className="controls-header">
              <h2 id="app-controls-title">{messages.controls.title}</h2>
              <p className="controls-subtitle">{messages.controls.subtitle}</p>
            </div>
            <ControlsArchitecture
              ariaLabel={messages.controls.architecture.ariaLabel}
              eyebrow={messages.controls.architecture.eyebrow}
              stages={architectureStages}
              cards={controlItems.map(
                ({ title, description, snippetLabel, link }, index) => {
                  const example = controlExamples[index];
                  return {
                    id: example.docSlug,
                    content: (
                      <>
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
                      </>
                    ),
                  };
                },
              )}
            />
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
          <OperationsShowcase
            switcherAriaLabel={messages.operations.switcherAriaLabel}
            items={operationsItems}
          />
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
      </main>

      <footer>
        <div className="shell footer-grid">
          <a className="logo" href="#top" aria-label={messages.brandAriaLabel}>
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
    </div>
  );
}

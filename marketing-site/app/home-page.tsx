import { DEFAULT_LOCALE, docsUrl, type Locale } from "../i18n/config";
import { getMessages, messageList, type Messages } from "../i18n/messages";
import { LocaleSwitcher } from "./locale-switcher";

const GITHUB = "https://github.com/caprover/caprover";
const SLACK =
  "https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA";
const LIVE_DEMO = "https://captain.server.demo.caprover.com/?demo=true";
const TUTORIAL = "https://www.youtube.com/watch?v=VPHEXPfsvyQ";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ASSET_PATH = "/homepage-assets";

type HomeMessages = Messages["homepage"];

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

function Dashboard({ alt }: { alt: string }) {
  return (
    <div className="dashboard-wrap">
      <img
        className="dashboard-screenshot"
        src={asset("/caprover-dashboard.png")}
        alt={alt}
      />
      <div className="diagram-lines" aria-hidden="true">
        <i />
        <i />
        <i />
        <b />
        <b />
        <b />
      </div>
    </div>
  );
}

function CommunitySupport({
  messages,
}: {
  messages: HomeMessages["community"];
}) {
  return (
    <section className="community shell" aria-labelledby="community-title">
      <div className="community-heading">
        <p className="section-kicker">{messages.kicker}</p>
        <h2 id="community-title">{messages.title}</h2>
      </div>
      <div className="community-grid">
        <article className="support-card">
          <span className="community-icon" aria-hidden="true">
            ♡
          </span>
          <h3>{messages.supportTitle}</h3>
          <p>{messages.supportDescription}</p>
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
          <span className="community-icon" aria-hidden="true">
            ✉
          </span>
          <h3>{messages.subscribeTitle}</h3>
          <p>{messages.subscribeDescription}</p>
          <form
            action="https://caprover.us19.list-manage.com/subscribe/post?u=c4a2955917a02c0480c9c5677&amp;id=d4a57b767d&amp;f_id=007e42e4f0"
            method="post"
            target="_blank"
            noValidate
          >
            <label className="sr-only" htmlFor="release-email">
              {messages.emailLabel}
            </label>
            <div className="subscribe-row">
              <input
                id="release-email"
                type="email"
                name="EMAIL"
                placeholder={messages.emailPlaceholder}
                autoComplete="email"
                required
              />
              <button type="submit" name="subscribe">
                {messages.subscribeButton}
              </button>
            </div>
            <input type="hidden" name="tags" value="9831781" />
            <div className="form-honeypot" aria-hidden="true">
              <input
                type="text"
                name="b_c4a2955917a02c0480c9c5677_d4a57b767d"
                tabIndex={-1}
                defaultValue=""
              />
            </div>
          </form>
        </article>
      </div>
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
          <a href="#features">{messages.navigation.features}</a>
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
          <a className="nav-cta" href={docs}>
            {messages.navigation.getStarted} <ArrowIcon />
          </a>
        </div>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> {messages.hero.eyebrow}
          </p>
          <h1>
            {messages.hero.titleLine1}
            <br />
            {messages.hero.titleLine2}
            <br className="desktop-break" /> {messages.hero.titleLine3}
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
          <p className="micro-proof">
            <span>✓</span> {messages.hero.proofs[0]} <i /> <span>✓</span>{" "}
            {messages.hero.proofs[1]} <i /> <span>✓</span>{" "}
            {messages.hero.proofs[2]}
          </p>
        </div>
        <Dashboard alt={messages.dashboardAlt} />
      </section>

      <section className="trust-bar">
        <div className="shell trust-grid">
          {messageList(messages.trust).map(({ icon, title, description }) => (
            <div className="trust-item" key={title}>
              <b>{icon}</b>
              <div>
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="intro shell">
        <p className="section-kicker">{messages.intro.kicker}</p>
        <h2>
          {messages.intro.titleLine1}
          <br />
          {messages.intro.titleLine2}
        </h2>
        <p>{messages.intro.description}</p>
        <div className="stack-row">
          <span>Docker</span>
          <i>＋</i>
          <span>nginx</span>
          <i>＋</i>
          <span>Let&apos;s Encrypt</span>
          <i>＋</i>
          <span>Docker Swarm</span>
        </div>
      </section>

      <CommunitySupport messages={messages.community} />

      <section className="workflow-section">
        <div className="shell workflow-grid">
          <div>
            <p className="section-kicker">{messages.workflow.kicker}</p>
            <h2>{messages.workflow.title}</h2>
            <p>{messages.workflow.description}</p>
            <a className="text-link" href={docs}>
              {messages.workflow.guideLink} <ArrowIcon />
            </a>
          </div>
          <div className="terminal">
            <div className="term-top">
              <span>
                <i />
                <i />
                <i />
              </span>
              <b>caprover deploy</b>
            </div>
            <code>
              <span>$ caprover deploy</span>
              {messageList(messages.workflow.steps).map((step) => (
                <em key={step}>✓ {step}</em>
              ))}
              <strong>{messages.workflow.buildComplete}</strong>
              <strong>{messages.workflow.deployed}</strong>
              <a href="https://my-app.example.com">
                https://my-app.example.com
              </a>
            </code>
          </div>
        </div>
      </section>

      <section className="features shell" id="features">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{messages.featuresSection.kicker}</p>
            <h2>{messages.featuresSection.title}</h2>
          </div>
          <p>{messages.featuresSection.description}</p>
        </div>
        <div className="feature-grid">
          {messageList(messages.featuresSection.items).map(
            ({ icon, title, description }) => (
              <article key={title}>
                <span>{icon}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="audience">
        <div className="shell audience-grid">
          <div>
            <p className="section-kicker">{messages.audience.kicker}</p>
            <h2>{messages.audience.title}</h2>
          </div>
          <div className="quote-code">
            <code>
              <span>more_of(</span>showResults(getUserList())<span>);</span>
              <br />
              <em>{messages.audience.codeComment}</em>
              <br />
              apt-get install libstdc++6
            </code>
          </div>
          <div className="audience-cards">
            <article>
              <b>01</b>
              <h3>{messages.audience.simpleTitle}</h3>
              <p>{messages.audience.simpleDescription}</p>
            </article>
            <article>
              <b>02</b>
              <h3>{messages.audience.powerfulTitle}</h3>
              <p>{messages.audience.powerfulDescription}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="tutorial shell" aria-labelledby="tutorial-title">
        <div className="tutorial-copy">
          <p className="section-kicker">{messages.tutorial.kicker}</p>
          <h2 id="tutorial-title">{messages.tutorial.title}</h2>
          <p>{messages.tutorial.description}</p>
          <a
            className="text-link"
            href={TUTORIAL}
            target="_blank"
            rel="noreferrer noopener"
          >
            {messages.tutorial.link} <ArrowIcon />
          </a>
        </div>
        <a
          className="tutorial-media"
          href={TUTORIAL}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={messages.tutorial.linkAriaLabel}
        >
          <img
            src={asset("/caprover-tutorial.gif")}
            alt={messages.tutorial.imageAlt}
          />
        </a>
      </section>

      <section className="blueprints" aria-labelledby="blueprints-title">
        <div className="shell">
          <div className="blueprints-heading">
            <p className="section-kicker">{messages.blueprints.kicker}</p>
            <h2 id="blueprints-title">{messages.blueprints.title}</h2>
            <p>{messages.blueprints.description}</p>
          </div>
          <div className="blueprints-grid">
            <figure>
              <div className="diagram-frame">
                <img
                  src={asset("/caprover-workflow.png")}
                  alt={messages.blueprints.workflowAlt}
                />
              </div>
              <figcaption>
                <div>
                  <strong>{messages.blueprints.workflowTitle}</strong>
                  <span>{messages.blueprints.workflowDescription}</span>
                </div>
                <a href={asset("/caprover-workflow.png")} target="_blank">
                  {messages.blueprints.openDiagram}
                </a>
              </figcaption>
            </figure>
            <figure>
              <div className="diagram-frame">
                <img
                  src={asset("/caprover-architecture.png")}
                  alt={messages.blueprints.architectureAlt}
                />
              </div>
              <figcaption>
                <div>
                  <strong>{messages.blueprints.architectureTitle}</strong>
                  <span>{messages.blueprints.architectureDescription}</span>
                </div>
                <a href={asset("/caprover-architecture.png")} target="_blank">
                  {messages.blueprints.openDiagram}
                </a>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="final-cta shell">
        <div>
          <Mark />
          <p className="section-kicker">{messages.finalCta.kicker}</p>
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

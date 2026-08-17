import { LanguageSwitch } from "@/components/LanguageSwitch";
import {
  GITHUB,
  LIVE_DEMO,
  SLACK,
  TUTORIAL,
  asset,
  docsPath,
  getHomeMessages,
  withBase,
  type Locale,
} from "@/lib/i18n";

function Mark() {
  return <img className="brand-mark" src={asset("/caprover-logo.png")} alt="" aria-hidden="true" />;
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
    <svg className="nav-icon github-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.91c-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.34 9.34 0 0 1 12 6.92a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.89v2.8c0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function SlackIcon() {
  return <img className="nav-icon slack-mark" src={asset("/slack-icon.png")} alt="" aria-hidden="true" />;
}

function Dashboard({ alt }: { alt: string }) {
  return (
    <div className="dashboard-wrap">
      <img className="dashboard-screenshot" src={asset("/caprover-dashboard.png")} alt={alt} />
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

export function HomePage({ locale }: { locale: Locale }) {
  const t = getHomeMessages(locale);
  const docs = withBase(docsPath(locale));
  const titleLines = t.introTitle.split("\n");

  return (
    <main>
      <header className="nav shell">
        <a className="logo" href="#top" aria-label={t.homeAria}>
          <Mark />
          <span>CapRover</span>
        </a>
        <nav aria-label={t.navAria}>
          <a href="#features">{t.features}</a>
          <a href={docs}>{t.docs}</a>
          <a href={GITHUB}>
            <GitHubIcon />
            {t.github}
          </a>
          <a href={SLACK}>
            <SlackIcon />
            {t.slack}
          </a>
        </nav>
        <div className="nav-end">
          <LanguageSwitch locale={locale} path="/" />
          <a className="nav-cta" href={docs}>
            {t.getStarted} <ArrowIcon />
          </a>
        </div>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> {t.eyebrow}
          </p>
          <h1>
            {t.heroTitleBefore}
            <br />
            {t.heroTitleAfter}
            <br className="desktop-break" /> {t.heroTitleRest}
          </h1>
          <p className="hero-text">{t.heroText}</p>
          <div className="actions">
            <a className="primary" href={docs}>
              {t.getStarted} <ArrowIcon />
            </a>
            <a className="secondary" href={LIVE_DEMO}>
              {t.liveDemo}
            </a>
          </div>
          <p className="demo-access">
            {t.demoPasswordLabel} <code>captain42</code>
          </p>
          <p className="micro-proof">
            <span>✓</span> {t.proofFree} <i /> <span>✓</span> {t.proofNoLockIn} <i /> <span>✓</span>{" "}
            {t.proofProduction}
          </p>
        </div>
        <Dashboard alt={t.dashboardAlt} />
      </section>

      <section className="trust-bar">
        <div className="shell trust-grid">
          {t.trust.map((item) => (
            <div className="trust-item" key={item.title}>
              <b>{item.icon}</b>
              <div>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="intro shell">
        <p className="section-kicker">{t.introKicker}</p>
        <h2>
          {titleLines[0]}
          <br />
          {titleLines[1]}
        </h2>
        <p>{t.introText}</p>
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

      <section className="community shell" aria-labelledby="community-title">
        <div className="community-heading">
          <p className="section-kicker">{t.communityKicker}</p>
          <h2 id="community-title">{t.communityTitle}</h2>
        </div>
        <div className="community-grid">
          <article className="support-card">
            <span className="community-icon" aria-hidden="true">
              ♡
            </span>
            <h3>{t.donateTitle}</h3>
            <p>{t.donateText}</p>
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
                alt={t.donateAlt}
              />
            </a>
          </article>
          <article className="subscribe-card">
            <span className="community-icon" aria-hidden="true">
              ✉
            </span>
            <h3>{t.subscribeTitle}</h3>
            <p>{t.subscribeText}</p>
            <form
              action="https://caprover.us19.list-manage.com/subscribe/post?u=c4a2955917a02c0480c9c5677&amp;id=d4a57b767d&amp;f_id=007e42e4f0"
              method="post"
              target="_blank"
              noValidate
            >
              <label className="sr-only" htmlFor={`release-email-${locale}`}>
                {t.emailLabel}
              </label>
              <div className="subscribe-row">
                <input
                  id={`release-email-${locale}`}
                  type="email"
                  name="EMAIL"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
                <button type="submit" name="subscribe">
                  {t.subscribe}
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

      <section className="workflow-section">
        <div className="shell workflow-grid">
          <div>
            <p className="section-kicker">{t.workflowKicker}</p>
            <h2>{t.workflowTitle}</h2>
            <p>{t.workflowText}</p>
            <a className="text-link" href={docs}>
              {t.workflowLink} <ArrowIcon />
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
              {t.terminalSteps.map((step) => (
                <em key={step}>✓ {step}</em>
              ))}
              <strong>{t.buildComplete}</strong>
              <strong>{t.deployedSuccessfully}</strong>
              <a href="https://my-app.example.com">https://my-app.example.com</a>
            </code>
          </div>
        </div>
      </section>

      <section className="features shell" id="features">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{t.featuresKicker}</p>
            <h2>{t.featuresTitle}</h2>
          </div>
          <p>{t.featuresLead}</p>
        </div>
        <div className="feature-grid">
          {t.featureItems.map((item) => (
            <article key={item.title}>
              <span>{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="audience">
        <div className="shell audience-grid">
          <div>
            <p className="section-kicker">{t.audienceKicker}</p>
            <h2>{t.audienceTitle}</h2>
          </div>
          <div className="quote-code">
            <code>
              <span>more_of(</span>showResults(getUserList())<span>);</span>
              <br />
              <em>{"// less of this"}</em>
              <br />
              apt-get install libstdc++6
            </code>
          </div>
          <div className="audience-cards">
            <article>
              <b>01</b>
              <h3>{t.simpleTitle}</h3>
              <p>{t.simpleText}</p>
            </article>
            <article>
              <b>02</b>
              <h3>{t.powerfulTitle}</h3>
              <p>{t.powerfulText}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="tutorial shell" aria-labelledby="tutorial-title">
        <div className="tutorial-copy">
          <p className="section-kicker">{t.tutorialKicker}</p>
          <h2 id="tutorial-title">{t.tutorialTitle}</h2>
          <p>{t.tutorialText}</p>
          <a className="text-link" href={TUTORIAL} target="_blank" rel="noreferrer noopener">
            {t.tutorialLink} <ArrowIcon />
          </a>
        </div>
        <a
          className="tutorial-media"
          href={TUTORIAL}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={t.tutorialAria}
        >
          <img src={asset("/caprover-tutorial.gif")} alt={t.tutorialAlt} />
        </a>
      </section>

      <section className="blueprints" aria-labelledby="blueprints-title">
        <div className="shell">
          <div className="blueprints-heading">
            <p className="section-kicker">{t.blueprintsKicker}</p>
            <h2 id="blueprints-title">{t.blueprintsTitle}</h2>
            <p>{t.blueprintsText}</p>
          </div>
          <div className="blueprints-grid">
            <figure>
              <div className="diagram-frame">
                <img src={asset("/caprover-workflow.png")} alt={t.workflowAlt} />
              </div>
              <figcaption>
                <div>
                  <strong>{t.workflowCaptionTitle}</strong>
                  <span>{t.workflowCaptionText}</span>
                </div>
                <a href={asset("/caprover-workflow.png")} target="_blank">
                  {t.openDiagram}
                </a>
              </figcaption>
            </figure>
            <figure>
              <div className="diagram-frame">
                <img src={asset("/caprover-architecture.png")} alt={t.architectureAlt} />
              </div>
              <figcaption>
                <div>
                  <strong>{t.architectureCaptionTitle}</strong>
                  <span>{t.architectureCaptionText}</span>
                </div>
                <a href={asset("/caprover-architecture.png")} target="_blank">
                  {t.openDiagram}
                </a>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="final-cta shell">
        <div>
          <Mark />
          <p className="section-kicker">{t.ctaKicker}</p>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
          <div className="actions">
            <a className="primary" href={docs}>
              {t.ctaPrimary} <ArrowIcon />
            </a>
            <a className="secondary" href={LIVE_DEMO}>
              {t.ctaSecondary}
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
          <p>{t.footerTagline}</p>
          <div>
            <a href={docs}>{t.docs}</a>
            <a href={GITHUB}>{t.github}</a>
            <a href={SLACK}>{t.slack}</a>
          </div>
          <small>© 2026 githubsaturn · Apache 2.0</small>
        </div>
      </footer>
    </main>
  );
}

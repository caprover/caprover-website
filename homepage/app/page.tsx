const DOCS = "https://caprover.com/docs/get-started.html";
const GITHUB = "https://github.com/caprover/caprover";
const SLACK = "https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA";
const LIVE_DEMO = "https://captain.server.demo.caprover.com/?demo=true";
const TUTORIAL = "https://www.youtube.com/watch?v=VPHEXPfsvyQ";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ASSET_PATH = "/homepage-assets";

function asset(path: string) {
  return `${BASE_PATH}${ASSET_PATH}${path}`;
}

function Mark() {
  return <img className="brand-mark" src={asset("/caprover-logo.png")} alt="" aria-hidden="true" />;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

function GitHubIcon() {
  return <svg className="nav-icon github-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.91c-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.34 9.34 0 0 1 12 6.92a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.89v2.8c0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" /></svg>;
}

function SlackIcon() {
  return <img className="nav-icon slack-mark" src={asset("/slack-icon.png")} alt="" aria-hidden="true" />;
}

function Dashboard() {
  return (
    <div className="dashboard-wrap">
      <img className="dashboard-screenshot" src={asset("/caprover-dashboard.png")} alt="CapRover dashboard showing apps organized by project" />
      <div className="diagram-lines" aria-hidden="true"><i /><i /><i /><b /><b /><b /></div>
    </div>
  );
}

function CommunitySupport() {
  return (
    <section className="community shell" aria-labelledby="community-title">
      <div className="community-heading">
        <p className="section-kicker">POWERED BY THE COMMUNITY</p>
        <h2 id="community-title">Support the project. Stay in the loop.</h2>
      </div>
      <div className="community-grid">
        <article className="support-card">
          <span className="community-icon" aria-hidden="true">♡</span>
          <h3>Keep CapRover independent</h3>
          <p>Help fund ongoing development and maintenance through OpenCollective.</p>
          <a className="collective-widget" href="https://opencollective.com/caprover" target="_blank" rel="noreferrer noopener">
            <img src="https://opencollective.com/caprover/donate/button@2x.png?color=blue" width="300" height="50" alt="Donate to CapRover on OpenCollective" />
          </a>
        </article>
        <article className="subscribe-card">
          <span className="community-icon" aria-hidden="true">✉</span>
          <h3>Don&apos;t miss important updates</h3>
          <p>Get notified about new CapRover releases. No noise, just product updates.</p>
          <form action="https://caprover.us19.list-manage.com/subscribe/post?u=c4a2955917a02c0480c9c5677&amp;id=d4a57b767d&amp;f_id=007e42e4f0" method="post" target="_blank" noValidate>
            <label className="sr-only" htmlFor="release-email">Email address</label>
            <div className="subscribe-row">
              <input id="release-email" type="email" name="EMAIL" placeholder="you@example.com" autoComplete="email" required />
              <button type="submit" name="subscribe">Subscribe</button>
            </div>
            <input type="hidden" name="tags" value="9831781" />
            <div className="form-honeypot" aria-hidden="true"><input type="text" name="b_c4a2955917a02c0480c9c5677_d4a57b767d" tabIndex={-1} defaultValue="" /></div>
          </form>
        </article>
      </div>
    </section>
  );
}

const features = [
  ["◫", "Any language", "Deploy Node.js, Python, PHP, Java, Ruby, .NET, or any app that runs in a container."],
  ["▣", "One-click apps", "Launch databases, WordPress, monitoring tools, and dozens of popular services in seconds."],
  ["⌁", "Flexible deploys", "Deploy from the dashboard, CLI, webhook, or your existing Git workflow."],
  ["◇", "Automatic HTTPS", "Issue and renew Let's Encrypt certificates, with one-click HTTP to HTTPS redirects."],
  ["⌘", "Simple control", "Manage ports, persistent directories, environment variables, and instance counts from one place."],
  ["↗", "Ready to scale", "Add nodes to your Docker Swarm cluster and let CapRover handle load balancing."],
];

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="logo" href="#top" aria-label="CapRover home"><Mark /><span>CapRover</span></a>
        <nav aria-label="Main navigation"><a href="#features">Features</a><a href={DOCS}>Docs</a><a href={GITHUB}><GitHubIcon />GitHub</a><a href={SLACK}><SlackIcon />Slack</a></nav>
        <a className="nav-cta" href={DOCS}>Get started <ArrowIcon /></a>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Scalable, free, and self-hosted PaaS.</p>
          <h1>Deploy apps.<br />Own your<br className="desktop-break" /> infrastructure.</h1>
          <p className="hero-text">A scalable, free platform that makes deploying and managing your apps simple, while keeping your infrastructure fully under your control.</p>
          <div className="actions"><a className="primary" href={DOCS}>Get started <ArrowIcon /></a><a className="secondary" href={LIVE_DEMO}>Live demo</a></div>
          <p className="demo-access">Live demo password: <code>captain42</code></p>
          <p className="micro-proof"><span>✓</span> Free forever <i /> <span>✓</span> No vendor lock-in <i /> <span>✓</span> Production ready</p>
        </div>
        <Dashboard />
      </section>

      <section className="trust-bar"><div className="shell trust-grid">
        {[["⬡","Docker native","Run anything, anywhere"],["▱","One-click apps","Deploy services in seconds"],["▣","Automatic HTTPS","Free TLS for every domain"],["▤","Self-hosted","Your data, your infrastructure"]].map(([icon,title,text])=><div className="trust-item" key={title}><b>{icon}</b><div><strong>{title}</strong><span>{text}</span></div></div>)}
      </div></section>

      <section className="intro shell">
        <p className="section-kicker">IT JUST WORKS</p>
        <h2>The power of Docker and nginx.<br />Without the busywork.</h2>
        <p>CapRover gives you a clean interface for the infrastructure tasks that usually steal hours from building your product.</p>
        <div className="stack-row"><span>Docker</span><i>＋</i><span>nginx</span><i>＋</i><span>Let&apos;s Encrypt</span><i>＋</i><span>Docker Swarm</span></div>
      </section>

      <CommunitySupport />

      <section className="workflow-section">
        <div className="shell workflow-grid">
          <div><p className="section-kicker">APP DEPLOYMENT MADE EASY</p><h2>From localhost to live in seconds.</h2><p>Bring your code. CapRover handles the build, deployment, routing, HTTPS, and ongoing management.</p><a className="text-link" href={DOCS}>See the deployment guide <ArrowIcon /></a></div>
          <div className="terminal">
            <div className="term-top"><span><i /><i /><i /></span><b>caprover deploy</b></div>
            <code><span>$ caprover deploy</span>{["Detecting source","Building image","Pushing image","Deploying to CapRover","Starting containers"].map(x=><em key={x}>✓ {x}</em>)}<strong>Build complete</strong><strong>Deployed successfully</strong><a href="https://my-app.example.com">https://my-app.example.com</a></code>
          </div>
        </div>
      </section>

      <section className="features shell" id="features">
        <div className="section-heading"><div><p className="section-kicker">EVERYTHING YOU NEED</p><h2>A simple control plane for your apps.</h2></div><p>Easy enough for your first deployment. Flexible enough when you need complete control.</p></div>
        <div className="feature-grid">{features.map(([icon,title,text])=><article key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="audience"><div className="shell audience-grid">
        <div><p className="section-kicker">BUILT FOR DEVELOPERS</p><h2>Spend more time writing code. Less time managing servers.</h2></div>
        <div className="quote-code"><code><span>more_of(</span>showResults(getUserList())<span>);</span><br /><em>{"// less of this"}</em><br />apt-get install libstdc++6</code></div>
        <div className="audience-cards"><article><b>01</b><h3>Simple by default</h3><p>Skip the repetitive server setup, certificates, nginx edits, and deployment scripts.</p></article><article><b>02</b><h3>Powerful when needed</h3><p>Customize nginx, attach nodes, use custom certificates, and reach the underlying Docker platform.</p></article></div>
      </div></section>

      <section className="tutorial shell" aria-labelledby="tutorial-title">
        <div className="tutorial-copy">
          <p className="section-kicker">SEE CAPROVER IN ACTION</p>
          <h2 id="tutorial-title">A full deployment, from server to shipped app.</h2>
          <p>Watch the original step-by-step tutorial to see how CapRover is installed, configured, and used to deploy an application.</p>
          <a className="text-link" href={TUTORIAL} target="_blank" rel="noreferrer noopener">Watch the full video tutorial <ArrowIcon /></a>
        </div>
        <a className="tutorial-media" href={TUTORIAL} target="_blank" rel="noreferrer noopener" aria-label="Watch the CapRover video tutorial on YouTube">
          <img src={asset("/caprover-tutorial.gif")} alt="Animated preview of the CapRover video tutorial" />
        </a>
      </section>

      <section className="blueprints" aria-labelledby="blueprints-title">
        <div className="shell">
          <div className="blueprints-heading">
            <p className="section-kicker">HOW IT WORKS</p>
            <h2 id="blueprints-title">The complete deployment flow, under the hood.</h2>
            <p>Explore the original CapRover workflow and architecture diagrams for a closer look at what happens from deploy command to live application.</p>
          </div>
          <div className="blueprints-grid">
            <figure>
              <div className="diagram-frame"><img src={asset("/caprover-workflow.png")} alt="CapRover deployment workflow from source code to a running application" /></div>
              <figcaption><div><strong>Deployment workflow</strong><span>From source code to live app</span></div><a href={asset("/caprover-workflow.png")} target="_blank">Open full diagram ↗</a></figcaption>
            </figure>
            <figure>
              <div className="diagram-frame"><img src={asset("/caprover-architecture.png")} alt="CapRover architecture showing Docker Swarm, nginx, services, and applications" /></div>
              <figcaption><div><strong>System architecture</strong><span>Routing, services, and Docker Swarm</span></div><a href={asset("/caprover-architecture.png")} target="_blank">Open full diagram ↗</a></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="final-cta shell"><div><Mark /><p className="section-kicker">READY TO GIVE IT A SHOT?</p><h2>Your first deployment is about 10 minutes away.</h2><p>Install CapRover on your own server and ship your first app today.</p><div className="actions"><a className="primary" href={DOCS}>Get started now <ArrowIcon /></a><a className="secondary" href={LIVE_DEMO}>Explore live demo</a></div></div></section>

      <footer><div className="shell footer-grid"><a className="logo" href="#top"><Mark /><span>CapRover</span></a><p>Scalable, free, and self-hosted PaaS.</p><div><a href={DOCS}>Docs</a><a href={GITHUB}>GitHub</a><a href={SLACK}>Slack</a></div><small>© 2026 githubsaturn · Apache 2.0</small></div></footer>
    </main>
  );
}

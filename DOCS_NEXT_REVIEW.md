# Docs-next preview review

The English preview lives at `/docs-next` beside the unchanged `/docs` tree. It is intentionally unlinked from the production navigation, marked `noindex`, and omitted from sitemaps. This review covers the preview before a separate cutover decision.

## Information architecture and task paths

- All 141 English Markdown pages appear in `docs-site/sidebars-next.js`, including category landing pages. There are no remaining draft placeholder sentences.
- A new user can follow Getting Started from server prerequisites and firewall rules through Docker installation, dashboard initialization, wildcard DNS, a first app, and HTTPS.
- Deployment tasks cover source, CLI, Git, Docker images, CI/CD, registries, logs, and rollback. The multi-node setup includes registry, SSH, and private network prerequisites before joining a node.
- DNS and HTTPS tasks are under Domains & Networking; app settings and storage tasks have dedicated sections. External database access states the published port and provider firewall requirements.
- Server backup guides distinguish `/captain/data` from images, external application data, and volumes; restore instructions include a fresh-server install command and cluster node mapping.
- Troubleshooting routes symptoms to the owning product areas. Guides hold end-to-end examples; Reference holds field and port details with links to source.
- A page-by-page pass covered all 141 English preview pages and compared the 36 old English documentation pages with the new task paths. Examples and version-sensitive claims were checked against current CapRover, CLI, and deployment-action source. The corrective pass fixed the ignored build output in the static app guide, a conflicting sample deployment instruction, optional versus default published ports, a stale CaptainDuckDuck script, a problematic OpenStack template, and an unsupported Pro recovery-code claim. It added a runnable application tutorial, a GitLab pipeline, CLI and API details, and source-backed troubleshooting and recovery procedures.

## URL and publication checks

- `DOCS_NEXT_URL_MAP.md` classifies all 36 current English Markdown pages; each proposed preview destination matches an existing slug. No old route is redirected during preview.
- Docusaurus production builds succeed for `en`, `es-ES`, and `zh-CN`. The combined-site HTTP smoke test passes; the old `/docs` output remains present.
- Generated `/docs-next` HTML has `noindex` in all three locales; none of the three sitemap files contains a `/docs-next` URL. Spanish and Chinese preview paths currently render English fallback content.
- The build rejects broken internal Markdown links. An independent editorial pass and live testing of provider-specific procedures are appropriate before a public navigation change; external destinations can change independently of this repository.
- The latest validation checked 21 shell, 13 JSON, 2 YAML, and 4 JavaScript fenced examples for syntax (the theme configuration as an object expression). The multi-service tutorial's GET/POST jobs, worker update, and PUT/GET upload were exercised locally against a shared in-memory PostgreSQL substitute. All 423 generated preview routes (141 pages in each of three locales) exist and are marked `noindex`; each locale's sitemap omits them. The combined-site HTTP smoke test passed. These checks do not substitute for a deployment on a live CapRover server, including PostgreSQL and Docker volumes, or editorial feedback from reviewers.

## External review follow-up

The two outside reviews were based partly on the draft before PR #220. That PR had already filled in the CLI flags, GitLab CI, dashboard password and NGINX recovery, app shell and restart, Certbot override example, theme object, and first runnable tutorial. The further review added:

- A DNS record table and external wildcard lookup, an optional CLI setup path, provider-image shortcut, domain-free local-install link, and low-memory swap guidance to Getting Started. The source-based CLI test deployment remains a separate linked task path.
- The actual built-in Captain Definition template names, image suffixes, and runtime version semantics; OTP authentication in the CLI; a scoped named-volume cleanup procedure; and the distinction between active and orphaned certificates.
- A multi-service tutorial with a public web app, private worker, PostgreSQL, persistent uploads, internal service networking, deployment archives, HTTPS, and separate data backups. The theme page now contains its own complete example rather than depending on the old docs.

The review did not restore the old signup-credit amount or referral claims because promotions change, nor recommend hiding the root domain as a security control. The old blanket Docker prune commands and automatic reuse of a historical CaptainDuckDuck script remain excluded. The rclone recipe and uncorrected OpenStack Heat template remain explicitly deferred pending a working provider-specific validation. One-Click instructions are distributed among install, configuration, connection, upgrade, and troubleshooting pages; the live catalog remains the source for its current app list. Short task pages are intentional and are not necessarily placeholders.

## Cutover work requiring a separate decision

1. Obtain explicit approval to promote the preview after the reviewer pass. Freeze the information architecture and incorporate any editorial feedback.
2. Enumerate and verify historical routes beyond the 36 English Markdown pages: translated pages, `.html` variants, anchors, and other externally used URLs. Finalize redirect destinations for split pages.
3. Decide whether to translate the new structure before promotion or use an English fallback, then update locale tooling and navigation accordingly.
4. Promote `/docs-next` to `/docs`, update navigation/search/sitemap/edit links, install only necessary legacy redirects, test important incoming links, and remove the duplicate preview route.

No cutover changes are included in this review.

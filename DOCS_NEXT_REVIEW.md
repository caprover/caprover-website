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
- The follow-up validation checked 18 shell, 9 JSON, 2 YAML, and 3 JavaScript fenced examples for syntax. The tutorial's counter was exercised with GET/POST/GET and retained the increment in the same process. All 423 generated preview routes (141 pages in each of three locales) exist and are marked `noindex`; each locale's sitemap omits them. The combined-site HTTP smoke test passed. These checks do not substitute for a deployment on a live CapRover server or editorial feedback from reviewers.

## Cutover work requiring a separate decision

1. Obtain explicit approval to promote the preview after the reviewer pass. Freeze the information architecture and incorporate any editorial feedback.
2. Enumerate and verify historical routes beyond the 36 English Markdown pages: translated pages, `.html` variants, anchors, and other externally used URLs. Finalize redirect destinations for split pages.
3. Decide whether to translate the new structure before promotion or use an English fallback, then update locale tooling and navigation accordingly.
4. Promote `/docs-next` to `/docs`, update navigation/search/sitemap/edit links, install only necessary legacy redirects, test important incoming links, and remove the duplicate preview route.

No cutover changes are included in this review.

# Consolidate CapRover documentation

**Status: historical 141→47 consolidation plan.** The preview now has **48 pages**: one additional Manual Setup page was added after consolidation for the alternative installation procedure. The original 141 route mappings remain unchanged.

## Outcome

- **141 preview pages → 47 retained pages**
- **8 top-level sections** with shallow navigation
- Every old preview page mapped exactly once in [DOCS_CONSOLIDATION_MAP.json](./DOCS_CONSOLIDATION_MAP.json)
- 36 historical English public documentation routes also linked to a planned new destination

## Editorial rules

1. Explain only unusual behavior, exact values, limitations, critical prerequisites and real failure modes.
2. Eliminate obvious UI steps such as “enable HTTPS in HTTP settings” or “check that the certificate works”.
3. Remove repeated introductions, tutorials duplicated between pages, and pure navigation index pages.
4. Prefer concise bullets, commands and tables. Use numbered steps only when sequence is essential.
5. Preserve unique commands, safety warnings, credentials/permissions requirements, and data-loss cautions.
6. Give major tasks and substantial references their own pages. Use headings and anchors for small features.
7. Reconcile overlapping information against the CapRover source code; retain a single canonical explanation.
8. Do not claim a fixed DigitalOcean promotion. Preserve the original referral URL only with promotion-neutral wording.

## Proposed sidebar

### Start & Guides (8)
- `get-started` | Fresh installation of a server and first HTTPS app; omit standard UI clicks.
- `installation` | Installation options, supported host requirements and Marketplace path; retain referral link without promising fixed credits.
- `installation/advanced` | Nonstandard installation modes and their real differences and limits.
- `fundamentals/how-caprover-works` | One short architecture explanation. Define unfamiliar Swarm terms inline.
- `production-checklist` | Production readiness checklist, excluding generic filler.
- `guides/complete-webapp` | The tested multi-service tutorial and genuinely useful sample links.
- `guides/static-react` | Static-site deployment example.
- `guides/cdd-migration` | CapRover migration-specific procedure.

### Applications & Deployments (10)
- `applications` | App configuration, settings, and important semantic caveats. Eliminate obvious UI walkthroughs.
- `applications/advanced` | Advanced service-update and pre-deploy controls.
- `deployments` | Common deployment modes, only meaningful required fields.
- `deployments/cli` | CLI deployment walkthrough. Detailed flags in reference.
- `deployments/git` | Git webhook setup and secrets.
- `deployments/captain-definition` | Captain Definition usage/examples. Exact schema in reference.
- `deployments/builds-logs` | Build logs and rollback limits, especially retained data.
- `deployments/registries` | Registry credentials, image names, default-push and cluster requirements.
- `deployments/ci-cd` | Token scope, GitHub and GitLab practical examples, generic CI alternative.
- `deployments/other/docker-compose` | Experimental Compose usage and supported/unsupported fields.

### One-Click Apps (2)
- `one-click-apps` | Managing installed One-Click apps and templates, stateful upgrades and custom repositories.
- `one-click-apps/authoring` | One-Click template authoring with author-specific requirements.

### Domains & Networking (5)
- `domains` | Wildcard/apex DNS, TLS prerequisites, renewals. Remove self-evident Enable HTTPS steps.
- `domains/firewall` | Public and private networking, port table and Docker/UFW pitfalls.
- `domains/advanced-nginx` | NGINX template behavior and advanced routing overrides.
- `domains/advanced-certbot` | Nondefault Certbot/DNS-01 configuration with credential caveats.
- `domains/cloudflare-reverse-proxies` | Cloudflare/reverse-proxy-specific pitfalls.

### Data & Persistence (4)
- `data-persistence` | Volumes, bind mounts, node locality, permissions and moving persistent data.
- `data-persistence/deploy-databases` | Database deployment and internal/external connectivity with host-port/security differences.
- `data-persistence/backup-data` | Back up, restore and move persistent application data separately from server config.
- `data-persistence/shared-storage` | Advanced shared storage, applicability and limitations.

### Server & Clusters (9)
- `server` | Server settings, access/security, Pro and themes as brief headed sections.
- `server/upgrade` | Exact upgrade and recovery requirements.
- `server/backup` | CapRover configuration backups: contents, omissions and automation.
- `server/backup/restore` | Restore ordering, nodes, DNS migration, application-data and image recovery.
- `server/netdata` | Resource monitoring and HTTP analytics.
- `server/disk-cleanup` | Safe disk cleanup and image retention.
- `server/uninstall` | Destructive uninstall with data-loss safeguards.
- `scaling` | Replica count, updates and placement: exact operational caveats.
- `scaling/multi-node` | Cluster setup, manager/worker SSH, networking, registry and node-local persistence.

### Troubleshooting (2)
- `troubleshooting` | Symptom-based checks and specific remedies, support/reporting links.
- `troubleshooting/diagnostics` | One canonical diagnostic collector procedure with privacy safeguards.

### Reference (7)
- `reference/captain-definition` | Captain Definition exact field schema and versioning.
- `reference/app-configuration` | App config, defaults, compatibility notes and limits.
- `reference/cli` | Exact CLI flags and examples.
- `reference/api` | API endpoints, auth and client conventions.
- `reference/server-environment` | Environment variables and config override settings.
- `reference/ports` | Complete CapRover / Swarm port matrix.
- `reference/one-click-schema` | One-Click template schema.

## Audit summary

| Decision | Source pages |
| --- | ---: |
| Retain as canonical | 47 |
| Merge into another retained page | 88 |
| Remove obsolete category landing / glossary after preserving any unique links | 6 |
| **Total** | **141** |

**Merge means extract the useful information, then rewrite.** Simply concatenating old Markdown files would make the docs longer. Sections with zero useful content should disappear, even when an original route receives a redirect.

## Execution

**PR 1: Architecture and inventory (this PR)**
- Agree on the retained list, sidebar grouping, and one-to-one source routing.
- Keep both current `/docs` and `/docs-next` fully untouched.
- Run `node scripts/check-docs-consolidation.mjs`.

**PR 2: Consolidation**
- Rewrite only the 47 canonical pages using the rules above.
- Rebuild the `docs-next` sidebar from the eight sections, without redundant category index pages.
- Add preview redirects for all merged/removed paths.
- Inventory existing incoming URL fragments and preserve anchor aliases where possible.
- Update direct Markdown links; avoid redirect chains.
- Test fresh installation, CI/CD and CLI deploys, DNS/HTTPS, persistent data, restore and multi-node procedures.

**PR 3: Publish (separate explicit approval)**
- Promote the approved preview routes to `/docs`; remove preview duplicate pages and `noindex`.
- Install redirects from original public routes, translated historical `.html` URLs and canonical aliases.
- Update navigation, Algolia, canonical/SEO metadata, sitemaps and edit URLs.
- Run Docusaurus builds for all locales, combined-site smoke test and high-value historical-URL checks.

## High-risk content to retain

- Docker installation and Swarm firewall / registry prerequisites
- Certificate validation on public TCP 80; DNS proxies and wildcard vs apex records
- Docker-published TCP/UDP ports and UFW caveats
- Image vs configuration vs persistent-application-data backups
- Node-local volumes and cluster placement
- Registry credentials, deployment token handling, release and rollback caveats
- Diagnostic collector commands, temporary-container behavior and report privacy

## URL compatibility

- The map's `previewRoutes` covers all 141 current preview pages.
- The map's `legacyEnglishRoutes` covers the 36 English mappings already recorded in DOCS_NEXT_URL_MAP.md.
- PR 2 must validate headings/anchors before inserting preview redirects.
- PR 3 must enumerate historical URLs beyond the existing English list, including localized paths, old `.html` variants and externally linked anchors.
- Keep old public documentation available throughout PR 1 and PR 2.

## Definition of done

- 40–50 meaningful pages across at most eight top-level groups, with at most two sidebar levels.
- Content that is already obvious in the dashboard is removed.
- Every high-value task remains discoverable from the sidebar within two decisions.
- Every old page has an appropriate canonical destination and no redirect chains.
- No meaningful technical facts or warnings are lost.
- Preview builds and public cutover smoke tests are green.

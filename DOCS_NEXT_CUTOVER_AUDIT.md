# Docs-next pre-cutover audit

**Scope:** English legacy documentation, the 47 consolidated English preview pages, and targeted source verification at CapRover 1.15.5. This audit precedes and does not implement the `/docs-next` → `/docs` cutover.

## Results

- **36/36** legacy English documentation routes mapped to a retained consolidated destination.
- **47/47** consolidated pages inventoried; the prior 141→47 consolidation build/link checks passed.
- **One confirmed factual error:** The documentation implied opening `443/udp` enabled HTTP/3. CapRover publishes this UDP port, while its stock [NGINX server template](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs) uses `listen 443 ssl` and `http2 on` without a QUIC listener. [NGINX's documentation](https://nginx.org/en/docs/quic.html) requires an explicitly configured QUIC listener. Corrected in this PR.
- **Material old-content gaps corrected:** Cloudflare deep-subdomain TLS coverage; complete prebuilt-image GitHub workflow; local `.localhost` use; read-only demo; community framework examples; Slack/support contacts; idle connection keepalive advice; restart commands; Pro alert forwarding.
- **Historical rclone volume integration:** Preserved an archived source link and its important setup structure. **Current plugin compatibility remains unverified.** Treat as an intentional limitation, not a supported current deployment recipe.
- **Outdated / potentially unsafe legacy practices remain excluded:** Hidden root-domain security claim, uncorrected OpenStack Heat template, missing CaptainDuckDuck migration script, broad Docker cleanup commands, hard-coded DigitalOcean signup-credit value, and unverified historical paid support SLA.

## Evidence and source checks

| Claim checked | Finding |
| --- | --- |
| Docker published NGINX ports | `LoadBalancerManager.ts` publishes host TCP 80, TCP 443 and UDP 443, but stock NGINX configs lack QUIC listeners |
| Default password / overrides | `Authenticator.ts`, `EnvVars.ts`, and `CaptainConstants.ts` confirm initial password fallback and override keys |
| Swarm image registry | `SystemRouter.ts` and Docker Registry helper confirm default push registry required for multi-node join flow |
| Restore / backup scope | `BackupManager.ts` packages `/captain/data` and cluster metadata; regular Docker volumes outside this path need separate backup |
| Modern deployment Action | [`caprover/deploy-from-github`](https://github.com/caprover/deploy-from-github) v2 supports image, `tar-file`, working-directory and checked-out-source modes |
| CLI environment variables | [`caprover-cli` deploy source](https://github.com/caprover/caprover-cli/blob/master/src/commands/deploy.ts) supports `CAPROVER_APP_TOKEN` |
| Cloudflare Universal SSL | [Cloudflare hostname limits](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/) cover apex and first-level names in a full zone, not deeper subdomains |
| One-Click Apps | Source schema/model and generated app semantics are covered; live template list is dynamic |

## Per-page coverage: legacy `/docs` → consolidated `docs-next`

| Legacy document | Planned canonical `/docs` route | Assessment | Notes |
| --- | --- | --- | --- |
| `get-started` | `/docs/get-started` | Retained | Installation, DNS, CLI/web setup, swap and sample deployment retained. Fixed misleading UDP/HTTP3 guidance. |
| `cdd-migration` | `/docs/guides/cdd-migration` | Adapted | Adapted: legacy migration script is absent upstream. Manual migration documented; old one-line script intentionally excluded. |
| `captain-definition-file` | `/docs/deployments/captain-definition` | Retained | Build selectors, Dockerfiles, images, templates, versions and monorepos retained. |
| `deployment-methods` | `/docs/deployments` | Retained | CLI, dashboard, image, Git webhook, rollback and CI/CD routes retained. |
| `app-configuration` | `/docs/applications` | Retained | App settings, HTTP ports, environment variables, persistence, placement, tags and advanced hooks retained. |
| `persistent-apps` | `/docs/data-persistence` | Retained | Mount paths, node placement, stateful scaling and cleanup retained. |
| `cli-commands` | `/docs/reference/cli` | Retained | Setup, login, deploy flags, list and logout retained; checked against caprover-cli source. |
| `one-click-apps` | `/docs/one-click-apps` | Adapted | Using, connecting, upgrading, custom templates and authoring retained. Legacy static app catalog deliberately replaced by live catalog. |
| `complete-webapp-tutorial` | `/docs/guides/complete-webapp` | Retained | Replaced with runnable PostgreSQL + web + worker + uploads example. |
| `resource-monitoring` | `/docs/server/netdata` | Retained | NetData and GoAccess retained. |
| `nginx-customization` | `/docs/domains/advanced-nginx` | Retained | App/global NGINX templates, shared files and recovery retained. |
| `service-update-override` | `/docs/applications/advanced` | Retained | Schema examples, update order, persistence of overridden fields and limitations retained. |
| `app-scaling-and-cluster` | `/docs/scaling` | Retained | Replicas, registry prerequisites, image distribution, node placement and cluster setup retained. |
| `pre-deploy-script` | `/docs/applications/advanced` | Retained | Hook semantics and security restrictions retained. |
| `play-with-docker` | `/docs/installation` | Retained | Working playground command and read-only homepage demo link retained. |
| `run-locally` | `/docs/installation/advanced` | Retained | Private LAN and router access retained. Restored localhost-specific DNS and Docker Desktop notes. |
| `certbot-config` | `/docs/domains/advanced-certbot` | Retained | DNS-01, custom Certbot command, alternate ACME and CAA guidance retained. Provider-specific recipes require testing. |
| `theme-customization` | `/docs/server` | Retained | Dashboard theme object, head embed and extra configuration retained. |
| `sample-apps` | `/docs/guides/complete-webapp` | Retained | Sample repo retained. Restored historical community Django, Laravel and Phoenix links with maintenance caution. |
| `zero-downtime` | `/docs/scaling` | Retained | Swarm update order, health checks and stateful limitations retained. |
| `database-connection` | `/docs/data-persistence/deploy-databases` | Retained | Private network and external database connection requirements retained. |
| `best-practices` | `/docs/production-checklist` | Adapted | Credentials, backups, CI builds, TLS and NGINX retained. 'Hidden root domain' security-through-obscurity claim deliberately excluded. |
| `backup-and-restore` | `/docs/server/backup` | Retained | Configuration backup scope, self-hosted registry exception, API automation, restore and cluster mapping retained. |
| `recipe-deploy-create-react-app` | `/docs/guides/static-react` | Retained | Modern static-build and archive deployment workflow retained. |
| `stateless-with-persistent-data` | `/docs/data-persistence/shared-storage` | Archived/unvalidated | Partial: full historical rclone plugin recipe remains archived via permanent source link; modern compatibility unverified. See release blocker. |
| `docker-compose` | `/docs/deployments/other/docker-compose` | Retained | Experimental parser fields and unsupported Compose behaviors retained. |
| `ci-cd-integration` | `/docs/deployments/ci-cd` | Retained | App deployment tokens and generic CI flow retained. |
| `ci-cd-integration/deploy-from-github` | `/docs/deployments/ci-cd` | Retained | Restored full GitHub image-build/push/deploy workflow alongside the server-build option. |
| `ci-cd-integration/deploy-from-gitlab` | `/docs/deployments/ci-cd` | Retained | GitLab registry / Docker-in-Docker workflow and alternative webhook retained. |
| `server-purchase/digitalocean` | `/docs/installation` | Retained | Referral URL and Marketplace image retained; fixed-dollar promotion omitted because availability varies. |
| `server-purchase/openstack` | `/docs/installation` | Adapted | Current manual OpenStack steps retained. Old uncorrected Heat template flagged unsafe and not recommended. |
| `disk-cleanup` | `/docs/server/disk-cleanup` | Retained | Image retention, scoped disk cleanup and safe volume handling retained. |
| `firewall` | `/docs/domains/firewall` | Retained | Public/Swarm/registry ports retained. Clarified 443/UDP is published without default QUIC listener. |
| `troubleshooting` | `/docs/troubleshooting` | Retained | App, 502, domain 1107, database timeouts, DNS, restart and diagnostics retained. |
| `troubleshooting-pro` | `/docs/server` | Adapted | OTP recovery, token deploy and alert email-forwarding retained. Historical 24-hour support SLA not reasserted without current confirmation. |
| `support` | `/docs/troubleshooting` | Adapted | GitHub, Slack and commercial support contacts restored. Historical third-party paid consultant listings remain unverified. |

## Critical cutover blocker: translated documentation

The legacy `/docs` has Spanish and Chinese translated Markdown (for example `content/es-ES/docs/get-started.md` and `content/zh-CN/docs/get-started.md`). The `docs-next` plugin currently reads the **same English** `content/en/docs-next` source for every locale. The preview under `/es-ES/docs-next` and `/zh-CN/docs-next` consequently shows English text.

Publishing `docs-next` as the new `/docs` without a locale plan would **remove the translated documentation experience**, even if all English content is accurate. This violates strict content parity.

Choose and explicitly approve one before cutover:

1. Translate the 47 retained docs pages to Spanish and Chinese, with translation coverage checked automatically; **or**
2. Preserve the currently translated legacy content at stable locale-specific routes and clearly link it as archival, while marking new English content as untranslated; then plan a translation migration.

Existing translated legacy pages also contain **stale fixed-credit claims**, so copying their text into the new documentation without review would propagate inaccuracies.

**Do not proceed with PR 3 until this is resolved.**

## What still requires live verification

1. **Production installation:** Fresh Ubuntu 24.04 on AMD64 and ARM64, public DNS, NGINX, Docker and Certbot. No production server was provisioned in this audit.
2. **Restoration:** Actual config+volume recovery and multi-node IP/SSH mapping, including self-hosted registry images.
3. **CI/CD:** Run GitHub and GitLab examples against a real CapRover instance. Syntax and source/API contract checks alone do not guarantee integration success.
4. **Advanced integration:** Custom Certbot DNS plugins, older OpenStack templates, rclone plugin, third-party sample repositories. These depend on external versions and credentials.
5. **Localization parity:** Retain or explicitly archive the existing Spanish and Chinese translations; do not silently substitute English.\n6. **Cutover URL verification:** Current preview redirects and builds are separate from full historical `/docs/*.html`, fragment and localized route preservation. Complete this in the future cutover PR.

## Recommendation

- Merge this audit correction only after CI passes and the editorial diff is reviewed.
- Keep the `/docs-next` preview isolated from production until the above high-value live paths are smoke-tested or explicitly accepted as unverified.
- **Do not represent this audit as a formal guarantee of zero errors.** It identifies observed inaccuracies and meaningful legacy gaps with sources, and separates static checks from runtime acceptance.

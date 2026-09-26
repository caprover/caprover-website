# CapRover Documentation Restructure Implementation Plan

## 1. Objective

Build a new generation of CapRover documentation with a coherent, task-oriented information architecture.

The new documentation will initially coexist with the current documentation:

```text
Current:
https://caprover.com/docs/...

New:
https://caprover.com/docs-next/...
```

Example:

```text
Current:
https://caprover.com/docs/get-started

New:
https://caprover.com/docs-next/get-started
```

The existing `/docs` site must remain functional and unchanged while `/docs-next` is developed and reviewed.

Once `/docs-next` is approved:

1. Freeze the new information architecture.
2. Create a complete mapping from existing `/docs/*` URLs to the new documentation.
3. Map removed or split pages to the closest appropriate new destination.
4. Replace the old documentation with the new documentation.
5. Change the new docs route from `/docs-next` to `/docs`.
6. Add redirects for legacy URLs that no longer exist.
7. Validate important existing external links.

The primary goal is information architecture and usability rather than wholesale rewriting.

---

# 2. Core Principles

## 2.1 Task guides must be self-contained

A task guide must contain every prerequisite needed to complete that task, in the order the user needs it.

Reference pages may provide deeper detail, but users must not need to discover unrelated pages before a workflow succeeds.

Examples:

- Getting Started must open required ports before installation.
- Multi-node setup must configure firewall rules and a default push registry before adding a node.
- External database access must include port mapping and firewall configuration.
- HTTPS setup must establish DNS requirements before certificate issuance.
- Persistent-app setup must explain node-placement consequences before storage is configured.
- Restore instructions must prepare the destination server before restoration begins.

Cross-links should provide additional detail rather than substitute required instructions.

## 2.2 Organize around user goals and product areas

Avoid broad categories such as:

```text
Basics
Do More
Recipes and Tips
Help
```

Users should be able to infer where information lives from the section name.

## 2.3 Task pages and reference pages serve different purposes

Task pages should be sufficient.

Reference pages should be exhaustive.

For example:

- Getting Started should say exactly which ports to open.
- The Firewall reference should document every relevant CapRover and Docker Swarm port.

## 2.4 Troubleshooting belongs beside the feature

Deployment problems belong under Deployments.

DNS and certificate problems belong under Domains & Networking.

Persistent-storage problems belong under Data & Persistence.

The top-level Troubleshooting page should primarily route users to the correct area.

## 2.5 Source code is authoritative

When existing documentation and implementation disagree, verify behavior against `caprover/caprover`.

Do not document speculative, obsolete, or dead functionality.

---

# 3. Parallel Documentation Architecture

## 3.1 Keep the existing docs intact

The current site uses:

```text
content/en/docs
    ↓
Docusaurus docs plugin
    ↓
/docs/*
```

Leave this implementation in place during development.

Do not move, delete, or restructure existing `/docs` content as part of building `/docs-next`.

Existing documentation may be used as source material.

## 3.2 Add a second docs instance

Create a separate documentation tree:

```text
content/en/docs-next
```

and a separate sidebar:

```text
docs-site/sidebars-next.js
```

Configure a second Docusaurus docs plugin instance with a separate plugin ID and:

```text
path: ../content/en/docs-next
routeBasePath: docs-next
```

The existing `sidebars.js` continues to power `/docs`.

The new `sidebars-next.js` powers `/docs-next`.

## 3.3 Design `/docs-next` for easy promotion

The path after `/docs-next/` should already be the intended permanent path.

For example:

```text
Preview:
/docs-next/get-started
/docs-next/applications/environment-variables
/docs-next/deployments/git

Final:
/docs/get-started
/docs/applications/environment-variables
/docs/deployments/git
```

Avoid temporary names such as:

```text
/docs-next/v2-get-started
/docs-next/new-deployments
```

Use explicit slugs where needed.

---

# 4. Required Repository Review

Before writing the new documentation, inspect:

### Website repository

- `caprover/caprover-website`
- current English docs
- `docs-site/docusaurus.config.js`
- `docs-site/sidebars.js`
- localization scripts
- docs UI catalogs
- internal links
- images/assets
- search configuration

### CapRover repository

Use the application implementation as the source of truth.

Important areas include:

```text
src/models/AppDefinition.ts
src/models/ProjectDefinition.ts
src/models/IRegistryInfo.ts
src/models/IProFeatures.ts
src/models/AutomatedCleanupConfigs.ts
src/models/IOneClickAppModels.ts
src/routes/user/
src/user/ServiceManager.ts
src/user/ImageMaker.ts
src/user/DockerRegistryHelper.ts
src/user/system/
src/docker/DockerApi.ts
src/utils/CaptainInstaller.ts
src/utils/CaptainConstants.ts
src/utils/EnvVars.ts
```

Pay particular attention to functionality that exists in code but is missing or weakly represented in the current docs.

---

# 5. Target Information Architecture

See NewContent.md file.

---

# 6. Existing Content Migration Strategy

The existing files remain under:

```text
content/en/docs
```

The new docs are authored separately under:

```text
content/en/docs-next
```

Use the old docs as source material according to this approximate mapping:

| Existing document | New destination |
|---|---|
| `get-started.md` | Start / Getting Started |
| `run-locally.md` | Start / Installation / Local & Private Network |
| `play-with-docker.md` | Start / Installation / Play with Docker |
| `server-purchase/*` | Start / Installation |
| `app-configuration.md` | Split across Applications, Domains & Networking, Data & Persistence, Reference |
| `deployment-methods.md` | Deployments |
| `captain-definition-file.md` | Deployments / Captain Definition |
| `cli-commands.md` | Reference / CLI plus task material under Deployments |
| `ci-cd-integration/*` | Deployments / CI/CD |
| `docker-compose.md` | Deployments / Other Deployment Methods |
| `one-click-apps.md` | One-Click Apps |
| `persistent-apps.md` | Data & Persistence |
| `database-connection.md` | Data & Persistence |
| `stateless-with-persistent-data.md` | Data & Persistence / Shared Storage |
| `app-scaling-and-cluster.md` | Split across Scaling & Clusters and Container Registries |
| `zero-downtime.md` | Scaling & Clusters |
| `service-update-override.md` | Applications / Advanced App Configuration |
| `pre-deploy-script.md` | Applications / Advanced App Configuration |
| `nginx-customization.md` | Domains & Networking |
| `certbot-config.md` | Domains & Networking |
| `firewall.md` | Domains & Networking + Reference |
| `resource-monitoring.md` | Server Administration |
| `disk-cleanup.md` | Server Administration |
| `backup-and-restore.md` | Server Administration |
| `theme-customization.md` | Server Administration |
| `troubleshooting-pro.md` | Server Administration / Pro |
| `troubleshooting.md` | Split into feature-specific troubleshooting |
| `best-practices.md` | Production Checklist + owning product areas |
| `complete-webapp-tutorial.md` | Guides |
| `recipe-deploy-create-react-app.md` | Guides |
| `sample-apps.md` | Guides |
| `cdd-migration.md` | Guides |
| `support.md` | Troubleshooting / Support |

Content can be reused, split, consolidated, or rewritten.

Do not modify the original file merely because its content was incorporated into `/docs-next`.

---

# 7. Documentation Gaps to Address

While building the new docs, inspect and document current code-backed capabilities that are missing or poorly covered.

At minimum investigate:

- Projects
- parent/nested Projects
- app descriptions
- app tags
- HTTP Basic Authentication
- redirect domains
- WebSocket support
- app deployment tokens
- TCP/UDP port protocol
- ingress/host publish mode
- GoAccess
- scheduled disk cleanup
- cleanup timezone
- Pro webhook alerts
- registry image prefixes
- current registry behavior
- current backup semantics
- current node requirements
- server environment variables
- current defaults and limits

Keep these additions scoped.

Do not turn the restructure into an unrelated complete product-documentation rewrite.

---

# 8. Content and Writing Standards

When authoring `/docs-next`:

- lead with the user's goal
- present prerequisites before dependent operations
- use concrete actions
- avoid assuming Docker, Swarm, NGINX, or Certbot expertise
- introduce infrastructure concepts only where they improve understanding
- use CapRover terminology consistently
- keep unnecessary implementation details out of beginner workflows
- clearly mark destructive operations
- clearly mark experimental functionality
- distinguish development/test setups from production
- distinguish CapRover backups from application-data backups
- avoid giant catch-all pages
- avoid duplicating long explanations across pages

Short critical instructions may intentionally be repeated.

For example, the cluster guide should state the required Swarm ports even though the complete list also exists in Reference.

---

# 9. URL Strategy

## 9.1 Preview URLs

During development:

```text
/docs/*
```

remains the current production documentation.

```text
/docs-next/*
```

is the new documentation.

Do not redirect between them.

Do not replace production `/docs` links with `/docs-next` links globally.

## 9.2 Final-intent paths

The path beneath `/docs-next` should already be the intended final path.

Example:

```text
/docs-next/get-started
/docs-next/applications
/docs-next/applications/environment-variables
/docs-next/deployments/git
/docs-next/domains/https
/docs-next/data-persistence/volumes
/docs-next/scaling/multi-node
/docs-next/server/backup
/docs-next/reference/ports
```

These later become:

```text
/docs/get-started
/docs/applications
/docs/applications/environment-variables
...
```

Prefer relative Docusaurus links inside the new docs so links survive the base-path change.

Avoid hardcoding `/docs-next/` in Markdown unless necessary.

## 9.3 Maintain a URL mapping artifact

While building the new docs, maintain a machine-readable or Markdown mapping such as:

| Existing URL | New preview URL | Final URL | Type | Notes |
|---|---|---|---|---|
| `/docs/get-started` | `/docs-next/get-started` | `/docs/get-started` | same path | |
| `/docs/app-configuration` | `/docs-next/applications` | `/docs/applications` | redirect | old page split |
| `/docs/app-scaling-and-cluster` | `/docs-next/scaling` | `/docs/scaling` | redirect | old page split |

Mapping types should include:

- same path
- moved
- split
- removed

Do not create final redirects during the preview stage.

---

# 10. Localization Strategy

Focus on English only. Once everything is confirmed, another agent will take care of localization. 

---

# 11. Search and SEO Strategy

During the coexistence period:

- `/docs` remains the production documentation
- `/docs-next` is a preview
- avoid treating both as permanent canonical content
- avoid duplicate search-index pollution where practical
- keep `/docs-next` directly accessible for review

Before implementation, choose the simplest approach supported by the current Docusaurus setup for preventing the preview docs from becoming competing canonical search results.

At cutover:

- `/docs` becomes the canonical new documentation
- `/docs-next` should no longer exist as duplicate permanent content
- sitemap/search configuration should reflect the new canonical paths

---

# 12. Implementation Plan

See ImplementationContent.md

---

# 13. Validation

## 13.1 Technical validation

Require:

- Docusaurus production build succeeds
- `/docs/*` still works
- `/docs-next/*` works
- no route collisions
- no broken internal links
- no broken images
- no invalid sidebar IDs
- no important orphaned pages
- current localized `/docs` still builds
- new docs links do not unnecessarily point back to old docs

## 13.2 Fresh-install workflow

Starting from:

- a fresh supported Ubuntu server
- a domain
- no CapRover knowledge

Following only `/docs-next/get-started` should result in:

- accessible CapRover dashboard
- correct DNS
- dashboard HTTPS
- deployed application
- application HTTPS

## 13.3 External database workflow

The guide must cover:

- database/service assumptions
- persistent storage
- port mapping
- firewall
- connection details
- security implications

## 13.4 Multi-node workflow

The guide must cover:

- additional-server preparation
- Docker
- networking/firewall
- SSH
- default push registry
- existing-image implications
- node addition
- node verification
- scaling verification
- persistence limitations

## 13.5 Restore workflow

The guide must explain:

- destination-server preparation
- what CapRover backup contains
- what it excludes
- application-data responsibilities
- image/registry implications
- DNS considerations
- multi-node restore behavior

## 13.6 Source-code spot checks

Review documentation against:

- `AppDefinition`
- Projects routes/models
- registry routes/models
- Pro models
- installer
- `BackupManager`
- `DiskCleanupManager`
- `CertbotManager`
- One-Click models
- Docker/Swarm logic

---

# 14. Cutover Plan

See CutoverContent.md

---

# 15. Scope Control

This project is a parallel next-generation documentation build.

Do not:

- change CapRover application behavior
- invent features
- restructure existing `/docs` during preview
- delete existing docs during preview
- redirect `/docs` to `/docs-next`
- rewrite every old page
- refactor unrelated website code
- modify One-Click templates
- change APIs
- remove translations as a shortcut
- perform cutover without explicit approval

If documentation review reveals an application bug, record it separately.

---

# 16. Deliverables

## Before cutover

Deliver:

1. second Docusaurus docs instance
2. `/docs-next/*`
3. `content/en/docs-next`
4. `sidebars-next.js`
5. complete new information architecture
6. category landing pages
7. new task-oriented documentation
8. code-backed missing documentation where appropriate
9. passing production build with both doc systems
10. unchanged existing `/docs/*`
11. old-to-new URL mapping artifact
12. list of intentionally deferred documentation gaps
13. cutover checklist

## At cutover

Deliver:

1. finalized old-to-new mapping
2. new docs promoted to `/docs`
3. old docs implementation removed
4. redirects for changed legacy paths
5. navbar/footer updated
6. search/sitemap updated
7. localization migration completed
8. production build passing
9. legacy URLs validated
10. `/docs-next` removed

---

# 17. Definition of Done

The `/docs-next` preview is ready for approval when users can quickly determine:

- how to install CapRover
- how to deploy an application
- how to configure an application
- how to add a domain
- how to expose a port
- how to persist data
- how to deploy and connect a database
- how to scale an application
- how to add another server
- how to configure a registry
- how to back up CapRover
- how to back up application data
- how to monitor the server
- how to troubleshoot a failed deployment
- where to find exact schemas, defaults, APIs, and ports

A new user must be able to complete `/docs-next/get-started` without consulting the old docs.

An experienced user must be able to navigate directly to the relevant product area or Reference.

The existing `/docs` site must remain operational until explicit cutover approval.

The final documentation should feel like one intentionally designed product manual rather than a chronological collection of feature pages.

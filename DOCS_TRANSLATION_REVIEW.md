# Translation editorial review for PR #247

## Status and release rule

**Editorial review complete.** All 48 canonical English pages have reviewed Spanish and Simplified Chinese translations. The static checks verify that code blocks, command identifiers, link destinations, frontmatter and numeric values are preserved. Full CI builds verify that the localized pages render.

The initial machine-generated drafts contained serious technical errors, including literal mistranslations of Docker terminology and port references. All 96 pages have now received engineer-focused prose review and corrections against the canonical English content, using the terminology guidelines in `content/glossaries/`.

The editorial pass retained CapRover's actual English UI labels, commands and configuration identifiers, while adopting natural wording for Spanish- and Chinese-speaking engineers. The integration build and structural checks are release requirements. This pass is an engineering-oriented editorial review and has not received independent native-speaker sign-off.

- Spanish full editorial rewrites: **48/48**
- Chinese full editorial rewrites: **48/48**
- Both languages covered by automated terminology and structural checks: **48/48 each**.
- Unfinished full prose reviews: **0 Spanish** and **0 Chinese**.

## Coverage

| Canonical English page | Spanish | Chinese |
| --- | --- | --- |
| `get-started` | Reviewed | Reviewed |
| `installation/manual` | Reviewed | Reviewed |
| `installation/index` | Reviewed | Reviewed |
| `installation/advanced/index` | Reviewed | Reviewed |
| `fundamentals/how-caprover-works` | Reviewed | Reviewed |
| `production-checklist` | Reviewed | Reviewed |
| `guides/complete-webapp` | Reviewed | Reviewed |
| `guides/static-react` | Reviewed | Reviewed |
| `guides/cdd-migration` | Reviewed | Reviewed |
| `applications/index` | Reviewed | Reviewed |
| `applications/advanced/index` | Reviewed | Reviewed |
| `deployments/index` | Reviewed | Reviewed |
| `deployments/cli` | Reviewed | Reviewed |
| `deployments/git` | Reviewed | Reviewed |
| `deployments/captain-definition` | Reviewed | Reviewed |
| `deployments/builds-logs` | Reviewed | Reviewed |
| `deployments/registries/index` | Reviewed | Reviewed |
| `deployments/ci-cd/index` | Reviewed | Reviewed |
| `deployments/other/docker-compose` | Reviewed | Reviewed |
| `one-click-apps/index` | Reviewed | Reviewed |
| `one-click-apps/authoring` | Reviewed | Reviewed |
| `domains/index` | Reviewed | Reviewed |
| `domains/firewall` | Reviewed | Reviewed |
| `domains/advanced-nginx` | Reviewed | Reviewed |
| `domains/advanced-certbot` | Reviewed | Reviewed |
| `domains/cloudflare-reverse-proxies` | Reviewed | Reviewed |
| `data-persistence/index` | Reviewed | Reviewed |
| `data-persistence/deploy-databases` | Reviewed | Reviewed |
| `data-persistence/backup-data` | Reviewed | Reviewed |
| `data-persistence/shared-storage` | Reviewed | Reviewed |
| `server/index` | Reviewed | Reviewed |
| `server/upgrade` | Reviewed | Reviewed |
| `server/backup/index` | Reviewed | Reviewed |
| `server/backup/restore` | Reviewed | Reviewed |
| `server/netdata` | Reviewed | Reviewed |
| `server/disk-cleanup` | Reviewed | Reviewed |
| `server/uninstall` | Reviewed | Reviewed |
| `scaling/index` | Reviewed | Reviewed |
| `scaling/multi-node` | Reviewed | Reviewed |
| `troubleshooting/index` | Reviewed | Reviewed |
| `troubleshooting/diagnostics` | Reviewed | Reviewed |
| `reference/captain-definition` | Reviewed | Reviewed |
| `reference/app-configuration` | Reviewed | Reviewed |
| `reference/cli` | Reviewed | Reviewed |
| `reference/api` | Reviewed | Reviewed |
| `reference/server-environment` | Reviewed | Reviewed |
| `reference/ports` | Reviewed | Reviewed |
| `reference/one-click-schema` | Reviewed | Reviewed |

## Terminology decisions

- Prefer familiar engineering terms: Docker Swarm, manager/worker nodes, Docker image, registry, push/pull, build, deploy, rollback, volume, bind mount, and CLI/API/CI/CD.
- Keep CapRover UI labels in English when the product UI is not localized, including **Deployment**, **Container HTTP Port**, and **Service Update Override**.
- Preserve code blocks, shell commands, Docker image names, URLs, credentials placeholders, variables, links, port numbers and warnings.
- For Spanish, use natural imperative instructions and engineering words such as *despliegue*, *build*, *registro de imágenes*, *nodo manager*, *nodo worker*.
- For Chinese, use natural technical terms 构建、部署、容器、镜像、镜像仓库、持久化数据、节点, retaining Docker Swarm and technical product names.

## Follow-up maintenance

Keep the locale pages in sync with future changes to canonical English documentation. All pages have received a prose review for technical accuracy and developer terminology; an independent native-speaker editorial sign-off remains optional and is not claimed here. Before release, require the site-integration workflow and translation integrity checks to pass.

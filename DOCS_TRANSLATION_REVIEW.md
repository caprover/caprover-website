# Translation editorial review for PR #247

## Status and release rule

**The PR must remain in draft.** All 48 English pages have Spanish and Chinese drafts. The static checks verify that code blocks, command identifiers, link destinations, frontmatter and numeric values are preserved. Full CI builds verify that the localized pages render.

Automated machine translation originally produced serious technical inaccuracies, such as Docker Swarm becoming “沼泽,” Docker images becoming “集装箱,” and an incorrectly shortened TCP port. A repository-wide terminology cleanup was applied using the engineering glossaries in `content/glossaries/`.

**Machine-normalized pages are not yet accepted as editorially accurate.** A static build cannot prove that the translated instructions are semantically correct. Full prose reviews compare each page against the original English, retain exact UI labels, correct syntax/grammar and check operational and security details. No page should be treated as complete solely because CI is green.

- Spanish full editorial rewrites: **7/48**
- Chinese full editorial rewrites: **9/48**
- Both languages covered by automated terminology and structural checks: **48/48 each**.
- Unfinished full prose reviews: **41 Spanish** and **39 Chinese**.

## Coverage

| Canonical English page | Spanish | Chinese |
| --- | --- | --- |
| `get-started` | Reviewed | Reviewed |
| `installation/manual` | Terminology QA only | Reviewed |
| `installation/index` | Terminology QA only | Terminology QA only |
| `installation/advanced/index` | Terminology QA only | Terminology QA only |
| `fundamentals/how-caprover-works` | Terminology QA only | Reviewed |
| `production-checklist` | Terminology QA only | Terminology QA only |
| `guides/complete-webapp` | Terminology QA only | Terminology QA only |
| `guides/static-react` | Terminology QA only | Terminology QA only |
| `guides/cdd-migration` | Terminology QA only | Terminology QA only |
| `applications/index` | Terminology QA only | Terminology QA only |
| `applications/advanced/index` | Terminology QA only | Terminology QA only |
| `deployments/index` | Terminology QA only | Terminology QA only |
| `deployments/cli` | Terminology QA only | Terminology QA only |
| `deployments/git` | Terminology QA only | Terminology QA only |
| `deployments/captain-definition` | Terminology QA only | Terminology QA only |
| `deployments/builds-logs` | Terminology QA only | Terminology QA only |
| `deployments/registries/index` | Terminology QA only | Terminology QA only |
| `deployments/ci-cd/index` | Reviewed | Reviewed |
| `deployments/other/docker-compose` | Terminology QA only | Terminology QA only |
| `one-click-apps/index` | Reviewed | Reviewed |
| `one-click-apps/authoring` | Terminology QA only | Terminology QA only |
| `domains/index` | Terminology QA only | Terminology QA only |
| `domains/firewall` | Terminology QA only | Terminology QA only |
| `domains/advanced-nginx` | Terminology QA only | Terminology QA only |
| `domains/advanced-certbot` | Terminology QA only | Terminology QA only |
| `domains/cloudflare-reverse-proxies` | Terminology QA only | Terminology QA only |
| `data-persistence/index` | Terminology QA only | Terminology QA only |
| `data-persistence/deploy-databases` | Terminology QA only | Terminology QA only |
| `data-persistence/backup-data` | Terminology QA only | Terminology QA only |
| `data-persistence/shared-storage` | Terminology QA only | Terminology QA only |
| `server/index` | Terminology QA only | Terminology QA only |
| `server/upgrade` | Terminology QA only | Terminology QA only |
| `server/backup/index` | Terminology QA only | Terminology QA only |
| `server/backup/restore` | Reviewed | Reviewed |
| `server/netdata` | Terminology QA only | Terminology QA only |
| `server/disk-cleanup` | Terminology QA only | Terminology QA only |
| `server/uninstall` | Terminology QA only | Terminology QA only |
| `scaling/index` | Terminology QA only | Terminology QA only |
| `scaling/multi-node` | Reviewed | Reviewed |
| `troubleshooting/index` | Reviewed | Reviewed |
| `troubleshooting/diagnostics` | Terminology QA only | Terminology QA only |
| `reference/captain-definition` | Terminology QA only | Terminology QA only |
| `reference/app-configuration` | Terminology QA only | Terminology QA only |
| `reference/cli` | Terminology QA only | Terminology QA only |
| `reference/api` | Terminology QA only | Terminology QA only |
| `reference/server-environment` | Terminology QA only | Terminology QA only |
| `reference/ports` | Reviewed | Reviewed |
| `reference/one-click-schema` | Terminology QA only | Terminology QA only |

## Terminology decisions

- Prefer familiar engineering terms: Docker Swarm, manager/worker nodes, Docker image, registry, push/pull, build, deploy, rollback, volume, bind mount, and CLI/API/CI/CD.
- Keep CapRover UI labels in English when the product UI is not localized, including **Deployment**, **Container HTTP Port**, and **Service Update Override**.
- Preserve code blocks, shell commands, Docker image names, URLs, credentials placeholders, variables, links, port numbers and warnings.
- For Spanish, use natural imperative instructions and engineering words such as *despliegue*, *build*, *registro de imágenes*, *nodo manager*, *nodo worker*.
- For Chinese, use natural technical terms 构建、部署、容器、镜像、镜像仓库、持久化数据、节点, retaining Docker Swarm and technical product names.

## Pending

Review the remaining pages' full prose and check it against English source, then update this matrix. Preserve the PR's draft state until every entry has been reviewed and verified. The 16 reviewed pages above have undergone a targeted complete rewrite, not a native-speaker external sign-off.

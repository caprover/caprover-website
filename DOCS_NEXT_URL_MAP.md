# Documentation URL mapping (draft)

This is the working map for the English `/docs/*` URLs. The preview URLs are for review only. Final redirects are created after the new information architecture is approved; no redirects are active during preview. Translated and historic `.html` URLs must be enumerated separately during cutover.

| Existing URL | Preview URL | Final URL | Type | Notes |
|---|---|---|---|---|
| `/docs/get-started` | `/docs-next/get-started` | `/docs/get-started` | same path | Primary workflow |
| `/docs/cdd-migration` | `/docs-next/guides/cdd-migration` | `/docs/guides/cdd-migration` | moved | |
| `/docs/captain-definition-file` | `/docs-next/deployments/captain-definition` | `/docs/deployments/captain-definition` | split | Schema also in Reference |
| `/docs/deployment-methods` | `/docs-next/deployments` | `/docs/deployments` | split | Task-specific deployment pages |
| `/docs/app-configuration` | `/docs-next/applications` | `/docs/applications` | split | Apps, domains, networking, persistence, and reference |
| `/docs/persistent-apps` | `/docs-next/data-persistence/stateless-persistent` | `/docs/data-persistence/stateless-persistent` | split | Additional storage and placement pages |
| `/docs/cli-commands` | `/docs-next/reference/cli` | `/docs/reference/cli` | split | Deployment tasks under Deployments |
| `/docs/one-click-apps` | `/docs-next/one-click-apps` | `/docs/one-click-apps` | same path | Expanded product area |
| `/docs/complete-webapp-tutorial` | `/docs-next/guides/complete-webapp` | `/docs/guides/complete-webapp` | moved | |
| `/docs/resource-monitoring` | `/docs-next/server/netdata` | `/docs/server/netdata` | moved | |
| `/docs/nginx-customization` | `/docs-next/domains/advanced-nginx` | `/docs/domains/advanced-nginx` | moved | |
| `/docs/service-update-override` | `/docs-next/applications/advanced/service-update-override` | `/docs/applications/advanced/service-update-override` | moved | |
| `/docs/app-scaling-and-cluster` | `/docs-next/scaling` | `/docs/scaling` | split | Scaling, cluster setup, and registry pages |
| `/docs/pre-deploy-script` | `/docs-next/applications/advanced/pre-deploy-function` | `/docs/applications/advanced/pre-deploy-function` | moved | |
| `/docs/play-with-docker` | `/docs-next/installation/play-with-docker` | `/docs/installation/play-with-docker` | moved | |
| `/docs/run-locally` | `/docs-next/installation/local-private-network` | `/docs/installation/local-private-network` | moved | |
| `/docs/certbot-config` | `/docs-next/domains/advanced-certbot` | `/docs/domains/advanced-certbot` | moved | |
| `/docs/theme-customization` | `/docs-next/server/themes` | `/docs/server/themes` | moved | |
| `/docs/sample-apps` | `/docs-next/guides/sample-apps` | `/docs/guides/sample-apps` | moved | |
| `/docs/zero-downtime` | `/docs-next/scaling/zero-downtime` | `/docs/scaling/zero-downtime` | moved | |
| `/docs/database-connection` | `/docs-next/data-persistence/deploy-databases` | `/docs/data-persistence/deploy-databases` | split | Internal and external connection guides |
| `/docs/best-practices` | `/docs-next/production-checklist` | `/docs/production-checklist` | split | Details also live with each feature |
| `/docs/backup-and-restore` | `/docs-next/server/backup` | `/docs/server/backup` | split | CapRover configuration and app-data backup |
| `/docs/recipe-deploy-create-react-app` | `/docs-next/guides/static-react` | `/docs/guides/static-react` | moved | |
| `/docs/stateless-with-persistent-data` | `/docs-next/data-persistence/shared-storage` | `/docs/data-persistence/shared-storage` | moved | |
| `/docs/docker-compose` | `/docs-next/deployments/other/docker-compose` | `/docs/deployments/other/docker-compose` | moved | Experimental |
| `/docs/ci-cd-integration` | `/docs-next/deployments/ci-cd` | `/docs/deployments/ci-cd` | split | Provider-specific pages |
| `/docs/ci-cd-integration/deploy-from-github` | `/docs-next/deployments/ci-cd/github-actions` | `/docs/deployments/ci-cd/github-actions` | moved | |
| `/docs/ci-cd-integration/deploy-from-gitlab` | `/docs-next/deployments/ci-cd/gitlab-ci` | `/docs/deployments/ci-cd/gitlab-ci` | moved | |
| `/docs/server-purchase/digitalocean` | `/docs-next/installation/digitalocean` | `/docs/installation/digitalocean` | moved | |
| `/docs/server-purchase/openstack` | `/docs-next/installation/openstack` | `/docs/installation/openstack` | moved | |
| `/docs/disk-cleanup` | `/docs-next/server/disk-cleanup` | `/docs/server/disk-cleanup` | moved | |
| `/docs/firewall` | `/docs-next/domains/firewall` | `/docs/domains/firewall` | split | Complete port table also in Reference |
| `/docs/troubleshooting` | `/docs-next/troubleshooting` | `/docs/troubleshooting` | split | New page routes to feature troubleshooting |
| `/docs/troubleshooting-pro` | `/docs-next/server/pro` | `/docs/server/pro` | moved | Pro-specific issues also in Diagnostics |
| `/docs/support` | `/docs-next/troubleshooting/support` | `/docs/troubleshooting/support` | moved | |

No legacy URLs are classified as intentionally removed yet. Recheck every destination, anchor, and localized URL before cutover.

/** @type {import("@docusaurus/plugin-content-docs").SidebarsConfig} */
const sidebars = {
  "preview": [
    {
      "type": "category",
      "label": "Start",
      "link": {
        "type": "doc",
        "id": "index"
      },
      "items": [
        "get-started",
        {
          "type": "category",
          "label": "Installation",
          "link": {
            "type": "doc",
            "id": "installation/index"
          },
          "items": [
            "installation/standard-vps",
            "installation/digitalocean",
            "installation/openstack",
            "installation/local-private-network",
            "installation/play-with-docker",
            {
              "type": "category",
              "label": "Advanced Installation",
              "link": {
                "type": "doc",
                "id": "installation/advanced/index"
              },
              "items": [
                "installation/advanced/custom-host-ports",
                "installation/advanced/reverse-proxy",
                "installation/advanced/existing-swarm"
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Fundamentals",
          "link": {
            "type": "doc",
            "id": "fundamentals/index"
          },
          "items": [
            "fundamentals/how-caprover-works",
            "fundamentals/applications-and-services",
            "fundamentals/builds-images-deployments",
            "fundamentals/networking",
            "fundamentals/persistence",
            "fundamentals/docker-swarm"
          ]
        },
        "production-checklist"
      ]
    },
    {
      "type": "category",
      "label": "Applications",
      "link": {
        "type": "doc",
        "id": "applications/index"
      },
      "items": [
        "applications/create-manage",
        "applications/projects",
        "applications/environment-variables",
        "applications/http-settings",
        "applications/public-ports",
        "applications/tags-descriptions",
        "applications/scaling-placement",
        "applications/persistent-directories",
        {
          "type": "category",
          "label": "Advanced App Configuration",
          "link": {
            "type": "doc",
            "id": "applications/advanced/index"
          },
          "items": [
            "applications/advanced/custom-nginx",
            "applications/advanced/service-update-override",
            "applications/advanced/pre-deploy-function"
          ]
        },
        "applications/troubleshooting"
      ]
    },
    {
      "type": "category",
      "label": "Deployments",
      "link": {
        "type": "doc",
        "id": "deployments/index"
      },
      "items": [
        "deployments/cli",
        "deployments/dashboard",
        "deployments/git",
        "deployments/docker-image",
        "deployments/captain-definition",
        "deployments/builds-logs",
        "deployments/versions-rollback",
        {
          "type": "category",
          "label": "Container Registries",
          "link": {
            "type": "doc",
            "id": "deployments/registries/index"
          },
          "items": [
            "deployments/registries/private",
            "deployments/registries/default-push",
            "deployments/registries/self-hosted"
          ]
        },
        {
          "type": "category",
          "label": "CI/CD",
          "link": {
            "type": "doc",
            "id": "deployments/ci-cd/index"
          },
          "items": [
            "deployments/ci-cd/deployment-tokens",
            "deployments/ci-cd/github-actions",
            "deployments/ci-cd/gitlab-ci",
            "deployments/ci-cd/generic"
          ]
        },
        {
          "type": "category",
          "label": "Other Deployment Methods",
          "link": {
            "type": "doc",
            "id": "deployments/other/index"
          },
          "items": [
            "deployments/other/docker-compose"
          ]
        },
        "deployments/troubleshooting"
      ]
    },
    {
      "type": "category",
      "label": "One-Click Apps",
      "link": {
        "type": "doc",
        "id": "one-click-apps/index"
      },
      "items": [
        "one-click-apps/install",
        "one-click-apps/configure",
        "one-click-apps/connect",
        "one-click-apps/upgrade",
        "one-click-apps/custom-repositories",
        "one-click-apps/troubleshooting",
        "one-click-apps/authoring"
      ]
    },
    {
      "type": "category",
      "label": "Domains & Networking",
      "link": {
        "type": "doc",
        "id": "domains/index"
      },
      "items": [
        "domains/root-domain",
        "domains/app-domains",
        "domains/custom-domains",
        "domains/https",
        "domains/certificate-renewal",
        "domains/internal-networking",
        "domains/public-services",
        "domains/firewall",
        "domains/nginx-routing",
        "domains/advanced-nginx",
        "domains/advanced-certbot",
        "domains/cloudflare-reverse-proxies",
        "domains/troubleshooting"
      ]
    },
    {
      "type": "category",
      "label": "Data & Persistence",
      "link": {
        "type": "doc",
        "id": "data-persistence/index"
      },
      "items": [
        "data-persistence/stateless-persistent",
        "data-persistence/volumes",
        "data-persistence/bind-mounts",
        "data-persistence/node-placement",
        "data-persistence/deploy-databases",
        "data-persistence/internal-databases",
        "data-persistence/external-databases",
        "data-persistence/shared-storage",
        "data-persistence/backup-data",
        "data-persistence/move-data",
        "data-persistence/troubleshooting"
      ]
    },
    {
      "type": "category",
      "label": "Scaling & Clusters",
      "link": {
        "type": "doc",
        "id": "scaling/index"
      },
      "items": [
        "scaling/scale-app",
        "scaling/zero-downtime",
        "scaling/multi-node",
        "scaling/manage-nodes",
        "scaling/placement",
        "scaling/persistent-apps",
        "scaling/networking",
        "scaling/troubleshooting"
      ]
    },
    {
      "type": "category",
      "label": "Server Administration",
      "link": {
        "type": "doc",
        "id": "server/index"
      },
      "items": [
        "server/settings",
        "server/upgrade",
        {
          "type": "category",
          "label": "Backup & Restore CapRover",
          "link": {
            "type": "doc",
            "id": "server/backup/index"
          },
          "items": [
            "server/backup/contents",
            "server/backup/create",
            "server/backup/automate",
            "server/backup/restore",
            "server/backup/multi-node-restore"
          ]
        },
        "server/move-server",
        "server/netdata",
        "server/goaccess",
        "server/disk-cleanup",
        "server/security",
        "server/pro",
        "server/themes",
        "server/diagnostics",
        "server/uninstall"
      ]
    },
    {
      "type": "category",
      "label": "Guides",
      "link": {
        "type": "doc",
        "id": "guides/index"
      },
      "items": [
        "guides/complete-webapp",
        "guides/static-react",
        "guides/sample-apps",
        "guides/home-server",
        "guides/persistent-storage",
        "guides/cdd-migration",
        "guides/recipes"
      ]
    },
    {
      "type": "category",
      "label": "Troubleshooting",
      "link": {
        "type": "doc",
        "id": "troubleshooting/index"
      },
      "items": [
        "troubleshooting/diagnostics",
        "troubleshooting/support",
        "troubleshooting/report-bug"
      ]
    },
    {
      "type": "category",
      "label": "Reference",
      "link": {
        "type": "doc",
        "id": "reference/index"
      },
      "items": [
        "reference/captain-definition",
        "reference/app-configuration",
        "reference/cli",
        "reference/api",
        "reference/server-environment",
        "reference/config-override",
        "reference/ports",
        "reference/docker-compose",
        "reference/one-click-schema",
        "reference/backup-contents",
        "reference/defaults-limits",
        "reference/glossary",
        "reference/legacy-compatibility"
      ]
    }
  ]
};

module.exports = sidebars;

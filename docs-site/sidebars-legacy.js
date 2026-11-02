/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "category",
      label: "Basics",
      items: [
        "get-started",
        "cdd-migration",
        "captain-definition-file",
        "deployment-methods",
        "app-configuration",
        "persistent-apps",
        "cli-commands",
        "one-click-apps",
        "complete-webapp-tutorial",
      ],
    },
    {
      type: "category",
      label: "Do More",
      items: [
        "resource-monitoring",
        "nginx-customization",
        "service-update-override",
        "app-scaling-and-cluster",
        "pre-deploy-script",
        "play-with-docker",
        "run-locally",
        "certbot-config",
        "theme-customization",
      ],
    },
    {
      type: "category",
      label: "Recipes and Tips",
      items: [
        "sample-apps",
        "zero-downtime",
        "database-connection",
        "best-practices",
        "backup-and-restore",
        "recipe-deploy-create-react-app",
        "stateless-with-persistent-data",
        "docker-compose",
        {
          type: "category",
          label: "CI/CD Integration",
          items: [
            "ci-cd-integration",
            "ci-cd-integration/deploy-from-github",
            "ci-cd-integration/deploy-from-gitlab",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Help",
      items: [
        {
          type: "category",
          label: "Server Purchase",
          items: [
            "server-purchase/digitalocean",
            "server-purchase/openstack",
          ],
        },
        "disk-cleanup",
        "firewall",
        "troubleshooting",
        "troubleshooting-pro",
        "support",
      ],
    },
  ],
};

module.exports = sidebars;

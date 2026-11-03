---
id: index
title: One-Click Apps
slug: /one-click-apps
---

<span id="source-one-click-apps-install"></span>

## Installation

One-Click templates create ordinary CapRover apps. Each template may provision multiple services.

- Check the template's required variables, images, exposed ports, volumes, and post-install instructions.
- Use unique database and administrator credentials.
- Persistent services need **separate application-data backups**. CapRover configuration backups do not contain database volumes.
- The live dashboard catalog is the source of current templates and versions.

<span id="source-one-click-apps-configure"></span>

<span id="configuration-settings"></span>

## Configuration

- Generated apps can be configured using their usual CapRover app settings.
- Some variables, such as initial database passwords, apply **only on first startup**. Later environment-variable changes do not necessarily update existing database users.

<span id="source-one-click-apps-connect"></span>

## Connecting services

- Internal connection example: `postgres:5432` (use the actual generated service name and listening port).
- For legacy apps, the `srv-captain--` service alias may still work.
- Store credentials in the consuming app's environment settings.
- For clients outside CapRover, see [External database connections](../data-persistence/deploy-databases.md).

<span id="source-one-click-apps-upgrade"></span>

<span id="upgrading-one-click-apps"></span>

## Upgrades

For apps that support an image-only upgrade, follow the upstream instructions for any required backups or migrations. If the template uses a custom image or initialization scripts, check how the upgrade will preserve that configuration.

In the app’s **Deployment** tab, open **Method 6: Deploy via ImageName**, enter the new image and tag, and deploy.

<span id="source-one-click-apps-custom-repositories"></span>

## Custom repositories

CapRover can load templates from third-party One-Click repositories.

- Review templates before deployment: they can run images, open ports, mount storage, and configure credentials.
- Record which repository supplied your installed app for future upgrades.
- See [Authoring One-Click Apps](authoring.md) to create a template.

<span id="source-one-click-apps-troubleshooting"></span>

## Troubleshooting

Identify the failing generated service. Inspect its logs and check:

- Template variables, image pull/build errors, and credentials.
- Port exposure, internal service names, volume mounts, and placement.
- Whether a database unexpectedly started with an empty node-local volume.

Preserve stateful volumes during investigation. Share redacted service logs, template name, and image versions when asking for help.

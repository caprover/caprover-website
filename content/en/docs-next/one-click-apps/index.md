---
id: index
title: One-Click Apps
slug: /one-click-apps
---

<span id="source-one-click-apps-install"></span>

## Install a One-Click App

- Open **One-Click Apps** in the dashboard, search the current catalog, and choose a template.
- Read its description, required variables, image versions, exposed ports, and start/end instructions before deploying.
- The catalog changes independently of this documentation, so use the template shown in your dashboard as the immediate source.

- Provide unique credentials for databases and admin accounts.
- Choose persistent storage for services that keep data, confirm the container paths and node placement, then deploy.
- Wait for every generated service to become healthy and follow any post-install instructions displayed by the template.

- Inspect the resulting apps individually under **Apps**.
- Verify their domains, HTTPS, persistent directories, and backup needs.
- A one-click template is a way to create CapRover apps; the generated services still require ordinary operations and recovery planning.

<span id="source-one-click-apps-configure"></span>

## Configure Installed Services

- A One-Click installation creates ordinary CapRover apps.
- Open each generated app's configuration to inspect its environment variables, storage, network exposure, domains, and deployment history.
- Change runtime settings using the app controls, then verify the service starts and retains its data.

- Some template variables initialize a service **only on first startup**.
- Example: changing a database's initial password environment variable later may not change an already-created database user.
- Follow that product's own password-change procedure, update dependent apps, and test the connection.

Before changing a stateful service, back up its application data. A CapRover configuration backup cannot recover a lost database volume by itself.

<span id="source-one-click-apps-connect"></span>

## Connect One-Click Services

- One-Click services are CapRover apps on its Docker network.
- Another app can normally connect by the service's app name and internal container port, such as `postgres:5432`, without exposing a database port publicly.
- Store its connection credentials in the consumer app's configuration.

- Confirm the installed template's actual app name and listen port.
- For legacy apps, a `srv-captain--` network alias may remain available.
- Verify a query or health check from the consumer, then back up the database's volume.

For a client outside CapRover, follow [Connect to Databases Externally](../data-persistence/deploy-databases.md). That workflow includes the port mapping, firewall restrictions, and transport security a public connection requires.

<span id="source-one-click-apps-upgrade"></span>

## Upgrade One-Click Apps

- One-Click Apps do not all share an upgrade procedure.
- Identify the installed app's image, generated configuration, persistent storage, and upstream application's migration requirements first.
- Back up its data and test a restore.

- For a simple image-only service, deploy a tested newer image tag through the app's **Deployment** tab and verify logs and data afterward.
- Some templates build a customized image or require initialization steps, so replacing the image with the upstream base image can discard important behavior.
- Products such as WordPress or databases may also require an application-level or schema upgrade.

- Do not delete and recreate a stateful app as a routine upgrade path.
- If recreation is necessary, preserve the actual named volumes, confirm the new app mounts them correctly, and test on a copy before touching production.

<span id="source-one-click-apps-custom-repositories"></span>

## Custom One-Click Repositories

CapRover can load One-Click templates from a repository other than its default catalog. Add a trusted repository through the One-Click Apps settings, then browse its templates in the dashboard.

- Templates can create services, set environment values, publish ports, mount storage, and run image builds.
- Review the source repository and the exact template before deploying it, especially credentials, default image tags, and public exposure.
- Keep track of which repository supplied an installed app so future upgrades can be evaluated against that template's changes.

To create your own template, see [Authoring One-Click Apps](authoring.md).

<span id="source-one-click-apps-troubleshooting"></span>

## Troubleshooting

- Identify which generated app failed and whether the error occurred while rendering the template, pulling/building an image, starting the service, or connecting related services.
- Inspect that app's deployment and service logs rather than treating the template as one opaque unit.

- Check required template variables, image availability, stored credentials, volume permissions, and the internal service names/ports used by dependent apps.
- A service may start with an empty database after a placement change because its local volume did not move with it.

Preserve volumes while investigating a stateful installation. Include the template name and repository, installed image tag, affected app names, and redacted logs when seeking support.

---
id: index
title: Applications
slug: /applications
---

## Create and Manage Apps {source-applications-create-manage}

- In the dashboard, open **Apps**, enter a name, and create the app.
- Choose whether it has persistent data at creation.
- CapRover registers the app and initially deploys a placeholder image; deploy your own source or image from the app's **Deployment** tab.

- Open the app's configuration to change its description, project, tags, environment variables, HTTP behavior, instance count, ports, or placement.
- Save the relevant settings and verify the service remains healthy after any change that updates Docker or NGINX.
- For source code or image deployment methods, see [Deployments](../deployments/index.md).

- Deleting an app removes its CapRover-managed service and settings.
- Before deletion, identify any Docker volumes, bind-mounted files, or external database state you must preserve.
- Back up that data separately and verify the app's consumers no longer depend on its domains or ports.

## Organize Apps with Projects {source-applications-projects}

- Projects organize apps in the dashboard.
- A project has a name and optional description, and can have a parent project.
- An app can be assigned to a project; the backend checks that the selected project exists before saving the app's configuration.

- Create a project in the dashboard's Projects area, optionally choose a parent, then assign apps to it from the app settings.
- Use a hierarchy that helps your operators find related services, such as `Production → Payments`.
- Project membership is an organizational attribute of the app rather than a separate Docker network or access boundary.

Review any apps and nested projects before deleting a project. Project deletion changes organization, not the need to back up or migrate those apps and their data.

## Environment Variables {source-applications-environment-variables}

### Set runtime variables

1. Open your app in the dashboard.
2. Under **Environment Variables**, add the key/value pairs.
3. Save and verify that the service starts.

Example in Node.js: `process.env.DATABASE_URL`.

**Important:**

- Keep passwords out of the repository and `captain-definition` files.
- Protect dashboard access and backups. App configuration may contain secrets.
- Image rollback preserves the current runtime variables.

### Build-time variables

For Dockerfile builds, use `ARG` and `ENV` for nonsecret build values:

```dockerfile
ARG PUBLIC_BUILD_VALUE
ENV PUBLIC_BUILD_VALUE=${PUBLIC_BUILD_VALUE}
```

- CapRover provides `CAPROVER_GIT_COMMIT_SHA` during source builds.
- Build-time values may become part of the image. Keep secrets out.
- Inspect the deployed service configuration when debugging variable changes.

## HTTP Settings {source-applications-http-settings}

### Web apps

- Requests reach your app through CapRover's NGINX.
- Set **Container HTTP Port** to the port your process listens on (often `80` for NGINX).
- Bind the app to `0.0.0.0` inside the container.

### Domains and HTTPS

- Default hostname: `<app-name>.<root-domain>`
- Custom domains: Point DNS to the server, then add the domain.
- HTTPS: Verify DNS and ports 80/443, enable HTTPS, then enable **Force HTTPS**.

See [App Domains](../domains/index.md#source-domains-app-domains) and [HTTPS](../domains/index.md#source-domains-https).

### Other options

- **Private services:** Select **Do not expose as web app** for workers and private databases.
- **WebSocket:** Enable support where required by the app.
- **HTTP Basic Authentication:** Restricts access to HTTP endpoints. Keep application permissions configured separately.
- **Redirect domains:** Sends incoming requests to another domain. Verify the destination first.

## Tags and Descriptions {source-applications-tags-descriptions}

- Add an app description to explain its purpose and operational owner.
- Add tags when you want to group or filter services in the dashboard.
- Both are stored with the app definition; they do not change its Docker networking, resource isolation, or deployment behavior.

- Projects give apps a nested organizational location.
- Tags can cut across that hierarchy, such as `customer-facing`, `staging`, or a team name.
- Keep names consistent so other operators can find an app quickly.
- See [Organize Apps with Projects](index.md#source-applications-projects).

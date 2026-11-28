---
id: index
title: Applications
slug: /applications
---

<span id="source-applications-create-manage"></span>

## Application settings

- **Web app:** CapRover routes requests through NGINX to the configured container HTTP port.
- **Private service:** Select **Do not expose as web app** for workers or databases without an HTTP endpoint.
- **Listen address:** Your web process should bind to `0.0.0.0` inside the container.
- **Delete app:** Back up any Docker volumes, bind mounts, or external data first. Removing the app does not constitute a backup.

For source/image deployment options, see [Deployments](../deployments/index.md).

<span id="source-applications-projects"></span>

## Projects

- Organize apps into projects and nested projects.
- Projects are organizational only. They provide no network isolation or access boundary.

<span id="source-applications-tags-descriptions"></span>

## Tags and descriptions

- Descriptions and tags make apps easier to find.
- Tags can span projects; neither setting changes networking, deployment, or isolation.

<span id="source-applications-environment-variables"></span>

## Environment variables

- Runtime variables are stored with the app's service configuration.
- An image rollback does **not** restore older variable values.
- App configuration and CapRover backups may contain secrets. Keep credentials out of the repository and `captain-definition` files.

For nonsecret Dockerfile build arguments:

```dockerfile
ARG PUBLIC_BUILD_VALUE
ENV PUBLIC_BUILD_VALUE=${PUBLIC_BUILD_VALUE}
```

CapRover also provides `CAPROVER_GIT_COMMIT_SHA` during source builds. Build values may be embedded in the resulting image.

<span id="source-applications-http-settings"></span>

## HTTP settings

- **Default domain:** `<app-name>.<root-domain>`. See [Domains & HTTPS](../domains/index.md).
- **Container HTTP Port:** Must match the port the process listens on.
- **HTTP Basic Authentication:** Restricts HTTP access; application-specific user authorization remains separate.
- **Redirect domains:** Confirm the destination hostname is reachable before enabling redirects.
- **Public TCP/UDP ports:** Use explicit published port mappings. See [Firewall & Networking](../domains/firewall.md).

---
id: index
title: Advanced App Configuration
slug: /applications/advanced
---

<span id="source-applications-advanced-service-update-override"></span>

## Service Update Override

- The **Service Update Override** field merges JSON or YAML settings into the Docker service update that CapRover prepares when an app is configured or deployed.
- It is useful for Docker service options that the dashboard does not expose.
- Start with the smallest possible override:

```yaml
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes: 104857600
```

- This example limits the service to 100 MiB of memory.
- Verify the value with `docker service inspect SERVICE_NAME`; obtain the actual name from `docker service ls`.
- Test under realistic load before keeping a limit.

- The update order is CapRover's normal settings, then the service override, then the optional pre-deploy function.
- An override can replace a setting CapRover chose.
- Values must match Docker's service update API.
- Removing an override does not necessarily clear a Docker field that CapRover itself does not manage; explicitly reset the value when undoing such a change.

- Keep a copy of the working service settings.
- An invalid or contradictory override can block deployments.
- See [Docker's service update API](https://docs.docker.com/reference/api/engine/) for the schema used by the Docker version running your server.

<span id="source-applications-advanced-pre-deploy-function"></span>

## Pre-Deploy Function

- A **Pre-Deploy Function** is JavaScript executed inside the CapRover process before an app's Docker service update.
- It can inspect the stored app object and modify the service update object.
- It runs after the standard app settings and Service Update Override have been applied.

```javascript
var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
  return Promise.resolve(dockerUpdateObject);
};
```

- The function must return the service update object, possibly through a promise.
- It executes again on deployments and configuration updates.
- Test it against a disposable app before using it for important services, and preserve a working copy of the function and service configuration.

- This code has the privileges of the CapRover process.
- It can break service updates or access sensitive data, so restrict who can edit it.
- For static service fields, prefer a [Service Update Override](index.md#source-applications-advanced-service-update-override).
- Check `docker service logs captain-captain` if a service update fails before reaching Docker.

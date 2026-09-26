---
id: service-update-override
title: Service Update Override
slug: /applications/advanced/service-update-override
---

The **Service Update Override** field merges JSON or YAML settings into the Docker service update that CapRover prepares when an app is configured or deployed. It is useful for Docker service options that the dashboard does not expose. Start with the smallest possible override:

```yaml
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes: 104857600
```

This example limits the service to 100 MiB of memory. Verify the value with `docker service inspect SERVICE_NAME`; obtain the actual name from `docker service ls`. Test under realistic load before keeping a limit.

The update order is CapRover's normal settings, then the service override, then the optional pre-deploy function. An override can replace a setting CapRover chose. Values must match Docker's service update API. Removing an override does not necessarily clear a Docker field that CapRover itself does not manage; explicitly reset the value when undoing such a change.

Keep a copy of the working service settings. An invalid or contradictory override can block deployments. See [Docker's service update API](https://docs.docker.com/reference/api/engine/) for the schema used by the Docker version running your server.

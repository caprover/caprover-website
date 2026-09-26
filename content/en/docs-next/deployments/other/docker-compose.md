---
id: docker-compose
title: Docker Compose (Experimental)
slug: /deployments/other/docker-compose
---

**Experimental:** CapRover's dashboard can import a limited subset of Docker Compose into managed apps. Open **Apps → Docker Compose**, paste the YAML, review the generated apps, and deploy. Check each app's HTTP port, environment variables, persistent data, and exposed ports afterward.

The current parser recognizes `image`, `environment`, `ports`, `volumes`, `depends_on`, `hostname`, `cap_add`, and `command`. Other Compose fields are ignored. In particular, do not assume `build`, custom `networks`, `secrets`, `configs`, `deploy`, `restart`, or `container_name` behaves like `docker compose`.

Named volumes are managed through the generated CapRover apps. A port mapping needs a `HOST:CONTAINER` form. For stacks that require unsupported Compose behavior, run Compose separately and explicitly connect the service to CapRover's external `captain-overlay-network` only when needed. Services managed outside CapRover remain outside its app lifecycle and backup behavior. See the [support matrix](../../reference/docker-compose.md).

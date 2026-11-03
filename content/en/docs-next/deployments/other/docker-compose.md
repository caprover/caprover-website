---
id: docker-compose
title: Docker Compose (Experimental)
slug: /deployments/other/docker-compose
---

- **Experimental:** CapRover's dashboard can import a limited subset of Docker Compose into managed apps.
- Open **Apps → Docker Compose**, paste the YAML, review the generated apps, and deploy.
- Check each app's HTTP port, environment variables, persistent data, and exposed ports afterward.

- The current parser recognizes `image`, `environment`, `ports`, `volumes`, `depends_on`, `hostname`, `cap_add`, and `command`.
- Other Compose fields are ignored.
- In particular, do not assume `build`, custom `networks`, `secrets`, `configs`, `deploy`, `restart`, or `container_name` behaves like `docker compose`.

Named volumes are managed through the generated CapRover apps. For stacks that require unsupported Compose behavior, run Compose separately and explicitly connect the service to CapRover's external `captain-overlay-network` only when needed. Services managed outside CapRover remain outside its app lifecycle and backup behavior. See the [support matrix](docker-compose.md).

<span id="source-reference-docker-compose"></span>

## Docker Compose Support Matrix

CapRover's One-Click format accepts a **subset** of Docker Compose service settings; it is not a general `docker compose up` replacement. The [model](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) declares:

| Service key | Supported input |
| --- | --- |
| `image`, `command`, `hostname`, `cap_add` | Image and selected container options. |
| `volumes` | Short `source:target` strings or objects with `type` (`volume` or `bind`), `source`, and `target`. Short-form `:ro` is ignored and long-form `read_only: true` is rejected. |
| `ports` | `HOST:CONTAINER`, `HOST:CONTAINER/tcp`, `HOST:CONTAINER/udp` strings or objects with `published`, `target`, optional `protocol` (`tcp` or `udp`), and optional `mode` (`ingress` or `host`). Without a protocol, CapRover publishes both TCP and UDP. |
| `environment` | A map of scalar values or a list of `KEY=value` strings. Bare keys and null values are omitted. |
| `depends_on` | Service-name array used to order One-Click deployment. |
| `caproverExtra` | CapRover extension for `dockerfileLines`, `containerHttpPort`, `notExposeAsWebApp`, and `websocketSupport`. |

- The deployment helper maps these values into apps and converts selected additional Compose options to a service override.
- Check the exact behavior in [OneClickAppDeploymentHelper.ts](https://github.com/caprover/caprover/blob/master/src/user/oneclick/OneClickAppDeploymentHelper.ts) and test templates in a disposable installation.
- Compose keys absent from the model are not promised to work.

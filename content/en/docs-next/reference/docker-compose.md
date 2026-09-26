---
id: docker-compose
title: Docker Compose Support Matrix
slug: /reference/docker-compose
---

CapRover's One-Click format accepts a **subset** of Docker Compose service settings; it is not a general `docker compose up` replacement. The [model](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) declares:

| Service key | Supported input |
| --- | --- |
| `image`, `command`, `hostname`, `cap_add` | Image and selected container options. |
| `volumes` | String mounts; check the target path and persistence. |
| `ports` | String host:container pairs. |
| `environment` | Mapping of variable names to string values. |
| `depends_on` | Service-name array used to order One-Click deployment. |
| `caproverExtra` | CapRover extension for `dockerfileLines`, `containerHttpPort`, `notExposeAsWebApp`, and `websocketSupport`. |

The deployment helper maps these values into apps and converts selected additional Compose options to a service override. Check the exact behavior in [OneClickAppDeploymentHelper.ts](https://github.com/caprover/caprover/blob/master/src/user/oneclick/OneClickAppDeploymentHelper.ts) and test templates in a disposable installation. Compose keys absent from the model are not promised to work.

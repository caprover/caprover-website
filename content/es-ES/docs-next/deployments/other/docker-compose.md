---
id: docker-compose
title: Docker Compose (Experimental)
slug: /deployments/other/docker-compose
---

- **Experimental:** El dashboard de CapRover puede importar un subconjunto limitado de Docker Compose en aplicaciones administradas.
- Abierto **Aplicaciones → Docker Compose**, pegar el YAML, revisar las aplicaciones generadas y desplegar.
- Compruebe el puerto HTTP de cada aplicación, variables de entorno, datos persistentes y puertos expuestos después.

- El parser actual reconoce `image`, `environment`, `ports`, `volumes`, `depends_on`, `hostname`, `cap_add`, y `command`.
- Otros campos Compose son ignorados.
- En particular, no asume `build`, personalizado `networks`, `secrets`, `configs`, `deploy`, `restart`o `container_name` se comporta como `docker compose`.

Los volúmenes designados se gestionan a través de las aplicaciones de CapRover generadas. Una mapeo de puertos necesita `HOST:CONTAINER` forma. Para las pilas que requieren un comportamiento compose sin soporte, ejecute Compose por separado y conecte explícitamente el servicio al externo de CapRover `captain-overlay-network` sólo cuando sea necesario. Los servicios gestionados fuera de CapRover permanecen fuera de su ciclo de vida de aplicaciones y comportamiento de respaldo. Ver el [matriz de apoyo](docker-compose.md).

<span id="source-reference-docker-compose"></span>

## Compatibilidad con Docker Compose

El formato One-Click de CapRover acepta un **subset** de la configuración de servicio Docker Compose; no es un sustituto general de `docker compose up`. El [modelo](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) declara:

| Servicio clave | Opciones admitidas |
| --- | --- |
| `image`, `command`, `hostname`, `cap_add` | Opciones de imagen y contenedor seleccionados. |
| `volumes` | Montajes definidos como cadenas de texto; comprobar el camino de destino y la persistencia. |
| `ports` | Cadenas con pares host:contenedor. |
| `environment` | Mapping of variable names to string values. |
| `depends_on` | Conjunto de nombre de servicio utilizado para ordenar la despliegue de One-Click. |
| `caproverExtra` | Extensión CapRover para `dockerfileLines`, `containerHttpPort`, `notExposeAsWebApp`, y `websocketSupport`. |

- El asistente de despliegue mapea estos valores en aplicaciones y convierte opciones adicionales de configuración seleccionadas a una override del servicio.
- Compruebe el comportamiento exacto en [OneClickAppDeploymentHelper.ts](https://github.com/caprover/caprover/blob/master/src/user/oneclick/OneClickAppDeploymentHelper.ts) y plantillas de prueba en una instalación de prueba.
- No se garantiza la compatibilidad con claves de Compose que no aparecen en el modelo.

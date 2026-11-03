---
id: docker-compose
title: Docker Compose (experimental)
slug: /deployments/other/docker-compose
---

- **Experimental:** el dashboard de CapRover permite importar un subconjunto de Docker Compose y crear aplicaciones administradas por CapRover.
- Abre **Apps → Docker Compose**, pega el YAML, revisa las aplicaciones generadas y despliega.
- Después, comprueba el puerto HTTP, las variables de entorno, los datos persistentes y los puertos publicados de cada aplicación.

- El parser admite actualmente `image`, `environment`, `ports`, `volumes`, `depends_on`, `hostname`, `cap_add` y `command`.
- Se ignoran los demás campos de Compose.
- En particular, no asumas que `build`, las `networks` personalizadas, `secrets`, `configs`, `deploy`, `restart` o `container_name` funcionan igual que con `docker compose`.

Los volúmenes con nombre se administran mediante las aplicaciones de CapRover generadas. Si necesitas funciones de Compose que CapRover no admite, ejecuta Compose por separado y conecta el servicio a la red externa `captain-overlay-network` de CapRover únicamente cuando sea necesario. Los servicios administrados fuera de CapRover también quedan fuera de su ciclo de vida y del sistema de backups de las aplicaciones. Consulta la [matriz de compatibilidad](docker-compose.md).

<span id="source-reference-docker-compose"></span>

## Matriz de compatibilidad con Docker Compose

El formato One-Click de CapRover admite un **subconjunto** de los ajustes de servicio de Docker Compose; no sustituye a `docker compose up` para cualquier archivo Compose. El [modelo](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) define:

| Clave del servicio | Configuración admitida |
| --- | --- |
| `image`, `command`, `hostname`, `cap_add` | Imagen y determinadas opciones del contenedor. |
| `volumes` | Cadenas `source:target` u objetos con `type` (`volume` o `bind`), `source` y `target`. El sufijo `:ro` se ignora y `read_only: true` en formato largo se rechaza. |
| `ports` | Cadenas `HOST:CONTAINER`, `HOST:CONTAINER/tcp`, `HOST:CONTAINER/udp` u objetos con `published`, `target`, `protocol` opcional (`tcp` o `udp`) y `mode` opcional (`ingress` o `host`). Si omites el protocolo, CapRover publica tanto TCP como UDP. |
| `environment` | Un mapa de valores escalares o una lista de cadenas `KEY=value`. Las claves sin valor y los valores nulos se omiten. |
| `depends_on` | Lista de nombres de servicios utilizada para ordenar el despliegue One-Click. |
| `caproverExtra` | Extensión de CapRover para `dockerfileLines`, `containerHttpPort`, `notExposeAsWebApp` y `websocketSupport`. |

- El asistente de despliegue convierte estos valores en aplicaciones y aplica determinadas opciones adicionales de Compose como overrides del servicio.
- Para verificar el comportamiento exacto, revisa [OneClickAppDeploymentHelper.ts](https://github.com/caprover/caprover/blob/master/src/user/oneclick/OneClickAppDeploymentHelper.ts) y prueba las plantillas en una instalación de pruebas.
- No se garantiza la compatibilidad con las claves de Compose ausentes del modelo.

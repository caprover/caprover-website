---
id: app-configuration
title: Configuración de aplicaciones
slug: /reference/app-configuration
---

CapRover guarda la configuración de cada aplicación por separado de Captain Definition. El [modelo de aplicación](https://github.com/caprover/caprover/blob/master/src/models/AppDefinition.ts) incluye:

| Área | Campos guardados | Uso |
| --- | --- | --- |
| Identidad | `projectId`, `description`, `tags` | Organización y etiquetas. |
| Despliegue | `deployedVersion`, `versions`, `captainDefinitionRelativeFilePath` | Historial de versiones y ruta de la definición. |
| HTTP | `notExposeAsWebApp`, `containerHttpPort`, `forceSsl`, `hasDefaultSubDomainSsl`, `websocketSupport`, `customDomain`, `redirectDomain`, `httpAuth`, `customNginxConfig` | Enrutamiento y acceso. |
| Asignación | `hasPersistentData`, `nodeId`, `instanceCount`, `networks` | Persistencia y asignación en Swarm. |
| Runtime | `envVars`, `ports`, `volumes`, `serviceUpdateOverride`, `preDeployFunction` | Variables de entorno, puertos publicados, montajes y ajustes avanzados. |

- Una variable de entorno es un par `{key,value}`.
- Un puerto publicado tiene `hostPort`, `containerPort`, el `protocol` opcional (`tcp` o `udp`) y el `publishMode` opcional (`ingress` o `host`).
- Un directorio persistente contiene `containerPath`, un `hostPath` o `volumeName` opcional y, si corresponde, `mode`.
- Configura estos valores desde el dashboard o la API, sin editar manualmente el JSON almacenado.

<span id="source-reference-defaults-limits"></span>

## Valores predeterminados y límites

Algunos valores predeterminados de [CaptainConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) y [EnvVars.ts](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts):

| Ajuste | Valor predeterminado |
| --- | --- |
| Directorio de estado de CapRover | `/captain`; datos incluidos en backups: `/captain/data` |
| Puertos HTTP, HTTPS y administración del host | `80`, `443`, `3000` |
| Subdominio del dashboard | `captain` |
| Versión de API | `v2` |
| Tamaño predeterminado de logs Docker | `512m` |
| Líneas de logs del build y tail de logs de aplicación | `50` y `500`, respectivamente |
| Máximo de versiones de despliegue guardadas | `50` |
| Selector de versión del build Docker | `2` |
| Retención de limpieza de imágenes programada cuando está desactivada | `1` |

Estos valores proceden del código fuente. Pueden modificarse mediante overrides y cambiar entre versiones. Comprueba tu versión instalada y su código antes de automatizar.

<span id="source-reference-legacy-compatibility"></span>

## Compatibilidad con versiones antiguas

- CapRover conserva nombres y enlaces históricos de CaptainDuckDuck, su predecesor.
- Las rutas `/docs/*` existentes siguen disponibles durante esta fase preliminar. Consulta el [mapa de URLs propuesto](https://github.com/caprover/caprover-website/blob/master/DOCS_NEXT_URL_MAP.md) para los destinos nuevos.
- Las redirecciones forman parte de una revisión posterior.

- El parser de Captain Definition admite **`schemaVersion: 2`**.
- Las definiciones antiguas necesitan migración; consulta [Migración desde CaptainDuckDuck](../guides/cdd-migration.md).
- El modelo conserva `isLegacyAppName` para aplicaciones creadas antes de CapRover 1.15.0, lo que afecta a la compatibilidad de nombres de servicio.
- Consulta [Red interna](../domains/firewall.md) antes de modificar hostnames internos hardcodeados.

Conserva las URLs y los alias de servicios antiguos durante esta fase. Prueba cada enlace histórico y las aplicaciones desplegadas cuando hagas la migración definitiva.

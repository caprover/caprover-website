---
id: app-configuration
title: Configuración de la aplicación
slug: /reference/app-configuration
---

CapRover almacena los ajustes de la aplicación separadamente de la definición Capitán. El [modelo de aplicación](https://github.com/caprover/caprover/blob/master/src/models/AppDefinition.ts) Incluye:

| Zona | Campos salvados | Propósito |
| --- | --- | --- |
| Identidad | `projectId`, `description`, `tags` | Organización y etiquetas. |
| Despliegue | `deployedVersion`, `versions`, `captainDefinitionRelativeFilePath` | Historia de la versión y ruta de definición. |
| HTTP | `notExposeAsWebApp`, `containerHttpPort`, `forceSsl`, `hasDefaultSubDomainSsl`, `websocketSupport`, `customDomain`, `redirectDomain`, `httpAuth`, `customNginxConfig` | Routing y acceso. |
| Lugar | `hasPersistentData`, `nodeId`, `instanceCount`, `networks` | Persistencia y colocación de Swarm. |
| Hora de correr | `envVars`, `ports`, `volumes`, `serviceUpdateOverride`, `preDeployFunction` | Medio ambiente, puertos publicados, monturas y personalización de servicios. |

- Una variable de entorno es un `{key,value}` par.
- Un puerto publicado tiene `hostPort`, `containerPort`, opcional `protocol` (`tcp` o `udp`), y opcional `publishMode` (`ingress` o `host`).
- Un directorio persistente contiene `containerPath`, opcional `hostPath` o `volumeName`, y opcional `mode`.
- Configure estos a través del dashboard o API en lugar de la edición manual almacenada JSON.

<span id="source-reference-defaults-limits"></span>

## Defaults and Limits

Preferencias seleccionadas de [CapitánConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) y [EnvVars.ts](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts):

| Ajuste | Default |
| --- | --- |
| Directorio estatal de CapRover | `/captain`; datos de respaldo `/captain/data` |
| Host HTTP, HTTPS, puertos de administración | `80`, `443`, `3000` |
| Subdominio de panel de mando | `captain` |
| Versión API | `v2` |
| Default Docker tamaño de registro | `512m` |
| Construir líneas de registro y cola de registro de aplicaciones | `50` y `500` respectivamente |
| Versiones de despliegue ahorradas | `50` |
| Selector de versión Docker build | `2` |
| Retención de limpieza de imagen programada cuando está deshabilitado | `1` |

Estos son defectos fuente, no garantías para cada instalación; los valores pueden ser anulados y pueden cambiar por versión. Comprueba la versión de tu instancia y la fuente de coincidencia antes de automatizarlas.

<span id="source-reference-legacy-compatibility"></span>

## Compatibilidad Legacy

- CapRover tiene nombres históricos y enlaces de su predecesor de CaptainDuckDuck.
- Existencia `/docs/*` los caminos permanecen vivos durante esta vista previa; ver [borrador del mapa de URL](https://github.com/caprover/caprover-website/blob/master/DOCS_NEXT_URL_MAP.md) para destinos antiguos a nuevos propuestos.
- Las redirecciones pertenecen a la revisión posterior de la reducción.

- El analizador de definición del capitán acepta **`schemaVersion: 2`**.
- Las definiciones más antiguas necesitan migración; véase [La migración de los niños](../guides/cdd-migration.md).
- El modelo de aplicación retiene `isLegacyAppName` para aplicaciones creadas antes de CapRover 1.15.0, que afecta la compatibilidad con el nombre de servicio.
- Check [redes internas](../domains/firewall.md) antes de cambiar los nombres internos de host.

No eliminar URLs existentes o alias de servicio heredados como parte de la publicación de previsualización. Prueba cada enlace histórico y aplicación desplegada en la eventual reducción.

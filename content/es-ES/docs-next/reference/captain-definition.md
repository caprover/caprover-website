---
id: captain-definition
title: Esquema de Captain Definition
slug: /reference/captain-definition
---

El archivo `captain-definition`, situado en la raíz del paquete de despliegue, indica a CapRover qué debe desplegar. La [interfaz de código fuente](https://github.com/caprover/caprover/blob/master/src/models/ICaptainDefinition.ts) incluye `schemaVersion` y cuatro opciones para definir el despliegue.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `schemaVersion` | number | Obligatorio. El parser actual acepta `2`. |
| `imageName` | string | Descarga y despliega una imagen Docker existente. |
| `dockerfilePath` | string | Ruta a un Dockerfile dentro del archivo de despliegue. No se admiten rutas que suban al directorio padre. |
| `dockerfileLines` | string[] | Líneas de un Dockerfile inline. |
| `templateId` | string | Utiliza una plantilla Dockerfile integrada. |

Debes indicar **exactamente una** de las cuatro opciones. El [parser](https://github.com/caprover/caprover/blob/master/src/user/ImageMaker.ts) rechaza definiciones con ninguna o más de una.

```json
{"schemaVersion": 2, "imageName": "nginx:stable-alpine"}
```

Para un despliegue con `imageName`, necesitas otra definición si quieres reconstruir la imagen desde el código fuente. Para un ejemplo con Dockerfile, consulta [Estáticos y React](../guides/static-react.md).

## Plantillas integradas y versiones

`templateId` sigue el formato `NAME/VERSION`, por ejemplo:

```json
{"schemaVersion":2,"templateId":"node/24"}
```

Las [definiciones de plantillas](https://github.com/caprover/caprover/blob/master/src/user/TemplateHelper.ts) de CapRover generan Dockerfiles con estas etiquetas de imágenes oficiales:

| `NAME` | Imagen base para `NAME/VERSION` |
| --- | --- |
| `node` | `node:VERSION-alpine` |
| `php` | `php:VERSION-apache` |
| `python-django` | `python:VERSION-alpine` |
| `ruby-rack` | `ruby:VERSION-alpine` |

- Para `node/24`, la imagen base resultante es `node:24-alpine`.
- La etiqueta debe existir en el registry de origen. Las etiquetas basadas solo en la versión principal pueden apuntar a imágenes distintas con el tiempo.
- Las instrucciones específicas de cada plantilla están en el [directorio `dockerfiles`](https://github.com/caprover/caprover/tree/master/dockerfiles) de CapRover.
- Revísalas antes de asumir qué frameworks admite la plantilla o de cambiar las versiones.
- Un Dockerfile incluido en tu propio repositorio permite fijar una etiqueta o digest exacto y controlar el build para otros frameworks.

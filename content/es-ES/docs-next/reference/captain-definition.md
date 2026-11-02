---
id: captain-definition
title: Plan de Captain Definition
slug: /reference/captain-definition
---

Un archivo llamado `captain-definition` en la raíz de despliegue le dice a CapRover qué desplegar. Es... [interfaz fuente](https://github.com/caprover/caprover/blob/master/src/models/ICaptainDefinition.ts) contiene `schemaVersion` y cuatro posibles selectores de despliegue.

| Campo | Tipo | Significado |
| --- | --- | --- |
| `schemaVersion` | Número | Se requiere; el parser actual acepta `2`. |
| `imageName` | cuerda | Tire y despliegue una imagen Docker existente. |
| `dockerfilePath` | cuerda | Camino a un Dockerfile en el archivo de despliegue. Se rechazan las trayectorias de parent-directory. |
| `dockerfileLines` | string[] | Líneas de un Dockerfile en línea. |
| `templateId` | cuerda | Utilice una plantilla Dockerfile integrada. |

Proporción **exactamente uno** de los cuatro selectores. El [parser](https://github.com/caprover/caprover/blob/master/src/user/ImageMaker.ts) rechaza cero o varios selectores.

```json
{"schemaVersion": 2, "imageName": "nginx:stable-alpine"}
```

`imageName` las implementaciones no pueden ser reconstruidas de la fuente sin una nueva definición. Por ejemplo con un Dockerfile, vea [Static / React](../guides/static-react.md).

## Plantillas y versiones incorporadas

`templateId` tiene la forma `NAME/VERSION`, por ejemplo:

```json
{"schemaVersion":2,"templateId":"node/24"}
```

CapRover [definiciones de plantilla](https://github.com/caprover/caprover/blob/master/src/user/TemplateHelper.ts) generar Dockerfiles utilizando estas etiquetas de imagen oficiales:

| `NAME` | Imagen de base para `NAME/VERSION` |
| --- | --- |
| `node` | `node:VERSION-alpine` |
| `php` | `php:VERSION-apache` |
| `python-django` | `python:VERSION-alpine` |
| `ruby-rack` | `ruby:VERSION-alpine` |

- Para `node/24`, la base resultante es `node:24-alpine`.
- La etiqueta debe existir en el registro de imagen de arriba relevante, y una etiqueta única puede moverse a medida que se actualiza la imagen.
- Instrucciones de Dockerfile específicas de plantilla están en CapRover [`dockerfiles` directorio](https://github.com/caprover/caprover/tree/master/dockerfiles).
- Inspeccionarlos antes de confiar en los supuestos marco de una plantilla o en versiones cambiantes.
- Un Dockerfile de repositorio le permite pinar una etiqueta de imagen exacta o digerir y controlar la build para otros marcos.

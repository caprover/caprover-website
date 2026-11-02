---
id: captain-definition
title: Definición
slug: /deployments/captain-definition
---

- A `captain-definition` archivo le dice a CapRover cómo construir fuente o qué imagen preconstruida para desplegar.
- Ponlo en la raíz del proyecto subido a menos que establezcas otro **Captain Definition Path** para la aplicación.
- El formato es JSON con `schemaVersion: 2`.

Para un repositorio Dockerfile:

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

Para una imagen preconstruida:

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

- Utilice exactamente una fuente de build/imagen. `dockerfileLines` puede definir un Dockerfile inline, y `templateId` selecciona una plantilla de lenguaje incorporada.
- Para un monorepo, establece una ruta de definición separada por aplicación; la raíz subida del proyecto sigue siendo el contexto Docker build.
- Ver el [Plan de Captain Definition](../reference/captain-definition.md) para las llaves y limitaciones soportadas.

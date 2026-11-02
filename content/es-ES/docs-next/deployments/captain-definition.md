---
id: captain-definition
title: Captain Definition
slug: /deployments/captain-definition
---

- El archivo `captain-definition` indica a CapRover cómo compilar una aplicación desde código o qué imagen existente debe desplegar.
- Colócalo en la raíz del proyecto subido, salvo que configures otro **Captain Definition Path** para la aplicación.
- Su formato es JSON y utiliza `schemaVersion: 2`.

Para un Dockerfile incluido en el repositorio:

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

Para desplegar una imagen ya compilada:

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

- Especifica una sola fuente de build o imagen. `dockerfileLines` permite incluir un Dockerfile inline, mientras que `templateId` selecciona una plantilla integrada para un lenguaje.
- En un monorepo, configura una ruta de definición distinta por aplicación. La raíz del proyecto subido sigue siendo el contexto del build de Docker.
- Consulta el [esquema de Captain Definition](../reference/captain-definition.md) para ver los campos admitidos y sus restricciones.

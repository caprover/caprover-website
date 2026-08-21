---
id: captain-definition-file
title: Archivo Captain Definition
sidebar_label: Archivo Captain Definition
---

## Conceptos básicos

Un archivo `captain-definition` en la raíz del proyecto indica a CapRover cómo compilarlo o desplegarlo. El archivo usa JSON y requiere `schemaVersion: 2`.

Para una aplicación Node.js:

```json
{
  "schemaVersion": 2,
  "templateId": "node/24"
}
```

`templateId` usa el formato `LENGUAJE/VERSIÓN`. Las plantillas incluidas son `node`, `php`, `python-django` y `ruby-rack`. CapRover obtiene la versión de la imagen oficial correspondiente durante la compilación.

Para aplicaciones nuevas de producción, un Dockerfile almacenado en el repositorio suele ofrecer una compilación más clara y reproducible. También permite usar cualquier lenguaje o entorno de ejecución.

## Usar un Dockerfile

Haga referencia a un Dockerfile del repositorio:

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
}
```

El contexto de compilación de Docker es la raíz del proyecto cargado, aunque el Dockerfile esté en un subdirectorio.

También puede definir el Dockerfile en línea:

```json
{
  "schemaVersion": 2,
  "dockerfileLines": [
    "FROM node:24-alpine",
    "WORKDIR /usr/src/app",
    "COPY package*.json ./",
    "RUN npm install --omit=dev && npm cache clean --force",
    "COPY . .",
    "ENV NODE_ENV=production",
    "ENV PORT=80",
    "EXPOSE 80",
    "CMD [\"npm\", \"start\"]"
  ]
}
```

Consulte la [referencia de Dockerfile](https://docs.docker.com/reference/dockerfile/) y las [prácticas recomendadas de compilación](https://docs.docker.com/build/building/best-practices/) de Docker para ver más opciones.

## Usar el nombre de una imagen

Para desplegar una imagen ya compilada desde un registro:

```json
{
  "schemaVersion": 2,
  "imageName": "nginxdemos/hello"
}
```

Puede pegar una definición que solo contenga una imagen en la pestaña **Deployment** de la aplicación. La CLI también acepta una imagen mediante `caprover deploy --imageName IMAGE`.

## Monorepositorios

Un repositorio puede contener una definición distinta para cada aplicación:

```text
/project
  /frontend
    package.json
  /backend
    package.json
  captain-definition-backend
  captain-definition-frontend
```

En la pestaña **Deployment** de cada aplicación, configure Captain Definition Path con el archivo correspondiente, por ejemplo `./captain-definition-backend`. Las rutas `COPY` del Dockerfile siguen siendo relativas a la raíz del proyecto, ya que esta es el contexto de compilación.

## Elegir versiones del entorno de ejecución

Use una versión con soporte activo y fíjela con el nivel de reproducibilidad que requiera la aplicación. Las versiones disponibles para las plantillas siguen las etiquetas publicadas por las imágenes oficiales:

- [Etiquetas de la imagen de Node.js](https://hub.docker.com/_/node)
- [Etiquetas de la imagen de PHP](https://hub.docker.com/_/php)
- [Etiquetas de la imagen de Python](https://hub.docker.com/_/python)
- [Etiquetas de la imagen de Ruby](https://hub.docker.com/_/ruby)

Una etiqueta flotante puede cambiar el entorno usado por una compilación posterior. Fije una etiqueta exacta o un digest cuando necesite compilaciones repetibles.

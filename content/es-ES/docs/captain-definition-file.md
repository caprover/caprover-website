---
id: captain-definition-file
title: Archivo de definición de Captain
sidebar_label: Archivo de definición de Captain
---

<br/>
## Conceptos básicos
Uno de los componentes clave de CapRover es el archivo `captain-definition` que se encuentra en la raíz de su proyecto. En el caso de la aplicación NodeJS, se encuentra junto a package.json, o al lado de index.php en el caso de PHP, o requisitos.txt para la aplicación Python. Es un JSON simple como este:


```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```

`schemaVersion` es siempre 2. Y `templateId` es la pieza que define la base que necesitas para ejecutar tu aplicación. Está en formato `LANGUAGE/VERSION`. El IDIOMA puede ser uno de estos: `node`, `php`, `python-django`, `ruby-rack`. Y VERSIÓN es la versión del idioma que desea utilizar; consulte [a continuación](#versions-for-templateid).

Tenga en cuenta que, aunque `templateId` puede ser uno de los 4 idiomas de aplicaciones web más populares: NodeJS, PHP y Python/Django, Ruby/Rack, ¡NO ESTÁ LIMITADO a estos idiomas predefinidos! Con CapRover, tienes la posibilidad de definir tu propio Dockerfile. Con un Dockerfile personalizado, puede implementar cualquier lenguaje, Go, Java, .NET, ¡lo que sea! Los Dockerfiles son bastante fáciles de escribir. Por ejemplo, los dos archivos captain-definition siguientes generan <b>exactamente el mismo resultado</b>.

#### Versión sencilla

```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```


#### Versión avanzada

```
 {
  "schemaVersion": 2,
  "dockerfileLines": [
                        "FROM node:8.7.0-alpine",
                        "RUN mkdir -p /usr/src/app",
                        "WORKDIR /usr/src/app",
                        "COPY ./package.json /usr/src/app/",
                        "RUN npm install && npm cache clean --force",
                        "COPY ./ /usr/src/app",
                        "ENV NODE_ENV production",
                        "ENV PORT 80",
                        "EXPOSE 80",
                        "CMD [ \"npm\", \"start\" ]"
                    ]
 }
```
## Utilice Dockerfile en captain-definition:

Tenga en cuenta que la versión simple de `captain-definition` con `templateId` es buena como punto de partida. Pero a medida que su proyecto se vuelve más complejo, es posible que desee realizar tareas más complicadas con su imagen base, como instalar extensiones PHP, instalar `uWSGI`, instalar una versión particular de `curl`, etc. En estos casos, puede aprovechar Dockerfile. El uso de Dockerfile personalizado le permite crear una imagen base muy personalizada. Si no está familiarizado con Docker, simplemente puede usar Google para encontrar algo similar a sus requisitos y modificarlo. Finalmente, si está estancado, no dude en hacer una pregunta en nuestro canal de Slack o StackOverflow.


Para usar un Dockerfile que está en su repositorio, simplemente puede hacer referencia a él en el archivo captain-definition:

```
 {
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
 }
```

Los Dockerfiles son muy simples y fáciles de leer. Incluso si no sabes nada sobre Docker, puedes hacerte una idea de lo que hace. Algunos ejemplos de métodos avanzados: [PHP Composer](https://github.com/githubsaturn/captainduckduck/issues/94) y [Meteor](https://github.com/githubsaturn/meteor-captainduckduck/blob/master/captain-definition)

Usando este enfoque (puro Dockerfile) puedes implementar Ruby, Java, Scala, ¡literalmente cualquier cosa! Si necesita más detalles sobre dockerfile, consulte [Dockerfile Ayuda](https://docs.docker.com/engine/reference/builder) y [Mejores prácticas](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices).

## Usar nombre de imagen

Si es un usuario avanzado de Docker, sabrá que hay muchas aplicaciones prediseñadas en DockerHub. Puede implementar estas imágenes usando captain-definition. Por ejemplo, para implementar https://hub.docker.com/r/nginxdemos/hello/, usas:

```
 {
  "schemaVersion": 2,
  "imageName": "nginxdemos/hello"
 }
```

Consejo: simplemente puede copiar y pegar el archivo captain-definition anterior en el panel web CapRover debajo de la pestaña de implementación.


## Monorepo:
Puede utilizar un repositorio git para implementar varias aplicaciones diferentes. Por ejemplo, es posible que tenga una aplicación frontend y backend en un repositorio. En este caso, puede definir varios archivos `captain-definition` y hacer que implementen aplicaciones independientes, por ejemplo, una estructura de directorios como esta:
```
/project
   /frontend
      /src/index.js
      package.json
   /backend
      /src/index.js
      package.json
captain-definition-backend
captain-definition-frontend
```
Con este contenido:
`captain-definition-backend`
```
 {
  "schemaVersion": 2,
  "dockerfileLines": [
                        "FROM node:12-alpine",
                        "RUN mkdir -p /usr/src/app",
                        "COPY ./backend /usr/src/app",
                        "RUN npm install && npm cache clean --force",
                        "CMD [ \"npm\", \"start\" ]"
                    ]
 }
```
Alternativamente, puedes señalar un Dockerfile. Tenga en cuenta que el contexto de compilación siempre será la raíz de su proyecto, por lo que en Dockerfile, tendrá que apuntar a ese directorio específico, por ejemplo, `COPY ./backend /usr/src/app`

A continuación, debe indicarle a su CapRover que use el `captain-definition` correcto para cada aplicación. Navegue a su aplicación, vaya a la pestaña IMPLEMENTACIÓN y edite su ruta captain-definition a `./captain-definition-backend`

## Versiones para templateId:
NOTA: Las versiones se extraen de los repositorios oficiales en tiempo de ejecución, por lo tanto, no necesita actualizar su Captain para usar una nueva versión de NodeJS. Por ejemplo, consulte [aquí](https://hub.docker.com/_/node/).

**IMPORTANTE:** Las versiones mencionadas a continuación son solo para **referencia**. Por ejemplo, en el momento en que se generó este documento, el Nodo 10 no estaba disponible, pero sí lo está ahora. Por lo tanto, puede utilizar `node/10`, `node/10.15` o `node/10.15.0` como su ID de plantilla a pesar de que no se menciona a continuación.


```bash
node/
carbon, 8, 8.9, 8.9.4, boron, 6, 6.12, 6.12.3, 9, 9.3, 9.3.0, 8.9.3, 9.2, 9.2.1, argon, 4, 4.8, 4.8.7, 6.12.2, 8.9.2, 6.12.1, 4.8.6, 6.12.0, 8.9.1, 9.2.0, 9.1, 9.1.0, 8.9.0, 9.0, 9.0.0, 4.8.5, 6.11, 6.11.5, 8.8, 8.8.1, 8.8.0, 8.7, 8.7.0, 6.11.4, 8.6, 8.6.0, 8.5, 8.5.0, 4.8.4, 6.11.3, 6.11.2, 7, 7.10, 7.10.1, 8.4, 8.4.0, 8.3, 8.3.0, 8.2, 8.2.1, 6.11.1, 8.2.0, 8.1, 8.1.4, 4.8.3, 6.11.0, 8.1.3, 8.1.2, 8.1.1, 8.1.0, 8.0, 8.0.0, 6.10, 6.10.3, 7.10.0, 4.8.2, 6.10.2, 7.9, 7.9.0, 7.8, 7.8.0, 4.8.1, 6.10.1, 7.7, 7.7.4, 4.8.0, 6.10.0, 7.7.3, 7.7.2, 7.7.1, 7.7.0, 7.6, 7.6.0, 4.7, 4.7.3, 6.9, 6.9.5, 7.5, 7.5.0, 4.7.2, 6.9.4, 7.4, 7.4.0, 4.7.1, 6.9.3, 7.3, 7.3.0, 6.9.2, 4.7.0, 7.2.1, 7.2, 4.6, 4.6.2, 7.2.0, 6.9.1, 7.1, 7.1.0
```

```bash
php/
7, 7.2, 7.2.1, 7.0, 7.0.26, 7.1, 7.1.12, 5, 5.6, 5.6.32, 7.2.0, rc, 7.2-rc, 7.2.0RC6, 7.0.25, 7.1.11, 7.2.0RC5, 7.2.0RC4, 5.6.31, 7.0.24, 7.1.10, 7.2.0RC3, 7.1.9, 7.0.23, 7.2.0RC2, 7.2.0RC1, 7.0.22, 7.1.8, 7.2.0beta3, 7.2.0beta2, 7.1.7, 7.2.0beta1, 7.0.21, 7.2.0alpha3, 5.6.30, 7.0.20, 7.1.6, 7.1.5, 7.0.19, 7.0.18, 7.1.4, 7.0.17, 7.1.3, 7.0.16, 7.1.2, 7.1.1, 7.0.15, 5.6.29, 7.0.14, 7.1.0, 5.6.28, 7.0.13, 7.1-rc, 7.1.0RC6, 7.1.0RC5, 7.0.12, 5.6.27, 7.1.0RC4, 7.1.0RC3, 5.6.26, 7.0.11, 7.1.0RC2, 5.6.25, 7.0.10, 7.1.0RC1, 5.6.24, 7.0.9, 5.5.38, 5.5, 5.5.37, 5.6.23, 7.0.8, 5.5.36, 5.6.22, 7.0.7, 7.0.6, 5.6.21, 5.5.35, 7.0.5, 5.6.20, 5.5.34, 7.0.4, 5.6.19, 5.5.33, 7.0.3, 5.6.18, 5.5.32, 7.0.2, 5.6.17, 5.5.31, 7.0.1, 5.6.16, 5.5.30, 7.0.0, 5.4, 5.4.45, 7.0.0RC8, 5.6.15, 7.0.0RC7, 7.0.0RC6, 7.0.0RC5, 5.6.14, 7.0.0RC4, 7.0.0RC3, 5.6.13, 5.5.29, 7.0.0RC2, 7.0.0RC1, 7.0.0beta3, 5.6.12, 5.5.28, 5.4.44, 7.0.0beta2, 5.6.11, 5.5.27, 5.4.43, 7.0.0beta1, 5.5.21, 5.5.19, 5.5.16, 5.4.40, 5.4.41, 5.4.39, 5.5.17, 5.6.3, 5.6.0, 5.6.8, 5.6.4, 5.4.42, 5.5.20, 5.4.38, 5.5.22, 5.6.5, 5.6.2, 5.4.35, 5.4.36, 5.4.33, 5.3.29, 5.3, 5.5.26, 5.5.18, 5.4.32, 5.4.37, 5.6.1, 5.6.6, 5.6.9, 5.6.10, 5.4.34, 5.6.7, 5.5.24, 5.5.23, 5.5.25
```

```bash
python-django/
2, 2.7, 2.7.14, 3, 3.6, 3.6.4, 3.6.3, rc, 3.7-rc, 3.7.0a3, 3.7.0a2, 3.7.0a1, 2.7.13, 3.6.2, 3.6-rc, 3.6.2rc2, 3.6.1, 3.6.2rc1
```

```bash
ruby-rack/
2.4, 2.4.3, 2, 2.5, 2.5.0, rc, 2.5-rc, 2.5.0-rc1, 2.4.2, 2.5.0-preview1
```

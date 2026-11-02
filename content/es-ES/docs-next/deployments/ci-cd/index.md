---
id: index
title: CI/CD
slug: /deployments/ci-cd
---

<span id="source-deployments-ci-cd-deployment-tokens"></span>

## Deployment Tokens

- Un token de implementación de aplicaciones permite la automatización desplegar una aplicación CapRover sin usar la contraseña de panel de control.
- Crear la aplicación, abrir su **Despliegue** pestaña, habilitar la ficha de aplicación y copiar el valor en la tienda secreta del sistema CI.
- Trate tanto el token como cualquier URL Git webhook como credenciales.

- Utilice la URL del panel de control HTTPS y el nombre exacto de la aplicación en CI.
- Para el CLI, suministro `--appToken` o conjunto `CAPROVER_APP_TOKEN` en el entorno de proceso, junto con la URL del servidor y el nombre de la aplicación.
- El [GitHub deployment action](https://github.com/caprover/deploy-from-github) lo acepta como `token` entrada.

- Si la ficha está expuesta, sustitúyala o deshágala en la configuración de la aplicación y actualice su secreto de CI.
- Dar cada trabajo de implementación sólo las credenciales de registro que también necesita; una ficha de aplicación no otorga al servidor CapRover acceso a un registro de imagen privado.

<span id="source-deployments-ci-cd-github-actions"></span>

## GitHub Actions

Uso [caprover/deploy-from-github](https://github.com/caprover/deploy-from-github) para los flujos de trabajo mantenidos que cubren fuente, imágenes Docker, archivos preparados y monorepos.

- Permitir un despliegue de aplicaciones token y guardarlo en los secretos de GitHub Actions.
- Proveer la acción `server`, `app`, y `token` entradas.
- Para imágenes privadas, configure las credenciales de registro en [CapRover](../registries/index.md).
- Verifique el despliegue y la salud de las aplicaciones resultantes después de que la acción tenga éxito.

<span id="source-deployments-ci-cd-gitlab-ci"></span>

## GitLab CI

Construir una imagen en GitLab CI, empujarla a GitLab Container Registry, e implementar esa etiqueta exacta a CapRover. Esto mueve la construcción costosa lejos del servidor CapRover.

1. Crear la aplicación en CapRover y habilitar su [de las Naciones Unidas](index.md).
2. En GitLab, almacena la URL de CapRover HTTPS, nombre de aplicación y token como variables protegidas CI/CD. Mantenga la ficha enmascarada cuando su configuración variable lo permita.
3. Construir y empujar la imagen con una etiqueta específica de compromiso como `$CI_COMMIT_SHA` a GitLab Container Registry.
4. Si esa imagen de registro es privada, añadir `registry.gitlab.com`, una credencial de alcance, y el prefijo de imagen correcto a CapRover [registros privados](../registries/index.md)La autenticación del lado del corredor es insuficiente.
5. Asegúrese de que su corredor GitLab admite Docker-in-Docker con el volumen de certificado TLS. Añadir esto `.gitlab-ci.yml` a un repositorio con un Dockerfile:

   ```yaml
   stages: [build, deploy]

   build:
     stage: build
     image: docker:27.4.1
     services:
       - docker:27.4.1-dind
     variables:
       DOCKER_HOST: tcp://docker:2376
       DOCKER_TLS_CERTDIR: /certs
     script:
       - echo "$CI_REGISTRY_PASSWORD" | docker login "$CI_REGISTRY" -u "$CI_REGISTRY_USER" --password-stdin
       - docker build -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" .
       - docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
     rules:
       - if: '$CI_COMMIT_BRANCH == "main"'

   deploy:
     stage: deploy
     image: node:24-alpine
     script:
       - npm install -g caprover
       - caprover deploy --caproverUrl "$CAPROVER_URL" --caproverApp "$CAPROVER_APP" --appToken "$CAPROVER_APP_TOKEN" --imageName "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
     rules:
       - if: '$CI_COMMIT_BRANCH == "main"'
   ```

- Set `CAPROVER_URL`, `CAPROVER_APP`, y `CAPROVER_APP_TOKEN` como variables GitLab CI/CD; proteger y enmascarar el token.
- GitLab suministra el `CI_REGISTRY_*` y comprometer variables cuando su registro de contenedores esté habilitado.
- Sustitución `main` si su rama de liberación difiere.
6. Verifique la etiqueta de imagen y la salud de servicio en CapRover después de que el trabajo de CI tenga éxito. Un exitoso despliegue de CLI significa que CapRover aceptó la actualización; la aplicación todavía necesita un contenedor saludable y el puerto HTTP correcto.

- See [GitLab's Docker-in-Docker Runner setup](https://docs.gitlab.com/ci/docker/docker_in_docker/) si la construcción no puede conectarse al daemon Docker.
- Evite incrustar una contraseña de dashboard o un mutable `latest` etiqueta de imagen en el gasoducto.
- Un GitLab push webhook es otra opción cuando construir desde la fuente en CapRover es aceptable.

<span id="source-deployments-ci-cd-generic"></span>

## Genérico CI

- Cualquier sistema CI puede desplegarse en CapRover si puede llegar al panel sobre HTTPS y mantener una aplicación [de las Naciones Unidas](index.md).
- Elija un archivo fuente que contenga `captain-definition` o una imagen preconstruida accesible al servidor.

- El flujo de liberación repetible más simple es: construir una imagen, etiquetarla con un identificador de confirmación inmutable o liberación, empujarla a un registro, autorizar CapRover para tirarla, luego desplegar esa imagen exacta utilizando el CLI o API.
- Mantenga la ficha de aplicación y registro credencial en la tienda secreta de CI, evite imprimirlos en registros, y verifique la salud de la aplicación final después de que CapRover acepte el despliegue.

Si CI envía fuente en su lugar, el servidor CapRover realiza la construcción y necesita suficiente memoria y disco. See [Construye y construye registros](../builds-logs.md) para resolver problemas.

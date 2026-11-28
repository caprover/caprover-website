---
id: index
title: CI/CD
slug: /deployments/ci-cd
---

<span id="source-deployments-ci-cd-deployment-tokens"></span>

## Tokens de despliegue

- Un token de despliegue permite a CI desplegar una aplicación concreta de CapRover sin utilizar la contraseña del dashboard.
- Crea la aplicación, abre la pestaña **Deployment**, habilita el token de la app y guárdalo como secreto en tu sistema de CI.
- Trata el token y cualquier URL de Git webhook como credenciales sensibles.

- En CI, utiliza la URL HTTPS del dashboard y el nombre exacto de la aplicación.
- Con la CLI, proporciona `--appToken` o define `CAPROVER_APP_TOKEN` como variable de entorno, junto con la URL del servidor y el nombre de la aplicación.
- La [GitHub Action oficial](https://github.com/caprover/deploy-from-github) acepta el token en el input `token`.

- Si se filtra el token, sustitúyelo o desactívalo en los ajustes de la aplicación y actualiza el secreto de CI.
- Si despliegas imágenes privadas, configura también las credenciales del registry. Un token de despliegue no concede al servidor CapRover acceso a un registry privado.

<span id="source-deployments-ci-cd-github-actions"></span>

## GitHub Actions

Utiliza [caprover/deploy-from-github](https://github.com/caprover/deploy-from-github), que mantiene los workflows para desplegar desde código fuente, imágenes Docker, archivos preparados y monorepos.

- Habilita un token de despliegue para la aplicación y guárdalo en los Secrets de GitHub Actions.
- Configura los inputs `server`, `app` y `token` de la Action.
- Si la imagen es privada, añade en [CapRover](../registries/index.md) las credenciales necesarias para hacer pull del registry.
- Cuando la Action termine, verifica el despliegue y el estado de salud de la aplicación.

<span id="source-deployments-ci-cd-gitlab-ci"></span>

## GitLab CI

Puedes construir la imagen en GitLab CI, publicarla en GitLab Container Registry y desplegar exactamente ese tag en CapRover. Así evitas consumir recursos del servidor CapRover durante el build.

1. Crea la aplicación en CapRover y habilita su [token de despliegue](index.md).
2. Guarda la URL HTTPS de CapRover, el nombre de la app y el token como variables protegidas de GitLab CI/CD. Marca el token como Masked cuando sea posible.
3. Construye la imagen y haz push a GitLab Container Registry usando un tag asociado al commit, por ejemplo `$CI_COMMIT_SHA`.
4. Si la imagen es privada, configura en CapRover el registry `registry.gitlab.com`, credenciales con permisos de lectura y el prefijo correcto de imagen. Consulta [registros privados](../registries/index.md). El login del runner de GitLab por sí solo no permite que CapRover descargue la imagen.
5. Configura el GitLab runner para utilizar Docker-in-Docker con el volumen de certificados TLS. En un repositorio que contenga un Dockerfile, añade este archivo `.gitlab-ci.yml`:

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

- Configura `CAPROVER_URL`, `CAPROVER_APP` y `CAPROVER_APP_TOKEN` como variables de GitLab CI/CD. Protege y oculta el token.
- GitLab proporciona las variables `CI_REGISTRY_*` y las variables del commit cuando está habilitado Container Registry.
- Cambia `main` si publicas desde otra rama.
6. Tras el job de CI, comprueba el tag de la imagen y el estado del servicio en CapRover. Que la CLI confirme el despliegue significa que CapRover ha aceptado la actualización; además, el contenedor debe estar saludable y escuchar en el puerto HTTP correcto.

- Si el build no puede conectarse a Docker, consulta [la configuración de Docker-in-Docker de GitLab](https://docs.gitlab.com/ci/docker/docker_in_docker/).
- Evita guardar la contraseña del dashboard en el pipeline o usar el tag mutable `latest` como identificador de una release.
- También puedes usar un webhook de push de GitLab si prefieres que CapRover construya el código fuente.

<span id="source-deployments-ci-cd-generic"></span>

## CI genérico

- Cualquier sistema CI puede desplegar en CapRover si tiene acceso al dashboard mediante HTTPS y un [token de despliegue](index.md).
- Puedes enviar un archivo de código fuente con `captain-definition` o una imagen preconstruida accesible desde el servidor.

- Un flujo reproducible es: construir una imagen, asignarle un tag inmutable de commit o release, publicarla en un registry, configurar el acceso de CapRover para hacer pull y desplegar ese tag exacto mediante la CLI o API.
- Guarda el token y las credenciales del registry en los Secrets del sistema CI, evita imprimirlos en los logs y comprueba que la aplicación funciona después del despliegue.

Si envías el código fuente, el servidor CapRover realizará el build y necesitará memoria y disco suficientes. Consulta [Builds y logs](../builds-logs.md) si algo falla.

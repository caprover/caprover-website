---
id: deploy-from-gitlab
title: Desplegar desde GitLab
sidebar_label: Implementar desde GitLab
---



En este tutorial, repasaremos la implementación mediante GitLab. Dicho esto, GitHub es muy similar. Si tienes algún problema en el camino, ¡háznoslo saber!


### 1- Crear GitLab Repositorio

Si no tiene una cuenta GitLab, cree una.
- Haga clic en "Nuevo proyecto" para crear un nuevo repositorio
- Haga clic en "Crear proyecto en blanco"
- Nombra tu proyecto y finaliza la creación de tu proyecto.



### 2- Agregar código fuente de muestra

Para este tutorial trabajaremos con un código fuente de muestra muy sencillo que contiene un archivo.

`index.php`
```php
 <?php echo 'PHP output: Hello World!'; ?> 
```

Agregue, confirme y envíe este archivo a su repositorio el GitLab. Deberías ver este archivo en la interfaz de usuario web de GitLab.



### 3- Dockerfile

Para poder construir sobre un sistema de compilación de terceros, necesita tener un Dockerfile. Si está utilizando un CapRover templateId, puede usar los [Dockerfiles listos para usar que están en el repositorio CapRover](https://github.com/caprover/caprover/tree/ff3d124f967ee06732c13774e9e633d33b0982c4/dockerfiles).

En este tutorial, usaremos PHP Dockerfile:

`Dockerfile`
```Dockerfile
FROM php:7.3-apache
COPY ./ /var/www/html/
```

**IMPORTANTE** Asegúrese de que su `Dockerfile` esté escrito exactamente así.

Agregue, confirme y envíe este archivo.



### 4- Crea un token de acceso para CapRover

CapRover necesita extraer las imágenes creadas de GitLab, por lo que debemos crear un token de acceso. Navegue a [Configuración de usuario > Tokens de acceso personal](https://gitlab.com/-/user_settings/personal_access_tokens) y cree un token.

Asegúrese de asignar los permisos `read_registry` y `write_registry` para este token.

Una vez que haya creado el token, pase al siguiente paso:



### 5- Agregar token a CapRover

Inicie sesión en su panel web CapRover, en `Cluster` haga clic en `Add Remote Registry`. Luego ingresa estos campos:

- Nombre de usuario: `your gitlab username`
- Contraseña: `your gitlab Token [From the previous step]`
- Dominio: `registry.gitlab.com`
- Prefijo de imagen: `again, your gitlab username`

NOTA: El prefijo de imagen depende de cómo estructura su proyecto en Gitlab. Si está utilizando un grupo para su repositorio, el prefijo de su imagen debe ser su grupo.
En general, el prefijo de la imagen es la parte entre el dominio y el nombre de la imagen. Por ejemplo, `my-group-project` es el prefijo de imagen para este proyecto:
```
registry.gitlab.com/my-group-project/test:latest
```

Guarde su registro.



### 6- Deshabilitar el push predeterminado

Ahora que agregó un registro, CapRover quiere enviar de forma predeterminada el artefacto creado a su registro. No necesita esto para este tutorial y podría provocar que sus implementaciones fallen. Así que adelante y desactiva `Default Push`



### 7- Crea una aplicación CapRover

En el panel CapRover y creamos una aplicación, la llamamos `my-test-gitlab-deploy`



### 8- Crear CI/CD Variables

Luego, vaya a la página de su proyecto en GitLab, navegue hasta `Settings > CI/CD`. Luego, en `Variables` agregue las siguientes variables:
- `Key`: `CAPROVER_URL`, `Value`: `https://captain.root.domain.com [replace it with your domain]`
- `Key`: `CAPROVER_PASSWORD`, `Value`: `mYpAsSwOrD [replace it with your password]`
- `Key`: `CAPROVER_APP`, `Value`: `my-test-gitlab-deploy [replace it with your app name]`

Añade todas estas 3 variables. Para mayor seguridad, asegúrese de que estén protegidos. Está bien si no están enmascarados, no aparecerán en los registros.



### 9- GitLab Archivo CI

Hasta ahora, tenemos dos archivos en nuestro directorio `index.php` y `Dockerfile`. Ahora agreguemos las instrucciones de compilación específicas de GitLab:

**IMPORTANTE** Asegúrese de que su `.gitlab-ci.yml` esté escrito exactamente así. Comienza con un punto.


`.gitlab-ci.yml`
```yaml
build-docker-master:
  image: docker:19.03.1
  stage: build
  services:
    - docker:19.03.1-dind
  before_script:
    - export DOCKER_REGISTRY_USER=$CI_REGISTRY_USER # built-in GitLab Registry User
    - export DOCKER_REGISTRY_PASSWORD=$CI_REGISTRY_PASSWORD # built-in GitLab Registry Password
    - export DOCKER_REGISTRY_URL=$CI_REGISTRY # built-in GitLab Registry URL
    - export COMMIT_HASH=$CI_COMMIT_SHA # Your current commit sha
    - export IMAGE_NAME_WITH_REGISTRY_PREFIX=$CI_REGISTRY_IMAGE # Your repository prefixed with GitLab Registry URL
    - docker login -u "$DOCKER_REGISTRY_USER" -p "$DOCKER_REGISTRY_PASSWORD" $DOCKER_REGISTRY_URL # Instructs GitLab to login to its registry

  script:
    - echo "Building..." # MAKE SURE NO SPACE ON EITHER SIDE OF = IN THE FOLLOWING LINE
    - export CONTAINER_FULL_IMAGE_NAME_WITH_TAG=$IMAGE_NAME_WITH_REGISTRY_PREFIX/my-build-image:$COMMIT_HASH
    - docker build -f ./Dockerfile --pull -t built-image-name .
    - docker tag built-image-name "$CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - docker push "$CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - echo $CONTAINER_FULL_IMAGE_NAME_WITH_TAG
    - echo "Deploying on CapRover..."
    - docker run caprover/cli-caprover:v2.1.1 caprover deploy --caproverUrl $CAPROVER_URL --caproverPassword $CAPROVER_PASSWORD --caproverApp $CAPROVER_APP --imageName $CONTAINER_FULL_IMAGE_NAME_WITH_TAG
  only:
    - master
```

Esto se explica por sí solo. **¡La mejor parte es que no tienes que realizar ningún cambio en este archivo!** ¡Es el mismo archivo para todos tus repositorios independientemente de su idioma o dónde los implementes!

Los únicos 3 valores que son diferentes para este archivo son los 3 valores `CAPROVER_***` que configuró en el paso anterior.


Confirme y envíe este archivo a su repositorio GitLab. Por ahora, su repositorio GitLab debe tener al menos estos 3 archivos
```bash
index.php
Dockerfile
.gitlab-ci.yml
```

¡Espera un poco hasta que tu compilación finalice y se implemente automáticamente! ¡¡¡Después de unos minutos podrás ver tu aplicación implementada en CapRover!!!

#### Nota sobre el uso de `--imageName` con un registro privado

Si encuentra el siguiente error al ejecutar `caprover deploy --imageName`, es posible que deba autenticar su instancia Captain en su registro, ya que iniciar sesión localmente no significa que CapRover pueda acceder a la imagen.

```
Deploy failed!
Error: (HTTP code 404) unexpected - pull access denied for user_name/repo_name, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
```

**Inicie sesión en su repositorio Docker privado en CapRover**:

- Navegar al CLUSTER
- Haga clic en AÑADIR REGISTRO REMOTO
- Ingresa tus datos y guarda tu registro
- Ahora puedes usar `caprover deploy --imageName` con tu registro de imágenes privado.


#### Fichas de aplicación

Cuando usa CI/CD, puede ser más conveniente evitar almacenar su contraseña. En su lugar, puede crear tokens específicos de la aplicación para la implementación de cada aplicación.

```
caprover deploy --appToken <YOUR_APP_TOKEN_HERE> --caproverUrl https://captain.domain.com --imageName YOUR_IMAGE_NAME --appName YOUR_APP_NAME
```

Por lo general, es más seguro guardar el token en una variable de entorno; CLI lo cargará desde la variable `CAPROVER_APP_TOKEN`.

¡Esta funcionalidad está disponible desde el backend CapRover 1.10 y la versión CapRover CLI de 2.2.0!



#### Método alternativo

Alternativamente, puedes usar un webhook en lugar de `docker run caprover/cli-caprover:v2.1.1 caprover deploy....`. Este método es un poco más complejo.

El siguiente NO es un ejemplo que FUNCIONA. En cambio, es solo una pista sobre los pasos necesarios para que funcione el método webhook.

```bash
    - echo "Deploying on CapRover..."
    - export DEPLOY_BRANCH=deploy-caprover
    - cd ~
    - git clone your-repo
    - cd your-repo
    - git checkout $DEPLOY_BRANCH || git checkout -b $DEPLOY_BRANCH
    - git rm -rf .
    - git clean -fdx .
    - echo "{\"schemaVersion\":2,\"imageName\":\"$CONTAINER_FULL_IMAGE_NAME_WITH_TAG\"}" > captain-definition
    - git add .
    - git commit -m "Deploy $CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - git push --set-upstream origin $DEPLOY_BRANCH
    - curl -X POST https://captain.rootdomain.com/your-webhook
```

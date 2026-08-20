---
id: deploy-from-github
title: Construya, pruebe e implemente desde GitHub
sidebar_label: Implementar desde GitHub
---

## Implementación directamente desde Github

Este ejemplo muestra una aplicación Vue 3 con un backend PHP que se puede crear, probar e implementar directamente desde Github a CapRover utilizando el CapRover [GitHub Action](https://github.com/caprover/deploy-from-github) mantenido por la comunidad. Siéntete libre de clonar un proyecto de ejemplo de https://github.com/PremoWeb/SDK-Foundation-Vue para probar cosas o crear tu próxima aplicación increíble.

### Crear una nueva aplicación

El nombre que elijas aquí se convertirá en el secreto APP_NAME.

![Crear una nueva aplicación](/img/docs/deploy-from-github/create-a-new-app.png "Create a new app")

### Habilitar token de aplicación

Busque la pestaña "Implementación" de su nueva aplicación, haga clic en Habilitar token de aplicación y copie este token. Este es tu secreto APP_TOKEN.

![Crear una nueva aplicación](/img/docs/deploy-from-github/enable-app-token.png "Enable App Token")

### Agregue los secretos Github

![Agregue los Github Secretos](/img/docs/deploy-from-github/create-github-secrets.png "Add your Github Secrets")

<hr />

![Creando un secreto](/img/docs/deploy-from-github/adding-a-secret.png "Creating a secret")

_Repita el proceso para sus secretos APP_TOKEN y CAPROVER_SERVER._

NOTA: El servidor CapRover debe tener el formato "https://captain.apps.your-domain.com".. Puede configurar CAPROVER_SERVER como Secreto global para todos sus proyectos públicos y/o privados.

<hr />

### Agregar archivos al proyecto

Necesitará como mínimo dos archivos para implementar en CapRover utilizando este método.

El primer archivo será su archivo `captain-definition` utilizado por CapRover al implementar su aplicación. El otro archivo es un archivo yaml de flujo de trabajo que Github Acciones utilizará para procesar su proyecto antes de la implementación.

Contenido de nuestro nuevo archivo de flujo de trabajo que se guardará en `.github/workflows/deploy.yml`:

```
name: Build & Deploy

on:
  push:
    branches: [ "main" ]

  pull_request:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run build --if-present
      - run: npm run test --if-present

      - uses: a7ul/tar-action@v1.1.0
        with:
          command: c
          cwd: "./"
          files: |
            backend/
            frontend/dist/
            captain-definition
          outPath: deploy.tar

      - name: Deploy App to CapRover
        uses: caprover/deploy-from-github@v1.0.1
        with:
          server: '${{ secrets.CAPROVER_SERVER }}'
          app: '${{ secrets.APP_NAME }}'
          token: '${{ secrets.APP_TOKEN }}'
```

Un desglose rápido de lo que está viendo arriba:

El primer paso es verificar y construir la parte frontal Vue 3 de la aplicación usando NPM. El resultado de la compilación se ubicará en la interfaz/dist/. Si está presente, la aplicación también se habrá probado antes del segundo paso.

El segundo paso copia los directorios `backend/`, `frontend/dist/` y el archivo `captain-definition` en un archivo de implementación.tar.

El último paso enviará el archivo tarball a CapRover para que CapRover pueda comenzar a implementar su aplicación.

### ¡Confirma cambios en tu código para implementar!

Cuando envía archivos al repositorio de su proyecto en la rama "principal", Github Acciones iniciará el procesamiento de su archivo de flujo de trabajo y, al finalizar, verá su aplicación implementada en Caprover en solo unos segundos. Cualquier error visto por Github enviará automáticamente un correo electrónico informándote. ¡Sin correos electrónicos significa una implementación exitosa!

<hr />

### Método alternativo (más eficiente)

Alternativamente, puede incluso crear la imagen Docker en Github y simplemente implementar el artefacto creado en su instancia CapRover. Esto ayudará ya que no consume RAM y CPU de su instancia CapRover para crear su imagen.

Para lograr esto, necesitaremos seguir los siguientes pasos para crear la imagen Docker usando GitHub Actions, almacenarla usando paquetes GitHub y luego implementarla en CapRover.

#### Crear un token de acceso personal GitHub

Deberá crear un GitHub Token de acceso personal con **permiso de escritura para paquetes**.

GitHub tiene una excelente guía sobre cómo crear un token de acceso personal si aún no lo ha hecho. Aquí está el enlace: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

#### Crear una nueva aplicación

Si aún no tiene una aplicación en CapRover, cree una siguiendo las instrucciones [aquí](#create-a-new-app)

Si ya tienes una aplicación en CapRover, puedes omitir este paso.

#### Habilitar token de aplicación

Si aún no tiene un token de aplicación para su aplicación, cree uno siguiendo las instrucciones [aquí](#enable-app-token)

Si tiene un token de aplicación, téngalo a mano ya que lo necesitaremos en el siguiente paso.

#### Agregue los secretos GitHub

Deberá agregar la siguiente información en GitHub Secretos:

- Nombre de la aplicación: nombre de la aplicación en CapRover
- App Token: token de aplicación que obtuvimos en el paso anterior.
- CapRover Servidor URL: URL de tu CapRover Servidor
- GitHub Token: GitHub Token de acceso personal que creó en el paso anterior

Puedes agregar GitHub Secretos siguiendo las instrucciones [aquí](#add-the-github-secrets)

#### Agregar un Docker Registry privado a CapRover

Para extraer la imagen de GitHub Paquetes, deberá agregar un registro Docker privado a CapRover. Si no ha hecho esto antes, puede hacerlo siguiendo las instrucciones [aquí](https://caprover.com/docs/app-scaling-and-cluster.html#add-a-private-docker-registry)

Utilice estos valores:

- Nombre de usuario: `<your github username>`
- Contraseña: `<your github personal access token>`
- Dominio: `ghcr.io` (sin www, sin http)
- Prefijo de imagen: `<your github username or your org username>` (si estás extrayendo imágenes de una organización diferente a tu nombre de usuario)

> Si el prefijo de su imagen es su nombre de usuario de github, su prefijo DEBE ESTAR en minúsculas

#### Crea el GitHub Action

GitHub Actions es la tubería CI/CD integrada en GitHub. Si no está familiarizado con él, sería beneficioso aprender los conceptos básicos revisando los Documentos de comprensión GitHub Actions de GitHub: https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions

A continuación se muestra un ejemplo GitHub Action que crea un contenedor acoplable en cada envío a una solicitud de extracción y lo implementa en el servidor CapRover (buen ejemplo para la configuración de un entorno de desarrollo).

```
name: Build and Deploy Docker Image

on: [pull_request]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Check out repository
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
            registry: ghcr.io
            username: ${{ github.repository_owner }}
            password: ${{ secrets.GITHUB_TOKEN }}

    - name: Preset Image Name
      run: echo "IMAGE_URL=$(echo ghcr.io/${{ github.repository_owner }}/${{ github.event.repository.name }}:$(echo ${{ github.sha }} | cut -c1-7) | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV

    - name: Build and push Docker Image
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./Dockerfile
        push: true
        tags: ${{ env.IMAGE_URL }}

    - name: Deploy Image to CapRrover
      uses: caprover/deploy-from-github@v1.1.2
      with:
        server: "${{ secrets.CAPROVER_SERVER }}"
        app: "${{ secrets.APP_NAME }}"
        token: "${{ secrets.APP_TOKEN }}"
        image: ${{ env.IMAGE_URL }}
```

Aquí hay una explicación rápida de lo que hace cada paso de la acción:

1. **Ver repositorio**: este paso utiliza la acción `actions/checkout@v2`, que es un GitHub Action predefinido que permite que el flujo de trabajo acceda al contenido del repositorio. La acción de pago clonará el repositorio en el ejecutor (el entorno virtual que GitHub Actions utiliza para ejecutar flujos de trabajo), de modo que todos los pasos posteriores del flujo de trabajo puedan operar en él.
2. **Configurar Docker Buildx**: este paso utiliza la acción `docker/setup-buildx-action@v1`, que es una acción Docker para configurar Docker Buildx. Esto permite capacidades de construcción de contenedores más avanzadas.
3. **Iniciar sesión en Container Registry**: este paso utiliza `docker/login-action@v2` para iniciar sesión en GitHub Container Registry (ghcr.io) utilizando el nombre de usuario del propietario del repositorio y un GitHub Token (GITHUB_TOKEN). Este token debe haber sido almacenado previamente en los secretos del repositorio.
4. **Nombre de imagen preestablecida**: este es un comando de shell que construye el URL para la imagen Docker. Utiliza el propietario del repositorio GitHub, el nombre del repositorio y el SHA de la confirmación actual (truncado a los primeros 7 caracteres) para construir un URL, convirtiendo todos los caracteres en mayúsculas a minúsculas y luego escribe este URL en el `GITHUB_ENV` para que pueda usarse en pasos posteriores como una variable de entorno.
5. **Construir y enviar Docker Imagen**: este paso utiliza `docker/build-push-action@v4` para construir la imagen Docker usando el Dockerfile en el repositorio y la envía al GitHub Registro de contenedor en el URL que se configuró en el paso anterior. La configuración `context: .` indica que el contexto de compilación es el directorio actual (es decir, la raíz del repositorio).
6. **Implementar imagen en CapRover**: este paso utiliza la acción `caprover/deploy-from-github@v1.1.2` para implementar la imagen Docker que se acaba de crear y enviar a CapRover. Los detalles del servidor CapRover, el nombre de la aplicación y un token de acceso se proporcionan a partir de los secretos del repositorio. La imagen Docker URL se toma de la variable de entorno establecida anteriormente.

#### ¡Desplegar!

Después de implementar estos cambios, confirme + envíelos a su repositorio y observe cómo sucede la magia 🪄

### ¿Necesitas ayuda?

Se encuentra disponible soporte comercial y comunitario. Visite la página [Ayuda y soporte](/docs/support.html "Help and Support") para obtener más detalles.

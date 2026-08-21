---
id: recipe-deploy-create-react-app
title: Aplicación estática React
sidebar_label: Aplicación estática React
---


## Aplicación de muestra

Consulte [directorio de aplicaciones de muestra](https://github.com/caprover/caprover/tree/master/captain-sample-apps) para ver una aplicación React lista para implementar. Si bien el ejemplo dado en ese directorio es excelente, si su servidor no tiene suficiente RAM y su paquete.json tiene demasiadas dependencias, su proceso de compilación puede fallar en su servidor cuando se queda sin memoria. En ese caso, puede seguir los pasos que se indican a continuación para crear su aplicación en su propia máquina local (por ejemplo, su computadora portátil) e implementar el código creado en el servidor.


## Construir en la máquina local

Aquí hay una pequeña guía paso a paso para implementar un `create-react-app` como sitio estático.
A diferencia del `caprover deploy` normal que implementaría archivos fuente en un contenedor `NodeJS`, luego compilaría su aplicación y ejecutaría un pequeño servidor de nodo para servir sus archivos, esta guía muestra cómo puede compilar localmente e implementar el paquete estático en un contenedor de servidor estático simple.

La gran ventaja de esta técnica es que la compilación se realiza en su máquina, donde ya tiene `node_modules` y probablemente más potencia informática que en su servidor. Además, solo carga archivos minimizados y no todo el código base. Debido a esto, la implementación es mucho más rápida y requiere menos procesamiento informático para su servidor.

Si bien esta guía utiliza `create-react-app` como ejemplo, puedes aplicar la misma técnica para cualquier proyecto estático (VueJS, Parcel, Angular...).

#### Crea tu aplicación

Lo primero que debe hacer es crear su aplicación para producción.

```bash
npm run build
```

#### Crear `captain-definition`

Luego crea un `captain-definition` en la raíz de tu proyecto:

```json
{
  "schemaVersion": 2,
  "dockerfileLines": [
    "FROM socialengine/nginx-spa:latest", 
    "COPY ./build /app", 
    "RUN chmod -R 777 /app"
  ]
}
```

Este `captain-definition` usa `socialengine/nginx-spa`, que es un servidor ngninx estático simple que maneja `pushState` (cada solicitud se enruta a `/index.html` para que pueda usar el enrutamiento frontend).

**Nota**: Si su salida `build` está en una carpeta diferente a `build`, debe cambiar `COPY ./build /app` a `COPY ./[my-output-folder] /app`

#### Crea el archivo `tar`

Ahora necesita crear un archivo `tar`, normalmente no tiene que hacer esto porque `caprover deploy` crea uno desde su repositorio git, pero aquí no queremos poner el contenido de nuestro repositorio en el `tar` sino solo los archivos estáticos y el archivo `captain-definition`.

```bash
tar -cvf ./deploy.tar --exclude='*.map' ./captain-definition ./build/*
```

**Nota**: Si su salida `build` está en una carpeta diferente a la `build`, debe reemplazar `./build/*` con `./[my-output-folder]/*`

**Nota**: También excluimos los archivos `.map` porque suelen ser bastante grandes y prolongan la carga. Si desea archivos `.map` en producción, simplemente elimine el archivo `--exclude='*.map'`.

**Consejo**: Agrega `deploy.tar` a tu `.gitignore` para evitar presionarlo accidentalmente 😉

#### Implementar con `caprover`

Ahora todo lo que tenemos que hacer es usar `caprover` CLI con un argumento `-t` para usar nuestro propio archivo `tar` en lugar del creado desde el repositorio git.

```bash
caprover deploy -t ./deploy.tar
```

Luego responde las preguntas como de costumbre, espera la carga y 🎉

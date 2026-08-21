---
id: deployment-methods
title: Métodos de implementación
sidebar_label: Métodos de implementación
---

<br/>
Independientemente de su método de implementación, asegúrese de tener un archivo 'captain-definition' en su proyecto. Consulte los documentos en [Captain Definición](captain-definition-file.md) para obtener más detalles.

## Implementar a través de CLI
Simplemente ejecuta `caprover deploy` en tu repositorio git y sigue los pasos. Este es el mejor método, ya que es el único que le informa posibles errores de compilación. Lea más sobre esto aquí:
 [Comenzar - Paso 5](get-started.md#step-5-deploy-the-test-app).

## Implementar a través del panel web
Convierta el contenido de su proyecto en un tarball (`.tar`), vaya a su panel web Captain y cargue el archivo tar. Este método de implementación normalmente se utiliza únicamente con fines de prueba.

Para archivos captain-definition que no requieren ningún código fuente, como [este](/docs/captain-definition-file.html#use-image-name), simplemente puede copiar y pegar el contenido captain-definition en el panel web.

![implementar aplicación](/img/docs/app-deploy.png)

## Revertir con un clic

Supongamos que implementó una nueva versión de su aplicación. Pero te das cuenta de que tiene errores. No tienes tiempo para regresar, revertir los cambios o corregir el error, ¿qué harías? ¡Simple! Simplemente vaya a la pestaña de implementación y haga clic en el ícono de revertir al lado de la versión a la que desea volver. CapRover ¡Inicia automáticamente una nueva compilación e implementa esa versión! Tenga en cuenta que esto **NO** revierte los cambios que realizó en las variables de entorno y otras configuraciones de aplicaciones, como directorios persistentes, etc. Simplemente revierte su imagen (código fuente implementado).

## Implementación automática usando Github, Bitbucket, etc.
Este método es quizás el más conveniente. Este método activa automáticamente una compilación con un archivo `captain-definiton` cuando envía su repositorio a una rama específica (como `master` o `staging` o `release` o etc.). Para configurar esto, vaya a la configuración de sus aplicaciones e ingrese la información del repositorio:
- repositorio: esta es la dirección principal HTTPS del repositorio, en el caso de github, está en formato `github.com/someone/something`. Asegúrese de que NO incluya el prefijo `https://` ni el sufijo `.git`.
- sucursal: La sucursal de la que desea que se realice el seguimiento, por ejemplo `master` o `staging` o `release`...
- nombre de usuario de github/bitbucket (dirección de correo electrónico): este es el nombre de usuario que se utilizará cuando Captain descargue el repositorio.
- Contraseña de github/bitbucket: puedes ingresar cualquier texto que no esté vacío, como `123456`, para proyectos públicos.
- O, en lugar de nombre de usuario/contraseña, use la tecla SSH: asegúrese de usar el formato PEM ya que es posible que otros formatos no funcionen. Utilice el siguiente comando si no está seguro:
 ```
ssh-keygen -m PEM -t ed25519 -C "yourname@example.com" -f ./deploykey -q -N ""
```

Después de ingresar esta información, guarde su configuración. Y ve a la página de aplicaciones nuevamente. Ahora verá un nuevo webhook de llamada de campo. Simplemente copie este webhook en los webhooks de su repositorio de github/bitbucket (ver más abajo). Captain escucha las solicitudes POST en este enlace y activa una compilación.

#### Github
Cree un webhook aquí:
- Proyecto > Configuración > Agregar Webhook > URL: Captain Webhook desde la página de aplicaciones, Tipo de contenido: `application/json`, 
Secreto: <Leave empty>, solo el evento `push`.
Además, agregue el contenido de su clave pública generada a las claves de implementación de sus repositorios.


#### Bitbucket
Los webhooks se pueden agregar aquí:
- Proyecto > Configuración > Webhooks > Agregar Webhook > Título: Captain Servidor, URL: Captain Webhook desde su página de aplicaciones.

#### GitLab y otros
Los webhooks se pueden agregar de manera similar. Siempre que el webhook active una solicitud POST, CapRover puede recogerla e iniciar una compilación desde la última confirmación en la rama especificada.

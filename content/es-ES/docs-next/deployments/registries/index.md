---
id: index
title: Container Registries
slug: /deployments/registries
---

<span id="source-deployments-registries-private"></span>

## Registries privados

- CapRover necesita credenciales de registry para descargar imágenes Docker privadas.
- En **Cluster / Registries** del dashboard, añade el registry remoto indicando dominio, usuario, contraseña o token de lectura y, si corresponde, un prefijo de imagen.
- CapRover utiliza las credenciales de pull para nombres de imagen que empiezan por `DOMAIN/PREFIX/` si configuras un prefijo, o `DOMAIN/` si lo dejas vacío.
- También utiliza ese prefijo al etiquetar imágenes que CapRover compila para el registry de push predeterminado.
- Comprueba el nombre completo de la imagen antes de confiar en esas credenciales.

- Para `ghcr.io/my-org/my-api:tag`, utiliza `ghcr.io` como dominio del registry y la ruta correspondiente a la organización o propietario como prefijo, con un token autorizado a leer el paquete.
- Para `registry.gitlab.com/my-group/my-project/image:tag`, utiliza la ruta de registry de GitLab y credenciales de lectura con permisos mínimos.

- Despliega la imagen con su nombre completo de registry y verifica que pueda descargarse desde todos los nodos previstos.
- Que CI haga push de una imagen no autentica automáticamente a CapRover para hacer pull.
- Si solo necesitas descargar imágenes ya compiladas, no selecciones ese registry como predeterminado para hacer push de las imágenes que construye CapRover.

<span id="source-deployments-registries-default-push"></span>

## Registry de push predeterminado

- El **default push registry** almacena las imágenes construidas por CapRover para que otros nodos de Swarm puedan descargarlas.
- Selecciona un registry accesible en **Cluster / Registries** del dashboard y configura sus credenciales.
- Un servidor de un único nodo puede funcionar sin él. CapRover requiere un default push registry antes de añadir nodos mediante su flujo de clúster.

- Si compilaste aplicaciones antes de configurar el registry, vuelve a desplegarlas para publicar las imágenes que utilizarán los nuevos nodos.
- Comprueba que un despliegue nuevo hace push correctamente antes de añadir un worker.
- Mantén el registry disponible durante despliegues y recuperación. Eliminar o desactivar las credenciales en un clúster puede impedir que sus nodos descarguen imágenes.

Puedes utilizar un [registry autohospedado](index.md) o uno remoto. Las credenciales solo de pull para imágenes precompiladas son independientes y no requieren configurar default push.

<span id="source-deployments-registries-self-hosted"></span>

## Registry autohospedado

- CapRover puede administrar un Docker registry para su propio clúster.
- Configúralo desde **Cluster / Registries** y selecciónalo como default push registry si vas a añadir nodos.
- Comprueba que todos los nodos pueden acceder al registry antes de desplegar aplicaciones por el clúster.

- El registry autohospedado de CapRover usa el puerto `996/tcp`.
- Abre ese puerto solo para los clientes o nodos que realmente lo necesiten y utiliza la autenticación configurada.
- Un registry que se ejecuta en el mismo servidor sigue siendo una dependencia: si ese host o su almacenamiento deja de funcionar, los nodos nuevos pueden quedarse sin acceso a las imágenes.

Tras habilitar default push, vuelve a desplegar las aplicaciones existentes para publicar sus imágenes. Después sigue la [guía de configuración multinodo](../../scaling/multi-node.md) para añadir y comprobar los workers.

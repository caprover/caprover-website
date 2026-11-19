---
id: upgrade
title: Actualizar CapRover
slug: /server/upgrade
---

En el dashboard, abre **Maintenance → CapRover Updates** y haz clic en **Install Update** cuando haya una versión estable disponible. En versiones anteriores del dashboard, busca esta opción en **Settings**.

Ejecuta estos comandos en el nodo manager de Swarm.

<span id="docker-api-compatibility"></span>

## Requisitos de la API de Docker

Si el dashboard bloquea una actualización porque la API de Docker del servidor es demasiado antigua, actualiza primero Docker Engine y vuelve a intentarlo desde el dashboard. Antes de actualizar Docker Engine, comprueba que la nueva versión sea compatible con la versión de la API que hayas configurado en `dockerApiVersion`.

El dashboard compara la versión máxima de la API de Docker que admite el servidor con el requisito de la versión de CapRover que vas a instalar. El ajuste `dockerApiVersion` solo selecciona la versión de la API que Captain usa para sus propias llamadas. El desarrollo y las pruebas de CapRover se realizan con la versión predeterminada de la API. Que una actualización funcione con una versión anterior de la API no garantiza que las siguientes también funcionen.

### Actualización manual con una versión de API personalizada

Sigue este procedimiento solo si tu instalación actual de CapRover ya funciona con un valor personalizado de `dockerApiVersion`. Actualizar directamente el servicio `captain-captain` omite la comprobación de compatibilidad de CapRover. Captain podría no iniciarse y dejar el dashboard inaccesible, o podrían fallar operaciones como el despliegue de apps después del arranque. Continúa bajo tu responsabilidad y prepárate para verificar la actualización y recuperar el servidor.

1. [Haz una copia de seguridad de CapRover y de los datos de tus aplicaciones](backup/index.md). Conéctate por SSH a un nodo manager de Swarm y guarda la referencia de la imagen actual, incluido el digest si aparece.

   ```bash
   docker service inspect --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' captain-captain
   ```

2. Sustituye `TARGET_VERSION` por la etiqueta exacta de la versión de CapRover y actualiza el servicio.

   ```bash
   docker service update --image caprover/caprover:TARGET_VERSION captain-captain
   ```

3. Comprueba la versión en el dashboard, que las apps sean accesibles y que se puedan desplegar.
4. Si falla la actualización y la versión anterior aún puede leer los datos actuales, sustituye `PREVIOUS_IMAGE` por la referencia completa que guardaste y vuelve a desplegar esa imagen. Si la actualización introdujo cambios incompatibles en los datos, [restaura la copia de seguridad anterior a la actualización en un servidor nuevo](backup/restore.md). En el comando `docker run` de la guía de restauración, sustituye `caprover/caprover` por la referencia completa de la imagen anterior que guardaste.

   ```bash
   docker service update --image PREVIOUS_IMAGE captain-captain
   ```

<span id="probar-una-imagen-edge"></span>

## Cambiar a edge

```bash
docker pull caprover/caprover-edge:latest
docker service update captain-captain --image caprover/caprover-edge:latest
```

## Volver a la versión estable

```bash
docker service update captain-captain --image caprover/caprover:latest
```

El cambio puede fallar si la versión edge introdujo cambios incompatibles con la versión estable.

Si falla la actualización, consulta [Diagnósticos](../troubleshooting/diagnostics.md).

---
id: index
title: Configuración avanzada de aplicaciones
slug: /applications/advanced
---

<span id="source-applications-advanced-service-update-override"></span>

## Service Update Override

- El campo **Service Update Override** combina ajustes JSON o YAML con la actualización del servicio Docker que CapRover prepara al configurar o desplegar una aplicación.
- Permite establecer opciones de Docker Service que el dashboard no expone.
- Empieza con el override más pequeño posible:

```yaml
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes: 104857600
```

- Este ejemplo limita la memoria del servicio a 100 MiB.
- Comprueba el valor con `docker service inspect SERVICE_NAME`; obtén el nombre real con `docker service ls`.
- Prueba la aplicación con una carga representativa antes de mantener ese límite.

- El orden de aplicación es: ajustes normales de CapRover, Service Update Override y, por último, la función opcional de pre-deploy.
- Un override puede sustituir un valor elegido por CapRover.
- Los valores deben seguir el esquema de la API de actualización de servicios Docker.
- Quitar el override no siempre restablece un campo de Docker que CapRover no administra. Al revertir el cambio, restablece explícitamente el valor.

- Guarda una copia de los ajustes del servicio que sabes que funcionan.
- Un override inválido o contradictorio puede impedir los despliegues.
- Consulta la [API de actualización de servicios de Docker](https://docs.docker.com/reference/api/engine/) para ver el esquema de la versión de Docker instalada.

<span id="source-applications-advanced-pre-deploy-function"></span>

## Pre-Deploy Function

- Una **Pre-Deploy Function** es código JavaScript que se ejecuta dentro del proceso de CapRover antes de actualizar el servicio Docker de una aplicación.
- Puede consultar el objeto de la aplicación guardada y modificar el objeto de actualización del servicio.
- Se ejecuta después de aplicar los ajustes normales y el Service Update Override.

```javascript
var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
  return Promise.resolve(dockerUpdateObject);
};
```

- La función debe devolver el objeto de actualización del servicio, directamente o mediante una promesa.
- Vuelve a ejecutarse al desplegar o actualizar la configuración.
- Pruébala primero en una aplicación descartable y conserva una copia funcional de la función y la configuración del servicio.

- Este código tiene los mismos privilegios que el proceso de CapRover.
- Puede impedir actualizaciones o acceder a información sensible. Limita quién puede editarlo.
- Para campos de servicio estáticos, utiliza preferiblemente [Service Update Override](index.md).
- Si una actualización falla antes de llegar a Docker, revisa `docker service logs captain-captain`.

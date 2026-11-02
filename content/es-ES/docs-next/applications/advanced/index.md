---
id: index
title: Configuración de aplicaciones avanzadas
slug: /applications/advanced
---

<span id="source-applications-advanced-service-update-override"></span>

## Actualización de servicio Override

- El **Actualización de servicio Override** campo fusiona la configuración JSON o YAML en la actualización de servicio Docker que CapRover prepara cuando una aplicación está configurada o desplegada.
- Es útil para las opciones de servicio Docker que el dashboard no expone.
- Comience con la anulación más pequeña posible:

```yaml
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes: 104857600
```

- Este ejemplo limita el servicio a 100 MiB de memoria.
- Verificar el valor con `docker service inspect SERVICE_NAME`; obtener el nombre real de `docker service ls`.
- Prueba bajo carga realista antes de mantener un límite.

- La orden de actualización es la configuración normal de CapRover, luego la anulación del servicio, luego la función opcional previa al despliegue.
- Una anulación puede reemplazar un ajuste elegido por CapRover.
- Los valores deben coincidir con la actualización de servicio de Docker API.
- La eliminación de una anulación no necesariamente aclara un campo Docker que CapRover en sí no maneja; restablecer explícitamente el valor al deshacer tal cambio.

- Mantenga una copia de la configuración del servicio de trabajo.
- Una anulación inválida o contradictoria puede bloquear las implementaciones.
- See [Actualización de servicio de Docker API](https://docs.docker.com/reference/api/engine/) para el esquema utilizado por la versión Docker ejecutando su servidor.

<span id="source-applications-advanced-pre-deploy-function"></span>

## Función previa al despliegue

- A **Función previa al despliegue** Es JavaScript ejecutado dentro del proceso CapRover antes de la actualización de servicio Docker de una aplicación.
- Puede inspeccionar el objeto de aplicación almacenado y modificar el objeto de actualización del servicio.
- Se ejecuta después de que se hayan aplicado los ajustes de aplicación estándar y Service Update Override.

```javascript
var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
  return Promise.resolve(dockerUpdateObject);
};
```

- La función debe devolver el objeto de actualización del servicio, posiblemente mediante una promesa.
- Se ejecuta de nuevo en implementaciones y actualizaciones de configuración.
- Pruébalo contra una aplicación desechable antes de utilizarla para servicios importantes, y conserva una copia de trabajo de la configuración de funciones y servicios.

- Este código tiene los privilegios del proceso CapRover.
- Puede romper actualizaciones de servicio o acceder a datos sensibles, así que restringir quién puede editarlo.
- Para los campos de servicio estáticos, prefiera un [Actualización de servicio Override](index.md).
- Check `docker service logs captain-captain` si una actualización de servicio falla antes de llegar a Docker.

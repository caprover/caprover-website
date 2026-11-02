---
id: diagnostics
title: Recoger Diagnósticos
slug: /troubleshooting/diagnostics
---

## Cheques rápidos

Captura: tiempo, operación, aplicación afectada/dominio, resultado esperado, resultado real y error.

En el **Swarm manager**:

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
```

**Compruebe por síntoma:**

- **Aplicación:** Encontrar su nombre en `docker service ls`. Las aplicaciones más antiguas pueden usar `srv-captain--APP_NAME`. Uso `docker service ps SERVICE_NAME` y `docker service logs SERVICE_NAME`.
- **Networking:** Revise DNS y pruebe HTTP y HTTPS por separado.
- **Almacenamiento:** Compruebe los montajes, el espacio de disco y la colocación de nodos.

## Recoger un informe completo del servidor

Usar el [colector de diagnóstico](https://github.com/caprover/caprover-website/blob/master/scripts/caprover-diagnostic.sh) si el dashboard no está disponible, varios servicios fallan, o cheques rápidos son inconclusivos. Ejecutar en un Debian/Ubuntu **Swarm manager** con sistema:

```bash
curl -fL https://raw.githubusercontent.com/caprover/caprover-website/master/scripts/caprover-diagnostic.sh -o caprover-diagnostic.sh
less caprover-diagnostic.sh
sudo sh ./caprover-diagnostic.sh
```

**Producto:** `/tmp/caprover-diagnostic.*.txt`Con permisos solo para el propietario.

**Los cheques incluyen:**

- Port owners (80/443/3000), host web servers, local HTTP responses
- Docker/Swarm servicios, errores de tarea, especificaciones y registros
- `/captain` montajes y permisos, redes, cortafuegos, errores de kernel y daemon
- Historial del paquete y tiempos de ejecución de contenedores disponibles

El colector prueba brevemente local `hello-world` y `nginx:1.27.2` imágenes **si ya está disponible**. No tira imágenes ni cambia la configuración de servicio CapRover.

**Lea el resumen del informe primero.** Ejemplos:

- **Puerto 80/443 propiedad de otro proceso:** CapRover NGINX puede no atar.
- **La tarea de Swarm rechazó:** Inspeccione su error de tarea.
- **`/captain` Falta el montaje:** Inspeccione el camino de acogida y las monturas.
- **Docker API warning:** Revisa otras pruebas también. In [cuestión #2377](https://github.com/caprover/caprover/issues/2377), host NGINX ocupado puerto 80.

## Antes de compartir

- Revise todo el informe para contraseñas, fichas, datos de usuario privado, nombres de aplicaciones e identificación de detalles de host.
- El coleccionista omite variables de entorno Docker y contenidos de configuración de CapRover, pero los registros, argumentos e historial de paquetes todavía pueden contener datos sensibles.
- Compartir sólo secciones relevantes y sanitarias.

See [Diagnóstico del servidor](diagnostics.md) para las medidas de recuperación específicas.

<span id="source-server-diagnostics"></span>

## Servicios de reinicio o inspección

```bash
docker service update captain-captain --force   # Restart CapRover
docker service update SERVICE_NAME --force      # Restart an app
docker service logs SERVICE_NAME --since 10m
```

Corre Docker ordena a un gerente de Swarm. Obtenga el nombre exacto del servicio físico `docker service ls`. Para un shell dentro de una aplicación, use `docker exec` sobre el nodo que acoge su tarea (véase infra).

## Diagnósticos

Comience con la solicitud o aplicación de fallo, su timetamp, y el error exacto. En el panel, inspeccione el historial de implementación y los registros de la aplicación. En el host de gerente:

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
docker system df
```

- Para una aplicación, encuentre su servicio en `docker service ls` y la inspección `docker service ps SERVICE_NAME --no-trunc` y `docker service logs SERVICE_NAME --tail 100`.
- Las aplicaciones más nuevas generalmente usan el nombre de la aplicación; aplicaciones heredadas pueden usar `srv-captain--APP_NAME`.
- Para fallos DNS o HTTPS, registros de verificación, posibilidad de llegar al puerto y estado de certificado del dominio.
- Para cuestiones multinodo, verifique la disponibilidad de nodos y la creación de redes privadas.
- Eliminar contraseñas, fichas y datos privados de los registros antes de compartirlos.
- See [Solución de problemas](index.md) encontrar un guía por síntoma.

Para una salida que implica varios servicios del sistema o un fracaso host poco claro, [recopilar un informe completo del servidor](diagnostics.md#collect-a-full-server-report) en el gerente.

### Dashboard no disponible en el puerto 3000

- En el gerente, compruebe `docker service ps captain-captain --no-trunc`, entonces inspeccionar `docker service logs captain-captain --since 60m` y `docker service logs captain-nginx --since 60m`.
- Corre `curl -v http://127.0.0.1:3000/` en el gerente.
- Si la solicitud local funciona pero la IP pública no lo hace, inspeccionar el proveedor y host firewalls y la cartografía portuaria.
- Si el servicio CapRover está reiniciando, utilice el error de tarea y los registros antes de cambiar la red.
- Para forzar un reinicio después de corregir el problema subyacente, ejecutar `docker service update captain-captain --force`.

### reiniciar o inspeccionar una aplicación

- Desde el panel, guarde la configuración de la aplicación para solicitar una actualización de servicio.
- Para un shell en una tarea de ejecución, primero obtener su nombre de servicio físico `docker service ls`, encontrar el host utilizando `docker service ps SERVICE_NAME`, y ejecutar estos en **ese anfitrión**:

```bash
docker ps --filter label=com.docker.swarm.service.name=SERVICE_NAME
docker exec -it CONTAINER_ID /bin/sh
```

Sustitución `SERVICE_NAME` y `CONTAINER_ID` con los valores que inspeccionaste. No todas las imágenes contienen `/bin/bash`; `/bin/sh` es más común. Un contenedor tiene amplio acceso a los datos y secretos de la aplicación.

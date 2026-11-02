---
id: diagnostics
title: Recopilar diagnósticos
slug: /troubleshooting/diagnostics
---

## Comprobaciones rápidas

Anota: fecha y hora, operación, aplicación o dominio afectado, resultado esperado, resultado real y mensaje de error.

En el **manager de Swarm**:

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
```

**Según el síntoma:**

- **Aplicación:** busca su nombre en `docker service ls`. Las aplicaciones antiguas pueden usar `srv-captain--APP_NAME`. Comprueba `docker service ps SERVICE_NAME` y `docker service logs SERVICE_NAME`.
- **Red:** comprueba DNS y prueba HTTP y HTTPS por separado.
- **Almacenamiento:** revisa los montajes, espacio en disco y nodo asignado.

<span id="collect-a-full-server-report"></span>

## Recopilar un informe completo del servidor

Utiliza el [script de diagnóstico](https://github.com/caprover/caprover-website/blob/master/scripts/caprover-diagnostic.sh) si el dashboard no funciona, fallan varios servicios o las comprobaciones rápidas no muestran la causa. Ejecútalo en un **manager de Swarm** con Debian o Ubuntu y systemd:

```bash
curl -fL https://raw.githubusercontent.com/caprover/caprover-website/master/scripts/caprover-diagnostic.sh -o caprover-diagnostic.sh
less caprover-diagnostic.sh
sudo sh ./caprover-diagnostic.sh
```

**Archivo de salida:** `/tmp/caprover-diagnostic.*.txt`, accesible solo al propietario.

**El informe incluye:**

- Procesos que ocupan puertos (80/443/3000), servidores web del host y respuestas HTTP locales.
- Servicios Docker/Swarm, errores de tareas, especificaciones y logs.
- Montajes y permisos de `/captain`, redes, firewall, errores del kernel y del daemon.
- Historial de paquetes y runtimes de contenedores disponibles.

El script prueba brevemente las imágenes locales `hello-world` y `nginx:1.27.2` **solo si ya están descargadas**. No descarga imágenes ni modifica la configuración de los servicios CapRover.

**Lee primero el resumen del informe.** Por ejemplo:

- **Otro proceso ocupa el puerto 80/443:** NGINX de CapRover podría no poder escuchar.
- **Tarea de Swarm rechazada:** revisa el error de la tarea.
- **Falta el montaje de `/captain`:** comprueba la ruta del host y los montajes.
- **Advertencia de API Docker:** contrástala con otras pruebas. En el [issue #2377](https://github.com/caprover/caprover/issues/2377), NGINX del host ocupaba el puerto 80.

## Antes de compartir el informe

- Revisa el archivo completo y elimina contraseñas, tokens, datos privados de usuarios, nombres de aplicaciones y detalles que identifiquen el servidor.
- El script omite variables de entorno de Docker y el contenido de la configuración de CapRover, pero los logs, argumentos e historial de paquetes pueden contener información sensible.
- Comparte solo las secciones necesarias después de sanitizarlas.

Consulta [Diagnósticos del servidor](diagnostics.md) para procedimientos más específicos.

<span id="source-server-diagnostics"></span>

## Reiniciar o inspeccionar servicios

```bash
docker service update captain-captain --force   # Restart CapRover
docker service update SERVICE_NAME --force      # Restart an app
docker service logs SERVICE_NAME --since 10m
```

Ejecuta comandos Docker en un manager de Swarm. Obtén el nombre exacto del servicio mediante `docker service ls`. Si necesitas un shell dentro de una aplicación, ejecuta `docker exec` en el nodo donde se está ejecutando la tarea (ver más abajo).

## Diagnóstico de errores

Empieza por la petición o aplicación que falla, la hora y el error exacto. En el dashboard revisa el historial de despliegues y los logs. En el manager:

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
docker system df
```

- Para una aplicación, busca su servicio en `docker service ls` y ejecuta `docker service ps SERVICE_NAME --no-trunc` y `docker service logs SERVICE_NAME --tail 100`.
- Las aplicaciones nuevas suelen utilizar el nombre de la aplicación; las antiguas pueden usar `srv-captain--APP_NAME`.
- Para DNS o HTTPS, comprueba registros, acceso a puertos y estado de certificados del dominio.
- En un clúster multinodo, revisa la disponibilidad de nodos y su red privada.
- Antes de compartir logs, elimina contraseñas, tokens y datos privados.
- Consulta [Solución de problemas](index.md) para buscar por síntomas.

Si fallan varios servicios del sistema o el host presenta un error desconocido, [recopila un informe completo](diagnostics.md#collect-a-full-server-report) en el manager.

### Dashboard inaccesible por el puerto 3000

- En el manager, ejecuta `docker service ps captain-captain --no-trunc`, y revisa `docker service logs captain-captain --since 60m` y `docker service logs captain-nginx --since 60m`.
- Prueba `curl -v http://127.0.0.1:3000/` desde el manager.
- Si la petición local funciona pero la IP pública no, revisa los firewalls del proveedor y del host, además del mapeo de puertos.
- Si el servicio CapRover se reinicia continuamente, consulta primero el error y los logs antes de cambiar la red.
- Tras resolver la causa, puedes forzar un reinicio con `docker service update captain-captain --force`.

### Reiniciar o inspeccionar una aplicación

- Desde el dashboard, guarda la configuración de la aplicación para solicitar una actualización del servicio.
- Para abrir un shell en una tarea, obtén primero el nombre del servicio mediante `docker service ls`, identifica el host con `docker service ps SERVICE_NAME` y ejecuta en **ese host**:

```bash
docker ps --filter label=com.docker.swarm.service.name=SERVICE_NAME
docker exec -it CONTAINER_ID /bin/sh
```

Sustituye `SERVICE_NAME` y `CONTAINER_ID` por los valores reales. No todas las imágenes incluyen `/bin/bash`; suele estar disponible `/bin/sh`. Un shell dentro del contenedor puede acceder a sus datos y secretos.

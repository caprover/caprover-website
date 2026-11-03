---
id: restore
title: Restaurar un servidor CapRover
slug: /server/backup/restore
---

## Antes de restaurar

- **Servidor:** Prepara un host nuevo con Docker, SSH y suficiente disco para el backup y sus datos extraídos.
- **Firewall:** Durante la instalación deben estar disponibles SSH, `80/tcp`, `443/tcp` y `3000/tcp`.
- **Clúster:** Configura los [puertos de Swarm y del registry](../../reference/ports.md) entre los nodos de confianza.
- **Datos:** Consulta [Qué incluye el backup](index.md) y prepara copias de seguridad independientes de bases de datos y volúmenes.

**Importante:** Coloca el archivo en `/captain/backup.tar` **antes** de ejecutar el instalador de CapRover. El instalador busca ese archivo al arrancar.

## Restauración

1. Copia el backup al servidor nuevo:

   ```bash
   ssh root@NEW_IP 'mkdir -p /captain'
   scp backup.tar root@NEW_IP:/captain/backup.tar
   ```

2. Inicia CapRover en el servidor nuevo:

   ```bash
   sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
     -e ACCEPTED_TERMS=true \
     -v /var/run/docker.sock:/var/run/docker.sock \
     -v /captain:/captain \
     caprover/caprover
   ```

   Si necesitas Docker, completa solo el paso [Instalar Docker](../../installation/manual.md#2-instalar-docker) antes de ejecutar el comando anterior.

3. Comprueba los logs del instalador. Para clústeres, sigue la [restauración multinodo](restore.md) cuando aparezca la solicitud de mapeo de nodos.
4. Cuando esté preparado el cambio, apunta el wildcard DNS original al nuevo servidor. Si vas a ejecutar una copia en paralelo con el original, utiliza otro dominio raíz.
5. Restaura por separado las bases de datos, volúmenes Docker y bind mounts. Si faltan imágenes, vuelve a desplegar las aplicaciones correspondientes.
6. Antes de desviar todo el tráfico, verifica el acceso al dashboard, HTTPS, los servicios y los datos de las aplicaciones.

Conserva el servidor original y los backups hasta que se haya comprobado la recuperación.

<span id="source-server-backup-multi-node-restore"></span>

## Restauración multinodo

Prepara un nodo manager nuevo y los nodos worker de reemplazo con Docker y acceso de red. Planifica también la recuperación de los datos persistentes de cada nodo antiguo. Sigue [Restaurar un servidor](restore.md) en el manager nuevo.

- En un backup multinodo, el instalador puede terminar intencionadamente en el primer intento y crear `/captain/restoring/restore-instructions.json`.
- Revisa `oldNodesForReference` y `nodesMapping` dentro de ese archivo.
- Sustituye `newIp` de cada worker antiguo por la IP del nodo que lo reemplazará.
- No modifiques la entrada `CURRENT_NODE_DONT_CHANGE` correspondiente al manager.
- El archivo también indica `user` y `privateKeyPath` para el acceso SSH de cada worker. Configura el acceso y copia de forma segura la clave privada a la ruta indicada (por defecto, `/captain/id_rsa`).

- Ejecuta **exactamente el mismo comando de instalación** otra vez en el manager nuevo.
- El instalador comprueba SSH con los workers y reasigna a los nodos de reemplazo las ubicaciones anteriores.
- Elimina la clave privada copiada cuando termine la restauración.
- Restaura los volúmenes y bind mounts de cada nodo por separado. Comprueba el registry, vuelve a desplegar imágenes no disponibles y revisa los servicios y su ubicación.
- **No apuntes el DNS de producción al clúster nuevo hasta completar las verificaciones.**

<span id="source-server-move-server"></span>

## Migrar CapRover a otro servidor

- En el servidor original, [crea un backup](index.md) y guarda por separado los volúmenes, bases de datos y archivos subidos de cada aplicación.
- Anota el dominio raíz, registros DNS, ubicación del registry, puertos personalizados y nodos asignados a las aplicaciones.
- Prepara Docker y los puertos necesarios en el destino. [Restaura el backup de CapRover](restore.md) o sigue la [restauración multinodo](restore.md) si se trata de un clúster.
- Restaura los datos de las aplicaciones, verifica que las imágenes se puedan descargar (o redespliega) y prueba el dashboard y las aplicaciones.
- Cuando todo funcione, cambia el wildcard DNS y el registro del dashboard a la IP nueva. Comprueba HTTPS cuando se propague el DNS.
- Mantén disponible el servidor anterior hasta validar la restauración.

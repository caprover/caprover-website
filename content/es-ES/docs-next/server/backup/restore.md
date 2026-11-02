---
id: restore
title: Restaurar un servidor
slug: /server/backup/restore
---

## Antes de restaurar

- **Servidor:** host fresco con Docker, SSH, y suficiente disco para el archivo y datos extraídos
- **Firewall:** SSH, `80/tcp`, `443/tcp`, y `3000/tcp` abierto durante la configuración
- **Clústeres:** Preparen confianza [Puertos de Swarm y registro](../../reference/ports.md)
- **Datos:** Leer [Lo que está respaldado](index.md) y obtener bases de datos y copias de seguridad de volumen separadas

**Importante:** Coloque el archivo en `/captain/backup.tar` **antes** ejecutando el instalador CapRover. El instalador lo detecta al inicio.

## Restauración

1. Copiar el archivo al nuevo servidor:

   ```bash
   ssh root@NEW_IP 'mkdir -p /captain'
   scp backup.tar root@NEW_IP:/captain/backup.tar
   ```

2. Ejecute CapRover en el nuevo servidor:

   ```bash
   sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
     -e ACCEPTED_TERMS=true \
     -v /var/run/docker.sock:/var/run/docker.sock \
     -v /captain:/captain \
     caprover/caprover
   ```

   ¿Necesita Docker? Seguir [Comienzo](../../get-started.md) primero.

3. Mira los registros del instalador. Para los grupos, siga [Restauración multinodo](restore.md) cuando se solicita para el mapeo de nodos.
4. Indique el DNS original comodín al nuevo servidor cuando esté listo. Para un clon que corre junto al original, elija un dominio raíz diferente.
5. Restaurar archivos de bases de datos, volúmenes y enlazar montajes por separado. Implementar aplicaciones si sus imágenes están desaparecidas.
6. Verifique el acceso de panel, HTTPS, servicios y datos de aplicaciones antes de cambiar completamente el tráfico.

Mantenga el servidor original y copias de seguridad hasta que la verificación tenga éxito.

<span id="source-server-backup-multi-node-restore"></span>

## Restauración multinodo

Prepare el nuevo gerente y cada worker de reemplazo con Docker, acceso a la red y un plan para los datos persistentes de los viejos nodos. Seguir [Restaurar un servidor](restore.md) en el nuevo gerente.

- Para una copia de seguridad multinodo, la primera ejecución del instalador puede salir intencionadamente y crear `/captain/restoring/restore-instructions.json`.
- Inspeccione su `oldNodesForReference` y `nodesMapping`.
- Para cada viejo worker, sustituya el titular del lugar `newIp` con su nodo de reemplazo IP.
- Deja el nodo manager `CURRENT_NODE_DONT_CHANGE` mapeando solo.
- El archivo también suministra el SSH `user` y `privateKeyPath` para cada worker; configurar el acceso y copiar la clave privada requerida de forma segura al camino indicado (por defecto `/captain/id_rsa`).

- Reacciona el **igual** comando de instalación en el nuevo gerente.
- El instalador comprueba SSH a los workers y mapas guardan la colocación del nodo a los reemplazos.
- Retire la clave privada copiada después de la restauración.
- Restaurar los volúmenes de cada nodo y unir montajes por separado, verificar el acceso al registro y redistribuir imágenes no disponibles, luego inspeccionar la colocación y los servicios.
- Nunca señale la producción DNS en el nuevo grupo hasta que la validación esté completa.

<span id="source-server-move-server"></span>

## Mover CapRover a otro servidor

- Uso [Crear un respaldo](index.md) en la fuente y copia de seguridad de los volúmenes de cada aplicación, bases de datos y archivos cargados por separado.
- Registre el dominio raíz, registros DNS, ubicación del registro, puertos personalizados y colocación de nodos de cada aplicación.

- Proporcione el destino con Docker y los puertos necesarios. [Restaurar el archivo CapRover](restore.md), o uso [Restauración multinodo](restore.md) para un clúster.
- Restaurar datos de aplicaciones, confirmar imágenes son accesibles o redespliegue, y probar el dashboard y las aplicaciones.
- Cambie los registros de DNS de comodín y dashboard a la nueva dirección cuando esté listo; compruebe HTTPS después de que DNS se propaga.
- Mantenga el antiguo host disponible hasta que el nuevo haya pasado un cheque de restauración.

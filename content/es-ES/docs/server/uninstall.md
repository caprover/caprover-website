---
id: uninstall
title: Desinstalar CapRover
slug: /server/uninstall
---

Antes de eliminar CapRover, exporta un [backup de CapRover](backup/index.md) y haz backups independientes de los datos de todas las aplicaciones. Documenta las dependencias de DNS y del registry de imágenes. Al eliminar CapRover o sus recursos Docker, las aplicaciones pueden dejar de estar disponibles.

CapRover no ofrece un comando de desinstalación que pueda decidir automáticamente qué datos o servicios de Swarm deben conservarse. Para retirar un host **dedicado** a CapRover:

1. Elimina o migra cada aplicación desde el dashboard. Anota su nombre real de servicio Docker y conserva los volúmenes o bind mounts necesarios. Comprueba que ningún cliente sigue dependiendo de sus dominios o puertos publicados.
2. Ejecuta `docker service ls` e identifica los servicios principales de CapRover (`captain-captain`, `captain-nginx`, `captain-certbot` y el registry opcional). Elimina **solo los servicios que realmente quieras retirar** con `docker service rm SERVICE_NAME`. No ejecutes `docker service rm $(docker service ls -q)` en un Swarm compartido: también eliminaría aplicaciones ajenas a CapRover.
3. Después de verificar que tienes un backup probado fuera del servidor, revisa `/captain` y la salida de `docker volume ls`. Elimina únicamente los directorios y volúmenes cuyos datos hayas decidido borrar. Un volumen puede conservar información valiosa incluso si ningún contenedor está en ejecución.
4. Elimina los registros DNS, las redirecciones de puertos y las reglas del firewall que ya no necesites. Ejecuta `docker swarm leave --force` **solo si** este host va a abandonar el clúster y ningún otro servicio depende de él. Si hay otros nodos, verifica primero el estado desde otro nodo.

- Conserva los backups y las imágenes del registry hasta verificar que el sistema de reemplazo puede recuperarse correctamente.
- Evita ejecutar `docker system prune --all` sin revisar su efecto: puede borrar imágenes necesarias para otras aplicaciones o para hacer rollback.

---
id: uninstall
title: Desinstalar CapRover
slug: /server/uninstall
---

Antes de eliminar CapRover, exportar a [Copia de seguridad](backup/index.md) y copias de seguridad separadas para los datos de cada aplicación. Registro DNS y dependencias del registro de imágenes. Eliminar CapRover o sus recursos Docker puede hacer que las aplicaciones no estén disponibles.

CapRover no tiene un comando único de desinstalación que decida con seguridad qué datos de aplicación u otros servicios de Swarm desea conservar. Para retirar un host **dedicado** a CapRover:

1. Eliminar o mover cada aplicación a través del dashboard, registrando su nombre de servicio Docker real y preservando cualquier volumen o monturas enlazadas que necesite. Confirme que ningún cliente todavía depende de su dominio o puerto publicado.
2. Corre `docker service ls` e identificar los servicios básicos de CapRover`captain-captain`, `captain-nginx`, `captain-certbot`, y cualquier registro opcional). Retirar **sólo los servicios que pretende retirar** con `docker service rm SERVICE_NAME`. No utilizar `docker service rm $(docker service ls -q)` sobre un Swarm compartido; también eliminaría aplicaciones no relacionadas.
3. Después de confirmar que tiene una copia de seguridad fuera del host, revisión `/captain` y la producción de `docker volume ls`. Retire sólo los directorios y volúmenes cuyos datos haya elegido explícitamente destruir. Un volumen todavía puede contener datos valiosos incluso si ningún contenedor está funcionando.
4. Eliminar los registros DNS, los puertos reenviados y las reglas de cortafuegos ya no son necesarias. Deja el Swarm con `docker swarm leave --force` **sólo si** este host está siendo retirado de ese Swarm y ningún otro servicio depende de él. Verificar de otro nodo primero en un cluster.

- Mantenga las imágenes de respaldo y registro hasta que el sistema de reemplazo haya pasado sus cheques de recuperación.
- Evite una manta `docker system prune --all`: puede eliminar las imágenes necesarias por otras aplicaciones o rollbacks.

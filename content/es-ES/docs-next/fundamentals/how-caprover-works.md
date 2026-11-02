---
id: how-caprover-works
title: Cómo funciona CapRover
slug: /fundamentals/how-caprover-works
---

CapRover administra servicios Docker Swarm en uno o varios servidores.

- **CapRover:** guarda la configuración de aplicaciones, dominios, historial de despliegues y ajustes.
- **Docker Swarm:** arranca contenedores, actualiza imágenes de servicio y mantiene el número solicitado de réplicas.
- **NGINX:** enruta peticiones HTTP(S) por hostname al puerto del contenedor de cada aplicación.
- **Docker registry:** distribuye imágenes a los nodos del clúster.
- **Volúmenes y bind mounts:** conservan datos de aplicaciones fuera de los contenedores que se reemplazan.

<span id="source-fundamentals-applications-and-services"></span>

## Aplicaciones y servicios

Cada aplicación de CapRover corresponde a un servicio de Docker Swarm.

- Una aplicación web suele recibir el dominio `<app-name>.<root-domain>`.
- Los workers y las bases de datos pueden funcionar sin enrutamiento HTTP público.
- Las aplicaciones stateful con almacenamiento local deben permanecer en el nodo que contiene esos datos.

<span id="source-fundamentals-builds-images-deployments"></span>

## Builds y despliegues

- Despliega una imagen existente o compila una mediante `captain-definition`.
- Desplegar actualiza el servicio Docker para ejecutar la imagen seleccionada.
- Que el build termine correctamente **no** garantiza que la aplicación funcione. El proceso debe escuchar en el puerto HTTP configurado del contenedor.
- Hacer rollback de una imagen no restaura variables de entorno, el esquema de la base de datos ni el contenido de los volúmenes.

Consulta [Despliegues](../deployments/index.md) y [Captain Definition](../reference/captain-definition.md).

<span id="source-fundamentals-networking"></span>

## Red

- **Tráfico web público:** DNS → NGINX de CapRover → puerto HTTP de la aplicación.
- **Tráfico interno:** nombre del servicio Swarm y puerto interno, por ejemplo `postgres:5432`, sin publicar el puerto de la base de datos.
- **Otros protocolos:** publica explícitamente puertos TCP/UDP. Consulta [Referencia de puertos](../reference/ports.md).

<span id="source-fundamentals-persistence"></span>

## Persistencia

- Los datos escritos solo dentro de un contenedor pueden perderse al redesplegar.
- Los volúmenes Docker y bind mounts normalmente son **locales al nodo**; Swarm no replica esos datos.
- Haz backups de los datos de aplicaciones por separado de la configuración de CapRover.

Consulta [Almacenamiento persistente](../data-persistence/index.md).

<span id="source-fundamentals-docker-swarm"></span>

## Docker Swarm

- CapRover inicializa Swarm incluso en instalaciones de un único nodo.
- Los nodos **manager** controlan Swarm y los **worker** ejecutan las tareas asignadas.
- Los clústeres multinodo necesitan una red confiable entre nodos y un registry de push predeterminado accesible. Consulta [Configuración multinodo](../scaling/multi-node.md).

<span id="source-reference-glossary"></span>

## Términos

| Término | Significado |
| --- | --- |
| `captain-definition` | Archivo de selección de build o imagen |
| Dominio raíz | Sufijo DNS utilizado por el dashboard y las aplicaciones |
| Instancia | Réplica de un servicio Docker |
| Directorio persistente | Volumen Docker o bind mount de una aplicación |
| One-Click App | Plantilla que despliega una o varias aplicaciones CapRover |

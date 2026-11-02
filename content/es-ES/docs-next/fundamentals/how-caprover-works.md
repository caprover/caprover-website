---
id: how-caprover-works
title: Cómo funciona CapRover
slug: /fundamentals/how-caprover-works
---

CapRover administra los servicios Docker Swarm en uno o más servidores.

- **CapRover:** Almacena configuración de aplicaciones, dominios, historial de despliegue y configuraciones.
- **Docker Swarm:** Comienza contenedores, actualiza imágenes de servicio y mantiene réplicas solicitadas.
- **NGINX:** Rutas HTTP(S) tráfico por nombre de host al puerto de contenedores de una aplicación.
- **Registro Docker:** Distribuye imágenes a nodos en un cluster.
- **Volumenes y monturas enlazadas:** Preserve datos de aplicación fuera de contenedores reemplazables.

<span id="source-fundamentals-applications-and-services"></span>

## Aplicaciones y servicios

Una aplicación CapRover mapas a un servicio Docker Swarm.

- Una aplicación web normalmente recibe `<app-name>.<root-domain>`.
- Los workers y las bases de datos pueden funcionar sin enrutamiento público de HTTP.
- Las aplicaciones estatales que utilizan almacenamiento local deben permanecer en el nodo manteniendo esos datos.

<span id="source-fundamentals-builds-images-deployments"></span>

## Builds y despliegues

- Implementar una imagen existente o construir una utilizando `captain-definition`.
- El despliegue actualiza el servicio Docker para ejecutar esa imagen.
- Una build de la imagen exitosa **no** garantizar una aplicación saludable. El proceso debe escuchar en el puerto de contenedores configurado.
- Los rollos de imagen no restauran variables de entorno, esquemas de bases de datos o contenidos de volumen.

Consulta [Despliegue](../deployments/index.md) y [Definición](../reference/captain-definition.md).

<span id="source-fundamentals-networking"></span>

## Redes

- **Tráfico web público:** DNS → CapRover NGINX → el puerto HTTP de la aplicación.
- **Tráfico interno:** Nombre de servicio de Swarm y puerto interno, como `postgres:5432`, sin publicar un puerto de base de datos.
- **Otros protocolos:** Publicar puertos TCP/UDP explícitamente. Consulta [Referencia del puerto](../reference/ports.md).

<span id="source-fundamentals-persistence"></span>

## Persistencia

- Los datos escritos sólo dentro de un contenedor pueden desaparecer en redespliegue.
- Los volúmenes de docker y monturas de fijación son generalmente **nodos locales**. Swarm no replica sus datos.
- Retroceda los datos de la aplicación por separado de la configuración propia de CapRover.

Consulta [Almacenamiento persistente](../data-persistence/index.md).

<span id="source-fundamentals-docker-swarm"></span>

## Docker Swarm

- CapRover inicializa un Swarm incluso para una instalación de un solo nodo.
- **Managers** controlar el Swarm; **workers** ejecutar tareas asignadas.
- Las configuraciones de múltiples nodos requieren la creación de redes internodos confiables y un registry de push predeterminado accesible. Consulta [Configuración multinodo](../scaling/multi-node.md).

<span id="source-reference-glossary"></span>

## Términos

| Mandato | Significado |
| --- | --- |
| `captain-definition` | Archivo de selección de imágenes |
| Dominio de raíz | Sufijo DNS utilizado por el dashboard y dominios de aplicaciones predeterminados |
| Instance | Una réplica de un servicio Docker |
| Directorio persistente | Volumen de docker o montaje enlatado dentro de una aplicación |
| App One-Click | Plantilla que implementa una o más aplicaciones CapRover |

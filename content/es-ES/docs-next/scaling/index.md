---
id: index
title: Escalada &amp; Disponibilidad
slug: /scaling
---

<span id="source-scaling-scale-app"></span>

## Replicaciones

- **Conde de instalación** controla el número solicitado de tareas de servicio de Swarm.
- Escala aplicaciones apátridas cuyo código y fondo de trabajo apoyan la ejecución simultánea.
- Comprobar CPU, RAM, límites de conexión de bases de datos y estado de tarea con `docker service ps SERVICE_NAME`.

<span id="source-scaling-zero-downtime"></span>

## Despliegues y controles de salud

- Las aplicaciones apátridas generalmente usan Docker Swarm **start-first** actualizaciones.
- Aplicaciones con uso de datos montados **stop-first** actualizaciones por defecto para prevenir escritores simultáneos.
- Un cheque de salud significativo ayuda a Swarm determinar la preparación:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1
```

Utilice un punto final de preparación real y un comando incluido en su imagen. Capacidad, dependencias y comportamiento de aplicación todavía determinan si las actualizaciones son libres de interrupciones.

<span id="source-scaling-placement"></span>

## Lugar

- Swarm programa tareas apátridas en los nodos disponibles basadas en limitaciones y capacidad.
- CapRover coloca aplicaciones persistentes al nodo que alberga datos locales.
- Compruebe el acceso al registro, la disponibilidad de nodos y las restricciones de colocación cuando las tareas permanecen pendientes.

<span id="source-applications-scaling-placement"></span>

## Escalada estatal

- Los volúmenes locales y las monturas de fijación no se comparten automáticamente entre los nodos.
- Evite forzar a múltiples escritores contra los mismos datos locales. Para **start-first** sobre servicios estatales, la aplicación y el almacenamiento deben apoyarlo explícitamente.
- Migrar datos antes de mover una aplicación persistente. See [Almacenamiento persistente](../data-persistence/index.md) y [Configuración multinodo](multi-node.md).

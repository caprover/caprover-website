---
id: index
title: Escalado y disponibilidad
slug: /scaling
---

<span id="source-scaling-scale-app"></span>

## Réplicas

- **Instance Count** determina cuántas tareas del servicio debe mantener Docker Swarm.
- Escala aplicaciones stateless cuyo código y trabajos en segundo plano admiten la ejecución concurrente.
- Comprueba CPU, RAM, límites de conexiones a la base de datos y estado de las tareas con `docker service ps SERVICE_NAME`.

<span id="source-scaling-zero-downtime"></span>

## Despliegues rolling y health checks

- Las aplicaciones stateless suelen utilizar actualizaciones **start-first** de Docker Swarm.
- Las aplicaciones con almacenamiento montado utilizan **stop-first** por defecto para evitar escrituras simultáneas.
- Un health check adecuado ayuda a Swarm a determinar si la aplicación está preparada:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1
```

Utiliza un endpoint de readiness real y un comando disponible en la imagen. La capacidad, las dependencias y el comportamiento de la aplicación determinan si la actualización puede completarse sin interrupciones.

<span id="source-scaling-placement"></span>

## Asignación de nodos

- Swarm distribuye las tareas stateless entre nodos disponibles según sus restricciones y recursos.
- CapRover fija las aplicaciones con datos persistentes al nodo que almacena sus datos locales.
- Si alguna tarea queda pendiente, comprueba el acceso al registry, la disponibilidad de nodos y las reglas de asignación.

<span id="source-applications-scaling-placement"></span>

## Escalar servicios con estado

- Los volúmenes locales y bind mounts no se comparten automáticamente entre nodos.
- Evita que varias réplicas escriban en los mismos datos locales. Para utilizar **start-first** en servicios con estado, tanto la aplicación como el almacenamiento deben permitirlo explícitamente.
- Migra los datos antes de mover una aplicación persistente. Consulta [Almacenamiento persistente](../data-persistence/index.md) y [Configuración multinodo](multi-node.md).

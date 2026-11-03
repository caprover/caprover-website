---
id: upgrade
title: Actualizar CapRover
slug: /server/upgrade
---

En el dashboard, abre **Settings** y usa la opción de actualización cuando haya una versión estable disponible.

Ejecuta estos comandos en el nodo manager de Swarm.

<span id="probar-una-imagen-edge"></span>

## Cambiar a edge

```bash
docker pull caprover/caprover-edge:latest
docker service update captain-captain --image caprover/caprover-edge:latest
```

## Volver a la versión estable

```bash
docker service update captain-captain --image caprover/caprover:latest
```

El cambio puede fallar si la versión edge introdujo cambios incompatibles con la versión estable.

Si falla la actualización, consulta [Diagnósticos](../troubleshooting/diagnostics.md).

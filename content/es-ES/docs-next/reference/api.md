---
id: api
title: API HTTP / caprover-api
slug: /reference/api
---

- CapRover expone endpoints HTTP versionados bajo `/api/v2`.
- Inicia sesión con `POST /api/v2/login`, un JSON `{"password":"..."}` y el header `x-namespace: captain`.
- Las rutas autenticadas utilizan el `data.token` de la respuesta como valor de `x-captain-auth`, manteniendo también `x-namespace: captain`.
- La respuesta incluye estado, mensaje y datos opcionales. Comprueba el estado de la operación en lugar de asumir que cualquier respuesta HTTP implica éxito.

Por ejemplo, después de exportar `CAPROVER_URL` y `CAPROVER_PASSWORD` en el shell:

```bash
token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/login" \
  -H 'x-namespace: captain' -H 'content-type: application/json' \
  --data "$(jq -n --arg password "$CAPROVER_PASSWORD" '{password:$password}')" | jq -er '.data.token')
curl --fail --silent --show-error "$CAPROVER_URL/api/v2/user/system/info/" \
  -H 'x-namespace: captain' -H "x-captain-auth: $token"
```

- Utiliza HTTPS y evita mostrar el token o la contraseña en los logs.
- Los principales grupos de rutas son `/user/apps/`, `/user/projects/`, `/user/oneclick/`, `/user/registries/`, `/user/system/` y `/user/pro/`.
- Los cuerpos y respuestas varían según el endpoint. El [código de rutas del servidor](https://github.com/caprover/caprover/tree/master/src/routes) es la referencia para la versión instalada.

- El cliente [caprover-api](https://github.com/caprover/caprover-api) encapsula operaciones habituales.
- Para CI que solo despliega una aplicación, utiliza tokens de despliegue de esa aplicación.
- Evita depender de campos de respuesta no documentados sin comprobar la versión específica de CapRover.
- Consulta el [ejemplo de automatización de backups](../server/backup/index.md) para una secuencia que utiliza un token de descarga temporal.

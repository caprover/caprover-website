---
id: api
title: HTTP API / caprover-api
slug: /reference/api
---

- CapRover sirve terminales HTTP versionados bajo `/api/v2`.
- Iniciar sesión con `POST /api/v2/login` y JSON `{"password":"..."}` más `x-namespace: captain` Cabeza.
- Las rutas de usuario autenticadas utilizan la respuesta `data.token` como `x-captain-auth`, también con `x-namespace: captain`.
- El envoltorio de respuesta incluye un estado, mensaje y datos opcionales; verifique el estado en lugar de tratar cada respuesta HTTP como una operación exitosa.

Por ejemplo, después de exportar `CAPROVER_URL` y `CAPROVER_PASSWORD` en su cáscara:

```bash
token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/login" \
  -H 'x-namespace: captain' -H 'content-type: application/json' \
  --data "$(jq -n --arg password "$CAPROVER_PASSWORD" '{password:$password}')" | jq -er '.data.token')
curl --fail --silent --show-error "$CAPROVER_URL/api/v2/user/system/info/" \
  -H 'x-namespace: captain' -H "x-captain-auth: $token"
```

- Use HTTPS y evite imprimir la ficha o contraseña.
- Los principales grupos de rutas son `/user/apps/`, `/user/projects/`, `/user/oneclick/`, `/user/registries/`, `/user/system/`, y `/user/pro/`.
- Sus órganos de solicitud y sus respuestas varían según el punto final; [código de la ruta del servidor](https://github.com/caprover/caprover/tree/master/src/routes) es el inventario autorizado para la versión implementada.

- El [caprover-api cliente](https://github.com/caprover/caprover-api) envuelve operaciones comunes.
- Preferir fichas de despliegue de aplicaciones para empleos de CI que solo implementen una aplicación.
- Evite dependiendo de un campo de respuesta indocumentado sin revisar la versión CapRover de destino.
- Ver el [ejemplo de automatización de respaldo](../server/backup/index.md) para una secuencia de solicitud con un token de descarga temporal.

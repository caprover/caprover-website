---
id: server-environment
title: Variables para el medio ambiente
slug: /reference/server-environment
---

El [medio ambiente-variable parser](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts) reconoce estas entradas de nivel servidor:

| Nombre | Efecto |
| --- | --- |
| `ACCEPTED_TERMS` | Aceptar los términos de instalación en el lanzamiento inicial. |
| `DEFAULT_PASSWORD` | Establecer la contraseña inicial del panel de control; reemplazarla después de la configuración. |
| `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT`, `CAPTAIN_HOST_ADMIN_PORT` | Puertos de acogida publicados; por defecto son 80, 443, y 3000. Coincide con el lado anfitrión del Docker `-p` cartografías. |
| `MAIN_NODE_IP_ADDRESS` | Suministrar la dirección de gestión para la instalación cuando la detección automática no es adecuada. |
| `CAPTAIN_BASE_DIRECTORY` | Superar el predeterminado `/captain` directorio base. |
| `CAPROVER_DISABLE_ANALYTICS`, `DO_NOT_TRACK` | Desactivar la analítica cuando se establece. |
| `CAPTAIN_DOCKER_API` | Override Docker API detalles de conexión. |
| `CAPTAIN_IS_DEBUG`, `IS_CAPTAIN_INSTANCE`, `DEMO_MODE_ADMIN_IP`, `FORCE_ENABLE_PRO`, `BY_PASS_PROXY_CHECK` | Controles internos, de desarrollo o de uso especial; use sólo después de leer su uso de fuentes. |

- El parser trata varias banderas booleanas como verdadera cuando la variable es una **cuerda no vacía**; pasando la cuerda literal `false` no necesariamente los apaga.
- Suministro de variables de instalación al comando inicial del contenedor, y uso [config overrides](server-environment.md) para constantes de servidor configurables.

<span id="source-reference-config-override"></span>

## config-override.json

CapRover lee que el usuario anula desde `/captain/data/config-override.json`Sólo las llaves bajo `configs` dentro [CapitánConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) están destinados a este archivo. Ejemplo:

```json
{"defaultMaxLogSize": "256m"}
```

- Retroceda el archivo antes de cambiarlo, utilice JSON válido, y reinicie el servicio CapRover para que los ajustes de arranque surtan efecto.
- Las anulaciones incorrectas pueden prevenir la puesta en marcha o debilitar la verificación de dominio.
- Revise los defectos de fuente reales y la versión de su instalación antes de cambiar los valores; `skipVerifyingDomains` es para configuraciones excepcionales controladas en lugar de la instalación pública rutinaria.

Este archivo está bajo `/captain/data`, por lo que se incluye en [Copia de seguridad](../server/backup/index.md).

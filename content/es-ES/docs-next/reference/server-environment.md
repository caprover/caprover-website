---
id: server-environment
title: Variables de entorno del servidor
slug: /reference/server-environment
---

El [parser de variables de entorno](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts) reconoce estos parámetros del servidor:

| Nombre | Efecto |
| --- | --- |
| `ACCEPTED_TERMS` | Acepta los términos al iniciar la instalación. |
| `DEFAULT_PASSWORD` | Configura la contraseña inicial del dashboard; cámbiala después. |
| `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT`, `CAPTAIN_HOST_ADMIN_PORT` | Puertos publicados del host: por defecto 80, 443 y 3000. Deben coincidir con el lado host de los mapeos Docker `-p`. |
| `MAIN_NODE_IP_ADDRESS` | Especifica la dirección del manager cuando la detección automática no es adecuada. |
| `CAPTAIN_BASE_DIRECTORY` | Cambia el directorio base predeterminado `/captain`. |
| `CAPROVER_DISABLE_ANALYTICS`, `DO_NOT_TRACK` | Desactiva la analítica cuando se establecen. |
| `CAPTAIN_DOCKER_API` | Modifica los detalles de conexión con la API Docker. |
| `CAPTAIN_IS_DEBUG`, `IS_CAPTAIN_INSTANCE`, `DEMO_MODE_ADMIN_IP`, `FORCE_ENABLE_PRO`, `BY_PASS_PROXY_CHECK` | Opciones internas, de desarrollo o para escenarios especiales: revisa su uso en el código antes de configurarlas. |

- Para varias flags booleanas, el parser interpreta como true cualquier **cadena de texto no vacía**. Pasar la cadena literal `false` no siempre las desactiva.
- Proporciona las variables de instalación en el comando inicial del contenedor. Para las constantes configurables, utiliza [overrides de configuración](server-environment.md).

<span id="source-reference-config-override"></span>

## config-override.json

CapRover carga las configuraciones personalizadas desde `/captain/data/config-override.json`. Solo las claves de `configs` definidas en [CaptainConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) están previstas para este archivo. Por ejemplo:

```json
{"defaultMaxLogSize": "256m"}
```

- Haz un backup antes de editar el archivo, utiliza JSON válido y reinicia el servicio de CapRover para aplicar los ajustes que se cargan al arrancar.
- Un override incorrecto puede impedir el arranque o reducir la seguridad de la validación de dominios.
- Comprueba los valores del código fuente correspondiente a tu versión antes de cambiarlos. `skipVerifyingDomains` es para instalaciones excepcionales y controladas, no para instalaciones públicas habituales.

Como el archivo está bajo `/captain/data`, se incluye en el [backup de CapRover](../server/backup/index.md).

---
id: cli
title: Despliegue con el CLI
slug: /deployments/cli
---

- Instala el CLI CapRover en tu máquina de desarrollo con `npm install -g caprover`.
- Establecer el servidor primero, crear una aplicación en su panel de control, y registrarse en la URL de panel HTTPS:

```bash
caprover login
```

En la raíz de un proyecto Git, añadir un `captain-definition` archivo. Para un repositorio Dockerfile:

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

- Corre `caprover deploy` desde ese directorio del proyecto y elegir el servidor, aplicación y rama guardado en los avisos.
- El CLI sube el contenido de Git comprometido, inicia una compilación e informa el progreso.
- Los archivos no comprometidos y Git ignorados no están incluidos.
- Después de la primera carrera exitosa, `caprover deploy -d` reutiliza las opciones guardadas para ese directorio.

- Para una imagen preconstruida, use `caprover deploy --imageName IMAGE` y proporcionar la información de la aplicación/servidor cuando se solicite.
- Mantener las credenciales fuera de la historia de los proyectiles y los registros CI; [tokens de despliegue](ci-cd/index.md) son mejores para la automatización de aplicaciones.
- Ver todo [Referencia del comando CLI](../reference/cli.md).

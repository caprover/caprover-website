---
id: cli
title: Desplegar con la CLI
slug: /deployments/cli
---

- Instala la CLI de CapRover en tu equipo con `npm install -g caprover`.
- Configura el servidor, crea una aplicación desde el dashboard e inicia sesión con la URL HTTPS del dashboard:

```bash
caprover login
```

En la raíz de un proyecto Git, añade el archivo `captain-definition`. Si tu repositorio contiene un Dockerfile:

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

- Ejecuta `caprover deploy` desde el directorio del proyecto. Selecciona el servidor, la aplicación y la rama cuando lo solicite la CLI.
- La CLI sube el contenido de Git que ya está commiteado, ejecuta el build y muestra el progreso.
- No se incluyen archivos sin commit ni archivos ignorados por Git.
- Después de un despliegue correcto, puedes usar `caprover deploy -d` para reutilizar las opciones guardadas en ese directorio.

- Para una imagen ya compilada, ejecuta `caprover deploy --imageName IMAGE` y proporciona la aplicación y el servidor cuando se solicite.
- Evita exponer credenciales en el historial del shell o en logs de CI; usa [tokens de despliegue](ci-cd/index.md) para automatizaciones limitadas a una aplicación.
- Consulta la [referencia completa de comandos CLI](../reference/cli.md).

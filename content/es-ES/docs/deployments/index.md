---
id: index
title: Despliegues
slug: /deployments
---

<span id="source-deployments-dashboard"></span>

## Desplegar desde el dashboard

- Crea una aplicación desde **Apps**, abre la pestaña **Deployment** y elige el método adecuado para tu proyecto.
- Para desplegar un archivo, empaqueta el proyecto con su `captain-definition` en la ruta configurada y sube el archivo tar.
- Si no necesitas archivos de código fuente, puedes pegar una Captain Definition directamente en el campo de texto del dashboard.

[Desplegar una imagen Docker existente](#desplegar-una-imagen-docker)

<span id="source-deployments-docker-image"></span>

## Desplegar una imagen Docker

Compila tu imagen y haz push a un registry, o utiliza una imagen pública. Crea una aplicación de CapRover y pega una definición que use la imagen en su pestaña **Deployment**:

```json
{
  "schemaVersion": 2,
  "imageName": "nginx:stable-alpine"
}
```

- El servidor CapRover debe poder acceder a la imagen.
- Si utilizas un registry privado, añade sus credenciales en [Container Registries](registries/index.md) antes de desplegar.
- También puedes ejecutar `caprover deploy --imageName IMAGE` desde la CLI.

- Después del despliegue, configura el puerto HTTP del contenedor para que coincida con el puerto real en el que escucha la imagen. Para un worker o base de datos, marca la aplicación como servicio no web.
- Comprueba el servicio y los logs de la aplicación.
- Para despliegues reproducibles en producción, utiliza tags explícitos o digests. Un tag flotante puede apuntar a una imagen diferente en el futuro.

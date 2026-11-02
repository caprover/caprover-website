---
id: index
title: Despliegue
slug: /deployments
---

<span id="source-deployments-dashboard"></span>

## Despliegue desde el panel

- Crear una aplicación en **Aplicaciones**, abrir su **Despliegue** tab, y elegir la entrada apropiada para su proyecto.
- Para desplegar un archivo, empaque el proyecto con su `captain-definition` archivo en la ruta esperada y subir el archivo tar.
- El panel también acepta una Captain Definition pegada en su entrada de texto cuando no se necesitan archivos fuente.

Por ejemplo, pega esta definición para desplegar una imagen pública existente:

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

- Comience el despliegue, observe el estado de build o tire, a continuación, verifique el puerto HTTP contenedor de la aplicación y su dominio predeterminado.
- Para una imagen privada, configure primero las credenciales del registro.
- Consulta [Desplegar una imagen Docker](index.md).

<span id="source-deployments-docker-image"></span>

## Desplegar una imagen Docker

Construir y empujar su imagen a un registro, o utilizar una imagen pública. Crear una aplicación CapRover, luego pegar una definición solo de imagen en su **Despliegue** token:

```json
{
  "schemaVersion": 2,
  "imageName": "nginx:stable-alpine"
}
```

- La imagen debe ser accesible al servidor CapRover.
- Para un registro privado, añádase sus credenciales en [Container Registries](registries/index.md) antes de desplegarse.
- También puede utilizar `caprover deploy --imageName IMAGE` del CLI.

- Después del despliegue, establezca el puerto HTTP de contenedores de la aplicación al puerto la imagen realmente escucha, o marque una aplicación de trabajo / base de datos como no-web.
- Verifique los registros de servicio y aplicaciones.
- Preferir etiquetas explícitas o digieres para rollos de producción predecibles; las etiquetas flotantes pueden resolver a otra imagen más adelante.

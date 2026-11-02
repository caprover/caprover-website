---
id: advanced-nginx
title: Configuración avanzada de NGINX
slug: /domains/advanced-nginx
---

- Desde los ajustes del servidor, CapRover permite editar la configuración base de NGINX y la plantilla de rutas del dashboard. Los ajustes HTTP de cada aplicación incluyen su propia plantilla de NGINX.
- Si solo una aplicación necesita cambiar un timeout, límite o regla de enrutamiento, utiliza preferiblemente su plantilla.

- Los archivos generados en `/captain/generated/nginx` muestran la configuración efectiva, pero CapRover puede sobrescribirlos.
- Guarda los cambios mediante la plantilla correspondiente del dashboard.
- El directorio del host `/captain/data/nginx-shared` se monta como `/nginx-shared` dentro del contenedor NGINX, por ejemplo para certificados personalizados.

- Para aplicar una plantilla predeterminada a las aplicaciones nuevas, CapRover puede leer `/captain/data/server-block-conf-override.ejs`.
- Parte de la [plantilla del código fuente](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs) correspondiente, conserva una copia y reinicia el servicio CapRover después de crear el override.
- Pruébalo en una aplicación descartable antes de aplicarlo a todo el servidor.
- Una plantilla global inválida puede afectar al dashboard y a varias aplicaciones.

## Recuperar el dashboard tras romper su configuración

- Si una configuración NGINX personalizada impide cargar el dashboard, guarda primero una copia de `/captain/data/config-captain.json` y de cualquier archivo `/captain/data/server-block-conf-override.ejs`.
- Si el problema lo provocó ese último archivo, muévelo fuera de esa ruta antes de reiniciar CapRover.
- Si el problema continúa, el siguiente procedimiento **borra la configuración NGINX personalizada de base, del dashboard y de todas las aplicaciones**. Conserva el backup para restaurar los cambios necesarios después.
- Ejecútalo en el nodo manager con `jq` instalado:

```bash
sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-nginx-reset
sudo jq '.nginxBaseConfig = "" | .nginxCaptainConfig = "" | .appDefinitions |= with_entries(.value.customNginxConfig = "")' \
  /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
sudo jq empty /captain/data/config-captain.json.new
sudo docker service scale captain-captain=0
sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
sudo docker service scale captain-captain=1
```

- Espera a que `docker service ps captain-captain` y `docker service ps captain-nginx` muestren tareas sanas.
- Si no se resuelve, revisa los logs y restaura el backup antes de intentar otro cambio.

<span id="source-domains-nginx-routing"></span>

## Enrutamiento de NGINX

- En peticiones web públicas, DNS apunta el hostname al servidor CapRover.
- NGINX recibe el tráfico por los puertos 80 o 443, selecciona el dominio de la aplicación o del dashboard y reenvía la petición al servicio Docker de la aplicación por su puerto HTTP interno configurado.

- Un error 502 después de un despliegue correcto suele indicar que NGINX no puede acceder a un contenedor sano por ese puerto.
- Comprueba que la aplicación escucha en `0.0.0.0`, que el puerto HTTP del contenedor es correcto y que la tarea Docker está ejecutándose.
- Un error de DNS ocurre antes de este enrutamiento; un fallo de certificados puede producirse antes de que HTTPS llegue a la aplicación.

Los cambios NGINX específicos de una aplicación se configuran en sus ajustes de [Custom NGINX](advanced-nginx.md). Las plantillas globales afectan a más rutas; utiliza la [configuración avanzada de NGINX](advanced-nginx.md) con precaución.

<span id="source-applications-advanced-custom-nginx"></span>

## Custom NGINX

- CapRover genera la configuración NGINX para cada aplicación web.
- En **HTTP Settings**, puedes editar la plantilla NGINX para configurar un timeout, límite de upload o comportamiento que no ofrecen las opciones habituales.

1. Guarda una copia de la plantilla actual antes de modificarla.
2. Cambia únicamente las directivas necesarias y guarda desde el dashboard.
3. Comprueba que la configuración es válida y prueba todos los dominios de esa aplicación por HTTP y HTTPS. La plantilla compartida afecta a todos esos dominios.

- Una configuración inválida puede interrumpir el enrutamiento.
- CapRover valida e intenta revertir las configuraciones inválidas, pero conserva la última plantilla funcional para una recuperación rápida.
- Los archivos de `/captain/generated/nginx` son salida generada, no la fuente para editar; CapRover puede sobrescribirlos.

Para cambios globales o del dashboard, consulta [Configuración avanzada de NGINX](advanced-nginx.md). Utiliza ese alcance solo si la plantilla de aplicación no cubre tus necesidades.

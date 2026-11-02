---
id: advanced-nginx
title: Configuración avanzada NGINX
slug: /domains/advanced-nginx
---

- CapRover le permite editar su configuración base NGINX y plantilla de enrutamiento de panel a través de la configuración del servidor, y la plantilla NGINX de una aplicación a través de la configuración HTTP de esa aplicación.
- Preferir cambios específicos de aplicaciones cuando sólo una aplicación necesita una regla diferente de límite o de enrutamiento.

- Archivos generados bajo `/captain/generated/nginx` mostrar la salida efectiva, pero CapRover puede sobreescribirlos.
- Guardar cambios a través de la plantilla de panel de control relevante.
- El directorio host `/captain/data/nginx-shared` se monta en el contenedor NGINX como `/nginx-shared` para apoyar archivos como un certificado personalizado.

- Para una plantilla predeterminada aplicada a aplicaciones recién creadas, CapRover puede leer `/captain/data/server-block-conf-override.ejs`.
- Comience de la coincidencia [plantilla de origen](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs), mantener una copia de seguridad, y reiniciar el servicio CapRover después de escribir la anulación.
- Prueba el config resultante con una aplicación desechable antes de aplicarla ampliamente.
- Una plantilla global inválida puede afectar el panel de control y múltiples aplicaciones.

## Recuperar de una configuración que rompió el panel de control

- Si el panel no puede cargar debido a un ajuste personalizado NGINX, primera reserva `/captain/data/config-captain.json` y cualquier `/captain/data/server-block-conf-override.ejs` archivo.
- Si este último causó el fracaso, moverlo fuera de esa ubicación antes de reiniciar CapRover.
- De lo contrario, lo siguiente **despeja la base personalizada, dashboard y la configuración NGINX de cada aplicación**; mantener la copia de seguridad para que pueda restaurar los cambios individuales más adelante.
- Corre en el gerente con `jq` instalado:

```bash
sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-nginx-reset
sudo jq '.nginxBaseConfig = "" | .nginxCaptainConfig = "" | .appDefinitions |= with_entries(.value.customNginxConfig = "")' \
  /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
sudo jq empty /captain/data/config-captain.json.new
sudo docker service scale captain-captain=0
sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
sudo docker service scale captain-captain=1
```

- Espera. `docker service ps captain-captain` y `docker service ps captain-nginx` para mostrar tareas saludables.
- Si esto no resuelve el problema, inspeccionar sus registros y restaurar su copia de seguridad antes de intentar otro cambio.

<span id="source-domains-nginx-routing"></span>

## NGINX Routing

- Para solicitudes web públicas, DNS señala un nombre de host en el servidor CapRover.
- El servicio NGINX de CapRover recibe tráfico en 80 o 443, selecciona el dashboard o dominio de la aplicación correspondiente, y envía la solicitud al servicio Docker de la aplicación en su puerto HTTP de contenedor configurado.

- Una respuesta de 502 después de un exitoso despliegue generalmente significa que NGINX no pudo llegar a un contenedor saludable en ese puerto.
- Confirmar la aplicación escucha en `0.0.0.0`, el puerto HTTP contenedor es correcto, y la tarea de servicio Docker está funcionando.
- Un fallo DNS ocurre antes de esta ruta de enrutamiento, mientras que un fallo de certificado puede ocurrir antes de que el tráfico HTTPS llegue a la aplicación.

Los cambios NGINX específicos de la aplicación pertenecen a la aplicación [Custom NGINX](advanced-nginx.md) Ajustes. Las plantillas globales afectan más rutas; uso [Configuración avanzada NGINX](advanced-nginx.md) cuidadosamente.

<span id="source-applications-advanced-custom-nginx"></span>

## Custom NGINX

- CapRover genera configuración NGINX para cada aplicación web.
- Utilice la aplicación **Ajustes HTTP** para editar su plantilla NGINX cuando usted necesita un tiempo de salida, límite de carga, u otro comportamiento NGINX que los controles estándar no expongan.

1. Guardar una copia de la plantilla actual antes de editar.
2. Cambie la directiva más pequeña y guárdala en el tablero.
3. Verifique que el dashboard acepta la configuración NGINX, luego pruebe todos los dominios adjuntos a la aplicación sobre HTTP y HTTPS. Una plantilla de aplicación compartida afecta esos dominios juntos.

- Una configuración inválida puede interrumpir el enrutamiento.
- CapRover valida e intenta revertir una configuración de aplicación inválida, pero mantenga la última plantilla de trabajo para recuperarse rápidamente.
- Archivos generados bajo `/captain/generated/nginx` son la salida, no la fuente para editar; CapRover puede sobreescribirlos.

Para los cambios en las plantillas globales NGINX o dashboard, vea [Configuración avanzada NGINX](advanced-nginx.md). Use ese alcance más amplio sólo cuando la plantilla específica de la aplicación no pueda satisfacer sus necesidades.

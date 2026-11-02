---
id: deploy-databases
title: Implementar bases de datos
slug: /data-persistence/deploy-databases
---

- Una base de datos en CapRover es una aplicación que necesita almacenamiento, credenciales y una ruta de red para sus clientes.
- El [Aplicaciones de un solo clic](../one-click-apps/index.md) catálogo puede crear un servicio de base de datos compatible, o puede desplegar una imagen de base de datos usted mismo.

1. Elija la versión de la base de datos y la imagen. Crear su aplicación con **Tiene datos persistentes** habilitado y licencia **No exponer como aplicación web** seleccionada; las bases de datos generalmente no sirven HTTP a través de NGINX.
2. Configure el nombre de usuario, contraseña y nombre de la base de datos requeridos a través de su configuración de aplicaciones o un instalador de One-Click. Utilizar credenciales únicas y mantenerlas fuera del control de fuentes.
3. Montar un volumen llamado o un enlace en el directorio de datos de la imagen de la base de datos. Coloque la aplicación en el nodo sosteniendo ese almacenamiento.
4. Implementar y leer los registros de servicios hasta que la base de datos reporte que está lista. Reiniciar o redistribuir una vez para confirmar sus datos permanece presente.
5. Conectar otra aplicación por el nombre de servicio de la base de datos y el puerto interno de contenedores. Publicar un puerto anfitrión sólo si un cliente externo lo necesita; seguir [guía de conexión externa](deploy-databases.md) por su cortafuegos y pasos de seguridad.
6. Programar copias de seguridad de la base de datos y probar una restauración. La copia de seguridad de configuración de CapRover no contiene los registros de bases de datos.

Compruebe la ruta de almacenamiento de la imagen de la base de datos elegida y las variables de inicialización; difieren entre PostgreSQL, MySQL, Redis y otros servicios.

<span id="source-data-persistence-internal-databases"></span>

## Conectarse a bases de datos internamente

- Las aplicaciones en la red de superposición de CapRover pueden conectarse a un servicio de bases de datos por su nombre de aplicación y puerto de contenedores.
- Para una aplicación PostgreSQL llamada `postgres`, use host `postgres` y puerto `5432` en la aplicación cliente, junto con el nombre configurado de la base de datos, nombre de usuario y contraseña.

- Ejemplo: establecer la aplicación web `DATABASE_URL` a una cadena de conexión apropiada para su conductor.
- Guardar la configuración de la aplicación web y probar una consulta.
- No se necesita cartografía portuaria pública.
- Las aplicaciones actualizadas antes de CapRover 1.15 pueden retener un `srv-captain--` nombre de servicio y alias de red; inspeccionar el servicio real si un nombre de host no resuelve.

- Mantenga las credenciales en la configuración del entorno de aplicaciones o un mecanismo secreto adecuado, y asegúrese de que la aplicación de la base de datos tenga almacenamiento y respaldos persistentes.
- See [Implementar bases de datos](deploy-databases.md) primero si la base de datos aún no está instalada.

<span id="source-data-persistence-external-databases"></span>

## Conectarse a bases de datos externamente

- Utilice una conexión de servicio interno cuando el cliente también se ejecuta en CapRover.
- Para un cliente externo, decida si un puerto publicado restringido o un túnel es apropiado antes de exponer una base de datos a Internet.

### Preparar la base de datos

- Implementar la base de datos como una aplicación persistente y no-web.
- Configure su volumen de datos o montura bind, credenciales y nombre de la base de datos.
- Verifique que está listo en sus registros de servicio y que una aplicación CapRover puede alcanzarlo internamente por nombre de aplicación y puerto de contenedores.
- Respalde los datos de la base de datos por separado de la configuración CapRover.

### Publicar un puerto restringido

- En la aplicación de bases de datos **App Config**, mapa un puerto anfitrión elegido, por ejemplo `12345/tcp`, al puerto de contenedores de la base de datos, por ejemplo PostgreSQL `5432/tcp`.
- Guardar y verificar la actualización del servicio.
- Desde su cliente, conéctese a `SERVER_PUBLIC_IP:12345` con el nombre de usuario y contraseña de la base de datos.

- Permitir entrada `12345/tcp` en el cortafuegos de su proveedor de alojamiento **sólo de las direcciones cliente que lo necesitan**.
- Revisar también las reglas del host: Los puertos publicados por Docker pueden evitar restricciones UFW ordinarias.
- En un clúster, elija la entrada o el modo host publicar deliberadamente y verifique qué nodo responde al puerto.
- Utilice TLS del protocolo de base de datos y una fuerte autenticación cuando el tráfico cruza una red no confiada; un mapeo de puerto por sí solo no lo encripta.

### Preferir un camino privado cuando sea posible

- Un VPN o un túnel en un servicio en la red de superposición de CapRover evita un puerto de base de datos ampliamente publicado.
- Host SSH solo no resuelve necesariamente ni alcanza el nombre interno de servicio Docker de una aplicación.
- Un punto final del túnel debe tener conectividad a esa red superpuesta; verificar sus controles de ubicación y acceso antes de confiar en ella.

Después de cualquier método funciona, prueba del cliente externo previsto, eliminar reglas temporales de cortafuegos amplios, y documentar el puerto, clientes permitidos, dueño de credenciales, respaldo y plan de apagado.

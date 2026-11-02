---
id: index
title: Aplicaciones de un solo clic
slug: /one-click-apps
---

<span id="source-one-click-apps-install"></span>

## Instalación

Las plantillas de One-Click crean aplicaciones comunes de CapRover. Cada plantilla puede proporcionar múltiples servicios.

- Compruebe las variables requeridas de la plantilla, imágenes, puertos expuestos, volúmenes e instrucciones de post-instalación.
- Utilice una base de datos única y credenciales de administrador.
- Servicios persistentes **copias de seguridad separadas de aplicaciones-datos**Las copias de seguridad de configuración de CapRover no contienen volúmenes de bases de datos.
- El catálogo de panel en vivo es la fuente de plantillas y versiones actuales.

<span id="source-one-click-apps-configure"></span>

## Configuración

- Las aplicaciones generadas pueden configurarse usando su configuración habitual de aplicaciones CapRover.
- Algunas variables, como contraseñas iniciales de bases de datos, aplican **sólo en el primer arranque**. Los cambios variables ambientales posteriores no necesariamente actualizan a los usuarios de bases de datos existentes.

<span id="source-one-click-apps-connect"></span>

## Servicios de conexión

- Ejemplo de conexión interna: `postgres:5432` (utiliza el nombre de servicio generado y el puerto de escucha).
- Para aplicaciones heredadas, las `srv-captain--` service alias may still work.
- Almacene las credenciales en la configuración del entorno de la aplicación que consume.
- Para clientes fuera de CapRover, ver [Conexión externa de bases de datos](../data-persistence/deploy-databases.md).

<span id="source-one-click-apps-upgrade"></span>

## Actualizaciones

- Lea las instrucciones de migración de la aplicación upstream y vuelva a actualizar sus datos.
- Una plantilla puede utilizar una imagen personalizada o scripts de inicialización. Reemplazarlo con una imagen de corriente vertical puede perder la configuración esencial.
- Los cambios de imagen no realizan cada base de datos o migración de esquemas de aplicaciones.
- Preserve y verifique los volúmenes existentes al recrear o migrar aplicaciones estatales.

<span id="source-one-click-apps-custom-repositories"></span>

## Repositorios personalizados

CapRover puede cargar plantillas de repositorios One-Click de terceros.

- Revise plantillas antes del despliegue: pueden ejecutar imágenes, abrir puertos, montar almacenamiento y configurar credenciales.
- Grabar qué repositorio proporcionó su aplicación instalada para futuras actualizaciones.
- Consulta [Crear plantillas One-Click](authoring.md) para crear una plantilla.

<span id="source-one-click-apps-troubleshooting"></span>

## Solución de problemas

Identificar el servicio generado fallido. Inspeccione sus registros y compruebe:

- Variables de plantilla, errores de imagen de arranque/build y credenciales.
- Exposición portuaria, nombres de servicio interno, montajes de volumen y colocación.
- Ya sea que una base de datos comenzó inesperadamente con un volumen nodo-local vacío.

Preserve volúmenes declarantes durante la investigación. Compartir registros de servicio redactados, nombre de plantilla y versiones de imagen al pedir ayuda.

---
id: backup-data
title: Volver arriba Datos persistentes
slug: /data-persistence/backup-data
---

Una copia de seguridad CapRover captura el estado y la configuración de CapRover, **no** el contenido de cada volumen de aplicación, directorio host o base de datos externa. Planifique copias de seguridad de datos de aplicaciones por volumen de trabajo.

1. Inventario de los nombres de volumen de la aplicación, caminos de unión, servicio de bases de datos y almacenamiento externo. Uso `docker volume ls` para confirmar los nombres físicos; antiguas instalaciones pueden tener `captain--` prefijos.
2. Para bases de datos, utilice el procedimiento consistente de descarga o instantánea compatible con la base de datos. Para los archivos cargados, respaldo el directorio montado o la tienda de objetos usando un método que maneja concurrentes escribe apropiadamente.
3. Almacenar copias fuera del servidor, protegerlas como sensibles, y definir retención y cifrado.
4. Restaurar en una aplicación de prueba o servidor de prueba y verificar registros y archivos reales. Grabar las versiones de aplicaciones/image y bases de datos correspondientes necesarias para su recuperación.

Retrocede la configuración de CapRover como un paso separado [Backup &amp; Restore CapRover](../server/backup/index.md). Un plan de recuperación de desastres utilizable necesita ambos lados y las imágenes del registro necesarias para ejecutar las aplicaciones.

<span id="source-data-persistence-move-data"></span>

## Mover datos persistentes

- Moving a persistent app requires moving its data as well as updating its CapRover settings.
- Primero identifique el volumen real o el camino de unión y el nodo fuente.
- Retrocede, luego deja de escribir o coloca la aplicación en modo de mantenimiento para que la copia sea consistente.

- Crear la ruta de destino o el volumen del nuevo nodo, transferir o restaurar datos, y comprobar la propiedad y permisos para el usuario del contenedor.
- Actualice la configuración de almacenamiento y colocación de nodos de la aplicación sólo después de que el destino esté listo.
- Comience una instancia, verifique los registros o archivos esperados y mantenga la copia de seguridad de la fuente hasta que se haya probado la recuperación.

- Para una base de datos, prefiera su proceso de migración o vertido/restore apoyado en lugar de copiar archivos de datos en vivo.
- Al mover todo el servidor, utilice [Mover CapRover a otro servidor](../server/backup/restore.md) para los pasos del plan de control también.

---
id: cdd-migration
title: Migración desde CaptainDuckDuck
sidebar_label: Migración desde CaptainDuckDuck
---

Nota: Esta sección solo está destinada si desea actualizar su servidor CaptainDuckDuck a CapRover.

### Script de migración

Simplemente ejecute [este script](https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/migrate-from-cdd.sh) para actualizar su servidor CaptainDuckDuck a CapRover. Crea automáticamente una copia de seguridad de su directorio de configuración `/captain` en caso de que algo salga mal.


Para migrar, simplemente puede ejecutar las siguientes líneas:

```bash
wget https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/migrate-from-cdd.sh

chmod +x migrate-from-cdd.sh

./migrate-from-cdd.sh
```


### Consejos para la migración:

Asegúrese de tener suficiente espacio en disco. CapRover la imagen pesa alrededor de 400 MB y el script realiza automáticamente una copia de seguridad del directorio de configuración.

#### Sin registro autohospedado
Lo más probable es que esté bien si tiene alrededor de 1,5 GB de espacio libre en su servidor.

#### Con registro autohospedado 
El Registro autohospedado puede consumir muchos GB de espacio en disco. Dado que Migration Script crea automáticamente una copia de seguridad para su directorio de configuración, es posible que tenga problemas durante la actualización.

Para ahorrar espacio, si tenía habilitado el Registro autohospedado, tiene dos opciones:
- puedes editar manualmente el script de migración y eliminar la línea de respaldo (`tar -cvf /captain-bk-$(date +%Y_%m_%d_%H_%M_%S).tar /captain`),
- o puede eliminar todo el contenido del registro ejecutando `rm -rf /captain/registry/*`, ya que consume mucho espacio en el disco. Tenga en cuenta que si realiza esta acción, deberá volver a implementar sus aplicaciones para que otros nodos puedan acceder a ellas. Si solo tiene un nodo, no es necesaria ninguna acción adicional.


### Cambios importantes de CaptainDuckDuck a CapRover:
- `schemaVersion` para el archivo captain-definition se cambia a `2`.
- Si anteriormente tenía que editar el puerto personalizado a algo distinto de 80 para su aplicación específica, ya no necesita editar la configuración NGINX, simplemente puede configurar el puerto del contenedor en cualquier puerto desde la interfaz de usuario.
- Si anteriormente utilizó un dockerfileLines personalizado, ha antepuesto todas las declaraciones `ADD` y `COPY` con `./src`. Esto ya no es necesario con CapRover. Por ejemplo, anteriormente había
```bash
COPY ./src/package.json /usr/app/
```

Con CapRover deberías cambiar esto a

```bash
COPY ./package.json /usr/app/
```

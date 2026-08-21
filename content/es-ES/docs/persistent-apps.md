---
id: persistent-apps
title: Aplicaciones persistentes
sidebar_label: Aplicaciones persistentes
---

<br/>

### Aplicaciones persistentes versus no persistentes

Al crear una aplicación, puedes elegir si debe tener **datos persistentes**.  
De forma predeterminada, debería preferir **aplicaciones no persistentes** para obtener una mayor flexibilidad y escalabilidad. Sin embargo, algunas aplicaciones requieren persistencia cuando necesitan retener datos tras reinicios, fallas o actualizaciones del contenedor.

También puede asignar un directorio en el host a un directorio dentro del contenedor si tiene una gran cantidad de datos estáticos que no desea incluir en cada compilación. Generalmente esto no es necesario a menos que los datos sean muy grandes.

---

#### Aplicaciones persistentes

Las aplicaciones persistentes son aquellas que necesitan almacenar datos en el disco para que sobrevivan reinicios, fallas, actualizaciones de contenedores y otros eventos. Debido a que almacenan datos localmente, están **bloqueados a un servidor específico**. Puede moverlos a otro servidor, pero todos los datos almacenados se perderán a menos que los migre manualmente.

**Ejemplos de aplicaciones que requieren persistencia:**
- Bases de datos (por ejemplo, MySQL, PostgreSQL, MongoDB)
- Aplicaciones de carga de fotografías que almacenan imágenes localmente en lugar de utilizar almacenamiento de terceros (por ejemplo, S3)
- Aplicaciones web como WordPress que almacenan archivos o complementos cargados en el disco

**Limitaciones:**
- Las aplicaciones persistentes **no** se pueden escalar a varias instancias.  
  Compartir una única ruta de almacenamiento entre varios contenedores puede provocar daños en los datos.

> **Nota:**  
> Incluso para aplicaciones persistentes, **no todos los directorios son persistentes de forma predeterminada**. Después de crear la aplicación, debe definir explícitamente qué directorios deben ser persistentes a través de la página **Detalles de la aplicación** en el panel.

---

##### Definición de directorios persistentes

Puede configurar directorios persistentes de dos maneras:

**1. Uso de etiquetas (recomendado)**  
CapRover administra la ubicación de almacenamiento por usted.  
- Los datos se almacenan en:  
  `/var/lib/docker/volumes/YOUR_VOLUME_NAME/_data`
- La ruta del contenedor es personalizable.
- De forma predeterminada, CapRover antepone `captain--` al nombre del volumen.  
  Por ejemplo, ingresar `my-volume` da como resultado `captain--my-volume`.

**2. Uso de rutas de host específicas**  
Puede asignar un **directorio específico en el host** a una ruta dentro del contenedor.  
Por ejemplo:  
- Ruta del host: `/var/usr`
- Ruta del contenedor: `/my-host-usr-something`
  
Se podrá acceder a un archivo guardado en el contenedor en `/my-host-usr-something/myfile.txt` en el host en `/var/usr/myfile.txt`.

> **Importante:**  
> Si elige una ruta de host específica, asegúrese de que el directorio **ya exista** en el host antes de asignarlo.

---

#### Eliminación de aplicaciones persistentes

Cuando eliminas una aplicación persistente, sus datos **no se eliminan automáticamente**. Esto evita la pérdida accidental de datos. Para eliminar directorios persistentes:

- **Volúmenes (basados en etiquetas)**  
  1. Listar volúmenes:
     ```bash
     docker volume ls
     ```
2. Retire el volumen deseado:
     ```bash
     docker volume rm NAME_OF_VOLUME
     ```

![Volúmenes](/img/docs/label-path.png)

- **Directorios de host asignados**  
  Elimine el directorio directamente del host:
  
```bash
  rm -rf /path/to/directory
```

![mapeado](/img/docs/path-binding.png)

---

#### Aplicaciones no persistentes

Las aplicaciones que **no necesitan almacenar datos en el disco** siempre deben ser no persistentes.
Son más flexibles y pueden migrar automáticamente entre servidores si uno falla.

**Ventajas de las aplicaciones no persistentes:**

* Puede ejecutar múltiples instancias sin conflictos (almacenamiento aislado)
* Redistribuido automáticamente en otros servidores en una configuración de múltiples servidores

> Las aplicaciones no persistentes ** aún pueden escribir en el disco**, pero todos los datos almacenados allí se perderán cuando el contenedor se reinicie debido a una falla, implementación, actualización de configuración o reinicio del host.

**Ejemplos:**

* Un procesador de imágenes que analiza las fotos cargadas (sin estado y con uso intensivo de CPU)
* Una aplicación web TODO donde la base de datos es persistente, pero la aplicación web en sí no almacena datos localmente
* Una aplicación de carga de imágenes que utiliza S3 u otro almacenamiento de terceros en lugar de guardar imágenes localmente

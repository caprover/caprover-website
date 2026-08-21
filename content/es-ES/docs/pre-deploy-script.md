---
id: pre-deploy-script
title: Script previo a la implementación
sidebar_label: Script previo a la implementación
---

<br/>
Esta es una operación muy avanzada y requiere atención. De lo contrario, puede interrumpir la implementación de su aplicación.

Este script se ejecutará justo antes de que su contenedor (es decir, la aplicación) se actualice debido a un cambio de configuración o implementación de la aplicación. En este script, puede modificar el objeto de servicio Docker, invocar una llamada HTTP y, literalmente, hacer cualquier cosa. La plantilla para este script es:
```
var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
	return Promise.resolve()
		.then(function(){

		    // Do something in a Promise form

		    // In the end, return the "possibly-modified" dockerUpdateObject
		    return dockerUpdateObject;
		});
};

```

Tenga en cuenta que `captainAppObj` es el objeto de la aplicación guardado en el archivo `/captain/data/config-captain.json` y `dockerUpdateObject` es el objeto de actualización del servicio que se pasa a Docker para actualizar el servicio (variaciones de entorno, versión de imagen, etc.). Este objeto es según [Docker documentos](https://docs.docker.com/engine/api/v1.30/#operation/ServiceUpdate).

Dado que este script se ejecutará en el proceso CapRover, obtendrá acceso a todas las dependencias de nodos que tiene CapRover; consulte [Caprover/caprover/package.json](https://github.com/caprover/caprover/blob/master/package.json). Por ejemplo, el siguiente script inyecta un UUID asignado a la versión implementada en la etiqueta del servicio con cada actualización:

```
var { v4: uuid } = require('uuid');

var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
	return Promise.resolve()
		.then(function(){

		    dockerUpdateObject.TaskTemplate.ContainerSpec.Labels[uuid()] =
                                                         captainAppObj.deployedVersion+ '';
		    return dockerUpdateObject;
		});
};

```

Tenga en cuenta que este script previo a la implementación, en particular el objeto de actualización del servicio Docker, es complicado. Por lo tanto, se recomienda encarecidamente utilizar este método previo a la implementación si es un usuario experto. Por ejemplo, observe cómo se agrega una cadena vacía a la versión implementada en esta línea:

```
dockerUpdateObject.TaskTemplate.ContainerSpec.Labels[uuid()] = captainAppObj.deployedVersion+ '';
```

Al eliminar este simple truco, se generará un error al implementar aplicaciones. Para ver los registros, debe ejecutar `docker service logs captain-captain --follow`. Incluso el error de Docker no es muy claro. Considerándolo todo, esta es una característica avanzada y no se recomienda para usuarios principiantes e intermedios.

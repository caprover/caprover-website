---
id: index
title: Container Registries
slug: /deployments/registries
---

<span id="source-deployments-registries-private"></span>

## Registros privados

- CapRover necesita credenciales de registro cuando una imagen Docker es privada.
- En el tablero **Grupo / Registros** área, añadir un registro remoto con su dominio, nombre de usuario, contraseña o ficha de lectura, y prefijo de imagen opcional.
- Los partidos de CapRover tiran credenciales contra el nombre de la imagen comenzando con `DOMAIN/PREFIX/` cuando se establece un prefijo, o `DOMAIN/` cuando está en blanco.
- También utiliza el prefijo al etiquetar imágenes de CapRover para el registro de presión predeterminado.
- Verifique el nombre completo de imagen antes de confiar en esas credenciales.

- Para `ghcr.io/my-org/my-api:tag`, uso del dominio del registro `ghcr.io` y el camino del propietario o de la organización coincidente como el prefijo de la imagen, con una credenciales permitidas para leer ese paquete.
- Para `registry.gitlab.com/my-group/my-project/image:tag`, utilice la ruta de registro GitLab y una credencial de lectura ampliada.

- Implementar una imagen usando su nombre completo calificado de registro y verificar que se puede extraer en cada nodo deseado.
- Empujar una imagen de CI no autenticar automáticamente CapRover para tirarla.
- Si sólo necesita extraer imágenes preconstruidas, no seleccione este registro como el registro de empuje predeterminado para las imágenes construidas con CapRover.

<span id="source-deployments-registries-default-push"></span>

## Registro de empuje predeterminado

- El **registro predeterminado** almacena imágenes CapRover construye para que otros nodos de Swarm puedan sacarlas.
- Elija un registro accesible en la configuración de Cluster / Registries del dashboard y configure sus credenciales.
- Un servidor de un solo nodo puede funcionar sin uno; CapRover requiere un registro de presión predeterminado antes de añadir otro nodo a través de su flujo de trabajo de racimo.

- Si se construyeron aplicaciones antes de configurar el registro, redespliegue esas aplicaciones para que sus imágenes sean empujadas y disponibles a nuevos nodos.
- Verificar un nuevo despliegue empuja con éxito antes de añadir un trabajador.
- Mantenga el registro disponible durante los lanzamientos y la recuperación; desactivar o eliminar las credenciales en un clúster puede evitar que los nodos tiren imágenes de aplicaciones.

Usar un [Registro autoanfitriono](index.md) o un registro remoto apropiado. Las credenciales sólo para las imágenes preconstruidas son una necesidad separada y no requieren presión predeterminada.

<span id="source-deployments-registries-self-hosted"></span>

## Registro Autónomo

- CapRover puede gestionar un registro de Docker para su propio cluster.
- Configure en el área de Cluster / Registries del panel de control, a continuación, seleccione como el registro de presión predeterminado cuando planea agregar nodos.
- Compruebe que cada nodo puede llegar al registro antes de desplegarse en todo el grupo.

- El registro auto hospedado de CapRover utiliza puerto `996/tcp` para el acceso al registro.
- Exponerlo sólo donde los clientes o los nodos lo necesitan, y protegerlo con la autenticación configurada.
- Un registro en el mismo servidor físico sigue siendo una dependencia: si ese servidor o su almacenamiento de imagen no está disponible, los nuevos nodos pueden no ser capaces de extraer imágenes.

Después de habilitar el empuje predeterminado, redespliegue las aplicaciones construidas existentes para publicar sus imágenes. Entonces sigue el [Guía de configuración de varios nodos](../../scaling/multi-node.md) para agregar y verificar trabajadores.

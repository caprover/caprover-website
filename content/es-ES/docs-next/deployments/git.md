---
id: git
title: Despliegue de Git
slug: /deployments/git
---

## Configuración

1. Añadir un `captain-definition` archiva su repositorio.
2. Cree la aplicación CapRover.
3. En su configuración de despliegue, introduzca la URL del repositorio, sucursal y credenciales.
4. Guardar y copiar la URL generada de Webhook.
5. Agregar esa URL como **push webhook** en su proveedor de Git.
6. Haz push de un commit. Revise los registros de despliegue de CapRover.

**Repositorios privados:** Utilice una cuenta de servicio clave o limitada.

**Importante:**

- Un empuje webhook hace que CapRover busque la rama configurada y construya la aplicación.
- Tratar la URL webhook como un secreto.
- Los formatos de URL del repositorio, las teclas SSH y las pantallas webhook dependen de su proveedor.
- Para las creaciones reproducibles lejos del servidor, use [CI/CD](ci-cd/index.md) para desplegar una imagen.

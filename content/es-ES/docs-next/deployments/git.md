---
id: git
title: Desplegar desde Git
slug: /deployments/git
---

## Configuración

1. Añade un archivo `captain-definition` al repositorio.
2. Crea la aplicación en CapRover.
3. En sus ajustes de despliegue, introduce la URL del repositorio, la rama y las credenciales.
4. Guarda la configuración y copia la URL del webhook generado.
5. Configura esa URL como **push webhook** en tu proveedor Git.
6. Haz push de un commit y consulta los logs del despliegue en CapRover.

**Repositorios privados:** utiliza una deploy key de solo lectura o una cuenta de servicio con permisos limitados.

**Importante:**

- Un evento push del webhook hace que CapRover descargue la rama configurada y ejecute el build de la aplicación.
- Trata la URL del webhook como un secreto.
- El formato de la URL, las claves SSH y la configuración de webhooks dependen del proveedor Git.
- Si prefieres builds reproducibles fuera del servidor, usa [CI/CD](ci-cd/index.md) para desplegar imágenes ya compiladas.

# Glosario técnico de español

Use estas decisiones para mantener la terminología uniforme en la documentación
y el sitio web.

| Source term | Preferred Spanish usage |
| --- | --- |
| build | build |
| deploy / deployment | desplegar / despliegue |
| downtime | downtime |
| override | override |
| registry | registro de imágenes |
| rollback | rollback |
| self-hosted | autoalojado |
| stateless | stateless |

Mantenga los nombres de productos y tecnologías en su forma original. Conserve
un término inglés cuando sea la opción habitual entre ingenieros de software.

## Infraestructura y CLI

- **Docker Swarm**: conservar el nombre; **Swarm manager** = nodo manager, **worker node** = nodo worker.
- **Build**: build o compilación. Evitar *construcción* y *edificio*.
- **Captain Definition**: conservar este nombre del formato de despliegue; no traducirlo literalmente.
- **Docker registry**: registro de imágenes o registry; **push/pull** = publicar/descargar una imagen.
- **Docker volume** = volumen Docker; **bind mount** = bind mount; **host** = host.
- **Token**, **CLI**, **API**, **webhook**, **CI/CD**, **Dockerfile**: conservar términos habituales entre ingenieros.
- Las etiquetas de UI como **Container HTTP Port**, **Service Update Override** y **Deployment** se mantienen tal como aparecen en el producto.
- Usar imperativos directos: *Ejecuta*, *Configura*, *Comprueba*. Respetar parámetros, puertos, credenciales, comandos, ejemplos y advertencias.

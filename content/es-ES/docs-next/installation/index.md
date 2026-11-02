---
id: index
title: Opciones de instalación
slug: /installation
---

Para un servidor Ubuntu estándar, usa el [instalador automático](../get-started.md). Si prefieres ejecutar los comandos de Docker y CapRover, consulta la [instalación manual](manual.md).

<span id="source-installation-standard-vps"></span>

## VPS estándar

- Ubuntu 24.04, AMD64 o ARM64, IPv4 pública, acceso root y al menos 1 GB de RAM.
- Abre SSH, `80/tcp`, `443/tcp` y `3000/tcp` en el firewall del proveedor.
- Apunta un registro A wildcard (por ejemplo, `*.apps.example.com`) a la IP pública del servidor.
- Evita instalar Docker mediante snap. Si ya tienes Docker Engine, compruébalo con `sudo docker version` y `sudo docker run --rm hello-world`.

<span id="source-installation-digitalocean"></span>

## DigitalOcean

- **Droplet Ubuntu nuevo:** sigue [Primeros pasos](../get-started.md).
- **[Imagen CapRover de Marketplace](https://marketplace.digitalocean.com/apps/caprover):** Docker y CapRover vienen instalados. Continúa con [DNS y configuración del dashboard](../get-started.md#dns).
- **Nuevos clientes DigitalOcean:** consulta este [enlace de registro](https://m.do.co/c/6410aa23d3f3) para comprobar si hay créditos promocionales disponibles. Las ofertas pueden variar.

El firewall, la RAM y el DNS wildcard tienen los mismos requisitos en ambos casos.

<span id="source-installation-openstack"></span>

## OpenStack

- Crea una instancia Ubuntu 24.04 con IPv4 pública o floating IP, clave SSH, conexión de salida y al menos 1 GB de RAM.
- Permite SSH, `80/tcp`, `443/tcp` y `3000/tcp` en los security groups y en el firewall del sistema.
- Apunta el DNS wildcard a la IP pública y sigue [Primeros pasos](../get-started.md).

**Plantilla Heat antigua:** la [plantilla existente](https://github.com/caprover/caprover/blob/master/dev-scripts/openstack/single-instance.yml) contiene valores hardcodeados y configuraciones de red y seguridad problemáticas. Revísala y corrígela antes de usarla.

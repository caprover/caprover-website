---
id: index
title: Opciones de instalación
slug: /installation
---

Para un servidor Ubuntu estándar, utilice el [instalador automatizado](../get-started.md). Para las órdenes paso a paso Docker y CapRover, vea [Configuración manual](manual.md).

<span id="source-installation-standard-vps"></span>

## VPS estándar

- Ubuntu 24.04, AMD64/ARM64, public IPv4, root access, at least 1 GB RAM.
- Permite SSH, `80/tcp`, `443/tcp`, y `3000/tcp` en los cortafuegos del proveedor.
- Establecer un comodín Un registro (por ejemplo, `*.apps.example.com`) a la IP pública del servidor.
- Evite Docker instalado a través de snap. Para un motor Docker existente, verifique `sudo docker version` y `sudo docker run --rm hello-world`.

<span id="source-installation-digitalocean"></span>

## DigitalOcean

- **Fresh Ubuntu Droplet:** Seguir [Comienzo](../get-started.md).
- **[Imagen del Mercado de CapRover](https://marketplace.digitalocean.com/apps/caprover):** Docker y CapRover están preinstalados. Continuar con [Configuración DNS y dashboard](../get-started.md#dns).
- **Nuevos clientes de DigitalOcean:** [Registro de referencia](https://m.do.co/c/6410aa23d3f3) para cualquier crédito promocional disponible actualmente. Las ofertas varían.

Los mismos requisitos de firewall, RAM y wildcard DNS se aplican a ambas opciones.

<span id="source-installation-openstack"></span>

## OpenStack

- Crear una instancia Ubuntu 24.04 con IPv4, SSH key, conectividad externa y por lo menos 1 GB de RAM.
- Permite SSH, `80/tcp`, `443/tcp`, y `3000/tcp` en grupos de seguridad y el cortafuegos invitado.
- Point wildcard DNS al público IP. Continuar con [Comienzo](../get-started.md).

**Plantilla de calor más vieja:** El [plantilla existente](https://github.com/caprover/caprover/blob/master/dev-scripts/openstack/single-instance.yml) contiene valores codificados y defectos de red/seguridad problemáticos. Revise y corríjalo antes de usarlo.

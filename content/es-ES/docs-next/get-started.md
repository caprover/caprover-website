---
id: get-started
title: Comienzo
slug: /get-started
---

Instala CapRover en un nuevo servidor Ubuntu 24.04.

## Necesidades

- Servidor AMD64 o ARM64, IPv4, sudo/root.
- Al menos 1 GiB RAM y 5 GiB espacio libre de disco.
- Un dominio con acceso DNS comodín.
- Puertos TCP entrantes públicos **80**, **443**, y **3000** permitido por su proveedor de alojamiento.

## Instalar CapRover

En el servidor:

```bash
sudo apt update && sudo apt install -y curl
curl -fsSLo caprover-install.sh \
  https://raw.githubusercontent.com/caprover/caprover/master/scripts/user/installer/caprover-install.sh
sudo bash caprover-install.sh --check
sudo bash caprover-install.sh
```

- [Fuente de instalación y opciones](https://github.com/caprover/caprover/tree/master/scripts/user/installer). Revisar el script descargado antes de ejecutarlo como root.
- `--check`: sólo lectura de controles para OS, RAM, disco, Docker, Swarm, puertos y conflictos de cortafuegos. Resolver problemas de bloqueo antes de instalar.
- El instalador instala Docker Engine cuando está ausente y preserva las cargas de trabajo existentes de Docker.
- En un firewall UFW activo, permite TCP 80/443/3000. Deja inactivo UFW y firewalls de proveedor de alojamiento sin cambios.
- Después de la instalación, comprueba la posibilidad de llegar a los puertos externos e informa advertencias. DNS, configuración de dashboard y HTTPS permanecen manuales.

**Otros métodos:** [Configuración manual](installation/manual.md) (Docker y CapRover comandos), [Mercado DigitalOcean](installation/index.md)o [Instalación avanzada](installation/advanced/index.md) para redes privadas, Swarms existentes y puertos personalizados.

## DNS

Cree un registro en su proveedor de DNS:

| Tipo | Nombre (in `example.com`) | Valor |
| --- | --- | --- |
| A | `*.apps` | Dirección IPv4 pública de su servidor |

Esta guía utiliza `apps.example.com` como el dominio raíz CapRover. Las cubiertas del comodín `captain.apps.example.com` y dominios de aplicaciones tales como `my-first-app.apps.example.com`.

Verificar DNS:

```bash
dig +short captain.apps.example.com
dig +short test.apps.example.com
```

Ambos deben devolver la IP de su servidor. Si utiliza un proxy DNS como Cloudflare, cambie a **DNS only** durante la configuración. El nombre de host raíz `apps.example.com` necesita un registro separado sólo si planea utilizarlo directamente.

## Configure CapRover

Abierto `http://YOUR_SERVER_IP:3000`. **Contraseña inicial:** `captain42`.

- Cambiar la contraseña y establecer el dominio raíz `apps.example.com` (sin `*.` o `captain.`).
- Dashboard hostname: `captain.apps.example.com`HTTPS y HTTPS de la Fuerza una vez que el DNS y el trabajo de expedición de certificados.
- Restrict public access to `3000/tcp` después de que el panel HTTPS funcione.

Para fallos de certificado, consulte DNS e inbound TCP 80/443. See [Dominios &quot; HTTPS](domains/index.md).

**CLI alternative:** Instalar el CLI con `npm install -g caprover` y correr `caprover serversetup` de tu computadora. See [Comandos CLI](reference/cli.md).

## Despliegue su primera aplicación

1. Abierto **Aplicaciones** y crear `my-first-app` como una aplicación web.
2. Under **Despliegue**, pega esta definición del capitán y desplegar:

   ```json
   {
     "schemaVersion": 2,
     "imageName": "nginx:stable-alpine"
   }
   ```

3. Set **Container HTTP Port** a `80`.
4. Abierto `http://my-first-app.apps.example.com`Deberías ver la página de bienvenida NGINX.
5. Configura HTTPS para la aplicación en su configuración HTTP cuando DNS y puerto 80 son accesibles.

**Siguiente:** [Implemente su propio código](deployments/index.md) · [Configurar aplicaciones](applications/index.md) · [Datos persistentes](data-persistence/index.md)

## Bajo memoria construye (opcional)

Si un edificio se queda sin memoria, compruebe `free -h` y `swapon --show`. Si usted tiene espacio de disco libre y `/swapfile` no existe ya:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

Para mantener el intercambio después del reinicio, añadir `/swapfile none swap sw 0 0` **una vez** a `/etc/fstab`Para construcciones frecuentes, use más RAM o construya en CI.

<span id="source-index"></span>

## Comienzo

Encuentra lo que necesitas:

- **Nueva instalación:** [Comienzo](get-started.md)
- **Aplicaciones y ajustes:** [Aplicaciones](applications/index.md)
- **Deployments:** [Despliegue](deployments/index.md)
- **Mantenimiento del servidor:** [Administración del servidor](server/index.md)
- **Problemas:** [Solución de problemas](troubleshooting/index.md)

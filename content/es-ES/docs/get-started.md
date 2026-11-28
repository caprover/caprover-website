---
id: get-started
title: Primeros pasos
slug: /get-started
---

Instala CapRover en un servidor nuevo con Ubuntu 24.04.

## Requisitos

- Servidor AMD64 o ARM64 con IPv4 pública y acceso de administrador (sudo/root).
- Al menos 1 GiB de RAM y 5 GiB de espacio libre en disco.
- Un dominio en el que puedas configurar registros DNS comodín.
- Los puertos TCP **80**, **443** y **3000** deben permitir conexiones entrantes desde Internet en el firewall de tu proveedor.

<span id="paso-1-instalación-de-caprover"></span>

## Instalar CapRover

Ejecuta estos comandos en el servidor:

```bash
sudo apt update && sudo apt install -y curl
curl -fsSL https://get.caprover.com -o caprover-install.sh
sudo bash caprover-install.sh
```

[Código fuente y opciones del instalador](https://github.com/caprover/caprover/tree/master/scripts/user/installer)

Para hacer una comprobación de solo lectura, ejecuta `sudo bash caprover-install.sh --check`.

**Otras opciones:** [Instalación manual](installation/manual.md) (comandos de Docker y CapRover), [DigitalOcean Marketplace](installation/index.md) o [Instalación avanzada](installation/advanced/index.md) para redes privadas, clústeres Swarm existentes o puertos personalizados.

<span id="paso-2-conectar-el-dominio-raíz"></span>

## DNS

Crea este registro A con tu proveedor DNS:

| Tipo | Nombre (en `example.com`) | Valor |
| --- | --- | --- |
| A | `*.apps` | Dirección IPv4 pública del servidor |

En esta guía, el dominio raíz de CapRover es `apps.example.com`. El registro comodín cubre `captain.apps.example.com` y los dominios de las aplicaciones, como `my-first-app.apps.example.com`.

Comprueba que DNS responde correctamente:

```bash
dig +short captain.apps.example.com
dig +short test.apps.example.com
```

Ambos comandos deben devolver la IP del servidor. Si utilizas un proxy DNS como Cloudflare, selecciona **DNS only** durante la instalación. Solo necesitas un registro independiente para `apps.example.com` si piensas utilizar directamente ese nombre.

<span id="paso-3-configurar-e-inicializar-caprover"></span>

## Configurar CapRover

Abre `http://YOUR_SERVER_IP:3000`. **Contraseña inicial:** `captain42`.

- Cambia la contraseña y establece `apps.example.com` como dominio raíz (sin `*.` ni `captain.`).
- El nombre del panel será `captain.apps.example.com`. Activa HTTPS y **Force HTTPS** cuando DNS funcione y puedas emitir el certificado.
- Una vez que el panel funcione por HTTPS, restringe el acceso público al puerto `3000/tcp`.

Si falla la emisión del certificado, comprueba DNS y el acceso entrante por TCP 80/443. Consulta [Dominios y HTTPS](domains/index.md).

**Alternativa con CLI:** Instala la herramienta con `npm install -g caprover` y ejecuta `caprover serversetup` desde tu equipo. Consulta [Comandos CLI](reference/cli.md).

<span id="step-5-deploy-the-test-app"></span>

## Desplegar la primera aplicación

1. Abre **Apps** y crea una aplicación web llamada `my-first-app`.
2. En **Deployment**, pega la siguiente Captain Definition y despliega la aplicación:

   ```json
   {
     "schemaVersion": 2,
     "imageName": "nginx:stable-alpine"
   }
   ```

3. Establece **Container HTTP Port** en `80`.
4. Abre `http://my-first-app.apps.example.com`. Deberías ver la página de bienvenida de NGINX.
5. Configura HTTPS para la aplicación en sus ajustes HTTP cuando DNS y el puerto 80 sean accesibles.

**Siguiente paso:** [Desplegar tu código](deployments/index.md) · [Configurar aplicaciones](applications/index.md) · [Datos persistentes](data-persistence/index.md)

## Compilaciones con poca memoria (opcional)

Si una compilación se queda sin memoria, comprueba `free -h` y `swapon --show`. Si tienes espacio libre en disco y aún no existe `/swapfile`:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

Para conservar la memoria de intercambio después de reiniciar, añade `/swapfile none swap sw 0 0` **una sola vez** a `/etc/fstab`. Si compilas con frecuencia, amplía la RAM o realiza las compilaciones en CI.

<span id="source-index"></span>

## Índice

Encuentra la documentación que necesitas:

- **Nueva instalación:** [Primeros pasos](get-started.md)
- **Aplicaciones y ajustes:** [Aplicaciones](applications/index.md)
- **Despliegues:** [Despliegues](deployments/index.md)
- **Mantenimiento del servidor:** [Administración del servidor](server/index.md)
- **Problemas:** [Solución de problemas](troubleshooting/index.md)

---
id: manual
title: Instalación manual
slug: /installation/manual
---

Utiliza esta guía si prefieres instalar Docker e iniciar CapRover manualmente en un servidor nuevo con Ubuntu 24.04. Para instalaciones habituales, consulta el [instalador automático](../get-started.md).

## 1. Puertos y firewall

Abre estos puertos en el firewall de tu proveedor de alojamiento. Si usas UFW en el servidor, ejecuta:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp   # Dashboard setup
sudo ufw status
```

Si UFW está desactivado, puedes habilitarlo con `sudo ufw enable` **después de permitir el acceso SSH**. Cuando el dashboard funcione mediante HTTPS, restringe el acceso público al puerto 3000. Consulta [Firewall](domains/firewall.md) para conocer los puertos necesarios en clústeres multinodo.

## 2. Instalar Docker

Ejecuta estos comandos en el servidor:

```bash
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker version
sudo docker run --rm hello-world
```

Si la instalación falla por conflictos con paquetes existentes, consulta la [guía oficial de Docker para Ubuntu](https://docs.docker.com/engine/install/ubuntu/). Usa Docker Engine en lugar de la versión distribuida mediante snap.

## 3. Instalar CapRover

```bash
sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
  -e ACCEPTED_TERMS=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /captain:/captain \
  caprover/caprover
```

Cuando termine la inicialización, abre `http://YOUR_SERVER_IP:3000`.

**Contraseña inicial:** `captain42`

Si el dashboard no responde, revisa `sudo docker service ls` y las reglas del firewall del paso 1.

Continúa con la [configuración de DNS y del dashboard](../get-started.md#dns).

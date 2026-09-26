# 5. New Content

The new top-level navigation should be:

- [ ] Start
- [ ] Applications
- [ ] Deployments
- [ ] One-Click Apps
- [ ] Domains & Networking
- [ ] Data & Persistence
- [ ] Scaling & Clusters
- [ ] Server Administration
- [ ] Guides
- [ ] Troubleshooting
- [ ] Reference

## 5.1 Start

- [ ] **Start**
  - [ ] Getting Started
  - [ ] Installation
    - [ ] Standard VPS
    - [ ] DigitalOcean
    - [ ] OpenStack
    - [ ] Local / Private Network
    - [ ] Play with Docker
    - [ ] Advanced Installation
      - [ ] Custom Host Ports
      - [ ] Reverse Proxy Scenarios
      - [ ] Existing Docker Swarm
  - [ ] Fundamentals
    - [ ] How CapRover Works
    - [ ] Applications and Docker Services
    - [ ] Builds, Images, and Deployments
    - [ ] Networking
    - [ ] Persistence
    - [ ] Docker Swarm
  - [ ] Production Checklist

### Getting Started

This is the primary new-user workflow.

It should guide a user through:

- [ ] Obtain a server and domain.
- [ ] Check server requirements.
- [ ] Install Docker.
- [ ] Open required firewall ports.
- [ ] Verify Docker.
- [ ] Install CapRover.
- [ ] Verify `SERVER_IP:3000`.
- [ ] Configure wildcard DNS.
- [ ] Initialize CapRover.
- [ ] Change the default password.
- [ ] Enable dashboard HTTPS.
- [ ] Create the first application.
- [ ] Deploy a simple application.
- [ ] Verify HTTP deployment.
- [ ] Enable application HTTPS.
- [ ] Verify the final deployment.
- [ ] Present useful next steps.

A user following only this page should be able to reach a working HTTPS application.

## 5.2 Applications

- [ ] **Applications**
  - [ ] Overview
  - [ ] Create and Manage Apps
  - [ ] Organize Apps with Projects
  - [ ] Environment Variables
  - [ ] HTTP Settings
  - [ ] Public TCP / UDP Ports
  - [ ] Tags and Descriptions
  - [ ] Scaling and Placement
  - [ ] Persistent Directories
  - [ ] Advanced App Configuration
    - [ ] Custom NGINX
    - [ ] Service Update Override
    - [ ] Pre-Deploy Function
  - [ ] Troubleshooting Applications

Use `AppDefinition.ts` as the feature coverage checklist.

Ensure current capabilities such as these are represented:

- [ ] Projects
- [ ] descriptions
- [ ] tags
- [ ] environment variables
- [ ] volumes
- [ ] TCP/UDP ports
- [ ] ingress/host publish mode
- [ ] instance count
- [ ] node placement
- [ ] web/non-web applications
- [ ] container HTTP port
- [ ] HTTP Basic Authentication
- [ ] WebSocket support
- [ ] forced HTTPS
- [ ] redirect domains
- [ ] deployment tokens
- [ ] repository configuration
- [ ] custom NGINX
- [ ] pre-deploy functions
- [ ] service update overrides

Do not rebuild the current catch-all `app-configuration.md` pattern.

## 5.3 Deployments

- [ ] **Deployments**
  - [ ] Overview
  - [ ] Deploy with the CLI
  - [ ] Deploy from the Dashboard
  - [ ] Deploy from Git
  - [ ] Deploy a Docker Image
  - [ ] Captain Definition
  - [ ] Builds and Build Logs
  - [ ] Versions and Rollback
  - [ ] Container Registries
    - [ ] Overview
    - [ ] Private Registries
    - [ ] Default Push Registry
    - [ ] Self-Hosted Registry
  - [ ] CI/CD
    - [ ] Overview
    - [ ] Deployment Tokens
    - [ ] GitHub Actions
    - [ ] GitLab CI
    - [ ] Generic CI
  - [ ] Other Deployment Methods
    - [ ] Docker Compose (Experimental)
  - [ ] Troubleshooting Deployments

Registries belong primarily here because they are image and deployment infrastructure.

Cluster documentation should repeat the default push registry prerequisite when configuring multi-node CapRover.

Docker Compose should be clearly marked experimental/limited and should not be presented as equivalent to the standard deployment methods.

## 5.4 One-Click Apps

- [ ] **One-Click Apps**
  - [ ] Overview
  - [ ] Install a One-Click App
  - [ ] Configure Installed Services
  - [ ] Connect One-Click Services
  - [ ] Upgrade One-Click Apps
  - [ ] Custom One-Click Repositories
  - [ ] Troubleshooting
  - [ ] Authoring One-Click Apps

Treat One-Click Apps as a first-class CapRover product area.

Avoid static lists of applications when the catalog itself is dynamic.

## 5.5 Domains & Networking

- [ ] **Domains & Networking**
  - [ ] Overview
  - [ ] Root Domain and Wildcard DNS
  - [ ] App Domains
  - [ ] Custom Domains
  - [ ] HTTPS
  - [ ] Certificate Renewal
  - [ ] Internal App-to-App Networking
  - [ ] Public TCP / UDP Services
  - [ ] Firewall
  - [ ] NGINX Routing
  - [ ] Advanced NGINX Configuration
  - [ ] Advanced Certbot / ACME
  - [ ] Cloudflare and Reverse Proxies
  - [ ] Troubleshooting

The overview should explain the basic routing model:

```text
DNS
  ↓
Server
  ↓
CapRover NGINX
  ↓
Docker service
  ↓
Application container
```

The Firewall page is the authoritative port reference, while relevant workflows repeat the required subset inline.

## 5.6 Data & Persistence

- [ ] **Data & Persistence**
  - [ ] Overview
  - [ ] Stateless vs Persistent Apps
  - [ ] Docker Volumes
  - [ ] Bind Mounts
  - [ ] Node Placement
  - [ ] Deploy Databases
  - [ ] Connect to Databases Internally
  - [ ] Connect to Databases Externally
  - [ ] Shared / External Storage
  - [ ] Back Up Persistent Data
  - [ ] Move Persistent Data
  - [ ] Troubleshooting

Treat databases as applications with persistence and networking requirements rather than as a separate CapRover subsystem.

Make the distinction between CapRover configuration backup and application-data backup explicit.

## 5.7 Scaling & Clusters

- [ ] **Scaling & Clusters**
  - [ ] Overview
  - [ ] Scale an Application
  - [ ] Health Checks and Zero-Downtime Deployments
  - [ ] Set Up a Multi-Node Cluster
  - [ ] Manage Nodes
  - [ ] Application Placement
  - [ ] Persistent Applications in Clusters
  - [ ] Multi-Node Networking
  - [ ] Troubleshooting

The multi-node setup guide must be a complete workflow:

- [ ] Explain cluster architecture.
- [ ] Prepare the additional server.
- [ ] Install compatible Docker.
- [ ] Configure required networking/firewall rules.
- [ ] Configure SSH access where necessary.
- [ ] Configure a default push registry.
- [ ] Redeploy existing built applications when necessary.
- [ ] Add the node.
- [ ] Verify node health.
- [ ] Scale a stateless application.
- [ ] Verify workload distribution.
- [ ] Explain persistent-app limitations.

The code refuses node addition without a default push registry, so the documentation must establish that requirement before the user reaches the add-node operation.

## 5.8 Server Administration

- [ ] **Server Administration**
  - [ ] Overview
  - [ ] Server Settings
  - [ ] Upgrade CapRover
  - [ ] Backup & Restore CapRover
    - [ ] What Is Backed Up
    - [ ] Create a Backup
    - [ ] Automate Backups
    - [ ] Restore a Server
    - [ ] Multi-Node Restore
  - [ ] Move CapRover to Another Server
  - [ ] Monitoring with NetData
  - [ ] HTTP Analytics with GoAccess
  - [ ] Disk & Cleanup
  - [ ] Security & Access
  - [ ] CapRover Pro
  - [ ] Dashboard Themes
  - [ ] Diagnostics
  - [ ] Uninstall CapRover

### Backup semantics

Clearly distinguish:

**CapRover backup**
- [ ] CapRover state and configuration.

**Application-data backup**
- [ ] databases
- [ ] persistent volumes
- [ ] uploaded files
- [ ] application-specific data

Users must not assume a CapRover backup is automatically a complete disaster-recovery backup.

### Disk cleanup

Document actual behavior from `DiskCleanupManager`, including:

- [ ] retention count
- [ ] scheduled cleanup
- [ ] cron expression
- [ ] timezone

### CapRover Pro

Cover code-backed functionality including:

- [ ] subscription/API key
- [ ] 2FA
- [ ] login alerts
- [ ] build-success alerts
- [ ] build-failure alerts
- [ ] email actions
- [ ] webhook actions
- [ ] OTP recovery

## 5.9 Guides

- [ ] **Guides**
  - [ ] Complete Web Application Tutorial
  - [ ] Deploy a Static / React App
  - [ ] Sample Applications
  - [ ] Home / Local Server Setup
  - [ ] Persistent Storage Recipes
  - [ ] Migration from CaptainDuckDuck
  - [ ] Additional Recipes

Use Guides for concrete recipes and end-to-end examples.

Fundamental concepts such as environment variables, domains, ports, scaling, and backups should remain under their owning product areas.

## 5.10 Troubleshooting

The top-level Troubleshooting page should be a routing page rather than another large FAQ.

Example:

```text
Installation
→ Start

Build or deployment
→ Deployments / Troubleshooting

502, DNS, SSL, domain
→ Domains & Networking / Troubleshooting

Volumes or persistent data
→ Data & Persistence / Troubleshooting

Cluster or node
→ Scaling & Clusters / Troubleshooting

Upgrade, backup, disk, server
→ Server Administration

One-Click deployment
→ One-Click Apps / Troubleshooting
```

Also include:

- [ ] how to collect diagnostics
- [ ] how to get support
- [ ] what information to include in a bug report

## 5.11 Reference

- [ ] **Reference**
  - [ ] Captain Definition Schema
  - [ ] App Configuration
  - [ ] CLI Commands
  - [ ] HTTP API / caprover-api
  - [ ] Server Environment Variables
  - [ ] config-override.json
  - [ ] Network and Firewall Ports
  - [ ] Docker Compose Support Matrix
  - [ ] One-Click App Schema
  - [ ] Backup Contents
  - [ ] Defaults and Limits
  - [ ] Glossary
  - [ ] Legacy Compatibility

Reference documentation should be exhaustive and source-backed.

Do not guess exact values.

## Phase 1: Add parallel docs infrastructure

Implement only the infrastructure required to host both doc generations.

Tasks:

- [ ] add the second Docusaurus docs plugin
- [ ] add `content/en/docs-next`
- [ ] add `sidebars-next.js`
- [ ] expose `/docs-next`
- [ ] verify `/docs` remains unchanged
- [ ] verify production build succeeds
- [ ] verify current localization scripts still work
- [ ] resolve any plugin ID or generated-route conflicts

Do not start the large content migration until this foundation works.

## Phase 2: Establish the new IA

Create:

- [ ] the full `/docs-next` sidebar
- [ ] category landing pages
- [ ] final slug conventions
- [ ] directory structure
- [ ] initial old-to-new URL mapping artifact

The full navigation should now be visible even if some pages are initially skeletal.

## Phase 3: Build Start

Implement:

- [ ] Getting Started
- [ ] Installation
- [ ] Fundamentals
- [ ] Production Checklist

This phase must include an end-to-end review of Getting Started.

A new user should be able to install CapRover and deploy an HTTPS application using that workflow alone.

## Phase 4: Build Applications and Deployments

Create the two core product sections.

Break apart relevant old docs such as:

- [ ] `app-configuration.md`
- [ ] `deployment-methods.md`
- [ ] `captain-definition-file.md`
- [ ] CLI docs
- [ ] CI/CD docs
- [ ] registry content

- [ ] Add missing code-backed application settings where appropriate.

## Phase 5: Build Domains & Networking and Data & Persistence

Cover:

- [ ] root domain
- [ ] DNS
- [ ] HTTPS
- [ ] certificates
- [ ] NGINX
- [ ] internal networking
- [ ] public ports
- [ ] firewall
- [ ] databases
- [ ] persistent directories
- [ ] volumes
- [ ] shared storage
- [ ] data backup

- [ ] Validate workflows that cross multiple features, especially external database access.

## Phase 6: Build Scaling & Clusters and One-Click Apps

Create:

- [ ] scaling
- [ ] health checks
- [ ] zero-downtime deployment
- [ ] complete multi-node workflow
- [ ] node management
- [ ] One-Click Apps product area

- [ ] Validate the multi-node flow against current backend requirements.

## Phase 7: Build Server Administration

Create:

- [ ] server settings
- [ ] upgrades
- [ ] CapRover backup/restore
- [ ] server migration
- [ ] NetData
- [ ] GoAccess
- [ ] cleanup
- [ ] security
- [ ] Pro
- [ ] themes
- [ ] diagnostics
- [ ] uninstall

- [ ] Validate backup/restore semantics against current code.

## Phase 8: Build Guides and Troubleshooting

- [ ] Move recipe-style content into Guides.
- [ ] Distribute troubleshooting content into the product areas that own each failure mode.
- [ ] Create the small top-level troubleshooting router.

## Phase 9: Build Reference

Create code-backed reference material for:

- [ ] Captain Definition
- [ ] app configuration
- [ ] CLI
- [ ] API/client
- [ ] server environment variables
- [ ] config overrides
- [ ] ports
- [ ] Docker Compose
- [ ] One-Click schema
- [ ] backups
- [ ] defaults and limits
- [ ] glossary
- [ ] compatibility

- [ ] Verify reference values against source code.

## Phase 10: Complete preview review

Before any cutover:

- [ ] review the entire sidebar
- [ ] review every major task path
- [ ] review the old-to-new URL mapping
- [ ] fix missing content
- [ ] fix incorrect categorization
- [ ] run production build
- [ ] validate navigation and links
- [ ] confirm old `/docs` remains unaffected

Stop here until explicit approval to cut over.

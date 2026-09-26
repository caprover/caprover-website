---
id: troubleshooting
title: Troubleshooting
slug: /one-click-apps/troubleshooting
---

Identify which generated app failed and whether the error occurred while rendering the template, pulling/building an image, starting the service, or connecting related services. Inspect that app's deployment and service logs rather than treating the template as one opaque unit.

Check required template variables, image availability, stored credentials, volume permissions, and the internal service names/ports used by dependent apps. A service may start with an empty database after a placement change because its local volume did not move with it.

Preserve volumes while investigating a stateful installation. Include the template name and repository, installed image tag, affected app names, and redacted logs when seeking support.

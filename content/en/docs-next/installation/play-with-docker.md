---
id: play-with-docker
title: Play with Docker
slug: /installation/play-with-docker
---

Play with Docker provides short-lived Docker hosts for trying CapRover without provisioning a VPS. Treat everything you deploy there as disposable. HTTPS certificate setup is not available in this environment.

1. Sign in to [Play with Docker](https://labs.play-with-docker.com/) and create a new instance.
2. In that instance's terminal, run the CapRover playground installer:

   ```bash
   curl -L https://pwd.caprover.com | bash
   ```

3. Wait for the installer to print a `captain.*.direct.labs.play-with-docker.com` URL. Open that URL and sign in with the initial password shown by the installer (historically `captain42`).
4. Change the initial password if you plan to use the session beyond a quick demo. Create an app and deploy an image to explore the dashboard.

This playground script is separate from the [standard installation](../get-started.md). Use a regular server and your own domain for a durable HTTPS installation. Inspect a downloaded script before running it if you need to assess what it does.

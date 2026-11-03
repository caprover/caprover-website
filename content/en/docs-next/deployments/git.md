---
id: git
title: Deploy from Git
slug: /deployments/git
---

## Setup

1. Add a `captain-definition` file to your repository.
2. Create the CapRover app.
3. In its deployment settings, enter the repository URL, branch, and credentials.
4. Save and copy the generated webhook URL.
5. Add that URL as a **push webhook** in your Git provider.
6. Push a commit. Check the CapRover deployment logs.

**Private repositories:** Use a read-only SSH deploy key or a limited service account. For SSH, generate a dedicated key with `ssh-keygen -t ed25519 -f ./deploykey -N ""`. Add `deploykey.pub` to the repository as a deploy key. Enter the SSH clone URL and the contents of `deploykey` in CapRover.

**GitHub webhook:** Choose `application/json` and the push event. Leave GitHub’s separate **Secret** field empty.

**Important:**

- A webhook push makes CapRover fetch the configured branch and build the app.
- Treat the webhook URL as a secret.
- Repository URL formats, SSH keys, and webhook screens depend on your provider.
- For reproducible builds away from the server, use [CI/CD](ci-cd/index.md) to deploy an image.

---
id: deploy-from-github
title: Build, Test and Deploy from Github
sidebar_label: Deploy from Github
---

## Deploy directly from Github

This example showcases a Vue 3 app with a PHP backend that can be built, tested and deployed directly from Github to CapRover using the CapRover community-maintained [GitHub Action](https://github.com/caprover/deploy-from-github). Feel free to clone the example project from https://github.com/PremoWeb/SDK-Foundation-Vue to try things out or build your next awesome app.

### Create a new App
The name you choose here will become the APP_NAME secret.

![Create a new app](/img/docs/deploy-from-github/create-a-new-app.png "Create a new app")

### Enable App Token
Find the "Deployment" tab for your new app, click Enable App Token and copy this token. This is your APP_TOKEN secret.

![Create a new app](/img/docs/deploy-from-github/enable-app-token.png "Enable App Token")

### Add the Github Secrets

![Add the Github Secrets](/img/docs/deploy-from-github/create-github-secrets.png "Add your Github Secrets")

<hr />

![Creating a secret](/img/docs/deploy-from-github/adding-a-secret.png "Creating a secret")

_Repeat the process for your APP_TOKEN and CAPROVER_SERVER secrets._

NOTE: CapRover server must be in the format of "https://captain.apps.your-domain.com". You can set CAPROVER_SERVER as a Global Secret for all your private and/or public projects.

<hr />

### Add files to project

You will need at minimum, two files to deploy to CapRover using this method.

The first file will be your `captain-definition` file used by CapRover when deploying your app. The other file is a workflow yaml file that Github Actions will use to process your project prior to deployment.

Contents of our new Workflow file to be saved at `.github/workflows/deploy.yml`:

```
name: Build & Deploy

on:
  push:
    branches: [ "main" ]

  pull_request:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run build --if-present
      - run: npm run test --if-present

      - uses: a7ul/tar-action@v1.1.0
        with:
          command: c
          cwd: "./"
          files: |
            backend/
            frontend/dist/
            captain-definition
          outPath: deploy.tar
  
      - name: Deploy App to CapRover
        uses: caprover/deploy-from-github@v1.0.1
        with:
          server: '${{ secrets.CAPROVER_SERVER }}'
          app: '${{ secrets.APP_NAME }}'
          token: '${{ secrets.APP_TOKEN }}'
```
A quick breakdown of what you are seeing above:

The first step is to check out and build the Vue 3 frontend part of the app using NPM. The output of the build will be located in frontend/dist/. If present, the app would have also been tested prior to the second step.

The second step copies the `backend/`, `frontend/dist/` directories and the `captain-definition` file into a deploy.tar file.

The last step will send the tarball file to CapRover so that CapRover can begin to deploy your app.

### Commit changes to your code to deploy!

When you commit files to your project's repo on the "main" branch, Github Actions will kick off the processing of your Workflow file and upon completion, you'll see your app deployed to Caprover within just a few seconds! Any errors seen by Github will automatically fire an email letting you know. No emails means a successful deployment!

<hr />

### Need help?
Commercial and community support is available. Please visit the [Help and Support](/docs/support.html "Help and Support") page for details.
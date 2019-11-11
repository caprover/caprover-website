---
id: recipe-deploy-create-react-app
title: Static React App
sidebar_label: Static React App
---


## Sample App

See [sample apps directory](https://github.com/caprover/caprover/tree/master/captain-sample-apps) for a ready to deploy React App. While the example given in that directory is great, if your server doesn't have enough RAM and your package.json has too many dependencies, your build process may crash on your server when it runs out of memory. In that case, you can follow the steps give below to build your app on your own local machine (e.g., your laptop) and deploy the built code to the server. 


## Build on Local Machine

Here is a small step-by-step guide to deploy a `create-react-app` as a static site.
Unlike the regular `caprover deploy` that would deploy source files on a `NodeJS` container then build your app and run a small node server to serve your files, this guide shows how you can build locally and deploy the static bundle in a simple static server container.

The big advantage of this technique is that the build happens on your machine where you already have `node_modules` and probably more computing power than on your server. You also only upload minified files and not the entire codebase. Because of these, the deployment is way faster and less computing intensive for your server.

While this guide uses `create-react-app` as an example, you can apply the same technique for any static project (VueJS, Parcel, Angular...).

#### Build your app

The first thing you have to do is to build your app for production.

```bash
npm run build
```

#### Create `captain-definition`

Then create a `captain-definition` at the root of your project:

```json
{
  "schemaVersion": 2,
  "dockerfileLines": [
    "FROM socialengine/nginx-spa:latest", 
    "COPY ./build /app", 
    "RUN chmod -R 777 /app"
  ]
}
```

This `captain-definition` uses `socialengine/nginx-spa` which is a simple static ngninx server that handle `pushState` (every request is routed to `/index.html` so you can use frontend routing).

**Note**: If your `build` output in a different folder than `build` you need to change the `COPY ./build /app` into `COPY ./[my-output-folder] /app`

#### Create the `tar` file

Now you need to create a `tar` file, usually you don't have to do this because `caprover deploy` create one from you git repository but here we don't want to put the content of our repository in the `tar` but only the static files and `captain-definition` file.

```bash
tar -cvf ./deploy.tar --exclude='*.map' ./captain-definition ./build/* ./package.json 
```

**Note**: If your `build` output in a different folder than `build` you need to replace `./build/*` with `./[my-output-folder]/*`

**Note**: We also exclude `.map` files because these are usually quite big and make the upload longer. If you want `.map` files in production just remove the `--exclude='*.map'`.

**Tip**: Add `deploy.tar` to your `.gitignore` to avoid accidentally pushing it 😉

#### Deploy with `caprover`

Now all we have to do is to use the `caprover` CLI with a `-t` argument to use our own `tar` file instead of the one made from the git repo.

```bash
caprover deploy -t ./deploy.tar
```

Then answer the questions as usual, wait for the upload and 🎉

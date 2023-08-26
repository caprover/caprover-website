---
id: captain-definition-file
title: Captain Definition File
sidebar_label: Captain Definition File
---

<br/>
## Basics
One of the key components of CapRover is the `captain-definition` file that sits at the root of your project. In case of NodeJS app, it sits next to package.json, or next to index.php in case of PHP, or requirements.txt for Python app. It's a simple JSON like this:


```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```

`schemaVersion` is always 2. And `templateId` is the piece which defines the foundation you need in order to run your app. It is in `LANGUAGE/VERSION` format. LANGUAGE can be one of these: `node`, `php`, `python-django`, `ruby-rack`. And VERSION is the version of the language you want to use - see [below](#versions-for-templateid).

Note that although the `templateId` can be one of the 4 most popular web app languages: NodeJS, PHP and Python/Django, Ruby/Rack, you are NOT LIMITED to these predefined languages! With CapRover, you have the ability to define your own Dockerfile. With a customized Dockerfile, you can deploy any laguage, Go, Java, .NET, you name it! Dockerfiles are quite easy to write. For example, the two captain-definition files below generate <b>the exact same result</b>.

#### Simple version

```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```


#### Advanced Version

```
 {
  "schemaVersion": 2,
  "dockerfileLines": [
                        "FROM node:8.7.0-alpine",
                        "RUN mkdir -p /usr/src/app",
                        "WORKDIR /usr/src/app",
                        "COPY ./package.json /usr/src/app/",
                        "RUN npm install && npm cache clean --force",
                        "COPY ./ /usr/src/app",
                        "ENV NODE_ENV production",
                        "ENV PORT 80",
                        "EXPOSE 80",
                        "CMD [ \"npm\", \"start\" ]"
                    ]
 }
```
## Use Dockerfile in captain-definition:

Note that the simple version of `captain-definition` with `templateId` is good as a starting point. But as your project gets more complex you may want to perform more complicated tasks with your base image, such as installing PHP extensions, installing `uWSGI`, installing particular version of `curl` and etc. In these cases, you can leverage the Dockerfile. Using custom Dockerfile allows you to build a very customized base image. If you're not familiar with Docker, you can simply use google to find something that's similar to your requirement and tweak it. Finally, if you're stuck, don't be shy to ask a question on our Slack channel, or StackOverflow.


To use a Dockerfile that's in your repository, you can simply reference it in the captain-definition file:

```
 {
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
 }
```

Dockerfiles are so simple and easy to read. Even if you don't know anything about Docker, you can get an idea what this does. Some examples of advanced methods: [PHP Composer](https://github.com/githubsaturn/captainduckduck/issues/94) and [Meteor](https://github.com/githubsaturn/meteor-captainduckduck/blob/master/captain-definition)

Using this approach (pure Dockerfile) you can deploy Ruby, Java, Scala, literally anything! If you need more details on dockerfile, please see [Dockerfile Help](https://docs.docker.com/engine/reference/builder) and [Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices).

## Use Image Name

If you are an advanced Docker user, you may know that there are plenty of pre-built applications sitting on DockerHub. You can deploy these images using captain-definition. For example to deploy https://hub.docker.com/r/nginxdemos/hello/, you use: 

```
 {
  "schemaVersion": 2,
  "imageName": "nginxdemos/hello"
 }
```

Tip: You can simply copy and paste the captain-definition file above on CapRover web dashboard under the deploy tab.


## Monorepo:
You can use one git repo to deploy multiple different apps. For example, you may have a frontend and backend app in one repository. In this case, you can define multiple `captain-definition` files and have them deploying separate apps, for example, a directory structure, like this:
```
/project
   /frontend
      /src/index.js
      package.json
   /backend
      /src/index.js
      package.json
captain-definition-backend
captain-definition-frontend
```
With this content:
`captain-definition-backend`
```
 {
  "schemaVersion": 2,
  "dockerfileLines": [
                        "FROM node:12-alpine",
                        "RUN mkdir -p /usr/src/app",
                        "COPY ./backend /usr/src/app",
                        "RUN npm install && npm cache clean --force",
                        "CMD [ \"npm\", \"start\" ]"
                    ]
 }
```
You can alternatively point to a Dockerfile. Note that the build context will be always the root of your project, so in the Dockerfile, you'll have to point to that specific directory, for example, `COPY ./backend /usr/src/app`

Next, you need to instruct your CapRover to use the correct `captain-definition` for each app. Navigate to your app, go to DEPLOYMENT tab, and edit your captain-definition path to `./captain-definition-backend`

## Versions for templateId:
NOTE: Versions get pulled from official repositories at runtime, therefore you do not need to update your Captain in order to use a new version of NodeJS. For example, see [here](https://hub.docker.com/_/node/).

**IMPORTANT:** Versions mentioned below are for **reference only**. For example, at the time that this document was generated Node 10 was not available, but it is available now. Therefore, you can use `node/10` or `node/10.15` or `node/10.15.0` as your templateId despite the fact that it is not mentioned below.


```bash
node/
carbon, 8, 8.9, 8.9.4, boron, 6, 6.12, 6.12.3, 9, 9.3, 9.3.0, 8.9.3, 9.2, 9.2.1, argon, 4, 4.8, 4.8.7, 6.12.2, 8.9.2, 6.12.1, 4.8.6, 6.12.0, 8.9.1, 9.2.0, 9.1, 9.1.0, 8.9.0, 9.0, 9.0.0, 4.8.5, 6.11, 6.11.5, 8.8, 8.8.1, 8.8.0, 8.7, 8.7.0, 6.11.4, 8.6, 8.6.0, 8.5, 8.5.0, 4.8.4, 6.11.3, 6.11.2, 7, 7.10, 7.10.1, 8.4, 8.4.0, 8.3, 8.3.0, 8.2, 8.2.1, 6.11.1, 8.2.0, 8.1, 8.1.4, 4.8.3, 6.11.0, 8.1.3, 8.1.2, 8.1.1, 8.1.0, 8.0, 8.0.0, 6.10, 6.10.3, 7.10.0, 4.8.2, 6.10.2, 7.9, 7.9.0, 7.8, 7.8.0, 4.8.1, 6.10.1, 7.7, 7.7.4, 4.8.0, 6.10.0, 7.7.3, 7.7.2, 7.7.1, 7.7.0, 7.6, 7.6.0, 4.7, 4.7.3, 6.9, 6.9.5, 7.5, 7.5.0, 4.7.2, 6.9.4, 7.4, 7.4.0, 4.7.1, 6.9.3, 7.3, 7.3.0, 6.9.2, 4.7.0, 7.2.1, 7.2, 4.6, 4.6.2, 7.2.0, 6.9.1, 7.1, 7.1.0
```

```bash
php/
7, 7.2, 7.2.1, 7.0, 7.0.26, 7.1, 7.1.12, 5, 5.6, 5.6.32, 7.2.0, rc, 7.2-rc, 7.2.0RC6, 7.0.25, 7.1.11, 7.2.0RC5, 7.2.0RC4, 5.6.31, 7.0.24, 7.1.10, 7.2.0RC3, 7.1.9, 7.0.23, 7.2.0RC2, 7.2.0RC1, 7.0.22, 7.1.8, 7.2.0beta3, 7.2.0beta2, 7.1.7, 7.2.0beta1, 7.0.21, 7.2.0alpha3, 5.6.30, 7.0.20, 7.1.6, 7.1.5, 7.0.19, 7.0.18, 7.1.4, 7.0.17, 7.1.3, 7.0.16, 7.1.2, 7.1.1, 7.0.15, 5.6.29, 7.0.14, 7.1.0, 5.6.28, 7.0.13, 7.1-rc, 7.1.0RC6, 7.1.0RC5, 7.0.12, 5.6.27, 7.1.0RC4, 7.1.0RC3, 5.6.26, 7.0.11, 7.1.0RC2, 5.6.25, 7.0.10, 7.1.0RC1, 5.6.24, 7.0.9, 5.5.38, 5.5, 5.5.37, 5.6.23, 7.0.8, 5.5.36, 5.6.22, 7.0.7, 7.0.6, 5.6.21, 5.5.35, 7.0.5, 5.6.20, 5.5.34, 7.0.4, 5.6.19, 5.5.33, 7.0.3, 5.6.18, 5.5.32, 7.0.2, 5.6.17, 5.5.31, 7.0.1, 5.6.16, 5.5.30, 7.0.0, 5.4, 5.4.45, 7.0.0RC8, 5.6.15, 7.0.0RC7, 7.0.0RC6, 7.0.0RC5, 5.6.14, 7.0.0RC4, 7.0.0RC3, 5.6.13, 5.5.29, 7.0.0RC2, 7.0.0RC1, 7.0.0beta3, 5.6.12, 5.5.28, 5.4.44, 7.0.0beta2, 5.6.11, 5.5.27, 5.4.43, 7.0.0beta1, 5.5.21, 5.5.19, 5.5.16, 5.4.40, 5.4.41, 5.4.39, 5.5.17, 5.6.3, 5.6.0, 5.6.8, 5.6.4, 5.4.42, 5.5.20, 5.4.38, 5.5.22, 5.6.5, 5.6.2, 5.4.35, 5.4.36, 5.4.33, 5.3.29, 5.3, 5.5.26, 5.5.18, 5.4.32, 5.4.37, 5.6.1, 5.6.6, 5.6.9, 5.6.10, 5.4.34, 5.6.7, 5.5.24, 5.5.23, 5.5.25
```

```bash
python-django/
2, 2.7, 2.7.14, 3, 3.6, 3.6.4, 3.6.3, rc, 3.7-rc, 3.7.0a3, 3.7.0a2, 3.7.0a1, 2.7.13, 3.6.2, 3.6-rc, 3.6.2rc2, 3.6.1, 3.6.2rc1
```

```bash
ruby-rack/
2.4, 2.4.3, 2, 2.5, 2.5.0, rc, 2.5-rc, 2.5.0-rc1, 2.4.2, 2.5.0-preview1
```

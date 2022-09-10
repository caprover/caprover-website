---
id: ci-cd-integration
title: CI/CD Integration 
sidebar_label: Intro
---

While CapRover is capable of building your source code and converting it to a Docker image very easily, often you realize that the build process is very heavy. In fact, in many cases, it's heavier than the load on your app itself. This may result in a server crash when you're trying to build your source code on your own server. The best way to avoid these heavy loads is to build your Docker image elsewhere and just deploy the built artifact to your CapRover server.

There are many easy CI/CD platforms that offer generous free minutes for your builds, for example GitHub and GitLab both offer free minutes for private repositories and unlimited free minutes for public repositories. 

Read more about  [Github integration](ci-cd-integration/deploy-from-github.md) and [Gitlab integration](ci-cd-integration/deploy-from-gitlab.md)  next!
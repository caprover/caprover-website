---
id: sample-apps
title: Sample Apps
sidebar_label: Sample Apps
---

<br/>
CapRover is built on top of Docker container. Therefore, pretty much all applications can be deployed on CapRover. As mentioned in `captain-definition` docs, there is a few simple versions of `captain-definition` for most popular web languages such as NodeJS, PHP, python and ruby.

However, CapRover is not limited to these languages. For example, it can deploy a go app. You just need a Dockerfile for it. 


### Ready to be Deployed!

Inside CapRover repo, you can find a collection of different sample apps that are ready to be deployed! See:
https://github.com/caprover/caprover/tree/master/captain-sample-apps

There are:
- ASP .NET
- Go app
- nginx advance app
- Python
- Ruby
- Elixir/Phoenix/LiveView
- NodeJS
- React App
- and etc...


To deploy sample apps, you just need to:
- Download the tar file of your choice.
- Go to your CapRover web dashboard and create a test app.
- Go to "Deployment" tab and upload the tar file!
- Done!!

Now you can unzip the tar content and see what's inside. This will give you an idea how different apps can be deployed using CapRover (Docker).


### Community Apps

A collection of sample apps from the community.

#### CapRover Django

This project template aims to provide a more real-world Django template including:
- PostgreSQL
- Instructions for CapRover setup
- Handling of Django settings

View the code and documentation on [GitLab](https://gitlab.com/kamneros/caprover-django)

Additionaly, you can find a step by step tutorial to deploy your Django App to CapRover [here](https://blog.kenshuri.com/posts/006_from_heroku_to_capRover.md).

#### CapRover Laravel

- [jackbrycesmith/laravel-caprover-template](https://github.com/jackbrycesmith/laravel-caprover-template)

#### Elixir/Phoenix App Deploy
Deploy an Elixir/Phoenix LiveView web app complete with diagnostic dashboard.

- [Drag and Drop tarball](https://github.com/TehSnappy/phoenix_sample/releases/download/v1.0/phoenix_sample.tar)
- [Link to application code](https://github.com/TehSnappy/phoenix_sample)




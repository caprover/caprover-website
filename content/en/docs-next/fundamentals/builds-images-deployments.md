---
id: builds-images-deployments
title: Builds, Images, and Deployments
slug: /fundamentals/builds-images-deployments
---

An **image** packages application code and runtime dependencies. CapRover can build an image from a repository or uploaded source, or deploy a prebuilt image from a registry. A `captain-definition` file tells CapRover which build or image method to use.

A **deployment** updates the app's Docker service to run the resulting image. A successful upload or build does not guarantee the app serves traffic: it must also listen on the configured container port, become healthy, and have working DNS and routing. Build logs and service logs answer different questions.

CapRover tracks deployed image versions for rollback, but a rollback changes the image rather than reverting environment variables, volume contents, or database migrations. In a multi-node setup, a registry accessible by all nodes lets them pull the same image.

Use [Deployments](../deployments/index.md) for the task guides and [Captain Definition Schema](../reference/captain-definition.md) for the exact format.

---
id: ci-cd-integration
title: CI/CD Integration
sidebar_label: CI/CD Integration
---


While CapRover is capable of building your source code and converting it to a Docker image very easily, often you realize that the build process is very heavy. In fact, in many cases, it's heavier that the load on your app itself. This may result in a server crash when you're trying to build your source code on your own server. The best way to avoid these heavy loads is to build your Docker image elsewhere and just deploy the built artifact to your CapRover server.

There are many easy CI/CD platforms that offer generous free minutes for your builds, for example GitHub and GitLab both offer free minutes for private repositories and unlimited free minutes for public repositories. 

In this tutorial, we'll go over the deployment via GitLab. Having said that, GitHub is very similar. If you have any issues along the way, let us know!


### 1- Create GitLab Repository

If you don't have a GitLab account, create an account.
- Click on "New Project" to create a new repository
- Click on "Create blank project"
- Name your project and finish your project creation



### 2- Add Sample Source Code

For this tutorial we'll work with a very easy sample source code containing one file

`index.php`
```php
 <?php echo 'PHP output: Hello World!'; ?> 
```

Add, commit and push this file to your repository on GitLab. You should be seeing this file on the web UI of GitLab.



### 3- Dockerfile

In order to build on a 3rd party build system, you need to have a Dockerfile. If you're using a CapRover templateId, you can use the ready to go [Dockerfiles that are in CapRover repository](https://github.com/caprover/caprover/tree/ff3d124f967ee06732c13774e9e633d33b0982c4/dockerfiles).

In this tutorial, we'll use the PHP Dockerfile:

`Dockerfile`
```Dockerfile
FROM php:7.3-apache
COPY ./ /var/www/html/
```

**IMPORTANT** Make sure your `Dockerfile` is spelled exactly as this.

Add, commit and push this file.



### 4- Create an Access Token for CapRover

CapRover needs to pull the built images from GitLab, so we need to create an access token. Navigate to https://gitlab.com/profile/personal_access_tokens and create a token.

Make sure to assign `read_registry` and `write_registry` permissions for this token.

One you created the token move to the next step:



### 5- Add Token to CapRover

Login to your CapRover web dashboard, under `Cluster` click on `Add Remote Registry`. Then enter these fields:

- Username: `your gitlab username`
- Password: `your gitlab Token [From the previous step]`
- Domain: `registry.gitlab.com`
- Image Prefix: `again, your gitlab username`

Save your registry.



### 6- Disable Default Push

Now that you added a registry, CapRover by default wants to push the built artifact to your registry. You do not need this for this tutorial, and it might make your deployments to fail. So go ahead and disable `Default Push`



### 7- Create a CapRover App

On CapRover dashboard and create an app, we call it `my-test-gitlab-deploy`



### 8- Create CI/CD Variables

Next, go to your project page on GitLab, navigate to `Settings > CI/CD`. Then, under `Variables` add the following variables:
- `Key` : `CAPROVER_URL` , `Value` : `https://captain.root.domain.com [replace it with your domain]`
- `Key` : `CAPROVER_PASSWORD` , `Value` : `mYpAsSwOrD [replace it with your password]`
- `Key` : `CAPROVER_APP` , `Value` : `my-test-gitlab-deploy [replace it with your app name]`

Add all these 3 variables. For best security make sure they are they are protected. It's okay if they are not masked, they won't appear in logs.



### 9- GitLab CI File

So far, we have two files in our directory `index.php` and `Dockerfile`. Now let's add GitLab's specific build instructions:

**IMPORTANT** Make sure your `.gitlab-ci.yml` is spelled exactly as this. It starts with a dot.


`.gitlab-ci.yml`
```yaml
build-docker-master:
  image: docker:19.03.1
  stage: build
  services:
    - docker:19.03.1-dind
  before_script:
    - export DOCKER_REGISTRY_USER=$CI_REGISTRY_USER # built-in GitLab Registry User
    - export DOCKER_REGISTRY_PASSWORD=$CI_REGISTRY_PASSWORD # built-in GitLab Registry Password
    - export DOCKER_REGISTRY_URL=$CI_REGISTRY # built-in GitLab Registry URL
    - export COMMIT_HASH=$CI_COMMIT_SHA # Your current commit sha
    - export IMAGE_NAME_WITH_REGISTRY_PREFIX=$CI_REGISTRY_IMAGE # Your repository prefixed with GitLab Registry URL
    - docker login -u "$DOCKER_REGISTRY_USER" -p "$DOCKER_REGISTRY_PASSWORD" $DOCKER_REGISTRY_URL # Instructs GitLab to login to its registry

  script:
    - echo "Building..." # MAKE SURE NO SPACE ON EITHER SIDE OF = IN THE FOLLOWING LINE
    - export CONTAINER_FULL_IMAGE_NAME_WITH_TAG=$IMAGE_NAME_WITH_REGISTRY_PREFIX/my-build-image:$COMMIT_HASH
    - docker build -f ./Dockerfile --pull -t built-image-name .
    - docker tag built-image-name "$CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - docker push "$CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - echo $CONTAINER_FULL_IMAGE_NAME_WITH_TAG
    - echo "Deploying on CapRover..."
    - docker run caprover/cli-caprover:v2.1.1 caprover deploy --caproverUrl $CAPROVER_URL --caproverPassword $CAPROVER_PASSWORD --caproverApp $CAPROVER_APP --imageName $CONTAINER_FULL_IMAGE_NAME_WITH_TAG
  only:
    - master
```

This is quite self-explanatory. **The best part is that you don't have to any changes to this file!** It is the same file for all of your repositories regardless of their language or where you deploy them! 

The only 3 values that are different for this file, are the 3 `CAPROVER_***` values that you set in the previous step.


Commit and push this file to your GitLab repository. By now, your GitLab repository must have at least these 3 files
```bash
index.php
Dockerfile
.gitlab-ci.yml
```

Wait a little bit until your build is finished and deployed automatically! After a few minutes you can see your deployed app on CapRover!!!



#### Alternative Method

Alternatively, you can use a webhook instead of `docker run caprover/cli-caprover:v2.1.1 caprover deploy....`. This method is a bit more complex. 

The following is NOT A WORKING example. Instead, it's just a hint on what steps are needed for the webhook method to work.

```
    - echo "Deploying on CapRover..."
    - export DEPLOY_BRANCH=deploy-caprover
    - cd ~
    - git clone your-repo
    - cd your-repo
    - git checkout $DEPLOY_BRANCH || git checkout -b $DEPLOY_BRANCH
    - git rm -rf .
    - echo "{\"schemaVersion\":2,\"imageName\":\"$CONTAINER_FULL_IMAGE_NAME_WITH_TAG\"" > captain-definition
    - git add .
    - git commit -m "Deploy $CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - git push --set-upstream origin $DEPLOY_BRANCH
    - curl -X POST https://captain.rootdomain.com/your-webhook
```
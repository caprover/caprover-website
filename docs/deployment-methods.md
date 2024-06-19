---
id: deployment-methods
title: Deployment Methods
sidebar_label: Deployment Methods
---

<br/>
Regardless of your deployment method, make sure that you have a 'captain-definition' file in your project. See docs on [Captain Definition](captain-definition-file.md) for more details.

## Deploy via CLI
Simply run `caprover deploy` in your git repo and follow the steps. This is the best method as it's the only method that reports potential build failures to you. Read more about it here:
 [Get Started - Step 5](get-started.md#step-5-deploy-the-test-app).

## Deploy via Web Dashboard
Convert the content of your project into a tarball (`.tar`), go to your Captain web dashboard and upload the tar file. This deployment method is typically used for testing purposes only.

For captain-definition files that do not require any source code, like [this](/docs/captain-definition-file.html#use-image-name), you can simply copy and paste the captain-definition content on web dashboard.

![deployapp](/img/docs/app-deploy.png)

## One Click Rollback

Let's say you deployed a new version of your app. But you realize that it's buggy. You don't have time to go back, revert your changes or fix the bug, what would you do? Simple! Just go to deployment tab and click on the revert icon next to the version that you want to revert to. CapRover automatically starts a new build and deploy that version! Note that this **DOES NOT** revert changes that you made to Environment Variables, and other app configs such as persistent directories and etc. It just reverts your image (deployed source code).

## Automatic Deploy using Github, Bitbucket and etc.
This method is perhaps the most convenient one. This method automatically triggers a build with a `captain-definiton` file when you push your repo to a specific branch (like `master` or `staging` or `release` or etc). To setup this, go to your apps settings and enter the repo information:
- repo: This is the main HTTPS address of repo, in case of github, it is in `github.com/someone/something` format. Make sure it does NOT include `https://` prefix and `.git` suffix.
- branch: The branch you want to be tracked, for example `master` or `staging` or `release`...
- github/bitbucket username(email address): This is username that will be used when Captain downloads the repo.
- github/bitbucket password: You can enter any non-empty text, like `123456`, for public projects.
- Or, instead of username/password, use SSH Key: Make sure to use PEM format as other formats may not work. Use the following command if unsure:
 ```
ssh-keygen -m PEM -t ed25519 -C "yourname@example.com" -f ./deploykey -q -N ""
```

After you enter this information, save your configuration. And go to your apps page again. Now, you'll see a new field call webhook. Simply copy this webhook to your github/bitbucket repo webhooks (see below). Captain listens to POST requests on this link and triggers a build.

#### Github
Create a webhook here:
- Project > Settings > Add Webhook > URL: Captain Webhook from your apps page, Content Type: `application/json`, 
Secret: <Leave empty>, Just the `push` event.
Furthermore add the contents of your generated public key to your repositories deploy keys.

WARNING: Github has recently introduced a bug where the webhooks are trimmed at 255 characters, please see this issue: https://github.com/caprover/caprover/issues/2079

#### Bitbucket
Webhooks can be added here:
- Project > Settings > Webhooks > Add Webhook > Title: Captain Server, URL: Captain Webhook from your apps page.

#### GitLab and Others
Webhooks can be added in a similar fashion. As long as the webhook fires a POST request, CapRover is able to pick it up and starts a build from the latest commit on the specified branch.

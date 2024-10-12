---
id: cli-commands
title: CLI Commands
sidebar_label: CLI Commands
---

<br/>

You can use this CLI tool to deploy your apps. Before anything, install the CLI tool using npm:
```
npm install -g caprover
```

### Server Setup

The very first thing you need to do is to setup your Captain server. You can either do this by visiting `HTTP://IP_ADDRESS_OF_SERVER:3000` in your browser, or the recommended way which is the command line tool. Simple run
```
caprover serversetup
```

Follow the steps as instructed, enter IP address of server. Enter the root domain to be used with this Captain instance. If you don't know what Captain root domain is, please visit www.caprover.com for documentation. This is a very crucial step. After that, you'll be asked to enter your email address. This should be a valid email address as it will be used in your SSL certificate. After HTTPS is enabled, you'll be asked to change your password. And... Your are done! Go to Deploy section below to read more about app deployment.


### Login

*If you've done the "Server Setup" process through the command line. You can skip "Login" step because "server setup" automatically logs you in as the last step of setup.*

The very first thing you need to do is to login to your Captain server. It is recommended that at this point you have already set up your HTTPS. Login over insecure, plain HTTP is not recommended.

To log in to server, simply run the following line and answer the questions.

```bash
caprover login
```

If operation finishes successfully, you will be prompted with a success message.

NOTE: You can be logged in to several Captain servers at the same time. This is particularly useful if you have separate staging and production servers.

### Deploy

In order to deploy your application, you first need to create a captain-definition file and place it in the root of your project folder. In case of a nodejs application, this would sit in the same folder as your package.json.

A simple captain-definition file for a nodejs application is:

```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```

See  [Captain Definition File](captain-definition-file.md) for more details on the Captain Definition file.

After making sure that this file exists, run the following command and answer the questions given:

```bash
caprover deploy
```

You will then see your application being uploaded and, after that, your application getting built. Note that the build process can take several minutes, so please be patient!

To use the previously-entered values for the current directory, without being asked again, use the `-d` option:

```bash
caprover deploy -d
```

Alternatively, you can use the stateless mode and supply the CapRover server information inline:
```bash
caprover deploy -h https://captain.root.domain.com -p password -b branchName -a app-name 
```

This can be useful if you want to integrate CI/CD pipeline.

#### Options:
Those params are available:
- `-d, --default`: Uses previously entered values for the current directory. Other options are not considered.
- `-c, --configFile <file>`: Specifies a configuration file to use for deployment settings.
- `-u, --caproverUrl <url>`: Sets the CapRover machine URL to which the deployment will be made. This URL is typically in the format [http[s]://][captain.].your-captain-root.domain.
- `-p, --caproverPassword <password>`: The password for the CapRover machine. This option is prompted when a URL is provided and an app token is not used.
- `-n, --caproverName <name>`: The name of the CapRover machine you wish to deploy to. This can be selected from a list of logged-in machines.
- `-a, --caproverApp <app>`: Specifies the application name on the CapRover machine to which you are deploying. This is selected from a list of available applications on the machine.
- `-b, --branch <branch>`: Specifies the Git branch to be deployed. Note that uncommitted and git-ignored files will not be included.
- `-t, --tarFile <tarFile>`: Specifies the path to a tar file which must include a captain-definition file for deployment.
- `-i, --imageName <image>`: Specifies a Docker image to be deployed. The image must exist on the server or be accessible through public or private repositories that CapRover can access.
- `--appToken <token>`: An optional token for app-level authentication, if required.


### List logged in servers

To see a list of servers you are currently logged in to, run the following line:

```bash
caprover list
```

### Logout

Run the following command:

```bash
caprover logout
```

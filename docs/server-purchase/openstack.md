---
id: openstack
title: Setting CapRover Up With OpenStack
sidebar_label: OpenStack
---

## Why OpenStack?

OpenStack is the most popular alternative to proprietary infrastructure-as-a-service (IaaS) cloud standards.
Both huge cloud providers like AWS and Azure as well as some smaller ones like Hetzner have their own distinct APIs,
configurations, and naming conventions for deploying resources.
OpenStack allows you to deploy the same way on any cloud that implements the OpenStack standard (or even roll your own),
thereby escaping vendor lock-in.

## Set up an OpenStack provider

A number of cloud providers support OpenStack, including Infomaniak, VEXXHOST, OVHcloud, SharkTech, and more.

Out of the providers I've seen, Infomaniak has the best [documentation](https://docs.infomaniak.cloud/).

You should follow your provider's instructions for getting the cloud.yaml file for connection the OpenStack CLI
to the cloud project.

Here's a brief summary of the steps for Infomaniak.
See their [documentation](https://docs.infomaniak.cloud/documentation/00.getting-started/01.Create_new_project/) for more details, including screenshots.
Steps for other providers should be similar.

1.  Create a new project in your public cloud dashboard. Call the project something like `caprover-prod`.
2.  When prompted, generate and set a password for the OpenStack user.
3.  Go to "Manage users" for the project. Click the dropdown next to the only user (starting with PCU-...) and download
    the clouds.yaml file.
4.  Move `clouds.yaml` to a location [where the OpenStack client will be able to find it](https://docs.openstack.org/python-openstackclient/latest/configuration/index.html), i.e.
    `.config/openstack/clouds.yaml` in your home directory.
    If you've already set up the file before, copy and append the configuration to your existing file.
5.  Open up your `clouds.yaml` file and change the cloud name from `PCP-...` to something more human-readable like
    `infomaniak-prod`. This will let you keep adding to your file as you add more environments or even other OpenStack
    providers.
6.  Also insert the password you've generated in step 2 into the file.

## Install the OpenStack CLI and validate the connection
1.  Install the OpenStack command line client.
    The [official OpenStack instructions](https://docs.openstack.org/newton/user-guide/common/cli-install-openstack-command-line-clients.html)
    would have you install the client via `pip`, but it's a lot cleaner to use [pipx](https://pipx.pypa.io/stable/)
    instead to avoid polluting your global Python package space:
    ```
    pip install pipx
    pipx install python-openstackclient
    pipx inject python-openstackclient python-heatclient
    ```
2.  Validate the connection with the command:
    ```
    openstack --os-cloud mycloud project list
    ```
    (Note: in this and following commands, replace `mycloud` with the actual name you've set up in clouds.yaml,
    such as `vexxhost-dev` or `infomaniak-prod`).
    This should display your default project name.

## Deploy the OpenStack Heat template file

1.  You'll need to generate a key to be able to SSH into your CapRover server if needed.
    You can create the folder `~/.ssh/openstack` or store your key wherever you like.
    ```
    openstack --os-cloud mycloud keypair create caprover > ~/.ssh/openstack/mycloud.priv
    chmod 600 ~/.ssh/openstack/mycloud.priv
    ```
2.  Many OpenStack providers supply a default set of VM images.
    Check available images with
    ```
    openstack --os-cloud mycloud image list
    ```
    It's recommended to grab the latest version of Ubuntu LTS.
    You can also upload your own image by following the instructions
    [here](https://docs.openstack.org/heat/latest/getting_started/create_a_stack.html#preparing-to-create-a-stack).
3.  Check available flavors with
    ```
    openstack --os-cloud mycloud flavor list
    ```
3.  Check available networks with
    ```
    openstack --os-cloud mycloud network list
    ```
4.  Finally, put all the pieces together to deploy CapRover. Be sure to replace the placeholder values with your own.
    ```
    openstack --os-cloud mycloud stack create -t https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/openstack/single-instance.yml --parameter image_id=<Ubuntu image ID> --parameter instance_type=<flavor> --parameter network=<network> caprover
    ```
    For example, the following works on Infomaniak:
    ```
    openstack --os-cloud infomaniak-dev stack create -t https://raw.githubusercontent.com/caprover/caprover/master/se
tup/openstack/single-instance.yml --parameter image_id="Ubuntu 22.04 LTS Jammy Jellyfish" --parameter instance_type=a1-ram2-disk20-perf1 --parameter network=ext-net1 caprover
    ```

## Validate the deployment
1.  Log in to your OpenStack dashboard web UI.
2.  Open Instances. You should see the instance `caprover-caprover_manager-...`. Copy its IP address.
3.  You should be able to see the CapRover dashboard in your browser at `<IP address>:3000`.
    From this point you should be able to finish setting up CapRover using the instructions in
    [Getting Started](https://caprover.com/docs/get-started.html)
4.  You can also SSH into the instance with the command:
    ```
    ssh -i ~/.ssh/openstack/mycloud-prod.priv -o StrictHostKeyChecking=accept-new ubuntu@<CapRover manager IP>
    ```
    After you're in, you can browse the output of the installation process from the Heat template with the command
    `sudo less /var/log/cloud-init-output.log`.
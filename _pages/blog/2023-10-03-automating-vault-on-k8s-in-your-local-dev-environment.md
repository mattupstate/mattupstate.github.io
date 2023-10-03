---
slug: /blog/automating-vault-on-k8s-in-your-local-dev-environment
title: Automating Vault on Kubernetes in Your Local Development Environment
date: 2023-10-03
description: A relatively minimal way to automate deploying and configuring Vault on a local Kubernetes cluster
---
Maybe you're like me and you're working on a system that is deployed to a Kubernetes cluster that requires Vault as a service to operate. 
Maybe you also want to be able to work on this system locally and for Vault to resemble production to avoid discrepencies with Vault's "dev" server mode. 
Maybe you _could_ spend the time to learn the ins and outs of deploying and configuring Vault but you'd rather stay focused on the integration of your system with Vault instead.
And maybe you came to the same question I did:

> How can I easily automate the deployment and configuration of Vault in my local development environment and afford myself a decent developer experience?

Here's how I answered this question.
Maybe it will help you too.

## Solution

The solution is illustrated by [this GitHub repository](https://github.com/mattupstate/local-vault-on-k8s)
It aims to be:

* Approachable - use only well known, well documented tools
* Minimal - strive for the least amount of tools, commands, etc
* Adaptable - relatively easy to map to other tools and environments

### Prerequisites

* A local Kubernetes cluster via one of the following (or similar):
    * [Docker Desktop](https://docs.docker.com/desktop/kubernetes/)
    * [Rancher Desktop](https://docs.rancherdesktop.io/ui/preferences/kubernetes)
    * [minikube](https://minikube.sigs.k8s.io/docs/start/)
* The following tools are installed:
    * [Helm](https://helm.sh/docs/intro/install/)
    * [Terraform](https://developer.hashicorp.com/terraform/downloads)
    * [Task](https://taskfile.dev/installation/)

### Instructions

Commands to deploy and configure Vault are performed in a specific sequence.
They are expressed in `Taskfile.yaml` and broken into two logical stages.
Assuming a clean Kubernetes cluster, all stages can be executed by running:

    $ task vault

The following describes the two logical phases encapsulated by this task:

#### Deployment

The `vault:deploy` task deploys Vault via Terraform and Helm from files in the `./01-deploy` directory. 
It includes a customized "post-start" script that initializes and unseals vault automatically.
The script also writes down the root token to a well known place in the Vault container.
Execute this task by running:

    $ task vault:deploy

Typically this task does not need to be executed again unless starting from scratch.

#### Configuration

The `vault:configure` task applies desired configuration against the running Vault service via Terraform.
Before Terraform is run the root token is copied from the Vault container to a local `.auto.tfvars.json` file.
A temporary port-fowarding process is also created to afford the local environment to connect to Vault.

Execute this task by running:

    $ task vault:configure

This task can be run independently after making changes to Terraform files in `./02-configure` to apply the desired state.

## Etc

This solution was extracted from [mattupstate/acme](https://github.com/mattupstate/acme)

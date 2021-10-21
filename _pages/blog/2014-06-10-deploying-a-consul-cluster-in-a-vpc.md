---
slug: /blog/deploying-a-consul-cluster-in-a-vpc
title: Deploying a Consul cluster in a VPC
date: 2014-06-10
---
In this article I'd like to show you how you might deploy a Consul cluster into a [Amazon Virtual Private Cloud](http://aws.amazon.com/vpc/) using a few of my favorite tools: [Troposphere](https://github.com/cloudtools/troposphere), [CloudFormation](http://aws.amazon.com/cloudformation/) and [Ansible](http://www.ansible.com/home). There's also a little [Dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) thrown in for good measure.

To support this article I have created a [repository](https://www.github.com/mattupstate/vpc-consul) with the relevant files you will need to deploy this on your own.

> **Update**\
> I originally wrote this article on June 9th and Consul was only at version 2.1. I've since updated the article and code on September 2nd, 2014 to take advantage of some new features on Consul 3.1.

## Components

### Consul

But first, why would you want to do this? Well, because Consul is pretty awesome. I won't go into [all the reasons Consul is awesome](http://www.consul.io/intro/index.html), but lets just say it's got many features one might want for their infrastructure, especially when you have various services coming and going throughout various times of the day, week, month, etc.

### The VPC

Before you deploy a VPC you're going to want to consider much about its design. There is a lot to consider when it comes to this and there's never a one size fits all model. That being said, I've designed the VPC for this article in what I believe to be a generic fashion in hopes that its easy for you to extend and/or modify.

The VPC is arguably designed with high availability in mind. This is achieved by distributing a public and private subnet across three availability zones. Each public subnet is meant to contain load balancers, proxies, etc. Where as each private subnet is meant to contain application servers, databases, message queues, etc. Additionally, each private subnet contains one instance meant to act as a Consul server. The idea is that if a network partition occurs between one AZ, the cluster should continue to operate until the AZ comes back online. Lastly, there is one bastion host that will be located in the first public subnet to allow SSH access to servers within the VPC.

### CloudFormation and Troposphere

There are a lot of components that need to be wired together when deploying a VPC. It is without a doubt that doing this for a VPC with any complexity is a complete drag of a task when doing it through the AWS management console. This is where CloudFormation comes in. Gone are the days of fumbling through all the UI screens and in are the days of abstracting your AWS resources through a declarative templating format! Seriously, if you're not using CloudFormation, get to it.

There is one annoying thing about CloudFormation though, and thats the templates. They're kind of annoying to write by hand. However, there are a plethora of tools out there to help you write your templates. [Troposphere](https://github.com/cloudtools/troposphere) happens to be my favorite tool, mostly because its written in Python. You can see [here](https://github.com/mattupstate/vpc-consul/blob/master/template.py) how I've used Troposphere to create the [CloudFormation template](https://github.com/mattupstate/vpc-consul/blob/master/template.json) for the VPC.

### Ansible

While CloudFormation is great, I still find myself leaving provisioning to another tool rather than leveraging the tools built into AWS. So rather than abstract provisioning in the stack template, I've opted to use [Ansible](http://www.ansible.com/home) to get the bastion and Consul servers up and running. The main thing to mention is the [custom inventory script](https://github.com/mattupstate/vpc-consul/blob/master/hosts) thats been tailored for this article. Notice that the host IP addresses have been hardcoded to the [values specified in the CloudFormation template](https://github.com/mattupstate/vpc-consul/blob/master/template.py#L258).

### Dnsmasq

The last piece of the puzzle is to use [Dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) to foward DNS queries to any Consul hostnames to the local agent. This is very easy to do and is [illustrated in the Consul server provisioning playbook](https://github.com/mattupstate/vpc-consul/blob/master/provision_consul.yaml#L53-L60).

## Deployment

Time to deploy! Follow these steps:

##### 1. Install Ansible on your local machine

Please refer to the Ansible docs for [how to install](http://docs.ansible.com/intro_installation.html) to your local machine.

##### 2. Create the stack

Create a CloudFormation stack using [template.json](https://github.com/mattupstate/vpc-consul/blob/master/template.json) via the AWS managment console or the API. When asked for the parameters be sure to enter the appropriate availability zone letters. The zones in which you can deploy subnets into is dependent on your AWS account. The deafult is `a,b,e` because that is what my account required. Additionally, remember to enter a value key pair name so that you can ssh into the bastion and Consul servers.

##### 3. Provision the bastion

The bastion will need to be provisioned in order to manage the Consul servers. First, get the bastion IP address from the stack's outputs and set the `BASTION_HOST_IP` environment variable:

```shell
git clone https://github.com/mattupstate/vpc-consul.git && cd vpc-consul
ssh-add </path/to/keypair.pem>
export BASTION_HOST_IP=<bastion-ip-output-from-stack>
ansible-playbook -i hosts provision_bastion.yaml
```

##### 4. Provision the Consul servers

SSH into the bastion and provision the Consul servers. Turning on SSH agent forwarding is highly recommended.

```shell
ssh ubuntu@$BASTION_HOST_IP -o ForwardAgent=yes
export ANSIBLE_HOST_KEY_CHECKING=False
ansible-playbook -i hosts provision_consul.yaml
```

##### 5. Verify the cluster

Now you'll want to SSH into one of the Consul servers and be sure that the cluster is in the desired state. The output should look like the following:

```shell
ssh 10.0.16.4
consul members
Node                     Address         Status  Type    Build  Protocol
consul-server-10-0-16-4  10.0.16.4:8301  alive   server  0.3.1  2
consul-server-10-0-32-4  10.0.32.4:8301  alive   server  0.3.1  2
consul-server-10-0-48-4  10.0.48.4:8301  alive   server  0.3.1  2
```

##### 6. Verify DNS lookups

Check that Dnsmasq is successfully forwarding DNS queries to Consul. The output should look like the following:

```shell
dig consul-server-10-0-32-4.node.consul

; <<>> DiG 9.9.5-3-Ubuntu <<>> consul-server-10-0-32-4.node.consul
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 59853
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;consul-server-10-0-32-4.node.consul. IN    A

;; ANSWER SECTION:
consul-server-10-0-32-4.node.consul. 0 IN A 10.0.32.4

;; Query time: 5 msec
;; SERVER: 127.0.0.1#53(127.0.0.1)
;; WHEN: Mon Jun 09 16:55:30 UTC 2014
;; MSG SIZE  rcvd: 104
```

## Wrap Up

So there you have it. A perfectly working three node Consul cluster distributed across three availability zones, each in a private subnet protected from the outside world. Now when you deploy any new instances into your VPC you'll want to make sure that you install and run the Consul agent, optionally registering any services made available by those instances. Also consider registering various health checks for the instance and services.

If anyone has any ideas on how to improve this please comment below. Thanks for reading!
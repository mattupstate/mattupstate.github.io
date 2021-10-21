---
slug: /blog/multi-server-flask-application-development-enviornment-with-vagrant-and-ansible
title: Multi Server Flask Application Development Environment with Vagrant and Ansible
date: 2012-08-20
---
I recently discovered [Vagrant](http://vagrantup.com/) which is a great tool that makes managing and provisioning local virtual machines rather superficial. Additionally, I recently found that there is a project called [vagrant-ansible](https://github.com/dsander/vagrant-ansible) that adds support for provisioning VMs with [Ansible](http://ansible.github.com/). Ansible is my favorite new system configuration tool, which might be evident in a [previous article](http://mattupstate.github.com/python/devops/2012/08/07/flask-wsgi-application-deployment-with-ubuntu-ansible-nginx-supervisor-and-uwsgi.html). This article is sort of a continuation of that previous article. The main difference being that I've added a database server to the mix to illustrate how one my mimic their staging or production environments on a development machine.

## Requirements

If you plan on following along with this tutorial you will need to install the following software. Please follow the installation instructions provided:

* [Vagrant](http://downloads.vagrantup.com/tags/v1.0.3)
* [vagrant-ansible](https://github.com/dsander/vagrant-ansible/blob/master/README.md)
* [Ansible](http://ansible.github.com/gettingstarted.html)

Additionally, the source code is available at <https://github.com/mattupstate/vagrant-ansible-tutorial>. Clone the repository on your machine.

## The Setup

Generally speaking a web application has at least two servers:

* Web server
* Database server

The web server runs the application code. In this case it runs a [Flask](http://flask.pocoo.org/) application using Nginx, uWSGI, and Supervisor. However, the web server could hypothetically consist of any sort of stack such as Apache and PHP. The database server hosts the database. In this case it is a PostgreSQL server but it could anything such as MySQL, MongoDB, etc.

### Vagrantfile

The servers are defined in the file named `Vagrantfile` located at the root of the source code. The contents look like such:

```ruby
require 'vagrant-ansible'

Vagrant::Config.run do |config|

  config.vm.define :web do |web_config|
    web_config.vm.box = "oneiric32_base"
    web_config.vm.box_url = "http://files.travis-ci.org/boxes/bases/oneiric32_base.box"
    web_config.vm.forward_port 80, 8080
    web_config.vm.network :bridged
    web_config.vm.network :hostonly, "192.168.100.10"

    web_config.vm.provision :ansible do |ansible|
      ansible.playbook = "devops/webserver.yml"
      ansible.hosts = "webservers"
    end
  end

  config.vm.define :db do |db_config|
    db_config.vm.box = "oneiric32_base"
    db_config.vm.box_url = "http://files.travis-ci.org/boxes/bases/oneiric32_base.box"
    db_config.vm.forward_port 5432, 54322
    db_config.vm.network :bridged
    db_config.vm.network :hostonly, "192.168.100.20"

    db_config.vm.provision :ansible do |ansible|
      ansible.playbook = "devops/dbserver.yml"
      ansible.hosts = "dbservers"
    end
  end

end
```

Pretty straight forward. Each server is defined as separate blocks. Within each block the servers are configured with port fowarding and networking information. In this case the servers are configured with both `:bridged` and `:hostonly` networking options. Check out the [Vagrant documentation](http://vagrantup.com/v1/docs/index.html) for more information regarding networking options. The important part here is to notice the IP address given to the database server: `192.168.100.20`. This is the address that the application must specify for its database connection.

Take notice of where Ansible comes in to play. In each server block Vagrant is configured to use Ansible during the provisioning process. A playbook and host group is also specified. Make note that the playbooks' hosts values matches up with the hosts value specified in the server block.

## Provisioning

Given the `Vagrantfile` and the associated playbooks for each server, provisioning each virtual machine is as easy as running the following command from the root folder of the source code:

```shell
vagrant up web && vagrant up db
```

You'll see a lot of activity in the terminal and will be asked what network adapter to attach each server to enable bridged networking. Select whatever you're machine is using at the moment.

## Application Development

Once the servers are running you're free to develop your application! Notice how the application's [database URL](https://github.com/mattupstate/vagrant-ansible-tutorial/blob/master/app.py#L6) is configured with the IP address specified in the Vagrant configuration.

You also, hypothetically, have the same stack as the staging and production environments. You could even deploy the application as you might do in the staging and production environments as well. The example application can be deployed to the webserver using the following command:

```shell
devops/deploy.sh
```

This will run the deployment playbook against the webserver. Once the playbook has completed its tasks you should be able to go to [http://127.0.0.1:8080](http://127.0.0.1:8080/) in your browser and see a list of two users.

If you ask me, that is how easy it should be to setup a development environment!
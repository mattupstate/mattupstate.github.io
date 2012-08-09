---
comments: true
date: 2012-08-07 21:16:55
layout: post
slug: flask-wsgi-application-deployment-with-ubuntu-ansible-nginx-supervisor-and-uwsgi
title: Flask/WSGI Application Deployment with Ubuntu, Ansible, Nginx, Supervisor and uWSGI
categories:
- python
- devops
tags:
- ansible
- flask
- nginx
- supervisor
- uwsgi 
---


In this article you will learn how to use [Ansible](http://ansible.github.com) to deploy an arbitrary WSGI app, in this case a [Flask](http://flask.pocoo.org) app, to an Ubuntu server that runs [Nginx](http://wiki.nginx.org/), [uWSGI](http://projects.unbit.it/uwsgi/), and [Supervisor](http://supervisord.org/). This article assumes you have a basic understanding of Ubuntu, Python web application development and are using git for source control.

##Contents

1. [Ansible](#ansible)
2. [Server Software](#server-software)
3. [The Flask/WSGI Application](#application)
4. [Server Setup](#server-setup)
5. [Application Deployment](#application-deployment)
6. [Playbooks Explained](#playbooks-explained)
    * [server_setup.yml](#server_setup.yml)
    * [deploy.yml](#deploy.yml)
7. [Notes](#notes)
    * [Nginx Service Problems](#nginx-service-problems)

---
## <a id="ansible"></a>Ansible

Ansible is a great devops tool. It's truly simply to understand and is easily extended with custom functionality that can be written in nearly any language. If you have not installed Ansible yet, please do by following the instructions on the [Getting Started](http://ansible.github.com/gettingstarted.html) page.

This tutorial will make use of a few modules I contributed to Ansible. They include `apt_repository`, `easy_install`, `pip`, and `supervisorctl`.


---
## <a id="server-software"></a>Server Software

**[Nginx](http://wiki.nginx.org/)**

Nginx is a very fast, lightweight, and popular web server. It will be used as the front end proxy server that ushers the HTTP requests to the Flask application. It will also be used to serve the application's static files to the browser.

**[uWSGI](http://projects.unbit.it/uwsgi/)**

uWSGI is a fast, stable, and full featured application container. It plays very nice with Python and WSGI applications. It will be used to run the Python application process(es) and Nginx, conveniently, supports uWSGI out of the box.

**[Supervisor](http://supervisord.org/)**

Supervisor will be used to manage the uWSGI application container including starting, stoping, and restarting it when necessary. Its also useful for managing other various processes. For instance, you could use it to manage worker processes for a task queue.


---
## <a id="application"></a>The Flask/WSGI Application

It's probably safe to say that if you're developing a Python web app you'll using a WSGI based framework. This article happens to use a very simple Flask application but this deployment method could be applied to any WSGI compatible framework. 

The application that will be used is located at [http://github.com/mattupstate/ansible-tutorial](http://github.com/mattupstate/ansible-tutorial). The repository also contains the Ansible playbooks for this tutorial. Clone the repository if you would like to follow along step by step:

    $ git clone http://github.com/mattupstate/ansible-tutorial
    $ cd ansible-tutorial


---
## <a id="server-setup"></a>Server Setup

Before following along with this section of the tutorial you may want to have a server to run the proceeding playbooks against. I've been using a fresh, 64-bit, Ubuntu 11.04 server on Amazon EC2. If you happen to have an Amazon EC2 account you can [launch an instance of the same server (ami-699f3600)](https://console.aws.amazon.com/ec2/home?region=us-east-1#launchAmi=ami-699f3600). 

Create a copy of the `devops/hosts.example` file and make sure its located at `devops/hosts`. Replace the current host name with the host name of your Ubuntu server.

    $ cp devops/hosts.example devops/hosts

With the server/host is defined you can run the [server_setup.yml](https://github.com/mattupstate/ansible-tutorial/blob/master/devops/setup_server.yml) playbook against it. Run the following Ansible command:

    $ ansible-playbook devops/setup_server.yml -i devops/hosts

If your server requires a private key to access it via ssh run the previous command but append it with:

    --private-key=<path_to_private_key>

If all goes well all the required software for running your application will be installed and configured.


---
## <a id="application-deployment"></a>Application Deployment

The application will deployed to the server using Ansible's [git module](http://ansible.github.com/modules.html#git). Essentially it will pull the latest code from the repository and checkout the specified version or branch. In the case of this tutorial the `HEAD` revision of the `origin/master` branch is being used.

To deploy the application run the [deploy.yml](https://github.com/mattupstate/ansible-tutorial/blob/master/devops/deploy.yml) playbook against the server with the following command (appending the `--private-key` argument if necessary):

    $ ansible-playbook devops/deploy.yml -i devops/hosts

If all goes well the application should be deployed to the server and if you access the host in your browser you should see `Hello World` appear in your browser!


---
## <a id="playbooks-explained"></a>Playbooks Explained

This section explains each playbook in detail.

### <a id="server_setup.yml"></a>server_setup.yml

The [server_setup.yml](https://github.com/mattupstate/ansible-tutorial/blob/master/devops/setup_server.yml) playbook is made specifically for setting up an Ubuntu server to run the application in the manner described above.


#### Configuration

At the top of the file you will see the following contents:

{% highlight yaml %}
---

- hosts: webservers
  user: ubuntu
  sudo: True
{% endhighlight %}

This part of the file specifies which host(s) to run the playbook against, which user to run as, and wether or not to use sudo actions. In the case of this tutorial the `hosts` attribute is set to the `webservers` group which was defined in the `devops/hosts` file. Additionall the default user for the newly created server is named `ubuntu` and all actions are performed as root for simplicity. 


#### Tasks

After the previous contents you will begin to see task definitions. The first four tasks are as follows:

{% highlight yaml %}
- name: add nginx ppa
  action: apt_repository repo=ppa:nginx/stable state=present

- name: install common packages needed for python application development
  action: apt pkg=$item state=installed
  with_items:
    - libpq-dev
    - libmysqlclient-dev
    - libxml2-dev
    - libjpeg62
    - libjpeg62-dev
    - libfreetype6
    - libfreetype6-dev
    - zlib1g-dev
    - mysql-client
    - python-dev
    - python-setuptools
    - python-imaging
    - python-mysqldb
    - python-psycopg2
    - git-core
    - nginx

- name: install pip
  action: easy_install name=pip

- name: install various libraries with pip
  action: pip name=$item state=present
  with_items:
    - virtualenv
    - supervisor
    - uwsgi
{% endhighlight %}

These tasks install the various pieces of software necessary for running the application. Notice the use of the custom Ansible modules `apt_repository`, `easy_install`, and `pip`. These are available in my [Ansible fork](https://github.com/mattupstate/ansible).

Following this are some housekeeping tasks:

{% highlight yaml %}
- name: symlink imaging library files
  action: file src=/usr/lib/x86_64-linux-gnu/libfreetype.so dest=/usr/lib/libfreetype.so state=link

- name: symlink imaging library files
  action: file src=/usr/lib/x86_64-linux-gnu/libz.so dest=/usr/lib/libz.so state=link

- name: symlink imaging library files
  action: file src=/usr/lib/x86_64-linux-gnu/libjpeg.so.62 dest=/usr/lib/x86_64-linux-gnu/libjpeg.so state=link

- name: symlink imaging library files
  action: file src=/usr/lib/x86_64-linux-gnu/libjpeg.so dest=/usr/lib/libjpeg.so state=link
{% endhighlight %}

These tasks ensure that a few files are able to be found during the build process of PIL, Python's imaging library. 

Following this are some tasks related to **Nginx**:

{% highlight yaml %}
- name: remove default nginx site
  action: file path=/etc/nginx/sites-enabled/default state=absent

- name: write nginx.conf
  action: template src=templates/nginx.conf dest=/etc/nginx/nginx.conf
{% endhighlight %}

With these tasks the default Nginx site is removed and a new Nginx configuration file is created from the [custom template](https://github.com/mattupstate/ansible-tutorial/blob/master/devops/templates/nginx.conf).

Following this are some tasks related to **Supervisor**:

{% highlight yaml %}
- name: create supervisord config folder
  action: file dest=/etc/supervisor state=directory owner=root

- name: create supervisord config
  action: template src=templates/supervisord.conf dest=/etc/supervisord.conf

- name: create supervisord init script
  action: template src=templates/supervisord.sh dest=/etc/init.d/supervisord mode=0755

- name: start supervisord service and have it run during system startup
  action: service name=supervisord state=started enabled=yes
{% endhighlight %}

The first task creates a directory to contain various program configurations. Following this a Supervisor configuration file is created from the [custom template](https://github.com/mattupstate/ansible-tutorial/blob/master/devops/templates/supervisord.conf) which will load all files located in the aforementioned directory. The third and fourth tasks setup Supervisor to run as a service and run when the system starts up.

And finally the last task:

{% highlight yaml %}
- name: create webapps directory
  action: file dest=/srv/webapps state=directory
{% endhighlight %}

This task simply creates a directory to hold all the server's web applications.


### <a id="deploy.yml"></a>deploy.yml

The [deploy.yml](https://github.com/mattupstate/ansible-tutorial/blob/master/devops/deploy.yml) playbook is made specifically for the previous server setup. 

#### Configuration

Just as with the `server_setup.yml` playbook, you'll see the same contents at the top of the file specifying the host(s) and user.

{% highlight yaml %}
---

- hosts: webservers
  user: ubuntu
  sudo: True
{% endhighlight %}

Following this are some variable definitions:

{% highlight yaml %}
vars:
  app_name: hello_flask
  repo_url: https://github.com/mattupstate/ansible-tutorial.git
  repo_remote: origin
  repo_version: master
  webapps_dir: /srv/webapps
  wsgi_file: wsgi.py
  wsgi_callable: app
{% endhighlight %}

These variables are used throughout the playbook and are also used when writing templates to the server.


#### Tasks

{% highlight yaml %}
- name: ensure log directory
  action: file dest=${webapps_dir}/${app_name}/log state=directory
{% endhighlight %}

This ensures the log directory is in place.

{% highlight yaml %}
- name: deploy code from repository
  action: git repo=$repo_url dest=${webapps_dir}/${app_name}/src remote=$repo_remote version=$repo_version
{% endhighlight %}

This task retrieves the source code form the remote git repository and checks out the specified version/branch, in this case the `HEAD` revision of the `master` branch. Notice the usage of the variables defined before.

{% highlight yaml %}
- name: install dependencies into virtualenv
  action: pip requirements=${webapps_dir}/${app_name}/src/requirements.txt virtualenv=${webapps_dir}/${app_name}/venv state=present
{% endhighlight %}

This tasks installs the application's dependencies into the specified vitualenv using pip and the applicaiton's `requirements.txt` file. 

{% highlight yaml %}
- name: create supervisor program config
  action: template src=templates/supervisor.ini dest=/etc/supervisor/${app_name}.ini
  notify:
    - restart app
{% endhighlight %}

This task creates or updates the application's Supervisor program configuration from a [custom template](https://github.com/mattupstate/ansible-tutorial/blob/master/devops/templates/supervisor.ini). If you look at the contents of the template you will see the previous defined variables being used. Additionally, this task defines a `notify` action. This means that if the configuration file changes at all, Ansible will run the `restart app` handler which is defined later on in the playbook.

{% highlight yaml %}
- name: create nginx site config
  action: template src=templates/nginx_site.conf dest=/etc/nginx/sites-available/${app_name}.conf
  notify:
    - restart nginx

- name: link nginx config
  action: file src=/etc/nginx/sites-available/${app_name}.conf dest=/etc/nginx/sites-enabled/${app_name}.conf state=link
{% endhighlight %}

These tasks creates or updates the applicatin's Nginx configuration from a [custom template](https://github.com/mattupstate/ansible-tutorial/blob/master/devops/templates/nginx_site.conf) and ensures a symlink exists in the Nginx `sites-enabled` directory. This task also defines a `notify` action and in this case, if the configuration changes at all, Nginx will be restarted.

{% highlight yaml %}
- name: start app
  action: supervisorctl name=${app_name} state=started
{% endhighlight %}

And lastly, this task ensures the application is running, if it is running already nothing will be affected.

This task ensures the symlink for the Nginx configuration


#### Handlers

Some of the previous tasks use Ansible's `notify` action. In the case those tasks make a change on the server Ansible will run a handler with the given name. The following are the handlers:

{% highlight yaml %}
- name: restart app
  action: supervisorctl name=${app_name} state=restarted
{% endhighlight %}

This handler will ensure the application is restarted via supervisorctl so long as it is already running. 

{% highlight yaml %}
- name: restart nginx
  action: service name=nginx state=restarted
{% endhighlight %}

This handler will ensure Nginx is restarted so long as it is already running.

---
##<a id="notes"></a>Notes

###<a id="nginx-service-problems"></a>Nginx Service Problems

At the time of writing this tutorial there was a small problem with the Nginx PPA and the init script that was packaged with it. Luckily a [bug was filed](https://bugs.launchpad.net/nginx/+bug/1033856) at Launchpad so I figured out what was going on. If you experience this problem simply replace the contents of the `/etc/init.d/nginx` file with this [alternative init script](https://launchpadlibrarian.net/112190683/nginx.txt).
---
slug: /blog/running-an-elasticsearch-cluster-on-coreos
title: Running an ElasticSearch Cluster on CoreOS
date: 2014-06-26
---
Recently I've been experimenting with [Docker](http://www.docker.com/) as a build and deployment tool. During my research I stumbled onto a seemingly interesting project called [CoreOS](https://coreos.com/). CoreOS is a new Linux distro tailored for scheduling and deploying services across a cluster of servers. It comes packed with Docker, [etcd](http://coreos.com/using-coreos/etcd/) (a distributed key value store), and [fleet](http://coreos.com/using-coreos/clustering/) (a distributed init system backed by [systemd](http://coreos.com/using-coreos/systemd/)). All really cool stuff. So I decided to check it out and see how I might deploy an [ElasticSearch](http://www.elasticsearch.org/) cluster.

## Environment

For the test environment I've used [Vagrant](http://www.vagrantup.com/) given that the CoreOS team provides up-to-date CoreOS builds as Vagrant boxes. If you'd like to follow along be sure to install Vagrant first. These are the steps I took to set my environment up:

##### 1. Get the files:

```shell
git clone https://github.com/coreos/coreos-vagrant.git
cd coreos-vagrant

```

##### 2. Make copies of the `config.rb.example` and `user-data.example` files:

```shell
cp config.rb.example config.rb
cp user-data.example user-data
```

##### 3. Change the number of instances in `config.rb` to 3:

```ruby
# config.rb
...
$num_instances=3
...
```

##### 4. Set the etcd discovery URL in `user-data`:

```shell
curl http://discovery.etcd.io/new
<discovery-url>

# user-data
coreos:
  etcd:
    discovery: <discovery-url>
...
```

##### 5. Uncomment the `synced_folder` option in `Vagrantfile`:

```ruby
# Vagrantfile
...
      config.vm.synced_folder ".", "/home/core/share", id: "core", :nfs => true, :mount_options => ['nolock,vers=3,udp']
...
```

##### 6. Start the machines:

```shell
vagrant up
```

##### 7. Verify the cluster:

```shell
vagrant ssh core-01 -- -A
Last login: Wed Jun 25 23:57:32 2014 from 10.0.2.2
CoreOS (alpha)
core@core-01 ~ $ fleetctl list-machines
MACHINE     IP      METADATA
4874973d... 172.17.8.102    -
7f0af17f... 172.17.8.103    -
847600c0... 172.17.8.101    -

```

## Service Units

To run the cluster I've decided to use two service units, one for ElasticSearch itself and another to act as a "discovery" service. One instance of each service will be deployed to each machine in the cluster for a total of six service instances.

### Discovery Service

The Discovery Sevice will act as a sort of health check for an ElasticSearch service. This is enabled with a basic bash script that sets a key for the machine in etcd if the service is available or removes the key if the service is not available. The idea here is that when additional ElasticSearch instances are deployed they can join the cluster by asking etcd for the currently deployed ElasticSearch services. The discovery service looks this:

```ini
# elasticsearch-discovery@.service

[Unit]
Description=ElasticSearch discovery service
BindsTo=elasticsearch@%i.service

[Service]
EnvironmentFile=/etc/environment

ExecStart=/bin/bash -c '\
  while true; do \
    curl -f ${COREOS_PRIVATE_IPV4}:9200; \
    if [ "$?" = "0" ]; then \
      etcdctl set /services/elasticsearch/${COREOS_PRIVATE_IPV4} \'{"http_port": 9200, "transport_port": 9300}\' --ttl 60; \
    else \
      etcdctl rm /services/elasticsearch/${COREOS_PRIVATE_IPV4}; \
    fi; \
    sleep 45; \
  done'

ExecStop=/usr/bin/etcdctl rm /services/elasticsearch/${COREOS_PRIVATE_IPV4}

[X-Fleet]
X-ConditionMachineOf=elasticsearch@%i.service
```

The bash script that does the work uses `curl` to make a request to the local ElasticSearch service running on port 9200. Passing the `-f` flag to `curl` allows one to get a more meaningful exit code and in this case it is used as the conditional to set or remove the key in etcd. Take note of the `BindsTo=` directive. This tells `systemd` that this service should be started only when the corresponding ElasticSearch service is started. Additionally, I've specified that this service should be deployed to the same machine as the corresponding ElasticSearch service with the `X-ConditionMachineOf=` directive.

### ElasticSearch Service

The ElasticSearch Service runs, not surprisingly, ElasticSearch. The service looks like this:

```ini
# elasticsearch@.service

[Unit]
Description=ElasticSearch service
After=docker.service
Requires=docker.service

[Service]
TimeoutSec=180
EnvironmentFile=/etc/environment

ExecStartPre=/usr/bin/mkdir -p /data/elasticsearch
ExecStartPre=/usr/bin/docker pull dockerfile/elasticsearch

ExecStart=/bin/bash -c '\
  curl -f ${COREOS_PRIVATE_IPV4}:4001/v2/keys/services/elasticsearch; \
  if [ "$?" = "0" ]; then \
      UNICAST_HOSTS=$(etcdctl ls --recursive /services/elasticsearch \
                      | sed "s/\/services\/elasticsearch\///g" \
                      | sed "s/$/:9300/" \
                      | paste -s -d","); \
  else \
      UNICAST_HOSTS=""; \
  fi; \
  /usr/bin/docker run \
    --name %p-%i \
    --publish 9200:9200 \
    --publish 9300:9300 \
    --volume /data/elasticsearch:/data \
    dockerfile/elasticsearch \
    /elasticsearch/bin/elasticsearch \
    --node.name=%p-%i \
    --cluster.name=logstash \
    --network.publish_host=${COREOS_PRIVATE_IPV4} \
    --discovery.zen.ping.multicast.enabled=false \
    --discovery.zen.ping.unicast.hosts=$UNICAST_HOSTS'

ExecStop=/usr/bin/docker stop %p-%i
ExecStop=/usr/bin/docker rm %p-%i

[X-Fleet]
X-Conflicts=%p@*.service
```

First note that a directory is created in a `ExecStartPre=` directive on the host machine to store the ElasticSearch data. This is then mounted to the Docker container and allows the ElasticSearch data to survive service restarts. Next of note is the bash script that starts ElasticSearch. In this script a variable is conditionally set to a comma separated list of IP and port pairs for the currently running ElasticSearch services. This variable is then used to configure the service's unicast hosts option so that the new service will join the cluster. Unicast is used here because multicast is not supported in a Docker environment. Lastly, the `X-Conflicts=` directive ensures that there will be but one ElasticSearch service per machine in the cluster.

## Deploying

Deploying the services is done with the `fleetctl` command line tool. It is a good idea to first deploy the Discovery Service so that it will automatically be started when the ElasticSearch Service is deployed. First, make sure you have ssh'd into one of the machines and using the synced folder as your working directory:

```shell
vagrant ssh core-01 -- -A
Last login: Wed Jun 25 23:57:32 2014 from 10.0.2.2
CoreOS (alpha)
core@core-01 ~ $ cd share
```

The next step is to "submit" the Discovery Service to `fleet` so that it is ready and waiting for the upcoming ElasticSearch services to be deployed:

```shell
core@core-01 ~/share $ fleetctl submit elasticsearch-discovery@{1,2,3}.service
```

Now its time to start and wait for at least one ElasticSearch service to be deployed:

```shell
core@core-01 ~/share $ fleetctl start elasticsearch@1.service
Job elasticsearch@1.service launched on 7f0af17f.../172.17.8.103
```

This first time this is deployed it can take a little while since Docker will have to pull the `dockerfile/elasticsearch` image from the public registry the first time. Normally `systemd` would timeout, but I've added a `TimeoutSec=` directive to the service unit to allow for this condition. If you want to watch the progress of this first service as it starts up you can tail the logs by running the `fleetctl journal` command. You should see something like this:

```shell
core@core-01 ~/share $ fleetctl journal -f elasticsearch@1.service
-- Logs begin at Wed 2014-06-25 18:03:29 UTC. --
Jun 26 03:08:57 core-03 systemd[1]: Starting ElasticSearch service...
Jun 26 03:08:57 core-03 docker[31109]: Pulling repository dockerfile/elasticsearch
Jun 26 03:09:01 core-03 docker[31136]: Pulling repository dockerfile/elasticsearch
Jun 26 03:09:04 core-03 systemd[1]: Started ElasticSearch service.
Jun 26 03:09:04 core-03 bash[31144]: % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
Jun 26 03:09:04 core-03 bash[31144]: Dload  Upload   Total   Spent    Left  Speed
Jun 26 03:09:04 core-03 bash[31144]: [155B blob data]
Jun 26 03:09:06 core-03 bash[31144]: {"action":"get","node":{"key":"/services/elasticsearch","dir":true,"modifiedIndex":493,"createdIndex":493}}[2014-06-26 03:09:06,159][INFO ][node                     ] [elasticsearch-1] version[1.2.1], pid[1], build[6c95b75/2014-06-03T15:02:52Z]
Jun 26 03:09:06 core-03 bash[31144]: [2014-06-26 03:09:06,160][INFO ][node                     ] [elasticsearch-1] initializing ...
Jun 26 03:09:06 core-03 bash[31144]: [2014-06-26 03:09:06,167][INFO ][plugins                  ] [elasticsearch-1] loaded [], sites []
Jun 26 03:09:09 core-03 bash[31144]: [2014-06-26 03:09:09,432][INFO ][node                     ] [elasticsearch-1] initialized
Jun 26 03:09:09 core-03 bash[31144]: [2014-06-26 03:09:09,433][INFO ][node                     ] [elasticsearch-1] starting ...
Jun 26 03:09:09 core-03 bash[31144]: [2014-06-26 03:09:09,521][INFO ][transport                ] [elasticsearch-1] bound_address {inet[/0:0:0:0:0:0:0:0:9300]}, publish_address {inet[/172.17.8.103:9300]}
Jun 26 03:09:12 core-03 bash[31144]: [2014-06-26 03:09:12,551][INFO ][cluster.service          ] [elasticsearch-1] new_master [elasticsearch-1][oDMLhfaqQPupW-Kx7053Eg][528834ab92f2][inet[/172.17.8.103:9300]], reason: zen-disco-join (elected_as_master)
Jun 26 03:09:12 core-03 bash[31144]: [2014-06-26 03:09:12,595][INFO ][discovery                ] [elasticsearch-1] logstash/oDMLhfaqQPupW-Kx7053Eg
Jun 26 03:09:12 core-03 bash[31144]: [2014-06-26 03:09:12,627][INFO ][http                     ] [elasticsearch-1] bound_address {inet[/0:0:0:0:0:0:0:0:9200]}, publish_address {inet[/172.17.8.103:9200]}
Jun 26 03:09:12 core-03 bash[31144]: [2014-06-26 03:09:12,648][INFO ][gateway                  ] [elasticsearch-1] recovered [0] indices into cluster_state
Jun 26 03:09:12 core-03 bash[31144]: [2014-06-26 03:09:12,649][INFO ][node                     ] [elasticsearch-1] started
```

Once the first ElasticSearch service is up and running you can now add additional "nodes" to the cluster by running additional services:

```shell
core@core-01 ~/share fleetctl start elasticsearch@{2,3}.service
Job elasticsearch@2.service launched on 847600c0.../172.17.8.101
Job elasticsearch@3.service launched on 4874973d.../172.17.8.102
```

And again, tail one of the services to watch the startup progress:

```shell
core@core-01 ~/share $ fleetctl journal -f elasticsearch@2.service
-- Logs begin at Wed 2014-06-25 18:02:30 UTC. --
Jun 26 03:15:27 core-01 systemd[1]: Starting ElasticSearch service...
Jun 26 03:15:27 core-01 docker[31265]: Pulling repository dockerfile/elasticsearch
Jun 26 03:15:29 core-01 docker[31286]: Pulling repository dockerfile/elasticsearch
Jun 26 03:15:32 core-01 systemd[1]: Started ElasticSearch service.
Jun 26 03:15:32 core-01 bash[31299]: % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
Jun 26 03:15:32 core-01 bash[31299]: Dload  Upload   Total   Spent    Left  Speed
Jun 26 03:15:32 core-01 bash[31299]: [155B blob data]
Jun 26 03:15:33 core-01 bash[31299]: {"action":"get","node":{"key":"/services/elasticsearch","dir":true,"nodes":[{"key":"/services/elasticsearch/172.17.8.103","value":"{\"http_port\": 9200, \"transport_port\": 9300}","expiration":"2014-06-26T03:16:10.516041728Z","ttl":39,"modifiedIndex":35199,"createdIndex":35199}],"modifiedIndex":493,"createdIndex":493}}[2014-06-26 03:15:33,505][INFO ][node                     ] [elasticsearch-2] version[1.2.1], pid[1], build[6c95b75/2014-06-03T15:02:52Z]
Jun 26 03:15:33 core-01 bash[31299]: [2014-06-26 03:15:33,506][INFO ][node                     ] [elasticsearch-2] initializing ...
Jun 26 03:15:33 core-01 bash[31299]: [2014-06-26 03:15:33,512][INFO ][plugins                  ] [elasticsearch-2] loaded [], sites []
Jun 26 03:15:36 core-01 bash[31299]: [2014-06-26 03:15:36,907][INFO ][node                     ] [elasticsearch-2] initialized
Jun 26 03:15:36 core-01 bash[31299]: [2014-06-26 03:15:36,908][INFO ][node                     ] [elasticsearch-2] starting ...
Jun 26 03:15:37 core-01 bash[31299]: [2014-06-26 03:15:37,001][INFO ][transport                ] [elasticsearch-2] bound_address {inet[/0:0:0:0:0:0:0:0:9300]}, publish_address {inet[/172.17.8.101:9300]}
Jun 26 03:15:40 core-01 bash[31299]: [2014-06-26 03:15:40,133][INFO ][cluster.service          ] [elasticsearch-2] detected_master [elasticsearch-1][oDMLhfaqQPupW-Kx7053Eg][528834ab92f2][inet[/172.17.8.103:9300]], added {[elasticsearch-1][oDMLhfaqQPupW-Kx7053Eg][528834ab92f2][inet[/172.17.8.103:9300]],}, reason: zen-disco-receive(from master [[elasticsearch-1][oDMLhfaqQPupW-Kx7053Eg][528834ab92f2][inet[/172.17.8.103:9300]]])
Jun 26 03:15:40 core-01 bash[31299]: [2014-06-26 03:15:40,174][INFO ][discovery                ] [elasticsearch-2] logstash/fnMFB1wMTZmNiQ96MS3cQw
Jun 26 03:15:40 core-01 bash[31299]: [2014-06-26 03:15:40,182][INFO ][http                     ] [elasticsearch-2] bound_address {inet[/0:0:0:0:0:0:0:0:9200]}, publish_address {inet[/172.17.8.101:9200]}
Jun 26 03:15:40 core-01 bash[31299]: [2014-06-26 03:15:40,186][INFO ][node                     ] [elasticsearch-2] started
Jun 26 03:15:42 core-01 bash[31299]: [2014-06-26 03:15:42,692][INFO ][cluster.service          ] [elasticsearch-2] added {[elasticsearch-3][F5mpLliyS5m6Hl5-GI59Sg][e72be2b7be66][inet[/172.17.8.102:9300]],}, reason: zen-disco-receive(from master [[elasticsearch-1][oDMLhfaqQPupW-Kx7053Eg][528834ab92f2][inet[/172.17.8.103:9300]]])
```

Notice in the log output that the new service has detected the first service as the master node! Finally, its just a good idea to verify the state of the ElasticSearch cluster with a plain old `curl` call:

```shell
core@core-01 ~/share $ curl localhost:9200/_cluster/state?pretty=true
{
  "cluster_name" : "logstash",
  "version" : 5,
  "master_node" : "oDMLhfaqQPupW-Kx7053Eg",
  "blocks" : { },
  "nodes" : {
    "oDMLhfaqQPupW-Kx7053Eg" : {
      "name" : "elasticsearch-1",
      "transport_address" : "inet[/172.17.8.103:9300]",
      "attributes" : { }
    },
    "fnMFB1wMTZmNiQ96MS3cQw" : {
      "name" : "elasticsearch-2",
      "transport_address" : "inet[/172.17.8.101:9300]",
      "attributes" : { }
    },
    "F5mpLliyS5m6Hl5-GI59Sg" : {
      "name" : "elasticsearch-3",
      "transport_address" : "inet[/172.17.8.102:9300]",
      "attributes" : { }
    }
  },
  "metadata" : {
    "templates" : { },
    "indices" : { }
  },
  "routing_table" : {
    "indices" : { }
  },
  "routing_nodes" : {
    "unassigned" : [ ],
    "nodes" : {
      "oDMLhfaqQPupW-Kx7053Eg" : [ ],
      "F5mpLliyS5m6Hl5-GI59Sg" : [ ],
      "fnMFB1wMTZmNiQ96MS3cQw" : [ ]
    }
  },
  "allocations" : [ ]
}
```

Hooray! All three nodes are in the cluster.

## Conclusion

So I think its safe to say that you could easily run an ElasticSearch cluster on CoreOS. However, I wouldn't say this is ready for a production environment quite yet given that CoreOS is still under very heavy development. But this is certainly very promising and feels like a great way to deploy apps and services.

So what now? Well, ElasticSearch can be used for all sorts of things. One of the most common use cases that I'm familiar with is for log aggregation. This *could* be enabled by running a [Logstash](http://logstash.net/) agent and a [logspout](https://github.com/progrium/logspout) container on each machine. In fact, I've prototyped this and will write more about this in a later post!
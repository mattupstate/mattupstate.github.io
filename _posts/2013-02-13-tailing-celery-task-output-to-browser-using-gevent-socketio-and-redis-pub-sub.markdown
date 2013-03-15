---
comments: true
date: 2013-02-13 21:16:55
layout: post
slug: tailing-celery-task-output-to-browser-using-gevent-socketio-and-redis-pubsub
title: Tailing Celery Task Output to a Browser Using gevent-socketio and Redis Pub/Sub
categories:
- python
- html5
tags:
- flask
- redis
- gevent
- socketio
- websockets

---

While working on a project at work I wanted to add a feature that displayed the output of a long running task in the browser in near real-time. This features was inspired by [travis-ci.org](http://travis-ci.org). If you're unfamiliar with Travis, the browser client displays the build log output as it is happening. After some tooling around and asking some random questions on IRC I was able to determine that this could be done using Socket.IO and the Redis Pub/Sub features. 

---
### Overview

Socket.IO is a websocket application framework that was originally written in JavaScript for the Node.js platform. In my case I wanted to avoid adding another stack into our infrastructure and luckily there exists [gevent-socketio](https://gevent-socketio.readthedocs.org), a Python implementation of the Socket.IO server. In this implementation Socket.IO will be used to push messages to the browser that are "dispatched" via Redis's [Pub/Sub implementation](http://redis.io/topics/pubsub). This tutorial will describe a very basic application that fulfills the functionality that I happened to be looking for. It assumes you have a working knowledge of Python, Flask, Celery, Redis and JavaScript. The source files for this application can be found over at my GitHub account: [https://github.com/mattupstate/gevent-socketio-tutorial](https://github.com/mattupstate/gevent-socketio-tutorial).

---
### Components

There are five components to this application. They are:

1. Frontend Application __(JavaScript/Socket.IO)__
2. Backend Application __(Python/Flask)__
3. Asynchronous Application __(Python/Celery)__
4. Socket Server __(Python/gevent-socketio)__
5. Message Broker __(Redis)__

---
#### Frontend Application

The frontend application, most importantly, uses the Socket.IO client side library for managing the connection and receiving messages from the socket server. The source code for this application can be found in `app/templates/index.html`. The important bit of JavaScript is located near the bottom of this file:

{% highlight javascript %}
var socket = io.connect("http://localhost:5000/tail");
socket.emit("subscribe");
socket.on("tail-message", function(data) {
  $(".log-output").append(data);
});
{% endhighlight %}

In the previous snippet a connection object is configured with a connection to the `tail` namespace. This is followed by sending a `subscribe` message to the server. This notifies the server that this particular client should receive messages from the `tail` namespace. Namespaces are a feature of Socket.IO that allow a developer to group messages. More on this later. Lastly, the client defines a handler function to receive `tail-message` messages. These messages are then appended as text to a DOM element.


---
#### Backend Application

The backend application is where requests to start the long running task are initiated. In the case of this tutorial only one task can be running at any given time for the sake of simplicity. The important source code regarding this functionality is located in `app/__init__.py`. One Flask endpoint defined and handles the aforementioned functionality:

{% highlight python %}
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if redis.llen(config.MESSAGES_KEY):
            flash('Task is already running', 'error')
        else:
            tail.delay()
            flash('Task started', 'info')
    return render_template('index.html')
{% endhighlight %}

In this endpoint the application determines if the user has requested to start the long running task. This happens when an HTTP POST request is sent. When the task is running there will be data in the form of a list stored in Redis under the key specified by the application's `MESSAGES_KEY` configuration value. If data does not exist for this key the task is then started by calling `tail.delay()`. The `tail` function is a Celery task that will be explained in a moment. 

---
#### Asynchronous Application

The asynchronous application performs the long running task. The source code for this part of the application is also located in `app/__init__.py`. The important code is as follows:

{% highlight python %}
@celery.task
def tail():
    for i in range(0, 20):
        msg = 'Task message %s\n' % i
        redis.rpush(config.MESSAGES_KEY, msg)
        redis.publish(config.CHANNEL_NAME, msg)
        time.sleep(1)
    redis.delete(config.MESSAGES_KEY)
{% endhighlight %}

In the case of this application the task is simply a function that runs for approximately 20 seconds. During these 20 seconds a message is appended to the list stored in Redis and also published to a channel specified by the applications `CHANNEL_NAME` configuration value. The reason that the message is both stored and published is to have be able to return all the back messages if the browser happens to be refreshed or a client connects while the task is running but after it has started. When the task is complete the list value in Redis is deleted so that the application can determine if the task is running or not.

---
#### Socket Server
 
The socket server acts as a layer between Redis and the frontend application. It is here that messages published to Redis are received and then dispatched or `emitted` to the front end application. This source code is also located in `app/__init__.py`.

{% highlight python %}
@app.route('/socket.io/<path:remaining>')
def socketio(remaining):
    socketio_manage(request.environ, {
        '/tail': TailNamespace
    })
    return app.response_class()
{% endhighlight %}

The previous snippet attaches the Socket.IO `tail` namespace to the Flask application via the `socketio.socketio_manage` method. This method is passed the request context from Flask and a dictionary containing the various namespaces that should be available. 

This endpoint is rather handy as it allows the gevent-socketio server and Flask application the be combined as one WSGI application. Thus it can be run under the same process on your webserver. One less thing to manage! Additionally, the `tail` namespace is defined as the `TailNamespace` class:

{% highlight python %}
class TailNamespace(BaseNamespace):
    def listener(self):
        # Emit the backlog of messages
        messages = redis.lrange(config.MESSAGES_KEY, 0, -1)
        self.emit(config.SOCKETIO_CHANNEL, ''.join(messages))

        pubsub.subscribe(config.CHANNEL_NAME)

        for m in pubsub.listen():
            if m['type'] == 'message':
                self.emit(config.SOCKETIO_CHANNEL, m['data'])

    def on_subscribe(self):
        self.spawn(self.listener)
{% endhighlight %}

This class extends the `socketio.namespace.BaseNamespace` class and must implement the `on_subscribe` method. In this case, when a client subscribes to the tail namespace (see the frontend app) the `listener` method is "spawned". Meaning it is called once for the client that happens to subscribe to the `tail` namespace. In this case the `listener` method simply subscribes to the same channel that the Celery task publishes to and as messages are received they are "emitted" to the client. However, this does not happen until a list of all the previous messages are retrieved and emitted in order for the client to receive the backlog if they connect after the task has started.

---
#### Message Broker

The message broker for this application is a running instance of Redis. The application is configured to connect to a running instance of Redis at `192.168.0.10`. If you have an instance of Redis running already change this value in the `app.config.py` file. If you happen to a Vagrant user, the supplied `Vagrantfile` will spin up a VM for you and you should not have to change this configuration value.

---
### Wrap Up

Now that you have an understanding of the various components for this application you can see it in action by running the Flask/Socket.IO server and the Celery application. Each will need to run as separate processes. You can do this by opening two separate terminal sessions and running the following commands:

Flask/Socket.IO server:

    $ python server.py
    
Celery workers:

    $ celery -A 'app.celery' worker

Now open your browser and go to [http://localhost:5000](http://localhost:5000). Click the button labeled __Start Task__ and marvel in how the task output is pushed to the browser in near real time! Refresh the browser while the task is running to see that one can connect at any time to see the past and current task output.

### Next Steps

Imagine now that you can publish messages to unique channel names for long running processes that may be happening at the same time. For instance, in my application my Celery tasks create custom AMI's for EC2 that are bootstrapped via Chef. The frontend application lets me configure a server with various roles and other properties and an entry in the database is created. The build task then uses the unique ID as a suffix and publishes to a unique channel. The frontend application sends the unique ID along with the "subscribe" message:

{% highlight javascript %}
socket.emit('subscribe', '<the build id>');
{% endhighlight %}

And the `on_subscribe` method of the namespace class accepts one parameter:

{% highlight python %}
def on_subscribe(self, build_id):
    self.spawn(self.listener, build_id)
{% endhighlight %} 

The ID can then be used to within the `listener` function to publish to the unique channel name.
























































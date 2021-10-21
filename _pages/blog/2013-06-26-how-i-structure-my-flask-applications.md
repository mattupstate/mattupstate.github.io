---
slug: /blog/how-i-structure-my-flask-applications
title: How I Structure My Flask Applications
date: 2013-06-26
---

This post was [featured on HackerNews](https://news.ycombinator.com/item?id=5948893).

[Flask](http://flask.pocoo.org/) has been my preferred web framework as of late. I think it has a great core feature set and Armin, the main author, has done well to keep it's API minimal and easy to digest even for developers that are relatively new to Python. However, given that it is a rather minimal framework, it can be often difficult to decide on how to structure an application after it reaches a certain level of complexity. It tends to be a common question that comes up in the #pocoo IRC channel.

In this article I intend to share how I structure Flask applications. To help support this article I've written a very basic application that I've arbitrarily named [Overholt](https://github.com/mattupstate/overholt). If you plan on following along I recommend having the [source code](https://github.com/mattupstate/overholt) open in your browser or a code editor.

## High Level Concepts

### Platform vs Application

Web applications can encapsulate a lot of different functionality. Most commonly when you think of a web application you probably think of a user interface rendered as HTML and JavaScript and displayed to a user in the browser. However, web applications can be infinitely more complicated. For instance, an application can expose a JSON API designed specifically for a Backbone.js front end application. There could also be a tailored JSON API for the native iOS or Android application. The list goes on. So when starting a project I try to think of it as a platform instead of an application. A platform consists of one or more applications. As a side note, this concept is not quite apparent in the Overholt application source code.

### A Flask application is a collection of views, extensions, and configuration

This concept supports the previous. I look for logical contexts within the larger scope of my platform. In other words, I try to find patterns in the endpoints I will be exposing to various clients. Each of these contexts has slightly different concerns and thus I encapsulate their functionality and configuration into individual Flask applications. These applications can reside in the same code repository or can be separated. When it comes time to deploy the applications I then have the option to deploy them individually or combine them using Werkzeug's `DispatcherMiddleware`. In the case of Overholt, the platform consists of two Flask applications which are organized into separate Python packages: `overholt.api` and `overholt.frontend`.

### Application logic is structured in logical packages and exposes an API of its own

I try to think of the application logic as a core "library" for my platform. Some developers call this a "service" layer. Regardless of what you call it this layer sits on top of the data model and exposes an API for manipulating the data model. This allows me to encapsulate common routines that may be executed in multiple contexts within the platform. Using this approach also tends to lead to "thinner" view functions. In other words it allows me to keep my view functions small and focused on transforming request data into objects that my the service layer expects in its API. Application logic within Overholt is primarily located in the `overholt.users`, `overholt.products`, and `overholt.stores` Python packages.

### View functions are the layer between an HTTP request and the application logic

A view function is where an HTTP request meets the application logic. In other frameworks this layer is often called a "controller" or a "handler" and sometimes even a "command". It is here that the data in the HTTP request is able to be accessed and used in conjuction with the API exposed by the application logic. The view function then renders an response according to the results of the application logic that was used. View functions within Overholt are organized using Blueprints. Each Blueprint has its own module within the application's Python package. An example of such a module is `overholt.api.products` or `overholt.frontend.dashboard`.

## Patterns and Conventions

Flask tends not to push any patterns or conventions on the developer. This is one of the things I like most about Flask compared to large frameworks like Django and Rails. However, any developer not willing to establish patterns and conventions for their Flask apps would be doing themselves or any other developers working on the project a disservice. Without patterns or conventions your applications will lose architectural integrity and be difficult to understand by others. After working with Flask for almost two years now I've settled on a few patterns and conventions of my own. The following is an overview of what I commonly use.

### Application Factories

The factory pattern is the first pattern to be implemented and used in any of my Flask applications. There is a [small amount of documentation](http://flask.pocoo.org/docs/patterns/appfactories/) regarding application factories already. While the documentation is limited in scope, I believe it is there to encourage the usage of this pattern. That being said, there is not an established convention for implementing a factory method. Chances are your app will have its own unique requirements and thus your factory method should be tailored accordingly. Regardless of your implementation the factory method is, in my opinion, indispensable as it gives your more control over the creation of your application in different contexts such as in your production environment or while running tests.

Within the Overholt source code you will find three different factory methods. There is one factory for each application and an additional factory which is shared by the individual application factories. The [shared factory](https://github.com/mattupstate/overholt/tree/master/overholt/factory.py#L18-L45) instantiates the application and configures the application with options that are shared between apps. The individual app factories further configure the application with options that are more specific to thir use. For example, the [api application factory](https://github.com/mattupstate/overholt/tree/master/overholt/api/__init__.py#L19-L33) registers a custom `JSONEncoder` class and custom error handlers that render JSON responses. Whereas the [frontend application factory](https://github.com/mattupstate/overholt/tree/master/overholt/frontend/__init__.py#L18-L30) initializes an assets pipeline and custom error handlers for HTTP responses.

### Blueprints

Blueprints are crucial to my Flask applications as they allow me to group related endpoints together. I honestly couldn't live without Blueprints. The Flask documentation provides the [best overview](http://flask.pocoo.org/docs/blueprints/) of what Blueprints are and why they are useful. There isn't much else I can describe about Blueprints themselves that Armin hasn't already. In the context of the Overholt source code, each application package contains various modules containing Blueprint instances. The API application contains three Blueprints located at `overholt.api.products`, `overholt.api.stores` and `overholt.api.users`. The frontend application contains but one Blueprint located at `overholt.frontend.dashboard`. All Blueprint modules are located in the same package as the application which allows me to use a simple method of registering them on their respective application. Within the [shared application factory](https://github.com/mattupstate/overholt/tree/master/overholt/factory.py#L21-L48) you should notice the `register_blueprints` helper method. This method simply scans all the modules in the application package for Blueprint instances and registers them on the app instance.

### Services

Services are how I follow my third high level concept: *"Application logic is structured in logical packages and exposes an API of its own"*. They are responsible for connecting and interacting with any external data sources. External data sources include (but are not limited to) such things as the application database, Amazon's S3 service, or an external RESTful API. In general each logical area of functionality (products, stores, and users) contains one or more services depending on the required functionality. Within the Overholt source code you will find a [base class](https://github.com/mattupstate/overholt/tree/master/overholt/core.py#L35-L151) for services that manage a specific SQLAlchemy model. Furthermore, this base class is extended and additional methods are added to expose an API that supports the required functionality. The best example of this is the `overholt.stores.StoresService` class ([ref](https://github.com/mattupstate/overholt/tree/master/overholt/stores/__init__.py#L13-L38)). Instances of service classes can instantiated at will, but as as a convenience instances are consolidated into the `overholt.services` ([ref](https://github.com/mattupstate/overholt/tree/master/overholt/services.py)) module.

### API Errors/Exceptions

Dealing with errors in a RESTful API can be kind of annoying at times but Flask makes it truly simple. Armin has already written a little bit about [implementing API exceptions](http://flask.pocoo.org/docs/patterns/apierrors/) which I recommend you read. My implementation is not quite the same as his but thats the beauty of Flask. Overholt has a [base error class](https://github.com/mattupstate/overholt/tree/master/overholt/core.py#L23-L25) and a slightly more [specific error class](https://github.com/mattupstate/overholt/tree/master/overholt/core.py#L28-L32) related to form processing. Perhaps you recognize these errors if you viewed the source referenced in the application factories section. More specifically, the API application registers error handlers for these errors and returns a JSON response depending on this error that was raised. Dig around the source and see if you can find where they are raised.

### View Decorators

Decorators in Python are are very useful functional programming tool. In the context of a Flask application they are extremely useful for view functions. The Flask documentation provides a [few examples](http://flask.pocoo.org/docs/patterns/viewdecorators/) of some useful view decorators. Within the Overholt source there are two examples of view decorators that I commonly use. Each are tailored for using Blueprints and specific to each of the two applications. Take a look at the [API view decorator](https://github.com/mattupstate/overholt/tree/master/overholt/api/__init__.py#L36-L51). This type of view decorator allows me to add all the other common decorators to my view methods. This prevents me from having to repeat decorators, such as `@login_required`, across all the API views. Additionally, the decorator serializes the return value of my view methods to JSON. This also allows me to simply return objects that can be encoded by the API application's custom `JSONEncoder`.

### Middleware

WSGI middlewares are pretty handy and can be used for all sorts of things. I have one middleware class that I always copy form project to project called `HTTPMethodOverrideMiddleware`. You can find it in the `overholt.middleware` module. This middleware allows an HTTP client to override the request method. This is useful for older browers or HTTP clients that don't natively support all the modern HTTP verbs such as `PUT`, `DELETE` and `HEAD`.

### JSON Serialization

If you've ever developed a JSON API you'll inevitably need to have control over how objects are represent as a JSON document. As mentioned earlier, the API application uses a custom `JSONEncoder` ([ref](https://github.com/mattupstate/overholt/tree/master/overholt/helpers.py#L35-L42)) instance. This encoder adds additional support for objects that include the `JSONSerializer` mixin. [This mixin](https://github.com/mattupstate/overholt/tree/master/overholt/helpers.py#L45-L77) defines a few "magic" variables which allow me to be explicit about the fields or attributes that are visible, hidden or modified before being encoded as JSON. I simply need to extend this mixin, override the magic variables with my options and include the new, extended mixin in the data model's inhertiance chain. Examining any of the model modules within the `overholt.stores` ([ref](https://github.com/mattupstate/overholt/tree/master/overholt/stores/models.py)), `overholt.products` ([ref](https://github.com/mattupstate/overholt/tree/master/overholt/products/models.py)), or `overholt.users` ([ref](https://github.com/mattupstate/overholt/tree/master/overholt/users/models.py)) packages will illustrate how this mixin is used.

### Database Migrations

In addition to using SQLAlchemy I always use [Alembic](http://alembic.readthedocs.org/). Alembic is a nice database migration tool made specifically for SQLAlchemy by [Mike Bayer](http://techspot.zzzeek.org/), the author of SQLAlchemy. What's nice about Alembic is that it includes a feature to autogenerate database versions from the model metadata. If you examine the `alembic.env` module you should notice the [application specific imports](https://github.com/mattupstate/overholt/tree/master/alembic/env.py#L11-L15). Further down is where the application's database URI and model metadata is [handed off to Alembic](https://github.com/mattupstate/overholt/tree/master/alembic/env.py#L58-L70). I've [written previously](http://mattupstate.com/python/databases/2012/11/15/database-migrations-with-alembic-sqlalchemy-and-flask.html) about using Alembic with Flask and I would suggest reading that article for a little more detail.

### Configuration

Configuration is always important for an application, especially for sensitive details such as API keys and passwords. I always provide a default configuration file that is checked into the project repository so that a developer can get up and running as quick as possible. This file contains default values that are specific to the virtual machine settings specified in the Vagrantfile. This default file is used to [configure any apps](https://github.com/mattupstate/overholt/blob/master/overholt/factory.py#L32) created by the shared application factory. Additionally, the factory method attempts to override any default settings from a `settings.cfg` file located in the application's instance folder. [Head over here](http://flask.pocoo.org/docs/config/#instance-folders) for more information regarding Flask's instance folders. This additional file can be created by any developer working on the project to tweak any settings to be more specific to their local development environment. When it comes time to deploy the application to a development or production server the `settings.cfg` file will be created by the deployment tool, such as Chef or Fabric.

### Management Commands

Management commands often come in handy when developing or managing your deployed application. The [Flask-Script](https://mattupstate.com/blog/how-i-structure-my-flask-applications/flask-script.readthedocs.org) extension makes setting up management commands pretty easy. Commands are useful in many ways such as manipulating data or managing the database. It's really up to you and your application's needs. [Overholt contains](https://github.com/mattupstate/overholt/blob/master/manage.py) a simple `manage.py` module at the top level of the project. There are three commands for managing users. As my applications grow management commands tend to as well.

### Asynchronous Tasks

Running code asynchronously is a common way of improving the reponsivness of a web application. [Celery](http://celeryproject.org/) is, arguably, the defacto library for doing this with Python. Similar to creating Flask apps, I also use a [factory method](https://github.com/mattupstate/overholt/blob/master/overholt/factory.py#L51-L65) for creating my Celery apps. The thing to note about this factory method is that it specifies a custom task class. This custom class creates an application context before any task is run. This is necessary because task methods will most likely be using code that is shared by the web application. More specifically, a task might query or modify the database via the Flask-SQLAlchemy extension which requires an application context to be present when interacting with the database. Beyond this tasks queued from within view functions. Overholt contains just a [few example tasks](https://github.com/mattupstate/overholt/blob/master/overholt/tasks.py) to illustrate how they might be used.

### Frontend Assets

When it comes to frontend assets I always use [webassets](http://webassets.readthedocs.org/en/latest/) in conjuction with the [Flask-Assets](http://elsdoerfer.name/docs/flask-assets/) extension. These libraries allow me to create [logical bundles of assets](https://github.com/mattupstate/overholt/blob/master/overholt/frontend/assets.py) that, once compiled and minified, offers optimized versions for web browsers to keep the download times to a minimum. When it comes time to deploy the assets there are two approaches. The first is simply to compile the assets locally and commit them to the project repository. The other is to compile the assets on the web server when the application is deployed. The first option has the advantage of not having to configure your web server with various tools (CoffeeScript, LESS, SASS, etc) to compile the assets. The second option keeps compiled files out of the project repository and could potentially prevent an error resulting from someone forgetting to compile new assets.

## Testing

Testing your Flask applications is "important". I've quoted the word "important" though and thats because tests, while very useful, should not be your first concern. Regardless, when it comes time to write tests it should be relatively easy to do so. Additionally, I rarely write unit tests for my Flask applications. I generally only write functional tests. In other words, I'm testing that all application endpoints work as expected with valid and invalid request data.

### Tools

In the Python world there are countless testing tools and libraries and its often difficult to decide which ones to use. The only thing I strive for is to find the right balance of fewest dependencies and ease of testing. That being said, I've found that its pretty easy to get by with using only the following tools:

#### [nose](https://docs.pytest.org/)

Running tests is a breeze with pytest. It has a lot of options and there is a wide variety of plugins that you may find useful. This library also seems to be widely used in the community so I've settled on it as my preferred, top level test tool.

#### [factory_boy](https://factoryboy.readthedocs.io/)

Without test data/fixtures it will be difficult to test any app. factory_boy is a nice library that makes it trivial to create test data from the application's models. Lately I've been using an older version and configured it to support SQAlchemy. However, as of writing this, there is a newer version on the horizon that will support SQLAlchemy out of the box.

#### [mock](https://mock.readthedocs.io/)

I use this library the least but it still comes in handy from time to time. This is why you'll see it listed in the requirements.txt file but not yet used in the tests.

### Structure

Without exception my Flask projects always contain a package named `tests` where all test related code is placed. In the [top level](https://github.com/mattupstate/overholt/tree/master/tests/__init__.py) of the `test` package you will see a few base classes for test cases. Base classes are extremely useful for testing because there is inevitably always repeated code in tests.

There are also a few modules in this package. One being `tests.settings` ([ref](https://github.com/mattupstate/overholt/tree/master/tests/settings.py)) which is a testing specific configuration module. This module is passed to each application's factory method to override any default settings. The `tests.factories` ([ref](https://github.com/mattupstate/overholt/tree/master/tests/factories.py)) module contains factory classes which utilize the aforementioned **factory_boy** library. Lastly you'll find the `tests.utils` ([ref](https://github.com/mattupstate/overholt/tree/master/tests/utils.py)) module. This module will hold all reusable test utilities. For now it contains a simply function to generate a basic HTTP auth header and a test case mixin class that has many useful assertion and request methods.

Also within the top level `tests` package are two other packages, `tests.api` ([ref](https://github.com/mattupstate/overholt/tree/master/tests/api)) and `tests.frontend` ([ref](https://github.com/mattupstate/overholt/tree/master/tests/frontend)) which map to the two applications that are part of Overholt. Within the top level of each package is another base class which inherits from `tests.OverholtAppTestCase`. This class can then be modified to add common testing code for the respective application. Each application then has a varying amount of test modules that group the testing of endpoints. For instance, the `tests.api.product_tests` ([ref](https://github.com/mattupstate/overholt/tree/master/tests/api/product_tests.py)) module contains the `ProductApiTestCase` class which tests all the product related endpoints of the API application.

## Documentation

The last and most commonly neglected part of any project is documentation. Sometimes you can get away with a small README file. The Overholt project happens to contain a small README file that explains how to setup the local development environment. However, README files are not necessarily sustainable as a project's complexity grows. When this is the case I always turn to [Sphinx](http://sphinx-doc.org/).

All documentation files reside in the `docs` [folder](https://github.com/mattupstate/overholt/tree/master/docs). These files can then be used by Sphinx to generate HTML (and other formats). There are also a lot extensions out there for Sphinx. The extension I most commonly use is [sphinxcontrib-httpdomain](http://pythonhosted.org/sphinxcontrib-httpdomain/). This extension is geared specifically for documenting HTTP APIs and even has the ability to [generate documentation](http://pythonhosted.org/sphinxcontrib-httpdomain/#module-sphinxcontrib.autohttp.flask) for a Flask application. You can see this extension in action in the [Overholt API documentation file](https://github.com/mattupstate/overholt/tree/master/docs/api.rst).

## Wrap Up

I believe the age old saying "There is more than one way to skin a cat." holds true to developing any application, let alone a web application with Flask. The approach outlined here is based on my personal experience developing, what I would consider, relatively large applications with Flask. What works for me might not work for you, but I'd like to think there is some useful information here for developers getting into Flask. And with that in mind I welcome all constructive criticism and would love to hear about other developers experiences.
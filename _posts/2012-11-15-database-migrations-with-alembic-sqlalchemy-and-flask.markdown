---
comments: true
date: 2012-11-15 21:16:55
layout: post
slug: database-migrations-with-alembic-sqlalchemy-and-flask
title: Database Migrations with Alembic, SQLAlchemy and Flask
categories:
- python
- databases
tags:
- flask
- sqlalchemy
- alembic
- migrations

---

Recently I started using [Alembic](http://alembic.readthedocs.org/) for managing database migrations for a Flask application at [work](http://www.chatid.com). Alembic is developed and maintained by the maker of SQLAlchemy, thus it was immediately an attractive tool. I've been using it the last month or so and without a doubt I've had a pleasant experience using it so far. In this post I want to share a couple of things that I did with Alembic while developing a Flask app that might prove useful for other developers out there.

### The Database Connection

Alembic, mostly, makes no assumptions about your database connection. Generally speaking, when you initialize Alembic for your project you will use the following command:

    $ alembic init alembic

The only assumption Alembic makes during this process is that you'll have one place to store your database connection setting. That is in the generated file named `alembic.ini`. In this file there will be a line that reads:

    sqlalchemy.url = driver://user:pass@localhost/dbname

This is a great place to get started but keeping the database connection setting in this file isn't sustainable for any application that has various environments or differences in connection settings.

Alembic also creates another file named `env.py` that is located in the folder named `alembic`. It is in this file that Alembic creates the SQLAlchemy engine object using the options specified in `alembic.ini`. This happens in a method called `run_migrations_online`. 

It is also in this file that you can work some magic so that Alembic will connect to the appropriate database. In my case I was developing a Flask application using the Flask-SQLALchemy extension and the database connection is specified in the application configuration file: `myapp/config.py`. Given that my configuration file is a plain Python file it was very easy to pass that value to Alembic. The `run_migrations_online` method of my `env.py` file now looks like this:

{% highlight python %}
def run_migrations_online():
    # Override sqlalchemy.url value to application's value
    alembic_config = config.get_section(config.config_ini_section)
    from myapp import config as app_config
    alembic_config['sqlalchemy.url'] = app_config.SQLALCHEMY_DATABASE_URI

    engine = engine_from_config(
                alembic_config,
                prefix='sqlalchemy.',
                poolclass=pool.NullPool)

    connection = engine.connect()
    context.configure(
                connection=connection,
                target_metadata=target_metadata
                )

    try:
        with context.begin_transaction():
            context.run_migrations()
    finally:
        connection.close()
{% endhighlight %}

This file now works in all the application's environments so long as `config.py` is properly configured.


## Autogenerating Migrations

One handy feature of Alembic is the ability to autogenerate migration files based on your SQLAlchemy models. This feature simply relies on specifying the MetaData object for your models. Given that I was using Flask-SQLAlchemy all I had to do was pass the preconfigured MetaData object to Alembic. This object is accessible on the instance of the Flask-SQLAlchemy extension object which in my app happens to in the `myapp.core` module.

Within `env.py` you'll see a commented out line that may look like the following:

{% highlight python %}
# target_metadata = mymodel.Base.metadata
{% endhighlight %}

In my case I changed this the following:

{% highlight python %}
from myapp.core import db
target_metadata = db.metadata
{% endhighlight %}

Now with my properly configured database connection and MetaData object in place I can autogenerate migrations with the following command:

    $ alembic revision --autogenerate -m "Added some table"

Just bear in mind that autogenerating migrations isn't the end all be all command. I does not account for everything that can be done during a migration. For instance, if you want to add indexes on particular fields you'll need to write that in yourself. Lastly, if you add anything by hand remember to modify both the `upgrade` and `downgrade` methods!
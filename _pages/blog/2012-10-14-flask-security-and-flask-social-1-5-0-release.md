---
slug: /blog/flask-security-and-flask-social-1-5-0-release
title: Flask-Security and Flask-Social 1.5.0 Release
date: 2012-10-14
---
I'm happy to announce the latest release of [Flask-Security](http://packages.python.org/Flask-Security) and [Flask-Social](http://packages.python.org/Flask-Social/) 1.5.0. 
I decided to bump the version numbers of each to 1.5.0 in an attempt to make it clear that they are in sync and can be used together. 
I've also updated the previously defunct [Flask-Social example site](http://flask-social-example.herokuapp.com/) after a snafu when migrating from the old shared database to the newer free development database. 
Its a decent example of how to use both projects. 
View the source code [here](https://github.com/mattupstate/flask-social-example).

One of my next goals is to improve the documentation. 
However, I won't be able to do this on my own. 
As more feedback comes in I will hopefully begin to see where things are unclear to new users and make adjustments to the docs accordingly. 
This goes for both projects. 
Flask-Social is probably in more need of this at the moment. 
Regardless, I look forward to this process as I want the docs to be top notch. 
Aside from the docs I will try and be as responsive as possible when it comes to bugs and other issues along the way.

Aside from bugs, the only major feature I want to add is Babel support. 
I've started a branch for this feature but I've been having trouble getting the implementation right. 
Would love a contribution on this one if anyone has the time.

At any rate, these projects have been really fun to work on. 
They were inspired by two projects that I had come across in the past. 
The first being [Devise](https://github.com/plataformatec/devise), a great authentication toolkit for Ruby on Rails applications and was the main inspiration for Flask-Security. 
On the other side of things Flask-Social was mostly inspired by [Spring Social](https://github.com/springsource/spring-social), an extension for the widely used Spring Framework which helps manage connections to OAuth providers. 
Now I have two of my favorite projects combined into one all written in my new favorite language.


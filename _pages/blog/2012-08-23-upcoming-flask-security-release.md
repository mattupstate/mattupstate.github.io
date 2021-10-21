---
slug: /blog/upcoming-flask-security-release
title: Learning by Doing and the Upcoming Flask-Security Release
date: 2012-08-23
---
For the past nine weeks or so my main side project has been developing [Flask-Security](https://github.com/mattupstate/flask-security/). Its been a fun and challenging project for me. Fun because it has helped me learn to write Python in a clean and consistent manner. Challenging because of the ongoing design process and my relative inexperience with writing Python (I only picked it up in July of 2011).

When I first started working on Flask-Security I started with bits and pieces of a [project](https://github.com/localprojects/Civil-Debate-Wall) I had completed at work. In retrospect it wasn't so pretty. The design of the initial release used some design concepts/patterns that, to my chagrin, probably overcomplicated things. For instance, it wasn't very easy to customize the model definitions. Additionally, I released the first version far too early. A few lessons were instantly learned. Regardless, I was determined to do better.

I knew what I wanted to do and that was a) improve the design and b) add a load of new features. Improving the design meant I wanted to simplify the code structure and strive to be as "pythonic" as possible. Additional features were all inspired mostly by [Devise](https://github.com/plataformatec/devise), a bootstrapped user authentication system for Rails. But in all honesty I had no idea how I was really going to do it. It didn't stop me though. Off I went hacking away towards an unknown destination.

The first thing I did was study the code base for the Devise project. This helped me get a sense of how one might implement the features I wanted, but only to a certain degree because, well, its Rails. Nonetheless I was able to apply the higher level concepts to my own code base. The new features came relatively quick but things still felt really messy.

As time passed and I kept adding more tests and polishing the features as best I could given how I thought they should be implemented. I was anxious to release the new features but I also didn't want to repeat myself. Thankfully this took a lot longer than I anticipated but it turned out to be a good thing in the end. Good because I really got to know my code and started to discover patterns and ways to simplify things.

Which brings me to the upcoming release of Flask-Security. I feel much better about the structure and readability of the code. I even recently removed a load of code which is always a good thing. I hope this makes contributing to the project easier for others. I also feel much better about the implementation of the new features and being able to extend/customize them in particular scenarios.

In the end I learned a lot about Python, Flask and open source software development throughout this process simply just by **doing** it. I don't think there's really any other way to learn. You can read all you want but until you actually fail at something you'll never truly have the knowledge or experience to prevent it in the future. That being said here is an incomplete list of things that I would tell anyone that is getting into developing open source software:

* You don't have to be an expert to try something new
* Avoiding failure is only possible if you've failed previously
* Experience in a particular matter means you can avoid known failures
* Get as much feedback as possible from whoever you can
* Consider **all** criticism to be helpful even if it is not apparent at first
* Respond to your users promptly and without insulting them

Now go out there and write some sofware because the world needs it!
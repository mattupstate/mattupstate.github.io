---
slug: /blog/my-time-in-open-source-a-memoir
title: My Time in Open Source, A Memoir
date: 2021-12-15
description: A personal tale of my experience as an open source developer.
---
Dear Open Source,

It's been quite some time since I wrote you.
Five years or so is my guess.
Long enough that I'm afraid you've forgotten about me by now.
You, on the other hand, are impossible to forget.
For many good reasons of course, but also some not so good ones.
Making it worse is that you did nothing wrong.
I figured it was about time I told you about what happened in the odd case you're interested.
I'll start from the beginning.

In the mid-to-late aughts I was developing a lot of Flash content for the web. 
It required quite a bit of coding which I almost always had to teach myself how to do.
Over time I would be slowly introduced to programming concepts and tools as I engaged with the broader Flash community.
Most enlightening was learning how to avoid repeating things over and over by using a framework.
The first being [PureMVC](https://puremvc.org/) for ActionScript.
I used it a few times but then found [Robot Legs](https://github.com/robotlegs/robotlegs-framework).
This would become my preferred framework, probably because I thought the name was cooler.

Out of curiousity, or maybe just sheer boredome one day, I decided to look at Robot Legs code.
I didn't go into it thinking I'd learn much.
In fact, I was pretty convinced it would be well over my head.
I was just a self-taught coder with a graphic design degree after all.
But to my surprise I was able to grok it without too much trouble.
The act of invalidating these assumptions I had made of myself was liberating.
It was then that I had fallen head over heels for you.

My infatuation led me to study [Flex](https://flex.apache.org/) and apply what I learned to my own work.
There wasn't much in the way of component toolkits or libraries back then.
So every new Flash project I started inherited some code I wrote from the last one.
Refactoring my boilerplate with a bottle (or two) of beer became my favorite past time.
The culmination being a [toolkit](https://github.com/mattupstate/AS3-Toolkit) I released to your ranks in June 2011.
Releasing this reminded me of the feeling I'd get after painting graffiti on freight trains.
There was no way to know who would see my work but it was now out in the world for all, or no one, to see.
It was absolutely exhilarating.

Why stop there, though?
Next up was to teach myself Java by studying [Spring](https://spring.io/) so I could take on a project at my day job.
The task was to improve the frontend and backend of a retail product configuration web app.
It would also be my introduction to the cloud having had to use S3 and CloudFront.
This would be the most complex thing I would work on in my career by a long shot.
Completing the project was a seminal moment for me.
From that point on I no longer identified as a "Flash Developer" and it was in some part because of you.

A little later in 2011 I would gift you two more projects.
[Spring Social Foursquare](https://github.com/mattupstate/spring-social-foursquare) and [Spring Social Instagram](https://github.com/mattupstate/spring-social-instagram) came from needing to build a few prototypes which used the Foursquare and Instagram APIs.
There was nothing special about these projects.
However, I had no idea that anyone would actually use them.
Let alone be mentioned on the [Spring Social](https://projects.spring.io/spring-social/) product page.
Nor had it occurred to me that the Foursquare and Instagram APIs would change and I might be expected to update the code.
It hit me real quick that there was a part of our relationship I wasn't prepared for.
Guilt hit me pretty hard when I imagined how the people who used the code would feel when they'd noticed I hadn't kept pace with the APIs.

That same year I would also find myself looking for a new job.
A studio I was fond of for their museum installation work was interested in me but I'd have to know Python.
So I taught myself Python using [Learn Python the Hard Way](http://learnpythonthehardway.org/) (when it used to be free content) and, perhaps with a bit of luck, landed the job.
Immediately I started to dig into the Python ecosystem and was blown away by what seemed like an infinite amount projects I could study.
It would turn out to be a near perfect activity to distract me from a situation I felt I had lost control of outside of work.
Dopamine is a hell of a drug.

One of the first projects I discovered would be [Flask](https://palletsprojects.com/p/flask/).
Flask was relatively new at the time and seemed to be gaining popularity as an alternative to Django's "bloat".
The extension ecosystem, however, was still to be desired. 
It occurred to me there might be space for something like Spring Security or [Devise](https://github.com/heartcombo/devise).
So after a few months of development, in March 2012, I naively gifted you the first versions of [Flask-Security](https://github.com/mattupstate/flask-security) and [Flask-Social](https://github.com/mattupstate/flask-social).
I would also adopt a few other Flask extensions as my own.
Some of which I used in those projects.

However, just two months before the release, the situation in my life that I alluded to earlier boiled over.
My partner moved out after having been married for three years.
By most standards the relationship would be described as dysfunctional for the majority of the time we were together.
Overworking, alcohol and occasional drug use were my preferred coping methods.
It's no surprise to me now that in the first two weeks of living alone I experienced my first anxiety attacks.
On a few occasions I would spontaneously burst into tears.
There were even a few days where I had to call in sick to work for fear of being unable to keep it together.

The emotions I felt, many I had never experienced before, spooked the hell out of me.
So much so that I took myself to see a therapist for the first time in my life.
Therapy was incredibly helpful and I'm thankful that I found the care I needed.
It helped me see the situation for, mostly, what it was.
Only mostly because it wasn't until almost a year later that my partner was officially diagnosed with a severe mental health disorder.
This helped me understand a lot of the behaviors I had to endure with them.
More importantly, from what I can tell, the diagnosis also lead to them receiving the care needed to make major improvements to their life.

As for me, I finally developed enough self awareness to realize I am a workaholic.
That was incredibly hard to come to terms with.
The behavior had began well before I met my partner and I had convinced myself that there was no downside to it.
Working included my day job but it also included anything related to you.
You were predictable, enriching, and supportive of my career.
I might even say you provided a sense of stability that I wasn't getting elsewhere.
But I indulged in you so I could avoid one of the most uncomfortable situations in my life.
It's not your fault, though.
You were just being you.

Despite coming to terms with this, and the marriage logically over, it remained difficult to stop overworking.
Flask-Security would start to develop a community of it's own and I felt compelled to nuture it for the next few years.
On the upside, engaging regularly with the NYC Python and Flask communities provided a much needed ego and confidence boost.
I truly enjoyed meeting new people, expanding my network and making content for meetups.
However, on the downside I would get anxious about the amount of time and energy it would require.
It also appeared that the time and energy would only increase the more I would engage.

As a result my contributions to Flask-Security and the other extensions I maintained would diminish over the next few years.
I had also found a new rabbit hole to go down when my day job forced me to focus more on operations and cloud resource management. 
Thankfully I was lucky enough to fill the gaps with some help from the community.
Notably, [Jon Banafato](https://www.jonafato.com/) and [Jiri Kuncar](https://jiri.kuncar.dev/) helped keep the strings mostly tied through 2018.
I also managed to drastically improve the balance between my work and personal life in part from investing in a new healthy relationship.

At the same time a [fork](https://github.com/Flask-Middleware/flask-security/) had managed to pick up steam.
It took me by surprise and my ego took a shot.
I was also disappointed in myself for not helping usher the project into someone elses hands.
Hamstrung by guilt and feeling burnt out I would lose all interest in the project.
Over time, however, it occured to me that the license I chose afforded the project to continue without my involvement.
This is, after all, what you stand for.
Free as in libre.
Am I right?

It was about April 2016 when I last touched Flask-Security.
That was around the time I took a job as a "DevOps Engineer" (who says that nowadays anyway?) at a health tech startup.
Fast forward to today and I'm a Director of Engineering at that same company.
I'm also lucky to have turned the healthy relationship I mentioned earlier into a family with two beautiful kids.
This is to say that it's near impossible to find time for you anymore.
It's frustrating because I have always enjoyed helping other people make stuff.
To be honest, I miss the living hell out of you.

Who knows, though.
My career has never been a straight line.
Maybe I'll be lucky enough to land a job where where we can go steady again.
Would you have me back?
Would you welcome me with open arms?
Why am I even asking you that question?
I guess that's more of a question for me. 
Isn't it?

Yours truly,<br/>
Matt
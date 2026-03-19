---
slug: /blog/dora-metrics-are-not-a-git-query
title: DORA Metrics Are Not a Git Query
date: 2026-03-19
description: Many organizations try to infer the values of DORA metrics from pre-existing data and, unfortunately, it's not that easy.
---
There always comes a time when engineering leadership is expected to speak to the performance of their team.
Advisors, board members, and executive leadership will also expect some sort of quantitative measures to support the story.
At this point in time engineering leaders will often reach for the DORA metric framework.
The definitions of the metrics are simple and they are fairly easy to understand even for non-technical stakeholders.
So it's a great place to start.

It's a good place to be.
I actually enjoy having this conversation because it forces introspection and makes for interesting conversations.
However, in my experience, the conversation starts to get complicated once reality sets in.
It almost always starts with the same assumption:

> We have the data already, don't we just have to aggregate it?

It's a reasonable assumption to make.
There’s git commit history. 
There are pull requests. 
CI workload logs. 
Deployments are automated.
Jira or Linear has various information.
And last but not least, there's incident management records somewhere, too.

It feels like the hard part should be over. 
This is just a reporting problem, right?
Someone with enough data-fu skills should be able to get all that data into one place, stitch together a few timestamps, write some queries, and put it all in a nice dashboard.
There are even products (Swarmia, LinearB, Waydev) out there that attempt to do this with little to no effort on your part.
Setup a few integrations and metrics will be inferred from pre-existing data.

But as it turns out collecting DORA metrics is not really a data extraction problem. 
It’s a modeling problem. 
More than that, it’s a _systems problem_ that looks like a reporting problem.
And the difference between those things shows up almost immediately if you are concerned at all about having an accurate report.

## Git is not your source of truth

Most implementations start in the same place: git commit history.
And that's a reasonable place to start. 
Git history has the following properties:

* highly accessible
* well structured
* has timestamps
* looks and feels authoritative

And it is a good place to begin.
Git can tell you:

* when code changed
* when a pull request was opened, reviewed, and merged
* who did the work and roughly when they did it

What it cannot tell you, at least not reliably, is what actually happened in production.

* a merge to main is not a deployment
* a deployment is not a release
* a release is not necessarily something a user ever experiences

Code can sit for an undeterminate amount of time.
It can:

* wait on CI
* wait on approvals
* be bundled with other changes
* be deployed behind a feature flag and never turned on
* be reverted before anyone notices
* be deployed successfully and still fail in ways that only show up later

Git knows about code but it has no record of outcomes.
And if you build your metrics entirely from git, you end up measuring activity in a repository and calling it delivery.

## Lead time is where the illusion breaks

Lead time is usually the first place this starts to feel off.

If you’re working from git, it’s very easy to define lead time as the time between first commit and merge. 
Or maybe from pull request open to pull request merge. 
Those are real intervals, easy to compute, and can get you a (hopefully) nice looking chart.

They are also incomplete.
The part of lead time that actually matters is what happens after the code is _done_.
The time spent waiting in CI. 
The time lost to failed builds. 
The time sitting in pre-production stages. 
The time consumed by release coordination, approvals, and whatever informal process exists to move something into production.

That space between merge and deploy is where a lot of reality lives.
If you don’t measure it, you’re not really measuring how long it takes to deliver software. 
You’re measuring how long it takes to finish writing it.

## Deployment frequency isn’t what you think it is

Deployment frequency has a similar problem, just in reverse.
Naive reports often count merges to a main branch and treat that as a proxy for deployments. 
It feels close enough, especially in smaller systems, but it can break down quickly

Sometimes twenty merges go out in a single deploy.
Sometimes one merge triggers deployments across multiple services. 
Sometimes infrastructure changes follow a completely different path than application code. 
Once feature flags enter the picture, deploy and release stop meaning the same thing entirely.
And don't get me started about having to account for all possible git branching strategies.

You can have a repository that looks very active and a production environment that changes relatively slowly. 
Or the opposite!

Counting merges gives you a number. 
It just doesn’t necessarily give you the one you’re looking for.

## Change failure rate is where things get real

Change failure rate is where most teams realize this isn’t just a query problem.
On paper, it’s simple: what percentage of deployments cause a failure?
In practice, it forces you to answer a harder question: what is a failure?

* Is it a rollback? 
* A Sev 1? A Sev 2? 
* A customer-visible issue? 
* A degraded SLO? 
* A hotfix within some window of time? 

Every organization has slightly different answers.
Sometimes those answers aren’t even consistent within the same engineering team.

And then there’s the question of causality.

* Which deployment caused the incident? 
* Was it the most recent one? 
* One from earlier in the day? 
* A combination of several? 
* Something that had been latent for weeks?

Sometimes the answer is obvious. 
Often it isn’t.

At that point a query won't help you.
You’re making decisions about how your system behaves and how much uncertainty you’re willing to tolerate in your measurements.

## MTTR depends on what you believe an incident is

Mean time to restore looks simpler until you try to define the boundaries.
There are a lot of questions to ask. 
Mostly around _when_:

* the incident started 
* a monitor crossed a threshold
* a customer noticed
* someone acknowledged a page
* the incident ended
* a service recovered
* a mitigation applied
* the incident officially resolved

These questions don’t have universally correct answers. 
But the answers you choose shape the metric in ways that are easy to overlook.

## The shift: from logs to events

At some point, the pattern becomes hard to ignore.
The problem isn’t that the data doesn’t exist. 
It’s that it exists in different places/systems, each one describing a different parts of the overall system that you want to measure.

Git tells you what changed.
CI tells you what was built.
Your deployment system tells you what actually ran in production.
Your incident tooling tells you when things broke and when they were fixed.

If you try to derive everything from one of those systems, you end up with a partial view and a lot of guesswork.
What works better, at least in my experience, is to define a small set of canonical events and build from there.

* A change was merged.
* A build completed.
* A deployment completed in production.
* An incident began.
* Service was restored.

Those are facts.
They come from different places, but they describe the same high level system. 
Once you can connect them, even if imperfectly (but honestly), your report can begin to look more accurate.

## You don’t need perfect data

And there’s a temptation to wait until everything is cleaned up before starting.
Perfect metadata. 
Perfect service ownership. 
Perfect traceability from commit to deploy to incident.

That day doesn’t tend to arrive on its own.
A rough model that is explicit about its assumptions is usually more useful than a polished dashboard that hides them.

If you’re linking incidents to deployments heuristically, say so.
If you’re measuring lead time from merge to production because commit-to-production is too ambiguous in your system, say so.
If feature flags mean that deploy doesn’t always equal release, say so.

Metrics can handle caveats. 
They don’t handle false precision very well.
Be honest about the data whenever you share it up or down the chain of leadership.

## The quiet failure mode

The failure mode I worry about most isn’t that teams get the numbers slightly wrong.
It’s that they build something that _looks_ right.

A dashboard that updates regularly.
Numbers that trend in plausible directions. 
Enough complexity to feel credible. 
Not enough transparency to be questioned (my biggest pet peeve).

If the entire system is built on Git logs, that’s usually what you get.
It’s not useless. 
But it’s not what people think it is.

## A better starting point

If there’s a simpler way to say all of this, it’s probably this: Let each system tell the part of the story it actually knows.

Use Git for changes.
Use CI for builds.
Use your deployment platform for production events.
Use your incident tooling for failures and recovery.

Then connect those pieces carefully, document the assumptions, and accept that the edges are going to be a little messy.
It’s not as clean as a single query.
But it’s a lot closer to the truth.

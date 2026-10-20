---
title: Ode to ADRs
description: Why Architecture Decision Records are one of the most underrated tools in software engineering, and why I start every project with them.
pubDatetime: 2026-03-17
tags:
  - dev
ogImage: https://images.unsplash.com/photo-1629104300205-d52dc8707183?fm=jpg&q=80&w=1280&h=720&fit=crop
replyPrompt: "Does your team write ADRs? How do you keep them up to date?"
---

The more I grow as a software engineer, the more I love documenting things. I know, I know, not exactly the most exciting topic. But hold on.

## What Are ADRs?

Architecture Decision Records (ADRs) are short documents that capture the reasoning behind significant technical decisions in a project. The concept was popularised by Michael Nygard in a [2011 blog post](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions), and the idea is beautifully simple: every time you make a decision that affects the structure, dependencies, or direction of a project, you write it down.

A typical ADR follows a straightforward structure:

- **Context** — The forces at play. What problem are we facing? What constraints exist?
- **Decision** — What we decided to do and why.
- **Status** — Accepted, deprecated, or superseded.
- **Consequences** — What follows from this decision, both good and bad.

That's it. One simple Markdown file. A conversation with your future self and your future colleagues.

The original format doesn't include them, but I personally like to add a few extra sections to my ADRs:

- **Rejected Alternatives** — What other options were considered and why they were discarded. This is arguably the most underrated section. Knowing _what you didn't choose_ and _why_ is just as valuable as knowing what you did choose. It prevents future team members from going down paths that were already explored and dismissed, and it shows that the decision was deliberate, not accidental.
- **Next Steps** — Concrete actions that follow from the decision. What needs to happen to implement it? This is especially useful when the decision affects something already in progress, you can lay out the path from where things are now to the final goal described in the ADR. It bridges the gap between a decision on paper and actual work getting done.
- **References** — Links to anything useful for understanding the full picture: external documentation, related PRs, or even other ADRs. This is one of the things I love most about ADRs: since they're just Markdown files in the same folder, it's trivially easy to link between them. A single ADR rarely tells the whole story, but a web of linked ADRs paints the bigger picture of how the system evolved and how decisions relate to each other.

## Why I Love Them

When I start a new project, I love beginning with the documentation. Before writing the first line of code, I want to think through the decisions and write them down. It forces clarity. It forces you to articulate _why_ you're choosing TypeScript over JavaScript, why GraphQL over REST, why this architecture over that one.

I did exactly this for a [code challenge](https://github.com/sirlisko/martian-robots-simulator/tree/main/docs/adr) I built some time ago. Even for a relatively small project, I documented decisions about the tech stack, testing framework, code structure, and CI setup. Some might say it was overkill for a code challenge, but who hired me told me they loved it. Every choice was traceable, every trade-off was explicit.

The key insight is that ADRs capture the **"why"**, not just the "what". Code tells you what the system does. Comments (sometimes) tell you how. But ADRs tell you _why_ it does it that way. That "why" is the first thing that gets lost as time passes and people move on.

## Joining a Codebase Without ADRs

When I join a new project and there's no ADR structure in place, it's one of the first things I try to introduce. I've done this in a React Native project I joined recently, where I set up the ADR process and started documenting every significant decision we made, from state management migrations to image format strategies to component architecture choices.

But here's the thing I find even more valuable: **writing ADRs retroactively**. When you join an existing codebase, there are decisions everywhere, buried in old pull requests, scattered across Slack threads, or simply living in someone's head. I make it a point to dig through PRs, talk to the people who were there, and reconstruct the reasoning behind past decisions. It takes effort, but it's absolutely worth it. Those conversations alone give you a deeper understanding of the codebase than weeks of just reading code.

ADRs are meant to be immutable, you don't delete old ones, you supersede them. This creates something like an archaeological record of the project's evolution. You can trace how the team's thinking changed over time, what assumptions turned out to be wrong, and what constraints shifted. It's incredibly powerful for onboarding new team members, but also for the team itself to reflect on its own journey.

## Don't Be Shy — Rejected ADRs Are Valuable Too

One thing I want to stress: don't only write ADRs for decisions that get accepted. An ADR with a "rejected" status is just as valuable as an accepted one. It documents that an idea was explored, discussed, and deliberately set aside, and more importantly, _why_. Without it, someone will inevitably propose the same thing six months later, and the team will have to go through the entire debate again.

What I like to do is create a pull request with the ADR in "proposed" status to kick off a discussion. People can comment on the PR, suggest changes, or push back on the reasoning. It always sparks constructive conversations, sometimes the ADR gets accepted as-is, sometimes it gets reshaped significantly, and sometimes it gets rejected. All three outcomes are perfectly fine, and all three are worth keeping in the record.

## AI Makes This Even Easier

Now, with AI tools becoming part of our daily workflow, writing and maintaining this kind of documentation has become significantly easier. Drafting an ADR, keeping them consistent in format, or even helping reconstruct past decisions from a pile of PRs and commit messages, these are tasks where AI genuinely shines. The barrier to good documentation has never been lower.

This doesn't mean the thinking is automated. You still need to understand the trade-offs, debate the options with your team, and make the call. But the mechanical overhead of writing it all down? That's been drastically reduced. There's really no excuse anymore.

## What's Next

I've been writing ADRs almost weekly in my current project, and some of them have turned into quite thorough documents, covering everything from image format strategies in React Native to offline mutation queues and cache persistence. I'm planning to start porting some of the best ones into blog posts, as I think they could be genuinely useful to others facing similar decisions.

In particular, I'm working on a series of 2-3 posts about **my experiences with React Native / Expo**, covering topics like image format selection (WebP vs SVG vs Lottie), compression strategies, and how to keep your app bundle lean. Stay tuned for that.

## Keep the Documentation in the Code

This is perhaps the most important point of all: ADRs should live in the codebase. Markdown files in a `docs/adr/` folder, versioned by the same git history, reviewed in the same pull requests. Tools like Confluence or Loop might seem convenient, but documentation that lives outside the codebase gets deprecated fast, because nobody looks at it. It's already hard enough to get people to read docs when they're _in_ the repo. If they're in a separate tool that potentially requires its own authentication or permissions, rest assured they will become obsolete sooner rather than later.

## Start Writing ADRs

If you're not writing ADRs yet, start today. You don't need a fancy tool, a `docs/adr/` folder in your repo and a simple Markdown template is all it takes. Don't forget to add a `.adr-dir` file in the root of your repo so you can easily point people to the folder. Your future self, your teammates, and whoever inherits your codebase will thank you.

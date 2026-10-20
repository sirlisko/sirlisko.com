---
title: Update Ghost Blog on WebFaction
pubDatetime: 2018-06-21
description: How to update a self-hosted Ghost blog on Webfaction.
tags:
  - dev
---

> [!WARNING]
> **Archived.** WebFaction shut down in December 2020, so this guide no longer applies. I keep it here for reference only.

Since Webfaction started to support [Ghost](https://ghost.org/) I obviously jumped on board, and after years (I don't know many) I am still an aficionado user.

I remember with pain the years of Ghost `0.x`, actually the real problem was (is?) how Webfaction is dealing with the _one-click_ applications, it's super easy to install them but it's a mess to update them. I remember back in the days spending ages, after every update, trying to re-set live my blog.

Then ghost `1.x` arrived, and a lot of changes happened, one of my favourites was the introduction of [`ghost-cli`](https://github.com/TryGhost/Ghost-CLI) the command line to install, update and, in general, control ghost.

In Webfaction every "app" is sandboxed, basically, every app folder has a `bin/` folder containing all the commands that you can need, _start_, _stop_, and in the case of Ghost, _npm_ and the _ghost-cli_ itself (`ghost`). The problem, in this case, is that sooner or later that ghost-cli is going to be outdated. So, my suggestion is to install `npm` globally for your user and then install a fresh version of `ghost-cli`.

In order to do that you need `node` and `npm` available to your user. There are a bunch of different ways to achieve this, personally, the one I find the best is using [`n`](https://github.com/tj/n). `n` is a Node version manager and it could be easily installed via bash `curl -L https://git.io/n-install | bash`.

Once we have `node` installed nothing can stop us from installing `ghost-cli` :)

We still have a little hassle to resolve, most likely when you are going to run `ghost update`, you will find a funny error saying:

    1) SystemError

    Message: The path /home/{yourUser}/ is not readable by other users on the system.
    This can cause issues with the CLI, please either make this directory readable by others or install node and Ghost-CLI in another location.

The problem here is that we don't have permission to write in the home nor in the `webapps` folder, so the easiest way to get around this problem is to use the flag `--no-setup-linux-user`.

That should be enough, if our blog is getting down after this update it'd be enough running `ghost start --no-setup-linux-user` to have it up and 🚀.

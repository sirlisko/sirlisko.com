---
title: How to Install User Scripts
description: How to install and run user scripts across different browsers, with a user script manager like Tampermonkey.
pubDatetime: 2015-05-04
modDatetime: 2026-10-12
tags:
  - dev
---

> [!NOTE]
> I updated this post in 2026. The original version covered browser extensions that no longer exist, like NinjaKit for Safari and Trixie for Internet Explorer.

![GreaseMonkey logo](./images/userscripts/greasemonkey.png)

A _user script_ is a small piece of JavaScript that runs on a web page to change how it looks or works. When _userscripts.org_ disappeared in 2014, I started publishing my little scripts only as Chrome extensions. Then I needed one of them on Safari, and I took the chance to look at how user scripts work in different browsers.

Converting a script is simple: you add a metadata block at the top of the file. It also gives you some handy features, for example an update URL that points to the script in its remote repository, so the browser can update it for you.

```js
// ==UserScript==
// @name        My script
// @match       https://example.com/*
// @updateURL   https://example.com/my-script.user.js
// ==/UserScript==
```

## Install a user script manager

Browsers do not run user scripts on their own. You need an extension, called a _user script manager_:

- **Chrome, Edge, Firefox, Safari** — [Tampermonkey](https://www.tampermonkey.net/), the most popular one.
- **Chrome, Edge, Firefox** — [Violentmonkey](https://violentmonkey.github.io/), open source.
- **Firefox** — [Greasemonkey](https://www.greasespot.net/), the original one.
- **Safari (macOS and iOS)** — [Userscripts](https://github.com/quoid/userscripts), open source and free.

On Chrome and other Chromium browsers, you also need to allow the manager to run user scripts. Open the extension details page and turn on _Allow User Scripts_ (on older versions, turn on _Developer mode_ instead).

## Install a script

1. Open a link to a file ending in `.user.js`.
2. The manager shows the script's code and the sites it runs on.
3. Click **Install**.

To find scripts, look at [Greasy Fork](https://greasyfork.org/) or [OpenUserJS](https://openuserjs.org/). A user script can read everything on the pages it runs on, so only install scripts from sources you trust.

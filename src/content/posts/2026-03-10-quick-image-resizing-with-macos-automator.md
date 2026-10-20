---
title: Quick Image Resizing with macOS Automator
description: Simple Automator Quick Actions to resize images to 25% or 50% directly from Finder's right-click menu.
pubDatetime: 2026-03-10
tags:
  - dev
---

I'm currently working on a _React Native_ project and I take a lot of screenshots from the iOS Simulator. Each one comes out at 1206×2622 pixels, way too big to attach to GitHub PRs without cluttering the conversation. I found myself opening _Preview_, resizing, saving, and repeating this dance dozens of times a week. There had to be a better way.

While my immediate need was simulator screenshots, this applies to any situation where you regularly deal with oversized images: blog posts, documentation, bug reports, etc.

## Automator to the Rescue

macOS ships with [Automator](https://support.apple.com/en-gb/guide/automator/welcome/mac), a tool for creating automated workflows. One of its most useful features is **Quick Actions**, workflows that appear directly in Finder's right-click menu. Perfect for this kind of repetitive task.

## The Workflows

I created two workflows, one for **25%** and one for **50%**, because different situations call for different sizes. Both follow the same structure:

1. **Duplicate the selected files** (so the originals are never touched)
2. **Scale the copies** (using the built-in _Scale Images_ action)

That's it. Select some images in Finder, right-click, pick "Resize by 25%" or "Resize by 50%", and you get smaller copies sitting right next to the originals. No apps to open, no dialogs to click through.

## Creating It Yourself

1. Open **Automator** and create a new **Quick Action**
2. Set "Workflow receives current" to **image files** in **Finder**
3. Add the **Duplicate Finder Items** action (this protects your originals)
4. Add the **Scale Images** action, select "By Percentage", and set it to **25** (or **50**)
5. Save it as "Resize by 25%" (or "Resize by 50%")

Once saved, it shows up in **Finder > right-click > Quick Actions** whenever you select image files.

## Why Two Sizes?

For my iOS Simulator screenshots (1206×2622), here's how the two options compare:

| Percentage | Result for 1206×2622 | Good for                           |
| ---------- | -------------------- | ---------------------------------- |
| **50%**    | 603×1311             | GitHub PRs, documentation, sharing |
| **25%**    | 301×655              | Thumbnails, quick previews         |

In practice, I reach for **50%** most of the time, it's detailed enough for PR screenshots while being small enough that GitHub doesn't complain. **25%** is handy when I need something even more compact.

## The Dotfiles Connection

As with most of my macOS customisations, this workflow lives in my [dotfiles repository](https://github.com/sirlisko/dotfiles/tree/main/osx/Automator/Resize%20by%2025%25.workflow). Automator workflows are just bundles (directories with a `.workflow` extension), so they're easy to version control. To install on a new machine, you just copy the `.workflow` file to `~/Library/Services/` and it's immediately available in Finder.

```bash
cp -r "Resize by 25%.workflow" ~/Library/Services/
cp -r "Resize by 50%.workflow" ~/Library/Services/
```

If you're curious about the rest of my setup, I wrote about the broader [dotfiles philosophy](https://sirlisko.com/blog/dotfiles-one-to-rule-them-all).

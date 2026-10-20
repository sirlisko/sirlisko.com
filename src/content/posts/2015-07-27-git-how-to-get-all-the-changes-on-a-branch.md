---
title: "Git: How to Get All the Changes on a Branch"
description: How to see only the changes made on a branch since it was created from main.
pubDatetime: 2015-07-27
tags:
  - dev
  - git
---

When you work with many branches in Git, it can be hard to see exactly what changed on one of them. This matters most during code reviews: you want to see all the changes made since the branch was created from `main` (or any other branch). `git diff main` does not help here, because it also shows the changes that landed on `main` after you created the branch.

What you need is the last commit your branch has in common with `main`, called the _merge base_. `git merge-base HEAD main` finds it, and you can pass it to `git diff`:

```bash
git diff $(git merge-base HEAD main)
```

Git also has a shortcut that does the same thing, using three dots:

```bash
git diff main...HEAD
```

This works even if you merged `main` into your branch along the way. After a merge, the merge base moves forward, so the diff still shows only the changes made on the branch.

You can add it as an alias to your _.gitconfig_ file:

```ini
[alias]
  changes = diff main...HEAD
```

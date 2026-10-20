---
title: "git-branch-switcher: A CLI Tool to Manage Git Branches"
description: A small CLI tool I built to switch, search, and delete git branches without typing long checkout commands.
pubDatetime: 2026-09-10
ogImage: "./images/git-branch-switcher/git-branch-switcher.jpeg"
tags:
  - dev
  - git
replyPrompt: "How do you manage your git branches?"
---

Years ago I wrote a couple of posts with small git tricks: [how to see all the changes on a branch](/blog/git-how-to-get-all-the-changes-on-a-branch), and a [one-line command to delete all your merged branches](/blog/git-how-to-delete-all-the-merged-branches). Both were quick fixes for the same problem: I never remember branch names, and typing them out, or cleaning them up, gets tedious. This time, instead of another snippet, I built a proper tool for it: [git-branch-switcher](https://github.com/sirlisko/git-branch-switcher).

## What it does

It's a CLI that wraps the everyday branch operations behind an interactive menu:

- Switch between local or remote branches, picked from a list
- Search branches by typing, instead of scrolling through a long list
- Delete one or more branches at once, local or remote
- Branches are sorted by commit date, so the ones you touched most recently are always at the top

It installs as two commands, `git-branch-switcher` and the shorter `br`.

## Installation

```bash
npm install -g git-branch-switcher
# or
pnpm add -g git-branch-switcher
```

## Usage

Switching branches is the default action:

```bash
br              # pick a local branch
br -r           # pick a remote branch
```

Add `-s` to search instead of scrolling:

```bash
br -s           # search local branches
br -r -s        # search remote branches
```

Deleting works the same way, but with multi-select:

```bash
br -d           # delete local branches, asks before deleting unmerged ones
br -D           # force delete, skips that check

br -r -d        # delete remote branches, asks for confirmation
br -r -D        # force delete remote, skips the confirmation
```

The remote is auto-detected. If you only have one remote, or you have several but one is called `origin`, it just uses that. If it can't work out which one to use, it tells you instead of guessing.

Deleting a remote branch runs `git push <remote> --delete` behind the scenes, so it's a real operation and hard to undo. That's why it asks for confirmation unless you pass `-D`.

## How it's built

It's written in TypeScript, using [simple-git](https://github.com/steveukx/git-js) to run the actual git commands, [@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js) for the interactive menus, and [yargs](https://yargs.js.org/) for parsing the flags. [Biome](https://biomejs.dev/) handles linting and formatting, and releases go through [Changesets](https://github.com/changesets/changesets): open a PR with a changeset, merge it, and a GitHub Action publishes to npm automatically.

If you find yourself typing `git checkout` and then squinting at a list of branch names every day, give it a try. The [repo](https://github.com/sirlisko/git-branch-switcher) has more details, and issues and pull requests are welcome.

---
title: Keeping Obsidian and My Git Repos in Sync
description: How I made folders from my code repos show up in my Obsidian vault, on the Mac and on the iPhone, and the options I tried and rejected on the way.
pubDatetime: 2026-10-13
tags:
  - dev
  - projects
replyPrompt: "How do you keep your notes and repos in sync? Did I miss a simpler way?"
---

I want all of my knowledge in one place, on laptop and on mobile. I already write almost everything in Markdown, so Obsidian is the obvious place.[^1]

The problem is that some of this writing lives in git repos, for example the posts of this blog, the documentation for my projects, and the notes site for RPG campaigns. For my blog for instance all the content is plain Markdown in a folder `~/dev/sirlisko.com/src/content/posts`.

I wanted to see and edit this content inside my main vault without copying files around by hand. Changes on one side should appear on the other. For the blog it is also handy: I can read my old posts anywhere and update them from the phone.

It took a few tries. This post explains what I ended up with, what I rejected, and why.

## The constraint that decides everything

My vault lives in _iCloud Drive_, so it syncs to my iPhone. This one detail rules out most of the simple answers.

## Rejected: symlinks

The first idea, which I had already tried some time ago, was a _symlink_: put a link in the vault that points to the folder in the repo. Obsidian on the Mac follows symlinks, so the files show up, and there is only one copy of each file. Nothing to sync.

The problem is iCloud. It does not follow symlinks, it uploads the link itself. On the iPhone the link points to `/Users/me/dev/...`, a path that does not exist there. So the folders were missing on the phone, and I wanted to read my posts there too.

## Rejected: symlinks the other way around

The opposite is to keep the real files in the vault and put a symlink in the repo. Now iCloud is happy, but git is not: git stores the symlink, not the files it points to. The repo would contain a link to my iCloud folder instead of my posts, and the site would not build anywhere else.

## Rejected: Obsidian plugins

If links don't work, the files must be copied. There are a few community plugins for this:

- **Markdown Hijacker**: two-way sync between vault folders and external folders. I could not get it to work.
- **Local Folder Sync**: it did work, but it was buggy. Its folder picker did not show all my subfolders, so I had to edit its config by hand, and I could not filter which file types to sync. Its two-way mode is "newest file wins", which means if I edit the same post on both sides, one edit is silently lost.
- **Folder Bridge**: it mounts external folders in the vault without copying them. That is the symlink problem again: the files are not in iCloud, so the phone does not see them.

There is also a deeper issue with plugins: they only run while Obsidian is open on the Mac.

## Rejected: writing my own plugin

I thought about it. But two-way sync is a hard problem. You need to tell a deleted file from a new one, notice when both sides changed, and handle changes made while the plugin was not running. Getting this wrong means losing writing. That is probably why the existing plugins are buggy, and mine would be too.

## Chosen: Unison in the background

While searching Homebrew, I found [Unison](https://github.com/bcpierce00/unison), a command-line file sync tool that has existed since the late 90s. It solves exactly this problem. The important part is that it keeps a record of the last sync, called the _archive_. With it, Unison knows:

- if a file is missing because I deleted it, or because it is new on the other side
- if a file changed on one side only, or on both

When a file changed on both sides, it does not guess. With my settings, the newer version wins and the other one is saved next to it, as a copy with `conflict_on_` and the date in its name. Nothing is lost.

Installing it is one command:

```bash
brew install unison
```

Each folder pair is a _profile_ in `~/.unison`. The shared settings go in `common.prf`:

```ini file=~/.unison/common.prf
ignore = Name .DS_Store
ignore = Name *.icloud
ignore = Name .trash
batch = true
auto = true
times = true
perms = 0
prefer = newer
copyonconflict = true
confirmbigdel = true
silent = true
log = true
logfile = /Users/me/Library/Logs/unison-obsidian.log
```

What these do:

- `batch` and `auto`: run without asking anything, so it can run in the background
- `times`: keep modification times, needed for `prefer = newer`
- `perms = 0`: ignore file permissions, iCloud does not keep them the same
- `prefer = newer` with `copyonconflict`: the conflict rule above
- `silent`: print only errors, so the error log stays empty when everything works. The full history still goes to `logfile`
- `confirmbigdel`: if one side suddenly loses most of its files, for example because I moved a folder, Unison stops instead of deleting everything on the other side

Then one profile per repo:

```ini file=~/.unison/blog.prf
include common
root = /Users/me/dev/sirlisko.com/src/content/posts
root = /Users/me/Library/Mobile Documents/iCloud~md~obsidian/Documents/Vault/Blog
```

`unison blog` syncs the blog once. To run it every minute I use _launchd_, the macOS service that starts jobs on a schedule. The job is a file in `~/Library/LaunchAgents/com.me.unison-obsidian.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.me.unison-obsidian</string>
  <key>ProgramArguments</key>
  <array>
    <string>/opt/homebrew/bin/unison</string><string>blog</string>
  </array>
  <key>StartInterval</key><integer>60</integer>
  <key>RunAtLoad</key><true/>
  <key>ProcessType</key><string>Background</string>
  <key>StandardErrorPath</key><string>/Users/me/Library/Logs/unison-obsidian.err.log</string>
</dict>
</plist>
```

Before starting it, in Finder, right-click your vault folders and pick **Keep Downloaded**. Otherwise iCloud can remove the local copy of files to save space, and Unison would see them as missing and delete them from the repo too. Then start the job:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.me.unison-obsidian.plist
```

It uses almost no resources. After the first sync, Unison only compares file sizes and dates, finishes in a fraction of a second and exits. Nothing stays running between runs, and it works whether Obsidian is open or not.

The full flow is: repo ↔ Unison ↔ vault folder ↔ iCloud ↔ iPhone.

There is one limit: an edit made on the iPhone reaches the repo only when the Mac is on. That is fine for me, because I commit and publish from the Mac anyway.

## Maintaining it

To check that the last run worked:

```bash
launchctl print gui/$(id -u)/com.me.unison-obsidian | grep 'last exit'
```

`last exit code = 0` means the last run was fine. Don't worry if `launchctl` also says `state = not running`: each sync takes less than a second, so between runs there is nothing to run.

To see what it copies, as it happens:

```bash
tail -f ~/Library/Logs/unison-obsidian.log
```

To find conflicts, which also show up in `git status` as new files:

```bash
find ~/dev/sirlisko.com/src/content/posts -name '*conflict_on_*'
```

When there is one, I merge what I need into the original file and delete the copy.

A few things to remember:

- **Git branches**: Unison syncs whatever is on disk, so switching branch in the repo changes the vault too. I try to switch only when I am not writing in Obsidian.
- **New notes**: a new note in Obsidian is an empty `Untitled.md`. It syncs to the repo right away, and without a `title` in the frontmatter the build fails. My content collection skips files that start with `_`, so I start drafts as `_something.md` and rename them when they are ready. If your collection uses `**/*.md`, change the pattern to `**/[^_]*.md` to get the same behaviour, and check that nothing else in your code reads the folder directly.
- **Errors**: if `unison-obsidian.err.log` says `Operation not permitted`, macOS is blocking the background job from reading iCloud Drive. Adding `/opt/homebrew/bin/unison` to Full Disk Access in System Settings fixes it. That path is a link to a folder with the version number in it, so after `brew upgrade unison` check the error log again: you may need to add it again.
- **Obsidian settings**: in Files & links, new attachments go in a subfolder called `images`, and links use relative paths. So an image I paste in Obsidian also works on the site.
- **Removing it**: `launchctl bootout gui/$(id -u)/com.me.unison-obsidian`, then delete the plist and `~/.unison`.

## A script for all of this

After setting it up by hand twice, I wrote a small script, [obsidian-sync](https://github.com/sirlisko/dotfiles/blob/main/scripts/obsidian-sync), and put it in my dotfiles. It creates the plist, and adding a new folder is one command:

```bash
obsidian-sync add blog ~/dev/sirlisko.com/src/content/posts Blog
```

`obsidian-sync status` shows in one place when the last sync ran, when it last changed something, and any conflicts and errors. Its log only records the syncs that copied or deleted files, so it stays short and easy to read.

The script uses its own names: the job is `local.obsidian-sync`, and the logs are `obsidian-sync.log` and `obsidian-sync.err.log` in `~/Library/Logs`. So with the script, the commands in "Maintaining it" become `obsidian-sync status`, `obsidian-sync log` and `obsidian-sync uninstall`.

## Was it worth it?

I traded a simple idea, a symlink, for a small background job. In return I can read and edit my posts and notes on the phone, git stays the source of truth, and a conflict gives me two files instead of a lost edit. The setup is two small config files and one plist, and Unison does the hard part.

It has worked well in the days I have been testing it, and it fixed a problem I had for a long time. I hope it means more documents, and more posts here.

[^1]: Sorry, Microsoft Office.

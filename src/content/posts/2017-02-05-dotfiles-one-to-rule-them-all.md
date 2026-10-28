---
title: ".dotfiles: One to Rule Them All"
pubDatetime: 2017-02-05
tags:
  - dev
description: My personal repository to rule all the dotfiles and set up my working environment in a matter of seconds.
---

> [!NOTE]
> My [dotfiles repo](https://github.com/sirlisko/dotfiles) has grown a lot since I wrote this post. It now also covers macOS settings, global npm packages and more. This post describes the first version.

Having a repository with a collection of all your dotfiles is the best way to keep your environments synced on multiple machines (e.g. _home_ and _work_). With one of these, you can set up a new machine in a matter of seconds, with all your settings, aliases and even programs.

## But what exactly is a _dotfile_?

As the name says, a dotfile is a file whose name starts with a `.`.

On Unix file systems, files starting with a `.` are hidden. Dotfiles usually live in your home folder (`~`) and contain settings and configuration. For example, `.gitconfig` can contain the git shortcuts you use every day, and `.bashrc` can contain aliases or programs that run when you open your terminal.

## One to rule them all

I have been playing with my dotfiles for a while. At first I copied them by hand, or used _Dropbox_ and `symlinks` to share them across machines. It worked, but I was only copying settings around. What I wanted was a single command to run, and then everything would be ready.

One lazy day, I did not want to rebuild my favourite environment on yet another new machine by hand. I looked for a better approach and found [dotfiles.github.io](https://dotfiles.github.io/), a whole site dedicated to exactly this problem.

Following the "copy from the best" approach, I created a [small repo](https://github.com/sirlisko/dotfiles) containing my basic set-up.

## The magic box

This is the structure of the ~~ring~~ repo:

```text
├── Brewfile
├── Makefile
├── README.md
├── git
│   ├── gitconfig
│   └── gitignore
└── zsh
    ├── aliases
    └── zshrc
```

### Brewfile

It lists all the programs and apps to install, from `git` to `flux` and some Finder improvements.

### Makefile

It's the engine, where the magic happens. It creates `symlinks` from the repo to the git and zsh settings in your home folder:

```makefile
symlinks:
	@ln -sf $(DIR)/git/gitconfig ~/.gitconfig
	@ln -sf $(DIR)/git/gitignore ~/.gitignore
	@ln -sf $(DIR)/zsh/zshrc ~/.zshrc
```

There is also a part that installs and upgrades the programs with `brew`:

```makefile
brew:
	brew update
	brew upgrade
	brew tap Homebrew/bundle
	brew tap caskroom/versions
	brew bundle
	brew cleanup
```

### git/

_Ça va sans dire_, it contains all the git settings.

### zsh/

Same as above, all the shell settings.

## Up and running

There are just a couple of prerequisites, which I want to automate in the future:

- `zsh`: instead of plain bash, I use [oh-my-zsh](https://ohmyz.sh/).
- `brew`: [Homebrew](https://brew.sh/), a package manager for macOS.

Once these two are installed, you are ready.

First, clone the repository:

```bash
git clone https://github.com/sirlisko/dotfiles.git
cd dotfiles
```

Then install everything:

```bash
make
```

That's it.

## To infinity and beyond

Unfortunately, I have not had much time to improve them yet. There are a few things I would like to add, for example removing the prerequisites. My to-do list:

- automate the installation of `zsh`
- automate the installation of `brew`
- macOS settings
- `NPM` global packages
- `apm` and Atom configuration

For now, I am happy enough with them.

I suggest playing with your dotfiles. It's a good exercise and time well spent: you will learn a lot, and the next time you set up a new machine, you will feel like a magician.

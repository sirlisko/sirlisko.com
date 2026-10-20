---
title: "Git: How to Delete All the Merged Branches"
description: A command to delete all the remote branches already merged into main.
pubDatetime: 2016-02-18
tags:
  - dev
  - git
---

Who has a repository without dead, already merged branches? Admit it, almost no one. In my team, especially since we moved to [git flow](https://nvie.com/posts/a-successful-git-branching-model/)[^1], this rarely happens. Forgetting to delete a merged branch from the remote is common, it happens to everyone. But

> I believe a tidy repository should let you understand its status at a glance.

After some research, I ended up with the following command to delete all the merged remote branches in one go:

```bash
git fetch --prune
git branch -r --merged origin/main |
  grep -v ' -> ' |
  grep -vE 'origin/(main|develop)$' |
  sed 's#^ *origin/##' |
  xargs git push origin --delete
```

Step by step:

1. `git fetch --prune` updates your remote branches and removes the ones already deleted on the remote.
2. `git branch -r --merged origin/main` lists the remote branches already merged into `main`.
3. `grep -v ' -> '` skips the `origin/HEAD -> origin/main` line.
4. `grep -vE 'origin/(main|develop)$'` protects the long-lived branches. Add any other branch you want to keep here. I once deleted `develop` by mistake, so be careful.
5. `sed` removes the `origin/` prefix.
6. `xargs git push origin --delete` deletes what is left.

Today, if you use GitHub, you can turn on _Automatically delete head branches_ in the repository settings, and merged pull request branches are deleted for you. For local branches, I later built [git-branch-switcher](/blog/git-branch-switcher), which can delete several branches at once.

---

[^1]: Unfortunately, git flow does not delete branches once they are merged. This could be a good thing if, like me, you like to mess up your work playing with rebase and squash.

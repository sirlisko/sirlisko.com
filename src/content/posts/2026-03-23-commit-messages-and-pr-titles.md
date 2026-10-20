---
title: Commit Messages & PR Titles
description: A practical guide to writing clearer commits and PRs. What I arrived at after almost two decades of questioning whether I was doing it right.
pubDatetime: 2026-03-23
tags:
  - dev
  - git
ogImage: https://images.unsplash.com/photo-1556075798-4825dfaaf498?fm=jpg&q=80&w=1280&h=720&fit=crop
replyPrompt: "How does your team write commit messages?"
---

I've been writing commit messages for almost two decades. And yet, recently, I found a new reason to think carefully about them.

I was writing an [ADR](/blog/ode-to-adrs) for my team about consistent analytics event naming. As I drafted the convention, I reached for past tense. Events describe things that already happened, so it made sense. That small choice made me pause. If we care enough about consistency in event names to document it formally, shouldn't we apply the same rigour to our commit messages and PR titles?

Especially since a PR title, when squash-merged, _becomes_ the commit on main. It's not just a label on a code review. It's permanent history.

That reflection turned into this guide. It's opinionated and it works for me, but the most important thing isn't that you follow this exact format. It's that your team has _one_ format, documented somewhere, and everyone follows it.

## Why This Matters

Good commit messages and PR titles:

- **Speed up reviews** — reviewers understand intent immediately, without digging through the diff
- **Aid debugging** — `git log` becomes a searchable changelog instead of a wall of noise
- **Document decisions** — future you (or teammates) understand the _why_, not just the _what_
- **Enable automation** — tools can parse types for changelogs, release notes, and deploys

## The Format

I use [Conventional Commits](https://www.conventionalcommits.org/), which looks like this:

```
<type>(<scope>): <subject>

<body>

<footer>
```

A real example:

```
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA to reduce account compromise risk.
Users can generate backup codes on initial setup.

Closes #234
```

The **type** describes what kind of change it is. I use these:

- `feat` — new feature
- `fix` — bug fix
- `refactor` — code change that isn't a feature or fix
- `perf` — performance improvement
- `test` — adding or updating tests
- `docs` — documentation
- `chore` — dependency updates, config, tooling
- `ci` — CI/CD pipeline changes
- `style` — formatting, linting (non-semantic)

The **scope** (optional but worth using) is the module or domain affected: `auth`, `api`, `ui`, `db`, `validation`, and so on. Pick 8–12 scopes for your project and stick to them.

The **subject** is the short summary. Keep it under 50 characters, use imperative mood ("add filter" not "added filter"), and don't put a period at the end.

## What Actually Makes a Good Commit Message

The format is the easy part. The hard part is knowing what to _say_.

I think about it as a 2x2 matrix. Every meaningful commit message should cover four things:

|                | What                                    | Why                                                |
| -------------- | --------------------------------------- | -------------------------------------------------- |
| **High-level** | **Intent** — What does this accomplish? | **Context** — Why does this code exist?            |
| **Low-level**  | **Implementation** — What did you do?   | **Justification** — Why was this change necessary? |

**Intent** goes in the subject line:

```
fix(auth): prevent concurrent token refresh race condition
```

**Context, implementation, and justification** go in the body:

```
fix(auth): prevent concurrent token refresh race condition

When users have multiple tabs open, token refresh requests can race.
Both requests see an expired token, both initiate refresh, and one
ends up with an invalidated token, causing 401 errors in the other tab.

Implemented request deduplication using a Promise stored on auth state.
Subsequent refresh requests await the first one instead of initiating
new refreshes.

Reduces token-related 401 errors by ~95% in multi-tab sessions.

Fixes #892
```

Not every commit needs all four. A simple refactor might just need intent and a one-liner of context. But when you're writing a body, ask yourself: am I explaining the _why_, or just restating what the diff already shows?

```
✗ Change email validation by adding a regex and checking it multiple times.
✓ Add stricter email validation to reduce bounce rate on password resets.
```

The code shows the _how_. The message explains the _why_.

## The Mistakes Worth Avoiding

**Vague subjects.** The subject should tell someone what changed without reading the diff:

```
✗ fix bugs
✗ update code
✓ fix(auth): prevent null reference in token refresh
```

**Repeating the type in the subject.** The type already says what kind of change it is, the subject should describe what was fixed, not restate it:

```
✗ fix(date): fix use of update date
✓ fix(date): use updated_at instead of created_at
```

**Mixing unrelated changes.** If your subject contains "and", that's usually a sign you have two commits:

```
✗ feat(auth): add 2FA and update dependencies and fix typo in docs
```

Split it. Easier to revert and understand.

**Subjects that are too long.** Keep it under 50 characters. Put the rest in the body, not the subject:

```
✗ feat(api): implement pagination support for user list endpoint with limit and offset params
✓ feat(api): add pagination to user list endpoint
```

**Forgetting to close issues.** Link it in the footer:

```
Fixes #892
```

GitHub auto-closes the issue on merge. Free changelog entry.

## Squash vs. Keep

This comes up in almost every team I've worked with, and I've seen both camps argue passionately.

My default is **squash**. Almost always. A single, well-written commit per PR is clean, easy to revert, and forces you to articulate the change clearly. It also keeps `git log` readable, which is the whole point.

The only time I keep multiple commits is when the feature is large enough that the commits genuinely tell a story worth preserving: each one is a meaningful, self-contained step, and collapsing them into one would lose context that matters when reading the history later. That's the exception, not the rule.

If you're unsure: squash. A history full of "fix linting", "oops", and "WIP" commits helps nobody.

## Before You Submit

My workflow: commit freely while coding. Rough messages, frequent commits. When I'm ready to open a PR, I run:

```bash
git rebase -i main
```

Then I reorder, squash, and reword into a clean narrative. The key operations you'll use most:

- `pick` — keep as-is
- `squash` (or `s`) — combine with the previous commit, prompting for a new message
- `fixup` (or `f`) — silently combine, keeping the previous message
- `reword` (or `r`) — keep the changes, edit just the message

Don't stress about commit quality while you're in the flow. Rebase is where you turn your working history into something a reviewer (and future you) will actually appreciate.

Which brings to mind a famous quote:

> Write drunk, edit sober — as Hemingway (allegedly) put it. The rebase is the sober part.

## PR Titles

PR titles follow the same format as commit messages, because they often end up _as_ the merge commit message. Same rules apply:

```
feat(auth): add two-factor authentication
fix(api): handle null responses in user endpoint
refactor(state): migrate from Redux to Zustand
```

Keep it under 60 characters. The body is where context lives, not the title.

One thing worth noting: **use imperative mood in the title** ("add two-factor authentication"), but **past tense in the body** ("implemented TOTP-based 2FA..."). The title describes what the PR does; the body narrates what you did.

Here's the PR body template I use:

```markdown
## Description

Briefly summarize what was implemented or changed.

## Motivation

Explain why this change was needed. What problem does it solve?

## Implementation Details

Describe how you solved it. Link to relevant code sections if helpful.

- Used X library for Y reason
- Refactored the Z module to improve performance
- Added validation for edge case

## How to test

[Describe how a reviewer can verify this change works as expected]

## Screenshots (if UI-related)

[Add screenshots for visual changes]

## Breaking Changes

[If applicable, describe what changed and migration path]
```

## Tooling

If you want to enforce this automatically, the setup takes about ten minutes:

```bash
npm install --save-dev husky commitlint @commitlint/config-conventional
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

Create `commitlint.config.js`:

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

Now every commit gets validated before it's created. Fail fast, fix fast.

You can also set a global commit template so your editor opens with the format pre-filled:

```bash
# Save this as ~/.gitmessage:
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>

git config --global commit.template ~/.gitmessage
```

## For Teams: CONTRIBUTING.md Template

Once you've settled on a convention, document it where people will actually find it: in the repo. Here's a ready-to-paste `CONTRIBUTING.md` section:

```markdown
## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

\`\`\`
<type>(<scope>): <subject>
\`\`\`

### Types

- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code refactoring
- `perf` — Performance improvement
- `test` — Test additions/changes
- `docs` — Documentation
- `chore` — Maintenance
- `ci` — CI/CD changes

### Scopes

Use one of: `auth`, `api`, `ui`, `db`, `hooks`, `validation`, `state`, `types`

### Rules

- Use imperative mood ("add" not "added")
- Keep subject under 50 characters
- Explain _why_ in the body, not _how_
- Link issues: `Closes #123`

### Example

\`\`\`
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA to reduce account compromise risk.
Users can generate backup codes on initial setup.

Closes #234
\`\`\`

## Pull Requests

- Title follows commit format
- Body uses past tense (what you did)
- Link related issues
- Add tests for new features
```

Adjust the scopes list to match your project. That's the one section where copy-paste won't cut it.

## Bonus: Changelog Automation

One side benefit of consistent commit messages: you can auto-generate changelogs from your history.

```bash
npm install --save-dev conventional-changelog-cli
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

This reads your commit history and produces a structured changelog grouped by features, fixes, and breaking changes. It only works well if your commits are clean, which is another reason the discipline pays off.

## Quick Checklist

Before committing:

- [ ] Type is accurate (`feat`, `fix`, `refactor`, etc.)
- [ ] Scope reflects what changed (or omitted if global)
- [ ] Subject is imperative mood & under 50 chars
- [ ] Body (if needed) explains _why_, not _how_
- [ ] Footer links related issues (`Closes #123`)
- [ ] No `WIP:` or `DEBUG:` left in the message

Before creating a PR:

- [ ] Title follows `type(scope): description` format
- [ ] Description explains the problem & solution
- [ ] Linked to relevant issues
- [ ] Tests are added or updated
- [ ] No breaking changes without a clear migration path

## References

- [Conventional Commits](https://www.conventionalcommits.org/) — The specification this guide is based on. Worth reading in full; it's short.
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) by Chris Beams — The classic post on the topic. The seven rules it lays out are still the best starting point for anyone new to thinking about this.
- [Write Better Commits, Build Better Projects](https://github.blog/developer-skills/github/write-better-commits-build-better-projects/) — GitHub's own take on the topic, with a focus on commit sizing and narrative structure.
- [Commitlint](https://commitlint.js.org/) — The tool that enforces your commit convention automatically. Pairs well with Husky.

## Consistency Over Perfection

The thing I kept coming back to while putting this together: none of this matters if the rules change depending on who's committing. A slightly imperfect convention that everyone follows is worth more than a perfect one that nobody does.

Pick a format. Document it in `CONTRIBUTING.md`. Set up commitlint if you want guardrails. Then stop thinking about it and get back to writing code.

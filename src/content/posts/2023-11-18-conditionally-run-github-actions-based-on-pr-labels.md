---
title: Conditionally Run GitHub Actions Based on PR Labels
description: How to run a GitHub Actions job only when a pull request has a specific label.
pubDatetime: 2023-11-18
tags:
  - dev
  - github
---

Sometimes you want a GitHub Actions job to run only in specific cases. For example, you deploy a Node.js app on every push to `main`, but on pull requests you only want to deploy when the PR has a `deploy` label.

## The simple way

A job's `if:` condition can read the `github` context, which includes the labels of the pull request. So you can write the condition directly on the job:

```yml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    types: [labeled, opened, synchronize, reopened]

jobs:
  release:
    name: Create GitHub Release
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || contains(github.event.pull_request.labels.*.name, 'deploy')
    steps:
      - run: echo 'deploy'
```

- **`on`**: runs the workflow on pushes to `main`, and on pull requests when they are opened, reopened, get new commits (`synchronize`), or get a new label (`labeled`). Without `labeled`, adding the label would not trigger anything until the next push.
- **`if`**: the job runs if we are on `main`, or if the pull request has the `deploy` label.

## Reusing the condition across jobs

If several jobs need the same condition, you might want to define it once as a workflow-level `env` variable. Unfortunately, this does not work: the `env` context is [not available in a job's `if:`](https://github.com/actions/runner/issues/480).

The workaround is a small job that turns the value into an _output_. Other jobs can then read it with `needs.<job>.outputs.<name>`:

```yml
env:
  SHOULD_RELEASE: ${{ github.ref == 'refs/heads/main' || contains(github.event.pull_request.labels.*.name, 'deploy') }}

jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      should_release: ${{ env.SHOULD_RELEASE }}
    steps:
      - run: echo "SHOULD_RELEASE=${{ env.SHOULD_RELEASE }}"

  release:
    name: Create GitHub Release
    runs-on: ubuntu-latest
    needs: [prepare]
    if: needs.prepare.outputs.should_release == 'true'
    steps:
      - run: echo 'deploy'
```

Outputs are always strings, so compare with `'true'`, not `true`.

For one or two jobs, I would keep the condition on the job itself. The extra job adds a few seconds to every run and one more thing to read.

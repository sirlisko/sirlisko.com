---
title: Dependencies vs devDependencies
pubDatetime: 2019-11-07
tags:
  - dev
description: When to put an npm package in dependencies vs devDependencies.
---

It's probably the most famous dilemma after the [chicken or the egg](https://en.wikipedia.org/wiki/Chicken_or_the_egg): should I install this package in _dependencies_ or in _devDependencies_?

Let's see what `npm` and `yarn` say about it:

### NPM

> `dependencies`: Packages required by your application in production.
> `devDependencies`: Packages that are only needed for local development and testing.

([npm docs](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file))

### Yarn

> `dependencies`: These are your normal dependencies, or rather ones that you need when running your code (e.g. React or ImmutableJS).
> `devDependencies`: These are your development dependencies. Dependencies that you need at some point in the development workflow but not while running your code (e.g. Babel or Flow).

([Yarn docs](https://classic.yarnpkg.com/en/docs/dependency-types))

Both talk about what you need to _run your code_, but neither mentions _building it_. Still, the `yarn` example suggests that tools like `babel`, and by extension `@types`, belong in `devDependencies`. So what should you do?

I looked at two of the project generators I have used lately: the very popular [`create-react-app`](https://github.com/facebook/create-react-app) and the brand new [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Both install everything as normal dependencies.

```json
    "dependencies": {
      "@types/jest": "24.0.22",
      "@types/node": "12.12.6",
      "@types/react": "16.9.11",
      "@types/react-dom": "16.9.4",
      "react": "^16.11.0",
      "react-dom": "^16.11.0",
      "react-scripts": "3.2.0",
      "typescript": "3.7.2"
    },
```

`package.json` created by `create-react-app`

So `create-react-app`, maintained by Facebook (which also created `yarn`), installs all the `@types` with `yarn`, but against what `yarn` itself suggests. The likely reason: some hosting platforms and CI setups run the install step with `NODE_ENV=production`, which makes both `npm` and `yarn` skip `devDependencies` entirely. If `react-scripts` or `typescript` lived there, `npm run build` would fail before your app ever got built. It's a pragmatic workaround for a deployment edge case, not a pattern to copy for a project that controls its own build step.

Whatever those two giants do, there is another thing to consider: size. If you have built lambda functions before, you have probably run into this. You want the code you ship to your lambda to be as small as possible, so you don't want to send along all the `@types` or `babel` plugins. You will most likely install all your dependencies at build time and then deploy a small package with only the dependencies needed by the application to run. Or you can ship the built code without the dependencies and install only the production ones in a later CI/deploy step (probably even caching them) with the handy `--production` (or `--prod` or `-p`) flag, before zipping and uploading it. `npm install --production` or `yarn --production` installs only the packages in `dependencies`, and skips the ones in `devDependencies`.

There is another scenario, though: you want to start your application without installing all the test and lint dependencies. In this case, `npm install --production` will install only the modules needed to start your application, and yes, unfortunately, `@types` are part of those. It could be handy to save a few seconds, especially if you are installing heavy packages (yes, `cypress` I am looking at you).

Of the two scenarios, I think the first one (keeping the deployed package small) matters most. The second one is a niche: unless you install a lot of applications from scratch all the time, I don't see much benefit. This is also why I wouldn't copy `create-react-app`'s layout into a project with its own build step: it solves a specific deployment problem, not a rule to follow everywhere.

### TL;DR

Can you run your application without this package?

- Yes: `devDependencies`.
- No: `dependencies`.

(Build tools bundled as `dependencies`, like in `create-react-app`, are the deployment-driven exception above.)

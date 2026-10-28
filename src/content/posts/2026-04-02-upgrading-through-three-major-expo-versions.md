---
title: "Upgrading Through Three Major Expo Versions (and Getting to Zero Warnings)"
description: What it takes to upgrade a production React Native app through Expo 53, 54, and 55, the breaking changes, the dependency hell, and the payoff.
pubDatetime: 2026-04-02
tags:
  - dev
  - react-native
ogImage: https://images.unsplash.com/photo-1608742213509-815b97c30b36?fm=jpg&q=80&w=1280&h=720&fit=crop
toc: true
series: "A Year Building a React Native App with Expo"
---

_This post is part of [A Year Building a React Native App with Expo](/blog/a-year-building-a-react-native-app-with-expo), a retrospective series on the decisions and patterns that shaped a production React Native app._

## Introduction

When I joined the project, running `npm start` and `npm test` was noisy. The console was full of deprecation warnings, React `act()` errors in tests, and yellow boxes on the simulator. The kind of noise that's easy to ignore when you're focused on features, but that slowly erodes confidence in the codebase. You stop noticing warnings, and then you stop noticing _actual problems_ hidden among the warnings.

One of the first things I did was fix those. Not because it was glamorous work, but because a clean console is a precondition for everything else. If your test suite screams warnings on every run, nobody reads the output. If your dev server logs deprecation notices on startup, nobody notices when a real error appears.

Over the following year, I upgraded the app through three major Expo versions (53, 54, and 55), each with its own breaking changes, dependency cascades, and native module incompatibilities. By the end, we were on the latest version of Expo, the latest supported React and React Native, running the new architecture, with zero warnings in the console.

This post is about what that journey looked like in practice.

## Starting Point: A Noisy Console

The warnings fell into a few categories:

**Deprecation logs from unmaintained packages.** The app used `react-native-render-html` for rendering HTML content from the CMS. The package hadn't been updated in a while, and it was firing deprecation warnings on every render. The fix wasn't a simple upgrade; there was no upgrade. I ended up patching the package directly using `pnpm patch`[^1]:

```json
{
  "pnpm": {
    "patchedDependencies": {
      "react-native-render-html@6.3.4": "patches/react-native-render-html@6.3.4.patch"
    }
  }
}
```

The patch was ~200 lines of code, essentially backporting fixes that the maintainers hadn't released. Not ideal, but the alternative was either forking the package or living with the noise. Sometimes patching is the pragmatic choice.

**React `act()` warnings in tests.** These were everywhere. Async state updates in tests weren't wrapped properly, effects were firing after assertions, and some tests were missing cleanup. I went through the test suite systematically, fixing `act()` warnings, wrapping async operations, adding proper teardown. Not one big PR, but a steady stream of fixes over several weeks.

**Dependency version conflicts.** Some packages were pinned to old versions that conflicted with each other. I cleaned up `overrides` in `package.json`, removed unnecessary version pins, and aligned transitive dependencies. The kind of work that shows up as a smaller `pnpm-lock.yaml` and faster installs.

**Console errors in dev.** FullStory was logging errors in non-production builds. Deprecated icon imports from `phosphor-react-native` were firing warnings. A custom Expo plugin for Auth0 was generating noise that the standard package handled silently. Each one was small, but together they made the console unusable as a debugging tool.

After a few weeks, both `npm start` and `npm test` ran clean. That baseline made everything that came after (feature work, refactors, upgrades) noticeably easier.

## Expo 53

The first major upgrade. The main challenges:

- **React Native version bump**: Each Expo version pins a specific React Native version. The jump meant updating every native module that depended on the RN version — `react-native-reanimated`, `react-native-gesture-handler`, `react-native-svg`, and others.
- **Metro config changes**: Expo regularly changes how Metro is configured. Transformer paths, resolver settings, and plugin APIs all shifted.
- **Deprecated APIs**: Several React Native APIs were deprecated or moved. `EventEmitter` listeners changed signature, `DeviceEventEmitter` usage needed updating.
- **Testing library updates**: `@testing-library/react-native` had breaking changes in its query APIs and event simulation.

The process was always the same: run `npx expo install --fix`, see what breaks, fix it, run tests, repeat. The `npx expo install --fix` command updates packages to versions compatible with the current Expo SDK, which handles most of the mechanical work. The remaining work is everything it can't detect: runtime behaviour changes, test failures from API shifts, and native module incompatibilities that only surface when you actually build.

## Expo 54

Expo 54 was smoother: it was mostly `package.json` and lock file changes. The main work was aligning Babel config with the latest `react-native-reanimated` requirements and updating some TypeScript types.

This upgrade also involved removing a `react-native` patch that was no longer needed. The patch had been working around a bug in the previous React Native version. When the underlying issue was fixed upstream, the patch became dead code, but it was still being applied on every install. Removing it was one line in `package.json` and the deletion of the patch file, but finding it required understanding _why_ the patch existed in the first place.

This is the hidden cost of patches: they solve a problem today, but they need to be re-evaluated on every upgrade. If you don't track why a patch was added, you can't know when it's safe to remove.

## Expo 55

The biggest jump. Three files changed, but the lock file diff was massive, around 5 thousand lines of changes, but mostly dependency tree simplifications.

This was also the version that completed the transition to the **new architecture** (Fabric renderer and TurboModules). The new architecture had been the default since Expo 53, but Expo 55 removed the old one entirely. For our app, this meant:

- Verifying that every native module supported the new architecture (most did by this point)
- Testing gesture handling, animations, and native transitions for regressions
- Updating any code that relied on the old bridge APIs

The payoff was real: faster startup, more efficient re-renders, and better interop between JavaScript and native code. But the migration required testing every screen, because the new architecture changes how the bridge works under the hood. Subtle rendering differences can appear in places you don't expect.

## The Upgrade Playbook

After doing this three times, I settled into a pattern:

**1. Start with `npx expo install --fix`.** Let it update compatible packages automatically. This handles 80% of the mechanical work.

**2. Run the build immediately.** Don't fix TypeScript errors first; build for iOS and Android and see what _actually_ breaks at the native level. TypeScript errors are easy to fix; native build failures are where the real work is.

**3. Run the full test suite.** Not just "do tests pass" but "is the output clean". New warnings in tests are a signal that something changed behaviour, even if the assertion still passes.

**4. Check every patch.** For each patched dependency, verify whether the upstream package has fixed the issue. If it has, remove the patch. If it hasn't, verify the patch still applies cleanly.

**5. Update overrides.** Transitive dependency conflicts often surface during major upgrades. Clean them up now rather than carrying them forward.

**6. Test on device.** Simulators don't catch everything. Gesture handling, animation performance, and native module behaviour can differ between simulator and device, especially after an architecture change.

## Why Bother

It's tempting to skip upgrades. The app works, the features are shipping, and upgrading is all cost with no visible user benefit. But the cost of _not_ upgrading compounds:

- **Security patches**: React Native and Expo regularly fix security issues. Falling behind means shipping known vulnerabilities.
- **Ecosystem compatibility**: Libraries drop support for old SDK versions. The longer you wait, the more libraries you can't update.
- **Upgrade difficulty**: Jumping one version is manageable. Jumping three at once is a project. We stayed current by upgrading shortly after each stable release, which meant each jump was incremental rather than a massive catch-up.
- **New architecture**: The new architecture is where React Native's future is. Waiting meant accumulating technical debt against an inevitable migration.

The Expo 53 upgrade was the hardest because it had been deferred. Expo 54 and 55 were progressively easier because we did them promptly. That's the pattern: the first upgrade is painful, and every subsequent one is easier _if you don't fall behind again_.

## The Payoff

After three major upgrades:

- **Zero warnings** in `npm start` and `npm test`
- **Latest Expo SDK** with the new architecture enabled
- **Latest supported React and React Native** versions
- **Cleaned dependency tree**: ~12,000 lines removed from `pnpm-lock.yaml` across the three upgrades
- **All patches evaluated**: removed stale patches, documented remaining ones
- **Faster builds and startup**: the new architecture delivers measurable performance improvements

The clean console might seem like a small thing, but it changed how the team worked. When a warning appears now, someone notices. When a test logs an error, it's a real error. The signal-to-noise ratio went from terrible to perfect, and that makes everything else (debugging, code review, onboarding) faster.

---

_Note: If you're planning an Expo upgrade, the [Expo changelog](https://docs.expo.dev/changelog/) and the `npx expo install --fix` command are your best friends. Start there, and let the build failures guide you to everything else._

[^1]: `pnpm patch <package>` opens the package source in a temp directory, lets you edit it, then saves a diff as a patch file that pnpm re-applies on every install. The npm equivalent is [patch-package](https://github.com/ds300/patch-package).

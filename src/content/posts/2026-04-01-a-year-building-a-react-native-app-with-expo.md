---
title: "A Year Building a React Native App with Expo"
description: A retrospective on joining a React Native project, shaping its technical direction through ADRs, and shipping it to production.
pubDatetime: 2026-04-01
tags:
  - dev
  - react-native
ogImage: https://images.unsplash.com/photo-1767334850102-b37f04d4e2b0?fm=jpg&q=80&w=1280&h=720&fit=crop
replyPrompt: "Are you using Expo in production? What surprised you?"
---

In early 2025, I joined a team building a React Native app with Expo. The app was already underway: there was a codebase, a product direction, and a team. My job was to help shape the technical direction as we pushed toward a production launch.

Over the following year, the app went from early development to version 1.8 in the App Store. I wrote around 500 commits across a codebase that grew to nearly 2,000 total. Along the way, I introduced Architecture Decision Records[^1] to the project and ended up writing 15 of them, documenting everything from file system organisation to offline mutation queues.

Now, as my time on the project comes to an end, I wanted to write this series as a retrospective: part technical deep-dive, part closure. This was a project I poured a lot of effort and care into, and writing it down is how I process what worked, what didn't, and what I'd carry forward. This post is the overview. The individual posts go deeper into specific topics.

## Table of contents

## The App

The app is a financial planning tool. It helps users explore retirement scenarios, track pensions, and get personalised content based on their situation. It's built with:

- **Expo** (with Expo Router for file-based routing)
- **Apollo Client** for GraphQL
- **React Query** for non-GraphQL APIs (CMS content)
- **Zustand** for client-side state
- **Lottie**, **SVG**, and **WebP** for assets
- **EAS** for builds and OTA updates

The codebase follows a clear separation: routing lives in `src/app/` (Expo Router file-based routes with no business logic), reusable UI components live in `src/components/`, and business logic is grouped by domain in `src/screens/`. Each domain folder can have its own components, hooks, and utilities, keeping related code together without scattering it across the repo. We avoid barrel files entirely: every import points directly to its source file, which simplifies debugging, prevents circular dependencies, and helps build performance.

```bash
src/
├── app/               # Expo Router pages (routing only)
├── components/        # Reusable UI components (no business logic)
├── screens/           # Business logic organised by domain
│   ├── Calculator/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── views/
│   │   └── index.tsx
│   ├── Dashboard/
│   └── ...
├── graphql/           # Apollo Client, offline queue, codegen
├── lib/
│   ├── services/store/  # Zustand stores
│   └── utils/           # Shared utilities
└── assets/
    ├── animations/    # Lottie
    ├── images/        # WebP
    └── vectors/       # SVG
```

This structure was one of the first things we documented. It's not revolutionary, but having it written down in an ADR meant new team members could understand the conventions on day one instead of reverse-engineering them from the code.

## The Series

Each post below covers a specific decision or pattern that came up during the project. They can be read independently, but together they paint a picture of what it takes to build and ship a production React Native app.

### [Upgrading Through Three Major Expo Versions](/blog/upgrading-through-three-major-expo-versions)

When I joined, the console was full of warnings and deprecation logs. I fixed them, then shipped upgrades from Expo 53 through 55, including the jump to the new architecture. Covers the upgrade playbook, patching unmaintained dependencies, and why a clean console is a precondition for everything else.

### [The Right Tool for the Job: Replacing XState with Zustand](/blog/the-right-tool-for-the-job-replacing-xstate-with-zustand)

We found XState powering a feature that was fundamentally simple CRUD state. The migration to Zustand reduced state management code by 80%, not because XState is bad, but because the implementation was the wrong tool for the job. Also covers how we drew clear boundaries between Zustand, Apollo Client, and reactive variables.

### [Offline-First Mutations in React Native with Apollo Client](/blog/offline-first-mutations-in-react-native-with-apollo-client)

Apollo's `RetryLink` handles transient failures, but mutations are lost when the app restarts. We built a persistent offline mutation queue with AsyncStorage, a `useOfflineMutation` drop-in hook, and a network listener that drains the queue on reconnect. Covers deduplication, optimistic updates, and the retryable vs non-retryable error distinction.

### [Storybook in Expo Router Without Replacing Your App](/blog/storybook-in-expo-router-without-replacing-your-app)

Most React Native Storybook setups replace the app entry point. We integrated it as an Expo Router route: navigate to `/storybook`, browse components, press back, you're in the app. Three layers of production exclusion ensure zero bundle size impact, and preview builds let non-developers browse components on real devices.

### [Asset Format Strategy for React Native Apps](/blog/asset-format-strategy-for-react-native-apps)

A simple content-based rule: SVG for vectors, WebP for rasters, Lottie for complex animations, compressed MP4 for video. Covers the decision matrix, implementation patterns with `expo-image` and `react-native-svg-transformer`, video compression with ffmpeg, asset organisation, and conversion tooling.

### [Accessibility in React Native: Beyond the Checklist](/blog/accessibility-in-react-native-beyond-the-checklist)

Accessibility is overlooked in most React Native content. This covers the practical side: screen reader support, font scaling with a custom `useLargeText` hook, and how to test with Accessibility Inspector, VoiceOver, TalkBack, and BrowserStack.

## What I'm Proud Of

Looking back, a few things stand out as having the biggest impact on the project.

**Decommissioning the custom GraphQL layer.** When I joined, the app had a hand-rolled custom GraphQL executor that managed operations via AsyncStorage. It had accumulated complex bugs around serialization, deduplication, and retry logic, and manual cache management was causing duplicate requests. Migrating to Apollo Client removed roughly 2,500 lines of custom code and gave us normalised caching, automatic refetching, and devtools for free. The offline mutation queue we built on top is under 200 lines and handles everything the old system did, plus deduplication and optimistic updates.

**Simplifying the state management.** The XState-to-Zustand migration removed 80% of the state management code. But equally important was what came after: establishing clear boundaries between Zustand (client state), Apollo (server state), and React Query (CMS content), documenting those boundaries so the team wouldn't drift back toward "one tool for everything". We also removed an entire store that was persisting data that Apollo's cache already handled, which simplified the data flow considerably.

**Standardising the carousels.** The app had multiple custom carousel implementations with accessibility issues: no screen reader support, no keyboard navigation. We migrated over 20 carousel instances to `react-native-reanimated-carousel`, deleted the custom full-screen carousel component and carousel navigation hook, and wrapped everything in a single `Carousel` component that enforces consistent behaviour. One library, one wrapper, consistent accessibility.

**Getting to zero warnings.** When I joined, `npm start` and `npm test` were full of deprecation logs, React `act()` warnings, and console errors from unmaintained packages. One of the first things I did was fix them all, including patching `react-native-render-html` with a `pnpm patch` because the package was abandoned but still firing deprecation warnings on every render. A clean console sounds trivial, but it's the difference between a team that notices problems and a team that ignores them.

**Three major Expo upgrades.** I shipped upgrades from Expo 53 through 55 (including the jump to the new architecture), cleaning up roughly 12,000 lines of dependency cruft along the way. Each upgrade meant updating native modules, fixing breaking TypeScript changes, testing on device, and re-evaluating every patch. We're now on the latest Expo, the latest supported React and React Native, with zero warnings in the console.

**Developer experience.** Introducing Storybook, the dev menu shortcuts, the ADR practice, the asset format strategy: these aren't flashy features, but they compound. Every new team member who reads an ADR instead of reverse-engineering a decision, every designer who browses components in a preview build instead of asking on Slack, every developer who knows exactly where to put a new asset: that's time saved, multiplied across the team and across months.

**Accessibility as a default.** Across major user flows, I added screen reader support, font scaling constraints, and adaptive layouts. These weren't separate "accessibility sprints"; they were part of building each feature. The carousel standardisation was partly motivated by this: the custom implementation had no screen reader support at all.

## What I'd Do Differently

No retrospective is honest without regrets. Two things bother me. Both were decisions made before I joined, and I didn't push hard enough to change them early on. By the time the cost was clear, they were too deeply embedded.

**Use the native Stack navigator header instead of reimplementing it.** Every single route in the app has `headerShown: false`. Instead, a custom layout component (~400 lines) reimplements the header, back button, blur effects, scroll behaviour, background images, gradients, footer with up to three buttons, safe area insets, font scaling, and theming. It's used in almost all the app's screens.

This means the app loses native back swipe gestures, native transitions, and accessibility features that come for free with the Stack navigator header. We had to do extra work to implement these features manually. It also means one monolithic component owns _everything_ about a screen's layout. If you need to change how the footer works, you're editing the same file that handles scroll behaviour and header blur. The right approach would have been: use the native header for navigation, compose smaller layout primitives for content areas, and let each concern be independently testable and replaceable.

**Centralise forms from the start.** The app had an internal form library plus a separate set of form components in `components/forms/`. We wrote an ADR adopting React Hook Form, but the migration only reached 5 files before other priorities took over. The result is two form systems coexisting, which is worse than committing to either one.

The lesson: when you join a project and see an abstraction that's going to cause pain, push for the change early. The cost of migration only goes up with time, and "we'll get to it later" usually means "it'll be someone else's problem".

## What I Learned

A few things that stuck with me:

**Document decisions, not just code.** ADRs were the single most impactful thing I introduced. Not because the decisions themselves were exceptional, but because writing them down forced clarity, prevented repeated debates, and gave new team members a way to understand _why_ things were the way they were.

**Simple beats clever.** The XState-to-Zustand migration removed 80% of the code. The offline mutation queue is under 200 lines. The Storybook integration is a one-line route file. The best solutions I shipped were the ones that felt almost too simple.

**Match the tool to the problem.** Not every form needs a state machine. Not every animation needs Lottie. Not every image needs to be SVG. Having clear guidelines (even simple ones) removes decision fatigue and lets the team move faster.

**Keep the documentation in the code.** Our ADRs lived in `docs/adr/`, versioned in git, reviewed in pull requests. They stayed current because they were visible. Documentation that lives outside the repo dies.

**Push for change early.** The two things I regret most are things I saw on day one but didn't prioritise. Technical debt doesn't stay constant; it compounds. The earlier you address a structural problem, the cheaper it is. "Too late to change" is a real thing, and it arrives faster than you expect.

---

This series is a retrospective on a year of work on a project I cared deeply about. Every pattern described here was shipped to real users, and every mistake mentioned was one I lived with. If any of these posts save you time, help you avoid a mistake I made, or give you the confidence to push for a change you know is right: that's the point.

[^1]: More on what ADRs are and how to use them: [Ode to ADRs](/blog/ode-to-adrs).

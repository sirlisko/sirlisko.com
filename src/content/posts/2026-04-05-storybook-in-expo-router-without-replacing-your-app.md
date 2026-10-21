---
title: Storybook in Expo Router Without Replacing Your App
description: How to integrate on-device Storybook as an Expo Router route with three layers of production exclusion and zero bundle size impact.
pubDatetime: 2026-04-05
tags:
  - dev
  - react-native
ogImage: https://images.unsplash.com/photo-1576153192396-180ecef2a715?fm=jpg&q=80&w=1280&h=720&fit=crop
toc: true
---

_This post is part of [A Year Building a React Native App with Expo](/blog/a-year-building-a-react-native-app-with-expo), a retrospective series on the decisions and patterns that shaped a production React Native app._

## Introduction

Most React Native Storybook setups follow the same pattern: replace the app's entry point with the Storybook UI. You either swap a root component, toggle a flag that conditionally renders Storybook instead of your app, or maintain a separate build configuration entirely. It works, but it's clunky: you lose your app while browsing stories, you need a rebuild to switch between modes, and it's not something you can easily share with non-developers.

We wanted something different. Our app uses [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing, and we wanted Storybook to be _just another route_. Navigate to `/storybook`, browse components, press back, you're in the app again. No rebuild, no separate entry point, no special build profiles.

The challenge was making this work without leaking Storybook into production builds. We ended up with a three-layer exclusion strategy that guarantees zero bundle size impact in production while making Storybook trivially accessible in development and preview builds.

## The Problem

The app had a growing set of reusable, business-agnostic components in `src/components/` with no way to browse, document, or develop them in isolation. Developers had to run the full app and navigate to specific screens to see a component in context. This slowed down UI development and made it harder for other teams, particularly design, to discover what already existed.

We needed a component catalogue that:

- Allows browsing and interacting with components in isolation
- Runs on-device (iOS/Android) so components render with native behaviour
- Does not ship in production builds
- Integrates with the existing Expo Router setup without a separate build pipeline

## The Route

The entire Storybook route is a single line:

```typescript file=src/app/storybook.tsx
export { default } from "../../.storybook";
```

It re-exports the Storybook UI root, which is configured in `.storybook/index.ts`:

```typescript file=.storybook/index.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  initialSelection: { kind: "Welcome", name: "Overview" },
});

export default StorybookUIRoot;
```

The route is registered in the app's layout, but guarded behind an environment variable:

```typescript file=src/app/_layout.tsx
<Stack.Protected
  key="storybook"
  guard={process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true"}
>
  <Stack.Screen name="storybook" />
</Stack.Protected>
```

When `EXPO_PUBLIC_STORYBOOK_ENABLED` is not `"true"`, the route simply doesn't exist. Navigating to `/storybook` would 404 like any other unregistered route.

## Three Layers of Production Exclusion

This is where things get interesting. A single env var check might feel fragile for keeping Storybook out of production. We wanted defence in depth.

![Three nested layers of production exclusion: Metro bundler stripping (outermost), environment variable check, and route guard (innermost) protecting the Storybook UI](./images/storybook-expo-router/three-layers.svg)

### Layer 1: Route Guard

The `Stack.Protected` wrapper shown above ensures the route is only registered when the env var is set. Even if Storybook code somehow made it into the bundle, there would be no route pointing to it.

### Layer 2: Environment Variable

`EXPO_PUBLIC_STORYBOOK_ENABLED` is only set in two places:

1. The `pnpm storybook` script for local development:

   ```json
   {
     "storybook": "EXPO_PUBLIC_STORYBOOK_ENABLED=true expo start --clear"
   }
   ```

2. The `preview-with-storybook` EAS build profile:

   ```json
   {
     "preview-with-storybook": {
       "extends": "preview",
       "env": {
         "EXPO_PUBLIC_STORYBOOK_ENABLED": "true"
       }
     }
   }
   ```

Production EAS profiles never set it. The base profile explicitly sets it to `"false"`.

### Layer 3: Metro Bundler Stripping

This is the most important layer. In `metro.config.js`, we wrap the config with `@storybook/react-native/metro/withStorybook`:

```javascript file=metro.config.js
const {
  withStorybook,
} = require("@storybook/react-native/metro/withStorybook");

module.exports = withStorybook(config, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
  configPath: path.resolve(__dirname, "./.storybook"),
  onDisabledRemoveStorybook: true,
});
```

The `onDisabledRemoveStorybook: true` flag is the key. When Storybook is disabled, Metro resolves all Storybook imports to empty modules at the bundler level. This means **zero bytes** of Storybook code end up in the production bundle: not the Storybook UI, not the addons, not the story files. It's as if none of it exists.

## Story Colocation

Stories live next to their components:

```bash
Badge/
├── Badge.stories.tsx
├── Badge.test.tsx
└── Badge.tsx
```

This is configured in `.storybook/main.ts`:

```typescript
const main: StorybookConfig = {
  stories: [
    "./stories/**/*.stories.tsx", // Welcome screen and docs
    "../src/components/**/*.stories.tsx", // Colocated component stories
  ],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
    "@storybook/addon-ondevice-backgrounds",
  ],
};
```

From experience, stories that live in a separate `stories/` directory far from the components they document tend to become outdated. Colocation keeps the story file visible whenever you modify a component; it's right there in the same folder, making it natural to update both together.

Story files are excluded from Jest coverage via `jest.config.ts`:

```typescript file=jest.config.ts
collectCoverageFrom: [
  // ...
  "!src/**/*.stories.tsx",
],
```

## Writing Stories

A story file follows the standard `@storybook/react-native` format. Here's a real example from our `Badge` component:

```typescript file=Badge/Badge.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Badge",
  component: Badge,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["info", "error", "success", "disabled"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Info: Story = {
  args: { variant: "info", description: "Information" },
};

export const ErrorBadge: Story = {
  args: { variant: "error", description: "Error occurred" },
};

export const SuccessBadge: Story = {
  args: { variant: "success", description: "Completed" },
};
```

The on-device addons (`controls`, `actions`, `backgrounds`) give you interactive knobs and theme switching directly on the device, which is essential for testing components with native behaviour; shadows, animations, and gestures don't render the same way in a browser-based Storybook.

## The Global Preview

The `.storybook/preview.tsx` file wraps every story with consistent padding and adds background switching between light and dark themes:

```typescript file=.storybook/preview.tsx
import { themeColors } from "@/theme";
import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={tw("flex-1 p-2")}>
        <Story />
      </View>
    ),
    withBackgrounds,
  ],
  parameters: {
    backgrounds: {
      values: [
        { name: "light", value: themeColors.light.background },
        { name: "dark", value: themeColors.dark.background },
      ],
    },
  },
};
```

This pulls the actual theme colours from the app's theme module, so the backgrounds match what users see in production, not arbitrary hex values that might drift over time.

## Dev Menu Shortcut

To make Storybook quick to access during development, we added an item to the Expo dev menu:

```typescript file=src/tools/devMenuItems.ts
{
  name: "Storybook",
  callback: () => router.replace("/storybook"),
},
```

Shake the device (or press `Cmd+D` in the simulator), tap "Storybook", and you're there. No URL to remember, no deep link to type.

## Making It Available to Non-Developers

One of the biggest wins of this approach is the `preview-with-storybook` EAS build profile. When you build with this profile, the resulting app has Storybook enabled; anyone with access to the preview build can browse components on a real device without needing a local development setup.

This is particularly useful for design teams. Instead of describing a component over Slack or sharing static screenshots, you can point someone to the preview build and say "open the dev menu, tap Storybook". They can interact with the component, change its props via the controls addon, and see exactly how it renders on their device.

## Conclusion

Integrating Storybook as an Expo Router route instead of replacing the app entry point gives you the best of both worlds: a component catalogue that lives alongside your app, accessible with a single navigation, and completely invisible in production.

The three-layer exclusion strategy (route guard, environment variable, and Metro bundler stripping) might feel like overkill, but each layer catches a different class of mistake. The route guard prevents navigation. The env var prevents accidental inclusion in build profiles. The Metro stripping prevents any Storybook code from entering the bundle. Together, they make it effectively impossible for Storybook to leak into production.

The setup is minimal (a one-line route file, a Metro config wrapper, and an env var) but the payoff is significant: faster UI development, discoverable components, and a component catalogue that stakeholders can actually use.

---

_Note: This approach uses `@storybook/react-native` v10 with Expo Router v4. The `withStorybook` Metro wrapper and `onDisabledRemoveStorybook` option are specific to the React Native flavour of Storybook; the web version handles bundling differently._

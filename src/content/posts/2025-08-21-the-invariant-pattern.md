---
title: "The Invariant Pattern: Cleaner TypeScript with Assertion Functions"
description: How the invariant pattern can eliminate endless null checks and make your TypeScript code more readable and type-safe.
slug: the-invariant-pattern-cleaner-typescript-with-assertion-functions
pubDatetime: 2025-08-21
tags:
  - dev
---

A few months ago, I joined a new client working on a _React Native_[^1] codebase. The team has a couple of pretty talented people and the codebase is interesting to explore. One pattern they use massively caught my attention: the **invariant pattern**. It's been a while since I wanted to write about this, as I started to quite like it.

## The Problem

How many times have you written code like this?

```typescript
const Resource = () => {
  const { resourceKey } = useLocalSearchParams<{resourceKey: string}>();
  if (!resourceKey) {
    throw new Error("No resource key provided");
  }
  const resource = useResource(resourceKey);
  if(!resource) {
    throw new Error(`The resource with key ${resourceKey} doesn't exist.`);
  }

  // Finally, actual component logic
  return <ResourceView resource={resource} />;
};
```

The endless `if` statements for validation checks clutter the code and force you to handle the same error scenarios repeatedly. TypeScript helps with type safety, but you still need runtime checks to ensure your assumptions hold true.

It could be even worse if those conditions fail silently, you never know something is wrong. TypeScript is happy, your app doesn't crash, but you're missing critical insights about invalid states in your application.

## Enter the Invariant Pattern

An invariant is a condition that must be true at a specific point in your program. The invariant pattern provides a clean way to assert these conditions and narrow TypeScript types simultaneously.

Here's the simplest version:

```typescript
function invariant(condition: unknown, msg?: string): asserts condition {
  if (!condition) {
    // you can even add a centralised console message
    console.error(`Invariant failed${msg ? `: ${msg}` : "."}`);
    throw Error(`Invariant failed${msg ? `: ${msg}` : "."}`);
  }
}
```

Now our previous example becomes:

```typescript
const Resource = () => {
  const { resourceKey } = useLocalSearchParams<{resourceKey: string}>();
  invariant(resourceKey, "No resource key provided");

  const resource = useResource(resourceKey);
  invariant(resource, `The resource with key ${resourceKey} doesn't exist.`);

  // TypeScript now knows resourceKey and resource are defined
  return <ResourceView resource={resource} />;
};
```

The magic happens with TypeScript's `asserts condition` return type. After calling `invariant(resourceKey)`, TypeScript narrows the type from `string | undefined` to `string`. Same with the resource, TypeScript knows it exists after the invariant check.

In _React_ applications, error boundaries can gracefully handle these assertions. In an _API_ context, you can catch invariant failures and return appropriate HTTP status codes. The key is that **you get notified when these conditions fail**, unlike silent defensive programming.

## Libraries for This

If you don't want to roll your own, there are excellent libraries focused on this pattern like [`tiny-invariant`](https://github.com/alexreardon/tiny-invariant).

## Production-Ready Implementation

In a real application, you'll want more sophisticated error handling. Here's a version ready to use in production:

````typescript file=invariant.ts
import { logError } from "./logger";

/**
 * Ensure a condition is true before continuing. E.g:
 *
 * ```ts
 * definitelyExists // string | null | undefined | false
 * invariant(definitelyExists) // Error if `definitelyExists` is falsy
 * definitelyExists // string
 * ```
 */
export function invariant(condition: unknown, msg?: string): asserts condition {
  if (!condition) {
    const error = new Error(`Invariant failed${msg ? `: ${msg}` : "."}`);
    if (process.env.NODE_ENV !== "test") {
      logError(error);
    }
    throw error;
  }
}
````

The logging part handles error monitoring and tracking:

```typescript file=./logger.ts
import { postSentryError } from "./sentry";

export const logError = (error: Error) => {
  console.error(error);
  postSentryError("App error", error);
};
```

You can use _Sentry_, _Dynatrace_, or whatever error monitoring service you prefer. The key is that invariant violations are automatically logged and tracked, giving you visibility into unexpected states in production.

## Why I Love This Pattern

1. **Less boilerplate**: One line instead of if/throw blocks
2. **Better TypeScript**: Automatic type narrowing
3. **Centralised error handling**: All invariant failures go through the same logging pipeline
4. **Readable code**: Clear intent about what conditions must be true
5. **Fail fast**: Issues are caught immediately rather than propagating
6. **Observability**: Unlike silent defensive programming, you get notified when assumptions break

The invariant pattern has significantly cleaned up our codebase and made TypeScript work harder for us. It's one of those simple patterns that, once you start using it, you wonder how you lived without it.

---

[^1]: I honestly thought React Native was dead, but apparently not!

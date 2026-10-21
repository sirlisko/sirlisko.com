---
title: Offline-First Mutations in React Native with Apollo Client
description: How to build a persistent offline mutation queue for React Native apps using Apollo Client, AsyncStorage, and a custom hook that survives app restarts.
pubDatetime: 2026-04-04
tags:
  - dev
  - react-native
ogImage: https://plus.unsplash.com/premium_photo-1664201890375-f8fa405cdb7d?fm=jpg&q=80&w=1280&h=720&fit=crop
toc: true
---

_This post is part of [A Year Building a React Native App with Expo](/blog/a-year-building-a-react-native-app-with-expo), a retrospective series on the decisions and patterns that shaped a production React Native app._

## Introduction

In mobile apps, network connectivity is not a given. Users move between WiFi and cellular, go through tunnels, or simply end up in areas with poor coverage. If your app relies on GraphQL mutations to save data, those mutations need to work, or at least _feel_ like they work, regardless of network state.

At work, we recently migrated a React Native app from a custom GraphQL execution system to [Apollo Client](https://www.apollographql.com/docs/react/). The old system, a custom GraphQL executor, managed a queue of operations via `AsyncStorage`. It had accumulated significant problems over time: complex bugs related to serialization, deduplication, and retry logic; manual cache management that led to duplicate requests; no automatic refetching or cache invalidation; and inconsistent error handling across components. The maintenance burden was high, but it did one thing well: mutations survived app restarts.

We evaluated a few alternatives before settling on Apollo. [TanStack Query](https://tanstack.com/query) is excellent for REST, but it's not purpose-built for GraphQL; it lacks a normalised cache and GraphQL-specific optimizations. [Relay](https://relay.dev/) is powerful but more opinionated, requires specific server-side setup, and has a steeper learning curve that felt like overkill for our needs. Apollo Client was already used successfully in other apps within our monorepo, which meant shared knowledge across teams and proven patterns we could lean on.

Apollo gives you a lot out of the box: normalised caching, automatic refetching, `RetryLink` for transient failures. But its retry mechanism only works within the current session. If the user closes the app while offline, any pending mutations are gone. We needed to bridge that gap.

## The Challenge

When implementing offline mutation support in a React Native application, we faced several challenges:

1. **Persistence**: Mutations must survive app restarts and not just live in memory
2. **Optimistic UI**: Users should see immediate feedback, even when offline
3. **Deduplication**: Double-tapping a button while offline should not result in duplicate mutations
4. **Selective retry**: Only retryable errors (network failures, 5xx) should be queued — client errors (4xx) should surface immediately
5. **Automatic recovery**: When the network comes back, queued mutations should process without user intervention

Apollo's built-in `RetryLink` handles transient failures well. We configured it with exponential backoff to match our previous implementation:

```typescript
const retryLink = new RetryLink({
  delay: {
    initial: 500,
    max: 500 * 4 ** 4, // ~128 seconds
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: error => {
      const statusCode = error?.statusCode;
      return !!error && (!statusCode || statusCode >= 500);
    },
  },
});
```

But `RetryLink` retries are in-memory only. Kill the app and they're lost. We needed something that persists.

## The Solution: Three Layers

We built a three-component system:

1. **`OfflineMutationQueue`** — a class that serializes mutations to `AsyncStorage` with deduplication and retry limits
2. **`useOfflineMutation`** — a drop-in replacement for Apollo's `useMutation` that detects offline state and routes mutations accordingly
3. **A network listener** — watches for connectivity changes and drains the queue when the network returns

![Offline mutation architecture: useOfflineMutation routes online mutations to Apollo Client and offline/5xx mutations to a persistent queue, which drains when the network returns](./images/offline-mutations/architecture.svg)

## OfflineMutationQueue

The queue class handles persistence. Each mutation is serialized as a GraphQL string (via `print` from `graphql`), stored alongside its variables, a timestamp, and a retry counter.

```typescript
import { type DocumentNode, type OperationVariables } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse, print } from "graphql";
import { v4 as uuidv4 } from "uuid";

const MUTATION_QUEUE_KEY = "apollo-mutation-queue";

interface QueuedMutation {
  id: string;
  mutation: string; // Serialized GraphQL string
  variables: OperationVariables;
  timestamp: number;
  retryCount: number;
}
```

### Deduplication

One of the trickiest problems with offline queues is preventing duplicates. If a user taps "Save" twice while offline, you don't want two identical mutations sitting in the queue. We solve this with deterministic variable hashing, sorting object keys before `JSON.stringify` to ensure consistent comparison regardless of key order:

```typescript
const hashVariables = (variables: OperationVariables): string => {
  const sortedKeys = Object.keys(variables).sort();
  const sortedObj = sortedKeys.reduce(
    (acc, key) => {
      acc[key] = variables[key];
      return acc;
    },
    {} as Record<string, unknown>
  );
  return JSON.stringify(sortedObj);
};
```

When enqueuing, we check for duplicates by comparing both the serialized mutation string and the variable hash:

```typescript
async enqueueMutation(
  mutation: DocumentNode,
  variables: OperationVariables,
): Promise<string> {
  const mutationString = print(mutation);
  const queue = await this.getQueue();

  const variablesHash = hashVariables(variables);
  const duplicate = queue.find(
    (qm) =>
      qm.mutation === mutationString &&
      hashVariables(qm.variables) === variablesHash,
  );

  if (duplicate) {
    return duplicate.id; // Return existing ID, don't enqueue again
  }

  const id = uuidv4();
  const queuedMutation: QueuedMutation = {
    id,
    mutation: mutationString,
    variables,
    timestamp: Date.now(),
    retryCount: 0,
  };

  queue.push(queuedMutation);
  await AsyncStorage.setItem(
    MUTATION_QUEUE_KEY,
    JSON.stringify(queue),
  );
  return id;
}
```

### Queue Processing

When the network returns, we iterate through the queue sequentially, executing each mutation against the Apollo Client. Failed mutations get their retry count incremented and stay in the queue, up to a maximum of 5 retries. After that, they're discarded and logged as errors:

```typescript
async processQueue(): Promise<void> {
  if (this.isProcessing) return; // Prevent concurrent processing
  this.isProcessing = true;

  try {
    const queue = await this.getQueue();
    const remainingQueue: QueuedMutation[] = [];

    for (const queuedMutation of queue) {
      try {
        await this.client.mutate({
          mutation: parse(queuedMutation.mutation),
          variables: queuedMutation.variables,
        });
        // Success — mutation is removed from the queue
      } catch (error) {
        queuedMutation.retryCount += 1;
        if (queuedMutation.retryCount < 5) {
          remainingQueue.push(queuedMutation);
        }
        // After 5 retries, the mutation is discarded
      }
    }

    await AsyncStorage.setItem(
      MUTATION_QUEUE_KEY,
      JSON.stringify(remainingQueue),
    );
  } finally {
    this.isProcessing = false;
  }
}
```

The `isProcessing` flag is important: without it, multiple network reconnection events could trigger concurrent queue processing, potentially executing the same mutation twice.

## useOfflineMutation

The hook is designed as a drop-in replacement for Apollo's `useMutation`. Same signature, same return type. The magic happens inside the mutate function:

```typescript
export const useOfflineMutation = <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: MutationHookOptions<TData, TVariables>
): MutationTuple<TData, TVariables> => {
  const { mutationQueue } = useApolloContext();
  const [originalMutate, mutationResult] = useMutation(mutation, options);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const offlineMutate = useCallback(
    async (mutationOptions?) => {
      const variables = mutationOptions?.variables || ({} as TVariables);
      const updateFn = mutationOptions?.update || optionsRef.current?.update;

      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        // OFFLINE: apply optimistic update and queue
        if (updateFn) {
          updateFn(
            mutationQueue.getClient().cache,
            { data: null },
            { variables }
          );
        }
        await mutationQueue.enqueueMutation(mutation, variables);
        return { data: undefined, errors: undefined };
      }

      // ONLINE: try to execute normally
      try {
        return await originalMutate(mutationOptions);
      } catch (error) {
        if (error instanceof ApolloError) {
          const statusCode =
            error.networkError && "statusCode" in error.networkError
              ? error.networkError.statusCode
              : undefined;

          const isRetryable = !statusCode || statusCode >= 500;

          if (isRetryable) {
            // Server error: apply optimistic update and queue
            if (updateFn) {
              updateFn(
                mutationQueue.getClient().cache,
                { data: null },
                { variables }
              );
            }
            await mutationQueue.enqueueMutation(mutation, variables);
            return { data: undefined, errors: error.graphQLErrors };
          }
        }
        // Non-retryable error (4xx, validation) — throw it
        throw error;
      }
    },
    [originalMutate, mutationQueue, mutation]
  );

  return [offlineMutate, mutationResult];
};
```

### Why the ref?

Notice `optionsRef`. Without it, if a consumer passes `options` inline (which is almost always), the `offlineMutate` callback would get a new reference on every render. That would invalidate any `useEffect` that depends on the mutate function, causing infinite loops. The ref breaks the cycle while keeping access to the latest options.

### Optimistic updates only when needed

An important subtlety: the manual `updateFn` call only happens when we're offline or when the mutation fails with a retryable error. When online and the mutation succeeds, Apollo handles the `update` function as normal, calling it with the actual server response. If we applied the optimistic update _and_ Apollo applied the real update, we'd get double-updates. The branching logic prevents that.

### The retryable vs non-retryable distinction

This is a key design decision. Not all errors deserve to be queued:

- **No status code** (network error) → retryable
- **5xx** (server error) → retryable
- **4xx** (client error, validation, auth) → throw immediately

A 400 Bad Request won't magically fix itself on retry. A 503 Service Unavailable probably will.

## The Network Listener

The final piece ties everything together. In our `ApolloContext` provider, we listen for network changes and process the queue when connectivity returns:

```typescript
useEffect(() => {
  if (!apolloInstance) return;

  const unsubscribe = NetInfo.addEventListener(async state => {
    const queueSize = await apolloInstance.mutationQueue.getQueueSize();
    if (state.isConnected && queueSize > 0) {
      await apolloInstance.mutationQueue.processQueue();
      await apolloInstance.client.refetchQueries({ include: "active" });
    }
  });

  return () => unsubscribe();
}, [apolloInstance]);
```

After processing the queue, we also refetch all active queries. This ensures that the UI is consistent with the server state; any data that was modified by the queued mutations gets refreshed.

This is a deliberate design choice: no per-mutation `refetchQueries`. The reconnection handler takes care of it globally, which keeps individual mutation call sites clean and avoids the risk of forgetting to add refetch logic to a new mutation.

## Cache Persistence

For the offline experience to feel complete, queries need to work offline too, not just mutations. We use [`apollo3-cache-persist`](https://github.com/apollographql/apollo-cache-persist) to persist the entire Apollo cache to `AsyncStorage`:

```typescript
const cache = new InMemoryCache();

const persistor = new CachePersistor({
  cache,
  storage: AsyncStorage,
  key: "apollo-cache-persist",
  maxSize: false,
});

await persistor.restore();
```

Combined with `cache-first` fetch policy, this means the app can render meaningful data even when there's no network, and mutations against that cached data get queued for when connectivity returns.

## Usage

Switching from `useMutation` to `useOfflineMutation` is a one-line change:

```typescript
import { useOfflineMutation } from "@/graphql/hooks/useOfflineMutation";

const [updateProfile] = useOfflineMutation(UPDATE_PROFILE_MUTATION, {
  update: (cache, _, { variables }) => {
    // This runs immediately when offline (optimistic update)
    // and normally when online (after server response)
    cache.updateQuery({ query: GET_PROFILE }, data => {
      if (!data) return undefined;
      return {
        ...data,
        profile: { ...data.profile, ...variables },
      };
    });
  },
});
```

The `update` function serves double duty: when online, Apollo calls it after the server responds. When offline, `useOfflineMutation` calls it manually with `{ data: null }` to apply the optimistic update immediately. The user sees the change instantly, and the actual mutation runs when the network returns.

## Limitations and Future Improvements

This approach has some known limitations worth calling out:

1. **No user notification on permanent failure**: If a mutation fails after 5 retries, it's silently discarded. A notification system would improve this.
2. **Potential for stale mutations**: If the server state changes significantly while mutations are queued, the queued mutations might conflict with the new state.
3. **No conflict resolution**: We don't have a last-write-wins or merge strategy. The server's response on retry is final.
4. **No queue expiration**: A mutation queued weeks ago will still attempt to execute. Adding a TTL based on the stored timestamp would prevent truly stale mutations from running.
5. **Sequential processing**: Mutations are processed one at a time. For most apps this is fine, but high-throughput scenarios might benefit from batching.

## Conclusion

Building offline-first support for GraphQL mutations in React Native doesn't require abandoning Apollo Client or bringing in heavy offline frameworks. With a persistent queue backed by `AsyncStorage`, a hook that detects network state, and a listener that drains the queue on reconnection, you get a system that:

- Feels instant to the user, even when offline
- Survives app restarts
- Prevents duplicate mutations
- Distinguishes between retryable and permanent errors
- Requires minimal changes to existing mutation code

The key insight is that Apollo's built-in retry (`RetryLink`) and a persistent offline queue solve different problems. `RetryLink` handles transient failures within a session. The offline queue handles persistence across sessions. You need both.

---

_Note: While this implementation is specific to Apollo Client and React Native, the pattern (persistent queue + optimistic updates + network listener) can be adapted to any GraphQL client or even REST APIs with similar offline requirements._

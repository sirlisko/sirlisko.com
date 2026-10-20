---
title: Efficient API Polling in Redux RTK Query with EtagCacher
description: How to build a reusable caching utility that optimises API requests through ETag tracking and smart polling strategies.
pubDatetime: 2024-03-22
tags:
  - dev
---

> [!NOTE]
> I created a [demo repo](https://github.com/sirlisko/etag-cacher-demo/) showing the `EtagCacher` in action.

## Introduction

When an operation takes time to process on the server, we often need to poll an endpoint until we get the updated data. Polling without any logic, though, means a lot of network traffic and server load for nothing.

At work, we needed a way to track changes to resources that are processed asynchronously. For instance, when a user interacts with the server, the backend might need time to process and confirm it. We wanted a way to poll efficiently until the operation was completed without flooding our servers with unnecessary requests.

## The Challenge

When implementing API polling in a React application using [Redux Toolkit Query (RTK Query)](https://redux-toolkit.js.org/rtk-query/overview), we faced several challenges:

1. **Detecting changes**: How do we know when a resource has been updated?
2. **Avoiding unnecessary requests**: How do we poll only when we are waiting for a change, and stop as soon as it happens?
3. **Managing polling state**: How do we track which resources need polling and which don't?
4. **Handling retry limits**: How do we prevent infinite polling loops when something goes wrong?

A standard approach would be to set up a polling interval using `setInterval` or RTK Query's built-in `pollingInterval`. However, this polls all the time, even when nothing is being processed, wasting bandwidth and server resources.

## Enter EtagCacher

To address these challenges, we built a utility class called `EtagCacher` that uses [HTTP ETags](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag) to optimise polling. An ETag (entity tag) is an HTTP response header that serves as a unique identifier for a specific version of a resource. When the resource changes, its ETag changes too.

Here's how our `EtagCacher` works:

1. It tracks ETags for specific resources.
2. It starts polling only after a mutation, when we know a change is coming.
3. While the ETag stays the same (the operation is still in progress), it fetches again after a delay. As soon as the ETag changes, it stops.
4. It has a retry limit to prevent infinite polling.
5. It can optionally check the response data to decide if polling should continue.

## Implementation

```typescript
import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { TagDescription } from "@reduxjs/toolkit/query";

const DEFAULT_OPTIONS = {
  maxRetries: 5,
  retryDelay: 1000,
};

// Define interface matching RTK Query's API structure
interface ApiWithInvalidateTags<TagType extends string = string> {
  util: {
    invalidateTags: (
      tags: Array<TagType | TagDescription<TagType> | null | undefined>
    ) => UnknownAction;
  };
}

/**
 * EtagCacher - A utility for implementing efficient polling with ETag-based caching
 *
 * This class provides a mechanism to intelligently poll an API based on ETag changes
 * and custom conditions. It helps reduce unnecessary network requests by monitoring
 * server responses for changes indicated by ETags.
 *
 * Features:
 * - ETag-based change detection
 * - Configurable polling with retry limits
 * - Support for custom "pending" state detection
 * - Seamless integration with RTK Query
 *
 * @template T - The API type with invalidateTags method (typically an RTK Query API)
 * @template K - The type of data elements being polled (used for status checking)
 * @template TagType - The type of cache tags used by the API
 */
export class EtagCacher<
  T extends ApiWithInvalidateTags<TagType>,
  K = undefined,
  TagType extends string = string,
> {
  cache: Record<string, { etag: string; poll: boolean; retry: number }>;

  /**
   * Creates a new EtagCacher instance
   *
   * @param tag - The cache tag to use for invalidation
   * @param api - The API instance with invalidateTags method
   * @param options - Configuration options for the cacher
   * @param options.maxRetries - Maximum number of retry attempts (default: 5)
   * @param options.retryDelay - Delay between retries in ms (default: 1000)
   * @param options.isStatusPending - Function to determine if an item is in pending status
   */
  constructor(
    private tag: TagType,
    private api: T,
    private options: {
      maxRetries?: number;
      retryDelay?: number;
      isStatusPending?: (element: K) => boolean;
    } = {}
  ) {
    this.cache = {};
    this.api = api;
    this.tag = tag;
    this.options = options;
  }

  /**
   * Checks the ETag against the cached value and determines if polling should continue
   *
   * This method is called when a response is received from the API. It compares the
   * received ETag with the cached one and checks if any data items are in pending state.
   * Based on these conditions, it either continues polling or stops.
   *
   * @param dispatch - The Redux dispatch function
   * @param key - The cache key to use (typically a resource identifier)
   * @param etag - The ETag received from the server
   * @param data - Optional array of data items to check for pending status
   */
  checkEtag(
    dispatch: ThunkDispatch<unknown, unknown, UnknownAction>,
    key: string,
    etag: string,
    data?: K[]
  ) {
    if (
      this.cache[`${this.tag}.${key}`] &&
      this.cache[`${this.tag}.${key}`].poll &&
      (etag === this.cache[`${this.tag}.${key}`].etag ||
        (data &&
          this.options.isStatusPending &&
          data.some(this.options.isStatusPending))) &&
      this.cache[`${this.tag}.${key}`].retry <
        (this.options.maxRetries ?? DEFAULT_OPTIONS.maxRetries)
    ) {
      setTimeout(
        () => dispatch(this.api.util.invalidateTags([this.tag])),
        this.options.retryDelay ?? DEFAULT_OPTIONS.retryDelay
      );
      this.cache[`${this.tag}.${key}`].retry += 1;
    } else {
      this.cache[`${this.tag}.${key}`] = { etag, poll: false, retry: 0 };
    }
  }

  /**
   * Initiates polling for a specific cache key
   *
   * Call this method to start the polling process, typically after
   * a mutation that requires waiting for backend processing.
   *
   * @param key - The cache key to poll
   */
  setPoll(key: string) {
    this.cache[`${this.tag}.${key}`] = {
      ...this.cache[`${this.tag}.${key}`],
      poll: true,
      retry: 0,
    };
  }

  /**
   * Explicitly stops polling for a specific cache key
   *
   * @param key - The cache key to stop polling
   */
  stopPolling(key: string): void {
    const cacheKey = `${this.tag}.${key}`;
    if (this.cache[cacheKey]) {
      this.cache[cacheKey].poll = false;
    }
  }

  /**
   * Gets the current polling status for a specific cache key
   *
   * @param key - The cache key to check
   * @returns Object containing polling status and retry count, or null if no entry exists
   */
  getPollStatus(key: string): { polling: boolean; retries: number } | null {
    const cacheKey = `${this.tag}.${key}`;
    const entry = this.cache[cacheKey];

    if (!entry) return null;

    return {
      polling: entry.poll,
      retries: entry.retry,
    };
  }
}
```

### Key Features

- **Generic Types**: The class uses TypeScript generics to work with any Redux API and data structure.
- **Configurable Retry Logic**: You can set custom `maxRetries` and `retryDelay` values.
- **Data-Driven Polling**: The optional `isStatusPending` callback allows polling based on the content of the response, not just the ETag.
- **Tag-Based Invalidation**: Works with RTK Query's tag-based cache invalidation.
- **Helper Methods**: `stopPolling` and `getPollStatus` for more control over the polling process.

## Practical Usage Example

Here's how we integrate the `EtagCacher` with our Redux RTK Query API:

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EtagCacher } from "./eTagCacher";

export interface Todo {
  id: string;
  title: string;
  status: "pending" | "completed" | "failed";
}

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    responseHandler: async response => {
      const data = await response.json();
      return {
        data,
        meta: {
          etag: response.headers.get("ETag") || "",
        },
      };
    },
  }),
  tagTypes: ["Todos"],
  endpoints: builder => ({
    getTodos: builder.query<{ data: Todo[]; meta: { etag: string } }, void>({
      query: () => "todos",
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          todosCacher.checkEtag(dispatch, "global", result.data.meta.etag);
        } catch (e) {
          console.error(e);
        }
      },
      providesTags: ["Todos"],
    }),
    updateTodoStatus: builder.mutation<
      { success: boolean },
      { id: string; status: Todo["status"] }
    >({
      query: ({ id, status }) => ({
        url: `todos/${id}`,
        method: "PUT",
        body: { status },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          todosCacher.setPoll("global");
        } catch (e) {
          console.error(e);
        }
      },
      invalidatesTags: ["Todos"],
    }),
    addTodo: builder.mutation<Todo, { title: string }>({
      query: newTodo => ({
        url: "todos",
        method: "POST",
        body: newTodo,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          todosCacher.setPoll("global");
        } catch (e) {
          console.error(e);
        }
      },
      invalidatesTags: ["Todos"],
    }),
  }),
});

// Initialize the EtagCacher with proper types
export const todosCacher = new EtagCacher("Todos", todosApi);

export const {
  useGetTodosQuery,
  useUpdateTodoStatusMutation,
  useAddTodoMutation,
} = todosApi;
```

### How It Works

1. **Initial Setup**: We create an instance of `EtagCacher` with the API and tag name.
2. **Setting Up Polling**: After a mutation (like `addTodo`), we call `todosCacher.setPoll("global")` to mark that resource for polling.
3. **Checking for Changes**: In the `getTodos` query, we call `todosCacher.checkEtag()` with the current ETag.
4. **Smart Retries**: If the ETag hasn't changed and we're under the retry limit, it schedules another request after the delay period.
5. **Automatic Termination**: Once the ETag changes (indicating the resource has updated) or we reach the retry limit, polling stops.

## When to Use EtagCacher

This utility is particularly useful in scenarios such as:

1. **Asynchronous Operations**: When the backend needs time to process a request (e.g., payment processing, batch operations)
2. **Event-Driven Systems**: When you need to wait for an event to complete before showing the result
3. **Status Tracking**: When tracking the status of a long-running operation
4. **Optimising Polling**: When you want to reduce unnecessary API calls while still keeping data fresh

## Limitations and Considerations

EtagCacher has some limitations:

1. **Server Support**: The server must support and return proper ETags.
2. **Memory Usage**: The utility keeps the state in memory, which could grow larger if tracking many resources.
3. **Component Unmounting**: If a component unmounts, polling will continue until the retry limit is reached.
4. **Network Issues**: Network interruptions can affect the polling mechanism.

## Conclusion

`EtagCacher` lets us poll only when we are waiting for a change, and stop as soon as it happens. It uses HTTP ETags and RTK Query's tag-based invalidation, so it needs very little code in each endpoint.

For us, it cut down API traffic a lot, because we poll only after a mutation and stop once the operation completes or hits the retry limit.

---

_Note: While this implementation is tailored to Redux Toolkit Query, the concept can be adapted to other state management and API fetching libraries with similar principles._

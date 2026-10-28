---
title: "The Right Tool for the Job: Replacing XState with Zustand"
description: How we reduced state management code by 80% by recognising that a finite state machine was the wrong abstraction for what was fundamentally simple CRUD state.
pubDatetime: 2026-04-03
tags:
  - dev
  - react-native
ogImage: https://images.unsplash.com/photo-1731694411560-050e5b91e943?fm=jpg&q=80&w=1280&h=720&fit=crop
replyPrompt: "Have you ever picked a tool that was too big for the job?"
toc: true
series: "A Year Building a React Native App with Expo"
---

_This post is part of [A Year Building a React Native App with Expo](/blog/a-year-building-a-react-native-app-with-expo), a retrospective series on the decisions and patterns that shaped a production React Native app._

## Introduction

[XState](https://stately.ai/docs/xstate) is a fantastic library. Finite state machines are a powerful abstraction for modelling complex, stateful systems: login flows with retries and timeouts, multi-step wizards with branching paths, real-time collaboration protocols. When the problem genuinely has discrete states and guarded transitions, XState makes the impossible states impossible.

But not every problem needs a state machine.

When I joined the team working on a React Native app, I found XState powering the retirement calculator, a feature that lets users model retirement scenarios by tweaking inputs like income, pensions, and savings. The implementation included a state machine (`calculator.ts`), supporting files for actions, helpers, selectors, and a context provider. It was thorough. It was also significantly more complex than the problem required.

This is not about XState being a bad choice in general. It's about recognising when a powerful tool has been applied to a problem that doesn't need its power, and having the discipline to simplify.

## What We Found

The calculator's state management had several pain points:

1. **Disproportionate complexity**: The state machine with its state transitions, guards, and actions was difficult to understand for team members not familiar with XState patterns. New developers faced a steep learning curve just to make changes to what was fundamentally a form.

2. **Over-abstraction**: Most of the calculator's operations were simple data transformations and API calls. Storing a base scenario, applying modifiers, calling a calculation engine, storing the result. There were no truly concurrent states, no complex transition guards, no states that needed to be "impossible".

3. **Testing overhead**: Testing required understanding XState's testing utilities and modelling state transition scenarios. The tests were testing the _machine_ rather than the _behaviour_.

4. **Bundle size**: XState added overhead for functionality that could be achieved more simply.

The calculator primarily needed:

- Simple state persistence (base scenario and last modified scenario)
- Derived calculations (default values from previous scenarios)
- Basic CRUD operations for modifiers
- Straightforward data transformations

That's a store. Not a state machine.

## The Migration

We replaced the XState implementation with [Zustand](https://zustand-demo.pmnd.rs/), a minimal state management library that the app was already using for other stores. The migration had three parts.

### 1. A Simple Store

The new store maintains just the essential state:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StoreState {
  forecast: number | null;
  // ... base and modified scenarios
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      forecast: null,
      // ... initial state and setters
    }),
    {
      name: "my-app",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
```

Zustand's `persist` middleware handles AsyncStorage serialization, rehydration on app startup, and versioned storage (all things the XState implementation had to manage manually with custom actions and reducers).

### 2. Business Logic as Pure Functions

The key architectural decision was extracting the calculation logic into a standalone utility (`calculator-engine.ts`) rather than encoding it as state machine actions:

```typescript
export const transformInput = (
  input: UserInputDetails & { modifiers?: Modifier[] }
): CalculateInput => {
  const userState = getUserStoreState();
  // Transform form data into calculator-engine format
  // Read user DOB from store, structure inputs, return CalculateInput
};

export const getRetirementIncomeRounded = async (
  input: CalculateInput
): Promise<CalculateSuccess | CalculateError> => {
  const result = await getRetirementIncome(input);
  if (result.tag === "success") {
    return {
      ...result,
      retirementIncome: roundToNearest500(result.retirementIncome),
      pensionFund: roundToNearest500(result.pensionFund),
    };
  }
  return result;
};
```

These are plain functions. They can be called from any component, tested with simple input/output assertions, and composed without understanding state machine semantics. No guards, no transitions, no events: just data in, data out.

### 3. Simplified Component Integration

Components went from XState hooks and context providers:

```typescript
// Before: XState
const [state, send] = useMachine(calculatorMachine);
const forecast = state.context.forecast;
send({ type: "UPDATE_MODIFIER", modifier: { ... } });
```

To standard Zustand selectors:

```typescript
// After: Zustand
const forecast = useStore(s => s.forecast);
const result = await getRetirementIncomeRounded(transformInput(formData));
```

No context providers wrapping the component tree. No event objects to construct. No state machine context to navigate.

## What We Removed

- `src/lib/machines/calculator.ts` — the state machine
- `src/lib/machines/actions.ts` — machine actions
- `src/lib/machines/helpers.ts` — machine helpers
- `src/lib/machines/calculator-selectors.ts` — state selectors
- `src/contexts/CalculatorContext.tsx` — context provider
- All associated test files

## What We Added

- A few lines in the existing Zustand store
- `src/lib/utils/calculator-engine.ts` — pure utility functions

The net result was approximately **80% less state management code**. We also removed the XState and `@xstate/react` dependencies entirely.

## The Broader Pattern

After this migration, the app ended up with a clean state management architecture with three tools, each owning a clear boundary:

- **Zustand** for client-local state that needs persistence — user profile, onboarding progress, pension data, calculator results. Four stores, all using the `persist` middleware with AsyncStorage and a consistent hydration pattern.
- **Apollo Client** for server-synced state via GraphQL — queries, mutations, normalised cache.
- **Apollo reactive variables** (`makeVar`) for ephemeral state tied to the GraphQL layer — temporary UI state that doesn't need persistence or complex actions.

We explicitly evaluated consolidating everything into Apollo reactive variables to reduce tooling. We decided against it: reactive variables have no persistence, no hydration, and no action patterns. We'd be hand-rolling what Zustand provides out of the box. Two tools with a clear boundary is better than one tool doing everything poorly.

The guideline is simple: if it needs persistence or complex actions, it goes in Zustand. If it's ephemeral and tied to GraphQL operations, it can be a reactive variable. If it comes from the server, Apollo owns it. When in doubt, Zustand.

## Trade-offs

We lost some things in the migration:

- **No impossible states**: Zustand doesn't prevent invalid state combinations the way a state machine does. There's more responsibility on developers to maintain consistency.
- **No transition documentation**: A state machine diagram _is_ the documentation. With Zustand, the flow lives in component code and utility functions, which is less visual.
- **Manual validation**: Guards and transitions enforce rules automatically. Without them, validation is explicit code you have to write and maintain.

For the Calculator, these trade-offs were acceptable. The feature doesn't have complex branching states or concurrent modes. Its "states" are really just "has data" and "doesn't have data". A state machine was expressing a trivial transition graph with heavyweight machinery.

## When _Would_ I Use XState?

This isn't an anti-XState post. I'd reach for it when:

- The feature has **genuinely discrete states** with meaningful transitions (e.g., a payment flow: idle → processing → success/failure → retry)
- There are **guards that prevent illegal transitions** (e.g., can't submit without validation, can't go back from a terminal state)
- The **state diagram itself is valuable documentation** that stakeholders or other engineers need to understand
- **Concurrent states** are involved (e.g., a video player that's simultaneously loading, buffering, and tracking playback)

None of these applied to a retirement calculator that stores two scenarios and calls a function.

## Conclusion

The lesson here isn't "Zustand is better than XState". It's that **matching the tool to the problem's actual complexity matters more than the tool's theoretical power**. Finite state machines are a beautiful abstraction. Use them when the problem genuinely is one. For everything else, the simplest tool that solves the problem is the right one.

When I found the XState implementation, it wasn't broken. It worked. But it was making a simple problem feel complex, and that complexity was slowing the team down. Sometimes the most impactful refactor isn't adding something clever; it's removing something that was too clever for the job.

---

_Note: If you're evaluating whether your XState usage is justified, ask yourself: "Does this feature have states that are meaningfully different from each other, with transitions that need to be guarded?" If the answer is "not really", you might be over-engineering._

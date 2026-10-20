---
title: "Accessibility in React Native: Beyond the Checklist"
description: Practical approaches to building accessible React Native apps, from screen readers and font scaling to testing tools like Accessibility Inspector, VoiceOver, and BrowserStack.
pubDatetime: 2026-04-07
tags:
  - dev
  - react-native
ogImage: https://images.unsplash.com/photo-1600202751116-3e0226e1e7a0?fm=jpg&q=80&w=1280&h=720&fit=crop
---

_This post is part of [A Year Building a React Native App with Expo](/blog/a-year-building-a-react-native-app-with-expo), a retrospective series on the decisions and patterns that shaped a production React Native app._

## Table of contents

## Introduction

Accessibility in mobile apps tends to fall into one of two categories: either it's treated as a compliance checkbox at the end of a project, or it's ignored entirely until someone raises it. Both approaches produce the same result: an app that technically works but is unusable for a significant portion of your audience.

Over the past year, I worked on a React Native app where accessibility was part of building each feature, not a separate workstream. The app serves users planning for retirement, a demographic that skews older and is more likely to rely on larger text, screen readers, and high-contrast settings. Getting accessibility wrong wasn't just a nice-to-have concern; it meant locking out the people the app was built for.

This post covers the practical side: how to think about accessibility in React Native, how to test it, and the specific problems I ran into and solved.

## The Three Pillars

Accessibility in React Native broadly comes down to three things:

### 1. Screen Reader Support

VoiceOver (iOS) and TalkBack (Android) need to be able to navigate your app meaningfully. This means:

- **Every interactive element needs a label.** Buttons, links, inputs — anything a user can tap needs an `accessibilityLabel` that describes what it does, not what it looks like. "Submit form" not "Blue button".
- **Decorative elements should be hidden.** Images that don't convey information, dividers, background shapes — these should have `accessibilityElementsHidden` (iOS) or `importantForAccessibility="no"` (Android) so the screen reader skips them.
- **Reading order matters.** Screen readers traverse the accessibility tree linearly. If your visual layout doesn't match the logical reading order, users get a confusing experience.

One problem I ran into early was with carousels. The app had a custom carousel where off-screen slides were still in the accessibility tree. A VoiceOver user would hear content from slides they couldn't see, with no way to know it was off-screen. The fix was marking non-visible carousel items as inaccessible to screen readers:

```typescript
accessibilityElementsHidden={!isVisible}
importantForAccessibility={isVisible ? "yes" : "no-hide-descendants"}
```

After we standardised on `react-native-reanimated-carousel`, this was handled by the library, but it's the kind of issue that only surfaces when you actually test with a screen reader.

### 2. Font Scaling

Users with visual impairments often increase their device's font size. iOS and Android both support system-level font scaling, and React Native respects it by default: `<Text>` components scale with the system setting. But "respects it" and "works well with it" are different things.

At high font scales (1.7x and above), layouts break. Text overflows containers, buttons become too small relative to the text, and fixed-height elements clip their content. We built a `useLargeText` hook to detect when the user has large text enabled and adapt layouts accordingly:

```typescript
const FONT_SCALE_THRESHOLD = 1.7;
export const MAX_CAPPED_FONT_SCALE = 2.143;

export const useLargeText = (options?: { threshold?: number }): boolean => {
  const { fontScale } = useWindowDimensions();
  return useMemo(
    () => fontScale >= (options?.threshold ?? FONT_SCALE_THRESHOLD),
    [fontScale, options?.threshold]
  );
};
```

The `MAX_CAPPED_FONT_SCALE` of 2.143 aligns with iOS accessibility settings; we found that setting it to exactly 2.0 caused clashing with custom line heights. This was one of those issues that only appeared on a real device with accessibility settings enabled; it was invisible in the simulator at default font scale.

Where we use this:

- **Navigation headers**: At high font scales, the title and back button need more vertical space. We scale the header height proportionally: `NAV_BAR_HEIGHT * Math.min(fontScale, 1.5)`.
- **Footers with buttons**: At large text, we move the footer into the scroll view so it doesn't eat half the screen.
- **Input fields**: We cap `maxFontSizeMultiplier` on text inputs so they remain usable at extreme scales.

### 3. Navigation and Focus

When a screen transition happens, the screen reader's focus should move to the new content. When a modal opens, focus should be trapped inside it. When an error appears, the screen reader should announce it. React Native's accessibility APIs handle some of this automatically with navigation libraries, but custom transitions and modals need explicit focus management.

We added `accessibilityLabel` to navigation elements and ensured that error states were announced:

```typescript
<View
  accessible
  accessibilityRole="alert"
  accessibilityLabel={`Error: ${errorMessage}`}
>
  <ErrorMessage>{errorMessage}</ErrorMessage>
</View>
```

## How to Test

Testing accessibility is where most teams fall short, not because they don't care, but because they don't know what tools exist. Here's what we used.

### Accessibility Inspector (Xcode)

This is the most underused tool in the iOS ecosystem. Open Xcode, go to **Xcode > Open Developer Tool > Accessibility Inspector**. It shows you the accessibility tree of your running app: every element, its label, role, traits, and frame.

You can point it at the iOS simulator and inspect any element. It tells you:

- What the screen reader will announce for each element
- Whether elements are properly grouped or orphaned
- Missing labels on interactive elements
- Elements that are unnecessarily in the accessibility tree

I used this as a first pass on every screen. It's faster than running VoiceOver and catches most structural issues. If an element shows up in the Inspector without a meaningful label, it needs fixing before you even start testing with a screen reader.

### VoiceOver (iOS)

The real test. Turn on VoiceOver (Settings > Accessibility > VoiceOver on a device, or `Cmd+F5` in the simulator) and navigate your app without looking at the screen.

Things that Accessibility Inspector can't catch but VoiceOver reveals:

- **Reading order issues**: The visual layout might look logical, but the accessibility tree traversal might jump around unexpectedly.
- **Missing context**: A button that says "Delete" is meaningless without context. VoiceOver users need "Delete pension, Scottish Widows" — the label needs to include what's being deleted.
- **Gesture conflicts**: Custom gestures (swipe to delete, pinch to zoom) can conflict with VoiceOver's navigation gestures.
- **Timing issues**: Animations, auto-advancing carousels, and timed content are hostile to screen reader users. If content changes while someone is trying to read it, they're lost.

I made it a habit to VoiceOver-test any screen I worked on before marking it as done. It adds 5-10 minutes per screen and catches issues that no automated tool will find.

### TalkBack (Android)

The Android equivalent. The UX is different from VoiceOver; TalkBack uses different gestures and announces elements slightly differently, so testing on both platforms matters. The most common issue I found was that `accessibilityLabel` values that worked well for VoiceOver sounded awkward or redundant with TalkBack's default announcements.

### BrowserStack Accessibility Testing

For testing on devices you don't have physically, [BrowserStack](https://www.browserstack.com/) provides real device access with accessibility tools. This was particularly useful for testing on older Android devices where TalkBack behaviour differs from the latest version, and for verifying that font scaling worked across different screen sizes and densities.

BrowserStack also provides automated accessibility audits that flag common issues: missing labels, insufficient contrast, touch targets that are too small. It's not a replacement for manual testing, but it catches the low-hanging fruit.

### Manual Device Testing

There's no substitute for testing on a real device with actual accessibility settings enabled. Some issues only manifest on physical hardware:

- Font scaling behaviour differs between simulator and device, especially at extreme scales
- VoiceOver and TalkBack have subtly different behaviour on simulators vs real devices
- Haptic feedback, which some accessibility users rely on, only works on physical devices

We kept a test device with large text enabled and VoiceOver active specifically for accessibility testing.

## Common Issues and Fixes

A few patterns that came up repeatedly:

### Touch Targets Too Small

Apple's Human Interface Guidelines recommend a minimum touch target of 44x44 points. At default font scale, this is usually fine. At large font scales, the text grows but the touch target often doesn't. We ensured minimum `hitSlop` or `minHeight`/`minWidth` on interactive elements.

### Flat Lists and Accessibility

`FlatList` and `ScrollView` create interesting challenges for screen readers. Items that scroll off-screen are still in the accessibility tree by default. For long lists, this means the screen reader announces dozens or hundreds of items. We used `accessibilityElementsHidden` on items that were far from the visible area.

### Images Without Alt Text

Every `<Image>` component should have either an `accessibilityLabel` (if it conveys information) or `accessible={false}` (if it's decorative). This is the most common accessibility violation, and the easiest to fix.

### Form Error Announcements

When a form validation error appears, sighted users see a red message below the field. Screen reader users see nothing unless you explicitly announce the error. We used `accessibilityRole="alert"` on error containers, which triggers an automatic announcement when the error appears.

## Making It Stick

The hardest part of accessibility isn't the implementation; it's making it a sustained practice rather than a one-time effort. A few things helped:

- **Test with VoiceOver as part of the definition of done.** Not "run Accessibility Inspector", but actually navigate the feature with a screen reader.
- **Keep a device with accessibility settings enabled.** If it's always there, you'll use it. If you have to configure it every time, you won't.
- **Fix issues immediately.** Accessibility bugs are like test failures — they're easy to fix when you wrote the code, and painful to fix three months later when someone else reports them.
- **Use the platform's native components when possible.** The native Stack navigator header, standard `TextInput`, built-in `Alert`: these all have accessibility behaviour built in. Custom implementations need to replicate all of it.

That last point was a lesson I learned the hard way on this project. The app's custom header component reimplemented navigation accessibility that the native Stack header provides for free. The more you lean on the platform, the less accessibility work you have to do yourself.

## Conclusion

Accessibility isn't a separate feature. It's a quality of the features you're already building. Every screen you ship either works for everyone or it doesn't, and "everyone" includes people who can't see the screen, people who need larger text, and people who navigate by voice.

The tools exist. Accessibility Inspector takes 30 seconds to open. VoiceOver is a toggle. The investment is 5-10 minutes per screen, and the payoff is an app that works for your entire audience rather than just the subset that happens to have good eyesight and steady hands.

For a retirement planning app, this wasn't optional. But honestly, it shouldn't be optional for any app.

---

_Note: This post focuses on React Native with Expo, but the principles (screen reader testing, font scaling, focus management) apply to any mobile framework. The tools change; the approach doesn't._

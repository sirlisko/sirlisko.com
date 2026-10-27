---
title: Asset Format Strategy for React Native Apps
description: A practical guide to choosing between WebP, SVG, Lottie, and compressed MP4 in React Native with Expo, and when to use each.
pubDatetime: 2026-04-06
tags:
  - dev
  - react-native
ogImage: https://images.unsplash.com/photo-1516635572575-84ee3373085c?fm=jpg&q=80&w=1280&h=720&fit=crop
toc: true
series: "A Year Building a React Native App with Expo"
---

_This post is part of [A Year Building a React Native App with Expo](/blog/a-year-building-a-react-native-app-with-expo), a retrospective series on the decisions and patterns that shaped a production React Native app._

## Introduction

As a React Native app grows, so does its collection of images: icons, illustrations, photographs, animations. Without clear guidelines, developers make ad-hoc format choices: someone adds a PNG for an icon, someone else exports a complex illustration as SVG, another person drops a GIF where a Lottie would be half the size. Over time, the bundle bloats and the asset folder becomes inconsistent.

At work, we reached a point where our app had a mix of PNGs, JPEGs, SVGs, and the occasional GIF, with no consistent rationale for which format was used where. We needed to formalise the decision into something the whole team could follow without thinking too hard about it.

The result was a simple content-based selection strategy: **SVG for vectors, WebP for rasters, Lottie for complex animations, compressed MP4 for video**. That's the short version. The rest of this post is the longer version: the reasoning, the tooling, and how it all fits together in a React Native app using Expo.

## The Formats

### WebP

[WebP](https://developers.google.com/speed/webp) is a modern raster format that provides excellent compression compared to PNG and JPEG, often 25-50% smaller at equivalent visual quality. It supports both lossy and lossless compression, transparency, and even animation (as a GIF replacement).

**Good for:** photographs, photorealistic artwork, rasterised content, CMS-loaded images.

**Not good for:** anything that needs to scale across screen densities without quality loss. A WebP image at 2x looks fuzzy on a 3x display, just like any raster.

### SVG

SVG is a vector format that scales infinitely without quality loss. A 24px icon and a full-screen illustration render from the same file with no degradation. When optimised with [SVGO](https://github.com/svg/svgo), SVGs are often smaller than their raster equivalents for non-photographic content.

**Good for:** icons, illustrations, UI elements, anything requiring dynamic styling (colour changes based on theme or state).

**Not good for:** photographs or photorealistic images. An SVG of a photograph would be enormous and defeat the purpose.

### Lottie

[Lottie](https://lottiefiles.com/) renders After Effects animations exported as JSON. It's purpose-built for complex, multi-step animations (loading spinners, onboarding sequences, micro-interactions) where frame-by-frame animation would be impractical as SVG or prohibitively large as video.

**Good for:** complex animations with timing, loading states, multi-step sequences.

**Not good for:** static images (overkill) or simple animations achievable with CSS/SVG transforms.

### Compressed MP4

Video assets (onboarding sequences, background loops, explainer clips) are the heaviest files in any app bundle. Unlike images, there's no alternative format debate: MP4 with H.264 is the universal choice. The question is how aggressively to compress.

We use [ffmpeg](https://ffmpeg.org/) with a standard command for all bundled videos:

```bash
ffmpeg -i input.mp4 -vf "scale=1080:-2" -crf 28 -an -movflags +faststart -y output.mp4
```

- `scale=1080:-2` — scales to 1080px wide, which is near 1:1 on 3x retina devices. Don't go below 720px for foreground content.
- `-crf 28` — the quality/size balance. Use 24–26 for detailed content, up to 30 for simple motion graphics.
- `-an` — strips audio. Most of our bundled videos are decorative and don't need a soundtrack.
- `-movflags +faststart` — moves the MP4 metadata to the beginning of the file, enabling instant playback without buffering the whole file first.

For videos used as **backgrounds or behind masks/overlays**, you can push compression further: lower resolution (`scale=720:-2` or `scale=480:-2`), higher CRF (`-crf 30` or `-crf 32`), and lower frame rate (`-r 20`). These videos are partially obscured anyway, so the quality loss is invisible.

Always verify on-device: if it looks too soft, dial back one setting at a time. And keep original source files outside the repo; this compression is lossy and irreversible.

**Good for:** onboarding sequences, background loops, explainer content, any motion content too complex for Lottie.

**Not good for:** content that needs to be pixel-perfect or where audio matters (consider streaming instead of bundling).

## The Decision Matrix

This is the mental model the team follows:

| Content Type       | Format         | Reasoning                                    |
| ------------------ | -------------- | -------------------------------------------- |
| Icons              | SVG            | Scales perfectly, small file size, themeable |
| Illustrations      | SVG            | Scales perfectly, optimise with SVGO         |
| Photographs        | WebP           | Only viable option for photographic content  |
| Rasterised artwork | WebP           | Content that originated as raster            |
| Complex animations | Lottie         | Purpose-built for animation, small file size |
| Video content      | Compressed MP4 | ffmpeg with CRF 28, faststart, no audio      |

If you're unsure, ask yourself: _"Is this a photograph?"_ If yes, WebP. _"Does this need to animate with multiple steps or timing?"_ If yes, Lottie. _"Is this real video footage or a long motion sequence?"_ If yes, compressed MP4. Everything else is probably SVG.

## Implementation in Expo

Our app uses three libraries, each matched to a format:

- [`expo-image`](https://docs.expo.dev/versions/latest/sdk/image/) for WebP (and any raster format)
- [`react-native-svg`](https://github.com/software-mansion/react-native-svg) + [`react-native-svg-transformer`](https://github.com/kristerkari/react-native-svg-transformer) for SVG
- [`lottie-react-native`](https://github.com/lottie-react-native/lottie-react-native) for Lottie animations
- [`phosphor-react-native`](https://github.com/duongdev/phosphor-react-native) for iconography (SVG-based)

### SVG as Components

The `react-native-svg-transformer` is configured in `metro.config.js` so that SVG imports resolve as React components:

```typescript
import BullseyeIcon from "@/assets/vectors/bullseye.svg";

<BullseyeIcon color="red" width={24} height={24} />
```

This means SVGs can be styled dynamically: you can change their colour based on theme, resize them via props, and treat them like any other component. No need for multiple sizes or colour variants of the same icon.

### WebP with expo-image

For raster images, `expo-image` handles WebP natively with built-in caching, transitions, and lazy loading:

```typescript
import { Image } from "expo-image";
import HERO_IMAGE from "@/assets/images/hero.webp";

<Image
  source={HERO_IMAGE}
  style={tw("h-64 w-full")}
  contentFit="cover"
  transition={300}
/>
```

### Lottie Animations

Complex animations use `lottie-react-native` with JSON or `.lottie` files:

```typescript
import LottieView from "lottie-react-native";
import animatedLogo from "@/assets/animations/animatedLogo.json";

<LottieView source={animatedLogo} autoPlay loop style={tw("h-[122px] w-full")} />
```

## File Organisation

Assets are organised by format in a predictable structure:

```bash
src/assets/
├── animations/       # Lottie JSON / .lottie files
├── images/           # WebP raster images
├── vectors/          # SVG files (imported as components)
└── videos/           # Compressed MP4 files
```

This isn't just cosmetic. It makes it immediately obvious where to put a new asset and what format it should be in. If you're about to add a file to `vectors/` and it's a photograph, something is wrong. The folder structure itself enforces the strategy.

In our app, this breaks down to roughly 70 WebP images, 50 SVG vectors, and 12 Lottie animations, with only 6 legacy PNGs remaining that predate the strategy.

## Converting Existing Assets

When we formalised this strategy, the app already had a mix of formats. Converting was straightforward with two CLI tools.

### PNG/JPEG to WebP

[ImageMagick](https://imagemagick.org/) handles raster conversion (I wrote about a [bulk conversion function](/blog/bulk-image-conversion-to-webp-with-a-simple-zsh-function) previously):

```bash
magick input.png -quality 80 -define webp:method=6 output.webp
```

- `-quality 80`: good balance between file size and visual quality
- `-define webp:method=6`: best compression method (slower encoding, smaller output)

For pixel-perfect output where lossy compression isn't acceptable:

```bash
magick input.png -define webp:lossless=true output.webp
```

### Optimising SVGs

[SVGO](https://github.com/svg/svgo) strips unnecessary metadata, comments, and redundant attributes:

```bash
svgo input.svg
```

This is especially important for SVGs exported from Figma or Illustrator, which tend to include a lot of cruft that inflates file size without any visual impact.

### Compressing Videos

[ffmpeg](https://ffmpeg.org/) handles video compression. The standard command for bundled assets:

```bash
ffmpeg -i input.mp4 -vf "scale=1080:-2" -crf 28 -an -movflags +faststart -y output.mp4
```

For background or decorative videos where quality is less critical:

```bash
ffmpeg -i input.mp4 -vf "scale=720:-2" -crf 32 -r 20 -an -movflags +faststart -y output.mp4
```

All three tools can be installed with Homebrew:

```bash
brew install imagemagick svgo ffmpeg
```

## Why Not Just Use PNGs?

This is the question that usually comes up. PNG works everywhere, every tool supports it, and it's "good enough". The problem is that "good enough" compounds. A single PNG icon at 3x resolution might be 15KB where the SVG equivalent is 2KB. Multiply that across 50 icons and you've added 650KB to your bundle for no reason. And those PNGs can't adapt to theme changes; you'd need separate light and dark variants, doubling the count.

WebP offers similar savings over PNG for photographs. In our experience, the compression ratios are consistently in the 40-60% range for photographic content, which adds up fast in an image-heavy app.

## Conclusion

The strategy is deliberately simple: SVG for vectors, WebP for rasters, Lottie for complex animations, compressed MP4 for video. No exceptions, no "it depends". The decision matrix fits on an index card and the folder structure enforces it by convention.

What made this work for our team wasn't the technical details (those are straightforward) but having the strategy documented and agreed upon. Before we formalised it, every new image was a micro-decision. Now it's mechanical: _"What kind of content is this?"_ → look at the matrix → done.

---

_Note: This strategy is specific to React Native with Expo, but the principles apply to any mobile or web project. The core insight (match the format to the content type, not the tool you happen to have open) is universal._

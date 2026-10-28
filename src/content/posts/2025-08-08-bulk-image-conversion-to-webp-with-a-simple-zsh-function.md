---
title: Bulk Image Conversion to WebP with a Simple Zsh Function
description: A practical Zsh function to batch convert images to WebP format with ImageMagick.
pubDatetime: 2025-08-08
tags:
  - dev
---

In today's web development landscape, image optimisation is crucial for performance. **WebP** format offers superior compression compared to traditional formats like _JPEG_ and _PNG_, often reducing file sizes by 25-50% while maintaining similar quality. After repeatedly converting images manually, I created a simple _Zsh function_ to automate the process.

## Prerequisites

First, you'll need [ImageMagick](https://imagemagick.org/) installed on your system:

**macOS (with [Homebrew](https://brew.sh/)):**

```bash
brew install imagemagick
```

**Ubuntu/Debian:**

```bash
sudo apt-get install imagemagick
```

Ubuntu and Debian still ship ImageMagick 6, which has no `magick` command: use `convert` instead in the function below.

## The Simple Solution

Here's the function I use daily, simple, effective, and gets the job done:

```bash
convert_to_webp() {
  setopt local_options null_glob  # prevent 'no matches found' errors
  for ext in jpg jpeg png; do
    for f in *.$ext; do
      [ -e "$f" ] || continue
      output="${f%.*}.webp"
      magick "$f" -quality 80 -define webp:method=6 "$output"
      echo "Converted: $f -> $output"
    done
  done
}
```

That's it. No complicated options, no verbose output, just converts every JPG, JPEG, and PNG in the current directory to WebP with sensible defaults.

### Why These Defaults?

- **Quality 80**: Good balance between file size and visual quality
- **Method 6**: Best compression (slower but smaller files)
- **Supported formats**: JPG, JPEG, PNG cover 95% of use cases

## Usage

Simply navigate to your image directory and run:

```bash
convert_to_webp
```

Example output:

```bash
Converted: photo1.jpg -> photo1.webp
Converted: banner.jpeg -> banner.webp
Converted: screenshot.png -> screenshot.webp
```

## File Size Comparisons

Here are some real-world examples of the savings you can expect:

| Original Format  | Original Size | WebP Size | Savings |
| ---------------- | ------------- | --------- | ------- |
| PNG (screenshot) | 2.4 MB        | 1.1 MB    | 54%     |
| JPEG (photo)     | 3.8 MB        | 2.1 MB    | 45%     |
| PNG (icon)       | 145 KB        | 32 KB     | 78%     |
| JPEG (web image) | 856 KB        | 524 KB    | 39%     |

The savings vary depending on the image content, screenshots and graphics with large solid areas compress exceptionally well, while detailed photos see lower but still significant reductions.

## Adding to Your [Dotfiles](https://sirlisko.com/blog/dotfiles-one-to-rule-them-all)

For my [dotfiles setup](https://github.com/sirlisko/dotfiles), I added the function to my [`zsh/functions`](https://github.com/sirlisko/dotfiles/blob/main/zsh/functions) file, then it's automatically available in any new shell session.

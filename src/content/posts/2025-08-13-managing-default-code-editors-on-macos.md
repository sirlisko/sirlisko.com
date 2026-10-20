---
title: Managing Default Code Editors on macOS
description: A simple bash script to quickly switch default file associations when jumping between code editors like VSCode, Cursor, and Windsurf.
pubDatetime: 2025-08-13
tags:
  - dev
---

As a developer, I constantly like to try new tools, and code editors are no exception. Over the past few months, I've found myself hopping between _VSCode_, _Cursor_, and most recently _Windsurf_. Each editor has its strengths, and sometimes you want to give one a proper test drive as your primary editor. (And no, I'm not just chasing the latest ~~vibe coding~~ trends... okay, maybe a little.)[^1]

The problem? Every time I switch editors, I have to manually update file associations for dozens of file types. Right-clicking on every `.js`, `.ts`, `.py`, etc. file and changing "Open with..." gets old fast. There had to be a better way.

## Enter `duti` - The macOS File Association Manager

After some research, I discovered [`duti`](https://github.com/moretension/duti), a command-line utility for managing default applications on macOS. It's exactly what I needed: a way to programmatically set file associations in bulk.

You can install it via Homebrew:

```bash
brew install duti
```

## The Script

Here's the script I created to handle editor switching:

```bash
#!/bin/bash

# Replace this with your verified editor bundle ID
# CURSOR_ID="com.todesktop.230313mzl4w4u92"  # Cursor
# VSCODE_ID="com.microsoft.VSCode"           # VSCode
EDITOR_ID="com.exafunction.windsurf"         # Windsurf

# Array of file extensions
EXTENSIONS=(
  # Web development
  ".html" ".css" ".js" ".jsx" ".ts" ".tsx"
  ".vue" ".svelte" ".scss" ".sass" ".less"

  # Python
  ".py" ".ipynb"

  # Ruby
  ".rb" ".erb"

  # Java/Kotlin
  ".java" ".kt"

  # C/C++
  ".c" ".cpp" ".h" ".hpp"

  # Go
  ".go"

  # Rust
  ".rs"

  # PHP
  ".php" ".phtml"

  # Swift/Dart
  ".swift" ".dart"

  # Data/Database
  ".sql" ".graphql" ".gql" ".r" ".R"

  # Config files
  ".json" ".yml" ".yaml" ".toml" ".xml" ".md"
  ".txt" ".ini" ".env" ".properties" ".conf"
  ".gitignore" ".editorconfig" ".prettierrc"

  # Infrastructure
  ".hcl" ".tf" ".lua"

  # Shell scripts
  ".sh" ".bash" ".zsh"
)

# Set each file association
for ext in "${EXTENSIONS[@]}"; do
  echo "Setting $ext to open with editor..."
  duti -s "$EDITOR_ID" "$ext" all
done

echo "Done! Editor should now be set as the default for all development files."
```

## Finding Bundle IDs

The tricky part is finding the correct bundle ID for each application. Here are a few ways to get them:

**Method 1: Using `osascript`**

```bash
osascript -e 'id of app "Windsurf"'
```

**Method 2: Using `mdls`**

```bash
mdls -name kMDItemCFBundleIdentifier -r /Applications/Windsurf.app
```

**Method 3: Check the app's Info.plist**

```bash
/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" /Applications/Windsurf.app/Contents/Info.plist
```

## Making It Flexible

To make the script more flexible, I keep the bundle IDs for different editors commented out at the top. When I want to switch editors, I just uncomment the one I want and update the `EDITOR_ID` variable.

You could also make it more sophisticated with command-line arguments:

```bash
#!/bin/bash

case "$1" in
  "vscode")
    EDITOR_ID="com.microsoft.VSCode"
    EDITOR_NAME="VSCode"
    ;;
  "cursor")
    EDITOR_ID="com.todesktop.230313mzl4w4u92"
    EDITOR_NAME="Cursor"
    ;;
  "windsurf")
    EDITOR_ID="com.exafunction.windsurf"
    EDITOR_NAME="Windsurf"
    ;;
  *)
    echo "Usage: $0 {vscode|cursor|windsurf}"
    exit 1
    ;;
esac

echo "Setting default editor to $EDITOR_NAME..."
# ... rest of the script
```

Then you can run it like:

```bash
./setup-editor.sh windsurf
```

## The Dotfiles Connection

This script fits nicely into my [dotfiles setup](https://sirlisko.com/blog/dotfiles-one-to-rule-them-all) philosophy. I've added it to my [dotfiles repository](https://github.com/sirlisko/dotfiles/blob/main/scripts/setup-editor.sh) so that whenever I set up a new machine or want to standardise my editor choice across multiple machines, it's just a single command away.

---

[^1]: I should probably write something about my current (and always evolving) relationship with AI-powered coding tools, but that's another story.

---
title: Jailbreaking My Old Kindle
description: How a Kindle Paperwhite that Amazon considered dead came back to life, faster and more capable than before, after I jailbroke it and installed KOReader.
pubDatetime: 2026-09-07
tags:
  - web-life
ogImage: "./images/jailbreaking-my-old-kindle/jailbreaking-kindle-og.jpeg"
replyPrompt: "Have you jailbroken a Kindle, or moved to another e-reader?"
---

I have a Kindle Paperwhite, 6th generation, released in 2013. My parents gave it to me that year, and for about three years it worked exactly as expected. Then its 3G stopped working. I contacted Amazon, but they couldn't figure out why.

## Losing 3G, then losing WiFi too

One of the suggested fixes was to install a new firmware version. After I did that, the WiFi broke as well: the Kindle could still browse the internet, but it could no longer connect to my Amazon account. I called customer service about ten times, and none of those calls led anywhere. According to them, some unexplained bug had caused it.

Eventually, after a lot of back and forth, I managed to get a refund, even though the device was out of warranty. Amazon couldn't explain what had gone wrong, so they agreed to it.

Without a connection, one of my favorite features, syncing across devices, stopped working. The Kindle still worked as a basic e-reader: I could drag books onto it manually over USB. But all the online features were gone, and there's not much you can do about that once you're inside Amazon's walled garden.

## Considering another e-reader

For the past several years I have been looking into buying another e-reader. I was leaning toward a Kobo, but I couldn't find an easy way to sync my reading across all my devices, and I wasn't sure whether to get the Clara Colour, so I could also read occasional comics, or stick with the black-and-white one.

More than the device itself, what I wanted was to get away from Amazon. As hardware, the Kindle is still one of the best e-readers around, but Amazon's recent decisions made me want out: they can delete your library remotely, and you can no longer manually download the books you bought from their site and load them onto your device. Everything only works as long as you stay inside their system.

## Down a rabbit hole

A few days ago I was browsing _r/selfhosted_ on reddit and came across a discussion about self-hosted reading trackers. Curious, I followed it down a rabbit hole and discovered [KOReader](https://koreader.rocks/), an open-source, alternative e-reader app.

Out of curiosity, I checked whether it supported a Kindle as old as mine. To my surprise, it did. I tried reconnecting my Kindle to a normal WiFi network, and this time it seemed to work. That's when I found [kindlemodding.org](https://kindlemodding.org/), a site with detailed tutorials on how to jailbreak Kindle devices. Since my firmware wasn't one of the latest versions, I didn't even need to be connected to Amazon to do it, only the built-in browser.

I followed the tutorials and got it right on the first try, jailbreak and KOReader installed. Right away, the device felt noticeably faster than it did with Amazon's own software.

## Building the ecosystem back up

Pleasantly surprised, I started looking for what else I could add. I found [Readest](https://readest.com/), which syncs reading progress and notes between Web, iOS, and the Kindle. I also found a KOReader plugin for [Readeck](https://readeck.org/en/), the read-it-later app I [wrote about recently](/blog/inbox-zero-and-read-it-later). Both worked on the first try.

I now have a Kindle that syncs across all my devices, runs noticeably faster and more efficiently, and supports features Amazon's own software never did, including syncing my Readeck articles straight to it. It's given a real boost to my long reading sessions, and brought back the joy of using a device I had otherwise written off as lost.

# Afterimage

**A feed measured by what remains—not how long it can keep you scrolling.**

[Try the working MVP](https://afterimage.michaelkong764423.chatgpt.site)

## Why Afterimage

There is a strange feeling I don't think we talk about enough. Have you ever watched twenty TikToks that genuinely made you laugh, learned something interesting from three YouTube videos, read a thoughtful article, and then, an hour later, realized you couldn't explain any of it coherently?

I kept catching myself doing exactly that.

It wasn't that I had a bad memory. I could remember conversations from years ago, obscure facts about my hobbies, or the exact feeling of watching my favorite tennis matches. Yet after spending hours online, almost nothing seemed to stay. I wasn't really consuming information, but rather I was merely **renting** it for a few seconds before handing it back.

The unsettling part wasn't that I was forgetting. It was that every platform seemed to be working exactly as intended. They optimize for clicks, watch time, and the next swipe. Every notification, autoplay, and infinite feed is designed to answer one question:

> How do we keep your attention for a little longer?

But almost none of them ask the question that became impossible for me to ignore:

> What actually deserves to be remembered?

That question became Afterimage.

I didn't want to build another productivity app or another social platform. I wanted to explore a different success metric for software: **not time spent, but ideas retained**. What if software could recognize the moments that genuinely mattered and bring them back at the right time? What if a feed occasionally paused, not to show another video, but to ask you to recall an idea that sparked your curiosity hours ago? What if the internet optimized for leaving an afterimage instead of maximizing another swipe?

Afterimage is still an experiment. The aspiration is an intelligent, private memory layer for the internet; this MVP tests the human loop underneath it first.

## What works today

- Choose meaningful threads instead of entering an algorithmic infinite feed
- Consume a finite mixed-format session with an explicit ending
- Mark moments as meaningful without interrupting every item
- Write one unprompted retrieval reflection after the feed dissolves
- Separate unaided recall from prompted recognition
- Receive an attention receipt with retention per minute
- Save a session locally for a 24-hour spaced-recall check-in
- Keep reflections on-device with no account or public profile

## What is experimental

The current prototype uses local keyword matching to connect written recall with viewed ideas. AI-based semantic matching, automatic meaningful-moment detection, browser integrations, and adaptive resurfacing are the next product hypotheses—not capabilities this MVP pretends are already solved.

## Product principles

1. **Memory over engagement.** Success is what remains, not time spent.
2. **Finite by design.** There is no infinite scroll.
3. **Retrieval without homework.** One carefully timed checkpoint beats constant interruption.
4. **Recognition is not recall.** The product reports them separately.
5. **Private by default.** Reflections remain in browser storage.

## Run locally

```bash
npm install
npm run dev
```

Afterimage is an early product experiment, not a medical or cognitive-performance claim.

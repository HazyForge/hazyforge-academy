---
name: hazyforge-academy-product-split
description: Use when changing Hazy Forge Academy web or mobile UI, auth entrypoints, scheduling/class/progress flows, design tokens, product positioning, or deciding whether features belong in the public Vite site or authenticated Expo app.
---

# Hazy Forge Academy Product Split

## Core Model

Hazy Forge Academy has two React surfaces in one pnpm workspace:

- `apps/web`: public browser site at `https://learn.hazyforge.io`.
- `apps/mobile`: Expo Router native app for authenticated/subscribed Academy users.

Keep them as separate surfaces for now. The split is useful: the web app is the public promise and conversion/login doorway; the mobile app is the operational companion once someone is already in the Academy system.

Do not merge them into one app just to avoid maintenance. Reconsider a single app only if web needs the same authenticated day-to-day workflows as mobile, SEO/marketing needs become secondary, or shared packages fail to keep duplicated work small.

## Shared Theme

Both surfaces must feel like Hazy Forge Academy:

- Ink/ice base with hunter-green primary signals.
- Restrained cyan for system/auth/account affordances.
- Amber for reminders, cautions, milestones, or workshop beats.
- Barlow-like uppercase display rhythm and compact technical labels.
- 8px panels, hairline dividers, technical grids, workbench/build motifs.
- Real machines, real projects, AI judgment, scheduling, and practical student outcomes.
- Confident and technical, but still legible for families and adult learners.

The browser site can be more editorial and trust-building. The mobile app should be denser, signed-in, and task-oriented.

## Surface Responsibilities

Use `apps/web` for:

- Public positioning, lesson paths, homeschool/adult learner context, credibility, and calls to book or sign in.
- SEO-friendly public pages and static content.
- Lightweight login or scheduling entry points.

Use `apps/mobile` for:

- Authenticated account state.
- Scheduling/class tracking and subscribed-user workflows.
- Lesson reminders, prep checklists, follow-up notes, progress, and notifications.
- Any student/family operational surface that should feel like being inside the system.

## Implementation Guidance

- Before substantial UI work, inspect both surfaces for theme drift.
- When redesigning web, also sketch or implement the mobile-app counterpart if the change affects product promises, visual language, or authenticated workflows.
- When redesigning mobile, ensure the public web site sets matching expectations for the same classes, motifs, and tone.
- Prefer shared workspace packages for common tokens and primitives when duplication repeats, such as `packages/academy-theme` or `packages/academy-copy`.
- Keep implementation native to each surface: CSS/HTML ergonomics for Vite web, React Native/Expo patterns for mobile.
- For Expo code changes, follow `apps/mobile/AGENTS.md` and the exact Expo SDK 56 docs before coding.

## Recommendation

Current recommendation: keep the Vite public site and Expo mobile app separate, but manage them as one product with one theme. The repo already uses pnpm workspaces, so shared tokens and copy are the right next step before considering a full app merge.

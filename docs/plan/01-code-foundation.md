# Phase 1 — Code foundation

Status: Complete.

## Findings

Quiz pages repeat the same state logic; question APIs use biased random sorting and unchecked counts. Replays can retain the previous answer. The lint script calls a removed Next.js command, and the baseline contains 54 lint errors.

## Tasks

- [x] Introduce typed quiz models, a Fisher–Yates shuffle, seeded daily selection, and validated bounded query parameters.
- [x] Share question generation and a reducer that prevents duplicate answers, resets replays, and records accurate results.
- [x] Fix lint tooling and existing type/unused-code findings without disabling checks.
- [x] Validate score inputs and bound memory used by the existing rate limiter.
- [x] Add meaningful regression tests, type checking, and continuous integration.

## Acceptance

Invalid requests return 400; generated options are unique and contain one valid answer; repeat answers cannot inflate scores. `npm run lint`, `npm run typecheck`, `npm test`, and the production build pass.

Next: [Phase 2](02-content-expansion.md).

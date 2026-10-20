# Future major roadmap: GeoBrains for Android

**Status:** Future proposal. Implementation has not started.
**Relationship to the web release:** This is a separate project roadmap, outside the completed five-phase improvement plan. It is not phase 6, does not reopen any completed phase, and does not authorize Android implementation or store publication.
**Prepared:** 2026-10-19. Recheck framework compatibility, service costs, and Play requirements when implementation begins.

## Goal and first-release scope

Build an Android app that feels native, preserves the geography game’s rules, and remains useful on unreliable or expensive mobile connections. Keep the Next.js website and its backend operational throughout the port.

The first public Android release should support the eight multiple-choice categories, mixed World Tour, Classic, Practice, Sprint, Survival, Daily, Map Pin, and Stats War. Include region/difficulty/length settings, hints, explanations, review, retrying mistakes, local history, personal bests, and existing account/profile capabilities through a mobile-compatible backend. Keep admin content management on the website.

Use the current 195-country, 1,186-prompt snapshot as a versioned starting point, not a permanently fixed content limit. Preserve its source attribution and database license; review distribution rights for every bundled image and map asset.

Internal release gates are explicit: Android-2 produces a limited guest text alpha; Android-3 adds gameplay/mode parity; Android-4 produces the full content/offline-media beta; completing Android-5 and Android-6 produces the full-feature beta. Android-7 produces the release candidate and Android-8 the approved distribution release. A partial alpha must not be described as the completed port. Real-time multiplayer, purchases, ads, push notifications, and an iOS release belong in later proposals.

## Agreed platform and connectivity direction

- **Minimum OS: Android 10 and above.** Plan for `minSdkVersion = 29`, corresponding to [Android 10 / API 29](https://developer.android.com/about/versions/10/setup-sdk). Validate the selected framework, native map library, and other native modules against that minimum; do not silently raise it to satisfy a dependency.
- **Map Pin: online first for the first release.** Require an internet connection for the map experience, subject to validating the provider’s quality, responsiveness, and cellular usage in Android-0. Offline map downloads are a possible later enhancement, not a first-release dependency.
- **Keep offline guest practice.** Bundled text quizzes and available downloaded media remain usable without internet. Accounts, synchronization, authoritative Daily validation, ranked submission, and Map Pin require the relevant online services.
- **Preserve data-saving behavior.** Load map data only after opening Map Pin, bound permitted caching, and provide a clear connection/error state with a way back to offline practice. Optional media downloads remain Wi-Fi-only by default.

The minimum supported OS is distinct from the build/target SDK. Use compile/target SDK values compatible with the selected toolchain and the Play requirements in effect at release; the Android 10 minimum does not mean targeting API 29 for Play publication.

## Proposed architecture and decisions to prove

**Working recommendation:** React Native with Expo and TypeScript, sharing platform-independent quiz logic with the website. This is a project-specific recommendation based on the existing React/TypeScript engine. It remains provisional until Android-0 proves the device, map, auth, and build requirements. React Native recommends a framework for new apps, and Expo supports shared workspace packages. See the [React Native setup guide](https://reactnative.dev/docs/environment-setup) and [Expo workspace guide](https://docs.expo.dev/guides/monorepos/).

Build native screens and navigation. Next.js pages, DOM elements, Tailwind CSS classes, Next Image, Leaflet components, browser localStorage, and Server Actions need platform adapters or replacement interfaces. Reuse their rules and data rather than assuming those components run unchanged on Android.

Proposed boundaries:

- Shared quiz package: configuration, types, input validation, shuffle/seed logic, question generation, reducer, distance/scoring rules, and content version contracts.
- Shared content package: normalized country/stat records, question metadata, attribution, and an asset manifest that resolves images per platform.
- Android app: native UI, navigation, lifecycle handling, SQLite storage, secure session storage, media/download controls, and a native map adapter.
- Hosted backend: Next.js API routes, authentication, authorization, server-side score validation, synchronization, Prisma, and PostgreSQL. Database credentials and server secrets stay here.

Proposed layout after a separately tested workspace migration: retain the current web app at the repository root initially; add `apps/android`, `packages/quiz-core`, and `packages/content`. Root scripts must explicitly choose web or Android. Move the website into `apps/web` only if a later decision justifies the deployment changes. Confirm that root TypeScript, ESLint, Next.js tracing, and CI do not accidentally compile Android-only dependencies.

An installable web wrapper is an alternative if the eventual priority is distribution speed. A Kotlin/Compose implementation is an alternative if Android-specific requirements outweigh sharing TypeScript. Record that trade-off in Android-0; do not maintain multiple mobile implementations in parallel.

## Android-0 — Feasibility and release decisions

**Prerequisite:** A future decision to start implementation. All items below remain unchecked.

- [ ] Use the agreed Android 10+ minimum; name the first-release audience, representative Android 10 and newer physical devices, accessibility expectations, and offline-practice requirements.
- [ ] Check Expo/React Native/native-map compatibility and the Android build toolchain against Android 10 / API 29; choose compatible versions and pin them when the work starts.
- [ ] Prove one guest question, persistence across restart, the proposed online map experience on Android 10 over Wi-Fi and cellular, and an external-browser sign-in callback using a small development build.
- [ ] Compare local Android builds with optional hosted build services. Record recurring service costs, signing ownership, and a reproducible local fallback without committing to a paid service.
- [ ] Establish measured budgets for installation size, startup time, memory, one normal quiz session, map usage, and optional downloads. Separate base-app bytes from optional media packs and measure online map traffic separately.
- [ ] Record a go/no-go architecture decision, package identifier ownership, and the minimum first-release feature set.

**Deliverable / exit:** A tested feasibility note and selected stack. Estimates and a schedule are produced from that evidence and available developer time; this proposal makes no fixed delivery-date promise.

## Android-1 — Extract a shared game engine safely

**Depends on:** Android-0.

- [ ] Extract the portable parts of `src/lib/quiz/config.ts`, `types.ts`, `schema.ts`, `random.ts`, `questions.ts`, and `reducer.ts`; include `src/lib/distance.ts` and the Stats War comparison rules.
- [ ] Keep web-specific URL parsing, React browser hooks, fetch transport, localStorage access, and account score submission outside the shared package.
- [ ] Replace hardcoded `/landmarks/...`, `/famous-people/...`, and FlagCDN paths in shared questions with stable asset IDs resolved by each client.
- [ ] Define a platform-neutral clock and seeded generation entry point. Version question IDs, rule changes, and content manifests so Daily rounds can agree across web and Android.
- [ ] Add shared fixtures that verify identical selections/options and score transitions for a given seed, config, and content version.
- [ ] Introduce workspace/build settings incrementally; keep the existing web deployment and its regression checks passing.

**Deliverable / exit:** Both clients can consume one tested quiz package. The core has no imports from Next.js, Prisma, Leaflet, DOM APIs, or Android UI modules. Web behavior remains covered by its existing tests.

## Android-2 — Native shell, navigation, and durable progress

**Depends on:** Android-1.

- [ ] Create Home, challenge setup, active quiz, results/review, progress, and Settings screens; add Android back behavior, safe areas, loading states, and deep-link handling.
- [ ] Adapt the existing dark blue identity to native layouts with readable text, large touch targets, clear focus, TalkBack labels, and reduced-motion support.
- [ ] Bundle a small, versioned starter text bank for the alpha and expose only its supported categories. This makes the first guest round independent of a content service; Android-4 completes the full text bank and pack management.
- [ ] Define persistence interfaces for preferences, attempt summaries, active rounds, content versions, and a future sync outbox. Prefer a transactional local store for these related records; [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) is the initial candidate.
- [ ] Add storage schema versions, migration tests, damaged-record recovery, bounded history/cache, and a user-visible clear-downloads control that preserves progress.
- [ ] Separate guest history from signed-in account history. Do not imply Android can directly read the website’s browser localStorage.
- [ ] Decide whether web guest-history transfer is worth adding. If included, design a validated explicit export/import or account-link flow; otherwise document that guest histories start separately.

**Deliverable / exit:** A limited guest text-alpha build can navigate, finish a quiz using bundled starter questions, close/reopen, and restore progress without signing in or contacting a content service. Full category/mode parity is not yet claimed.

## Android-3 — Gameplay parity and lifecycle rules

**Depends on:** Android-2.

- [ ] Port every mode and setting using the shared reducer: Classic, Practice, Sprint, Survival, Daily, mixed categories, filters, streaks, skip, hints, explanations, review, and retry-mistakes.
- [ ] Preserve unique answer choices and exclusion of alternative valid capitals, languages, currencies, and neighbors. Show the actual available round length.
- [ ] Use touch interactions as the primary controls, with optional haptics and sound that respect user settings. Keep feedback readable without color or audio.
- [ ] Specify interruption behavior. Classic/Practice/Survival may restore a saved round; Sprint retains a deadline and must not award extra time when the app backgrounds or its process is killed.
- [ ] Distinguish elapsed-time clocks from wall-clock dates. Test device-clock changes and reboot recovery; use server timing for any future competitive submission.
- [ ] Match Daily rounds by UTC date, content version, and rules version. Show a version/date mismatch explicitly; an offline round with an unverified device date is local practice rather than an authoritative Daily result.
- [ ] Preserve the first local Daily completion and keep practice/offline results distinct from leaderboard-eligible attempts.

**Deliverable / exit:** Shared parity fixtures pass, and a real device can complete and replay each mode without duplicate scores, lost answers, restored lives, or timer exploits.

## Android-4 — Offline content and cellular-data controls

**Depends on:** Android-3; asset-rights decisions start in Android-0.

- [ ] Expand the Android-2 starter bank to the complete text bank and a versioned manifest so all declared text categories need zero runtime network requests. Measure the build instead of promising an unmeasured download size.
- [ ] Audit and license a compact local flag set. Decide whether it belongs in the base install or an optional pack before claiming Flags works offline.
- [ ] Package appropriately resized landmark/portrait images as optional packs, with visible download sizes, storage requirements, licensing/credits, and uninstall controls.
- [ ] Default optional content downloads to Wi-Fi-only and make cellular use an explicit user choice. Never preload all photos or refresh a whole content bank in the background.
- [ ] Support interruption, retry/backoff, integrity checks, version compatibility, atomic activation, and rollback to the last usable pack. Keep a playable bundled fallback.
- [ ] Filter mixed rounds to categories whose required assets are available, and explain those exclusions before starting. Image-dependent questions must not become blind guesses when an asset is missing.
- [ ] Expose Data saver, download/cache usage, and manual refresh controls. Keep cached content playable while online services are unavailable.

**Deliverable / exit:** In airplane mode, the declared offline categories and downloaded packs work after a cold start; Map Pin clearly explains that internet is required. On metered data, no optional pack downloads without a deliberate user action.

## Android-5 — Map Pin and Stats War

**Depends on:** Android-3 and the relevant asset controls from Android-4.

- [ ] Rebuild Map Pin with a compatible native map component; validate provider cost, attribution, caching rights, API-key restrictions, and Android build support before choosing the provider.
- [ ] Preserve map targets, distance scoring, longitude wrapping, marker feedback, round progression, and clear country-center scoring language.
- [ ] Support accessible alternatives to touch-only placement, such as moving a focusable crosshair and confirming its position. Keep essential controls usable with large text.
- [ ] Implement internet-required Map Pin for the first release, with clear offline, loading, connection-loss, and retry states. Retain results and allow returning to offline practice when connectivity fails. Defer offline map packs; any later proposal must select a licensed offline-capable source rather than bulk-fetching public OpenStreetMap tiles, as required by the [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/).
- [ ] Port Stats War with the existing higher/lower and streak rules, a dated/versioned dataset, tie handling, clean replays, and an explanation that population values are approximate.
- [ ] Handle missing tiles, map-provider errors, empty data, and low-memory conditions without losing quiz history.

**Deliverable / exit:** Both specialized games can start, finish, and replay on Android 10+; Map Pin uses a working connection and fails gracefully without one. Its internet requirement, measured data use, provider costs, and geographic limitations are documented. Stats War can use bundled data offline.

## Android-6 — Mobile accounts, backend API, and trustworthy sync

**Depends on:** Android-1 and Android-2; complete before the full account-enabled beta.

- [ ] Design and document a versioned mobile HTTPS API for sign-in/session handling, profile, leaderboard, content manifests, and attempt submission. Browser Server Actions are not the native app’s public API contract.
- [ ] Add a mobile-compatible authentication flow that maps to existing user IDs. For provider sign-in, prove system-browser redirects, PKCE where supported by the chosen flow, state validation, and verified callback ownership; consult [Expo authentication guidance](https://docs.expo.dev/guides/authentication/).
- [ ] Specify how existing email/password, email verification, and logout/revocation work on mobile. Do not assume the current NextAuth browser-cookie session can simply be copied into an Android client.
- [ ] Keep session secrets in platform-backed secure storage, with expiry, logout, backup, reinstall, and device-lock behavior tested; [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) is the initial candidate. Store ordinary progress separately.
- [ ] Add explicit request/response schemas, authorization, timeouts, bounded payloads, compatible API versions, and shared-store rate limiting for a multi-instance backend.
- [ ] Replace raw client-reported leaderboard totals with server-issued online attempts and server-computed results. Bind each attempt to its user, rules/content version, question set, expiry, and a unique submission identity.
- [ ] Keep offline/local attempts unranked. Bundled answers and an offline client cannot provide server-authoritative anti-cheat; never silently upgrade an offline score to ranked status when connectivity returns.
- [ ] Synchronize only eligible history through a bounded durable outbox. Use idempotency keys, retry/backoff, per-account ownership, and deterministic conflict rules. Preserve unsent records on transient failure and stop retrying revoked sessions.
- [ ] Keep foreground/manual sync reliable first. Any later background scheduler must respect metered-network constraints and OS scheduling; do not promise exact background timing. Review [Android persistent-work guidance](https://developer.android.com/develop/background-work/background-tasks/persistent).
- [ ] Add backward-compatible server changes and rollback steps so existing web clients continue to work during rollout.

**Deliverable / exit:** An existing user can sign in on Android, access their account, safely synchronize eligible progress, and sign out. Duplicate/replayed submissions cannot create duplicate ranked scores, and offline results remain visibly unranked.

## Android-7 — Device, accessibility, performance, and release testing

**Depends on:** Android-4, Android-5, and Android-6.

- [ ] Run shared-core unit tests, API contract tests, native component tests, and end-to-end flows on physical devices and an emulator when available.
- [ ] Test Android 10 / API 29 as the minimum supported release and a current Android release, a lower-memory phone, small/large screens, rotation, large text, TalkBack, reduced motion, and back/navigation gestures.
- [ ] Cover airplane mode, intermittent cellular data, Wi-Fi transitions, rejected downloads, disk full, interrupted content updates, expired auth, duplicate sync, process death, reboot, and clock/date changes.
- [ ] Measure cold start, interaction latency, frame smoothness, memory, battery behavior, base installation size, update size, and bytes used by a representative quiz/map session against Android-0 budgets.
- [ ] Check permission minimization, secret-free release bundles/logs, account data separation, signed content/update handling, dependency compatibility, and tested data migrations.
- [ ] Add separate Android CI jobs while retaining web CI. Cache dependency/Gradle artifacts where permitted; run native builds when relevant files change rather than on every documentation edit.
- [ ] Distribute a signed internal beta to a small tester group and record issues, reproducible fixes, and explicit release acceptance.

**Deliverable / exit:** A reproducible release candidate passes the documented device matrix and measured budgets, with no unresolved crash, data-loss, sign-in, or scoring blocker.

## Android-8 — Distribution, staged launch, and maintenance

**Depends on:** Android-7. Publishing remains a later, explicit release decision.

- [ ] Choose initial distribution: a signed test APK/internal track for testers, followed by the intended public channel. Prepare an Android App Bundle for Google Play if selected.
- [ ] Establish ownership of the package ID, Play account, signing/upload keys, secure backups, access controls, and the release process; follow [Android app-signing guidance](https://developer.android.com/studio/publish/app-signing).
- [ ] Recheck current [Play target API requirements](https://support.google.com/googleplay/android-developer/answer/11926878), applicable testing requirements, privacy/Data safety declarations, content rating, account-deletion obligations, and asset licenses immediately before submission. Do not freeze those changing requirements to today’s values.
- [ ] Prepare accurate screenshots, store description, support contact, credits, privacy information, and clear offline/data-use expectations. Include only permissions and data collection the app actually uses.
- [ ] Define release/version numbering, API and content compatibility, staged rollout/stop criteria, and a recovery release path that preserves existing local data.
- [ ] If runtime update services are adopted, document compatible runtime boundaries, integrity/signing, user data-use controls, and a safe recovery path. Native binary changes still require the appropriate build/distribution process.
- [ ] Maintain crash/error reporting with deliberate data collection, a dependency/SDK update schedule, content corrections, device support reviews, and recurring web/Android parity checks.

**Deliverable / exit:** The selected Android channel contains the approved signed release, update/recovery behavior has been tested, and an owner can reproduce and maintain subsequent releases.

## Completion definition and scope boundaries

The Android port is complete only when Android-0 through Android-8 pass their exit criteria and the approved distribution release is verified. Planning, a web shortcut, a development build, or a guest-only alpha alone does not meet that definition.

The current task creates this document and a README link only. It adds no Android project, SDK, emulator, package dependency, account integration, paid service, or deployment. All implementation checkboxes stay open. The existing [five-phase web plan](../plan/01-code-foundation.md) remains complete and separate.

## Cellular-data working rules for future implementation

- Inventory existing local tools and caches before fetching anything. Plan SDK, Gradle, native dependencies, emulator images, and large test assets for an unmetered connection; prefer a physical phone when it avoids an emulator-image download.
- Report expected large transfers before bootstrap; reuse caches, pin versions, and avoid reinstalling or rebuilding unrelated packages.
- Develop against bundled fixtures and local/mock APIs where possible. Keep test traffic local and block unrelated external image/map requests.
- Download individual licensed media packs intentionally. Do not crawl a CDN or bulk-download map tiles as part of normal testing.
- Keep source commits separate from APK/AAB files, emulator images, dependencies, caches, signing material, and private downloads. Transfer binaries through the chosen release channel rather than Git history.

## Decisions to revisit when scheduling the port

Android 10+ and an online-first Map Pin release are the agreed baseline. Remaining decisions are representative test devices, whether image categories work offline in the base install, the online map provider and budget, account-sync/ranked-play scope, distribution ownership, and available developer time. Offline maps may be reconsidered after the first release. Record the remaining decisions in Android-0 before presenting a delivery estimate. No answer is required to keep this proposal as future work.

## Source maintenance

Official documentation links were checked when drafting this proposal. Recheck them at implementation and release time; the proposed packages and architecture are recommendations rather than proof of compatibility with a future SDK. Current-project observations come from the repository’s quiz, data, auth, persistence, and map modules.

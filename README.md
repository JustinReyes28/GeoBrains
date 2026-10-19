# GeoBrains

A geography quiz app built with Next.js 16, React 19, TypeScript, and PostgreSQL/Prisma. Play as a guest or use an account for Classic category scores and the existing leaderboard.

## Play

Eight multiple-choice categories cover capitals, flags, borders, landmarks, famous people, currencies, languages, and world regions. World Tour mixes those subjects. Map Pin and Stats War remain separate games.

- **Classic:** untimed rounds; completed category rounds can save to a signed-in account.
- **Practice:** untimed learning with a 50/50 hint, explanations, and no account scoring.
- **Sprint:** 60 seconds, up to 50 questions; the clock continues between questions and in background tabs.
- **Survival:** three lives; a wrong answer or skip costs a life.
- **Daily challenge:** ten shared mixed questions with standard difficulty, refreshed at midnight UTC. Your first local result is retained.

Choose a region, 3/4/up to 6 choices, and 5/10/20/50 questions where the mode permits. Hard mode favors distractors from the same region. Smaller pools cap the actual question/choice count. Results show the full review and let you practice missed questions. Use number keys to answer and Enter to continue.

The latest 30 rounds and personal best streak save on the current browser. Storage errors do not block play. Practice, Sprint, Survival, Daily, and mixed rounds do not submit to the global leaderboard. Clearing site data removes guest progress.

## Content and data use

The bundled snapshot covers **195 countries** and **1,186 multiple-choice prompts**: 193 capitals, 195 flags, 157 borders, 30 landmarks, 26 people, 195 currencies, 195 languages, and 195 region questions. Map Pin has 195 country-center targets. Existing landmark and portrait images are reused.

See [content sources and refresh instructions](docs/CONTENT_SOURCES.md) or the app’s Content & sources page for the pinned revision, ODbL database license, corrections, and geographic limitations. The app code retains its existing license. Country metadata stays server-side; quiz requests return only the selected round.

The home page uses local SVG/CSS, system fonts, and no automatic route prefetching. Small flag images load for the active question only. Existing local quiz photos are resized through Next.js image optimization. Map tiles load only inside Map Pin. This is not a complete offline application.

## Local setup

Use Node.js **22.12+** and PostgreSQL. Install with `npm ci`; postinstall generates the Prisma client. Create a local `.env` with the required settings:

- `DATABASE_URL`: PostgreSQL URL; the Prisma config also accepts the existing provider-specific fallback variables.
- `AUTH_SECRET` / `NEXTAUTH_SECRET`: a long random authentication secret.
- `NEXTAUTH_URL`: local or deployed application URL.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: optional Google sign-in configuration.
- SMTP settings used in `src/lib/nodemailer.ts` for registration verification.
- `ADMIN_EMAIL` and the existing database role for admin access.

Do not commit environment files. A local `.env.example` may be available but is ignored by this repository; consult `src/lib/nodemailer.ts`, `src/auth.ts`, and `prisma.config.ts` for deployment configuration.

Run `npx prisma migrate dev` against your own development database, then `npm run dev`. This release requires no schema migration. Guest questions use bundled content; the admin editor manages separate database records and does not change the bundled bank.

## Quality checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

CI repeats lint, type checking, regression tests, and the production build. Tests cover input bounds, content and asset integrity, unambiguous options, seeded daily rounds, replay guards, hints, lives, timers, storage, score validation, and bounded rate limiting. No live database is needed for those tests.

An optional browser smoke script uses an already installed Playwright module and browser. Start the built app on port 3100, then run:

```sh
node scripts/smoke-browser.mjs <path-to-playwright/index.mjs> <browser-executable> http://127.0.0.1:3100
```

The smoke script never downloads packages or browsers. It blocks external browser requests, checks desktop/mobile flows, and writes screenshots to ignored `private/qa/`.

## Five-phase improvement plan

1. [Code foundation](docs/plan/01-code-foundation.md)
2. [Content expansion](docs/plan/02-content-expansion.md)
3. [Gameplay and modes](docs/plan/03-gameplay-and-modes.md)
4. [Experience and progress](docs/plan/04-experience-and-progress.md)
5. [Validation and release](docs/plan/05-validation-and-release.md)

## Future development

[Android port — separate major roadmap](docs/future/ANDROID_PORT_ROADMAP.md) covers a proposed native app, shared game engine, offline/data-saving content, mobile accounts, maps, testing, and distribution. This is future work outside the completed five-phase web plan; Android implementation has not started.

## Practical limits

The existing leaderboard accepts authenticated client-reported scores. Input validation constrains values but is not anti-cheat or server-authoritative scoring. Rate limiting remains enabled on every route and runs per process; multi-instance deployments should use a shared limiter. Stats War uses original approximate, undated values. Map Pin measures distance to country centers, not point-in-border accuracy. Daily stability assumes the same content version across deployments.

# GeoBrains Release Marketing Materials

This document contains social media copy tailored for **Twitter / X**, **LinkedIn**, and **Reddit** celebrating the latest release, architectural overhaul, and feature enhancements of **GeoBrains**.

---

## 1. Twitter / X Thread 🐦

### Post 1 (Hook / Main Announcement)
🚀 Huge update alert! **GeoBrains** – the ultimate open-source geography quiz platform – just got a massive upgrade! 🌍✨

Powered by **Next.js 16**, **React 19**, **Prisma**, and **PostgreSQL**, test your world knowledge across 195 countries and 1,186+ challenges!

🧵👇 [Thread below]

### Post 2 (Game Modes & Content)
🎮 **5 Exciting Ways to Play:**
• **Classic Mode**: Save high scores to your account & climb global leaderboards 🏆
• **Sprint**: 60s against the clock ⏰
• **Survival**: 3 lives. Zero mistakes allowed ❤️
• **Daily Challenge**: Fresh 10-question set generated every midnight UTC 🗓️
• **Practice**: 50/50 hints & instant explanations 🧠

Plus interactive **Map Pin** & **Stats War** mini-games!

### Post 3 (Tech Stack & Modernization)
⚡ **Under the Hood Technical Upgrades:**
• Full migration from Vite to **Next.js 16 App Router**
• **React 19** & Tailwind CSS v4 styling
• **Prisma ORM** + Neon PostgreSQL database
• Database-side `DENSE_RANK()` SQL window functions for instant leaderboard indexing
• High-security NextAuth / Auth.js with PII log masking & rate limiting

### Post 4 (Call to Action / Link)
Try GeoBrains today – no account required to play guest rounds! 🌐

⭐ Open source & developer-friendly:
[Insert GitHub Repo Link]

What's your highest geography streak? Drop your score below! 👇
#buildinpublic #nextjs #reactjs #webdev #geography #opensource

---

## 2. LinkedIn Post 💼

**Headline**: Major Release Announcement: Modernizing GeoBrains with Next.js 16, React 19, and Full-Stack Performance Improvements 🌍⚡

I’m thrilled to share a major update to **GeoBrains**, an interactive open-source geography knowledge platform!

Over the past few weeks, we executed a complete architectural overhaul to transform GeoBrains from a client-side SPA into a high-performance, full-stack Next.js 16 application. Here is a breakdown of what went into this release:

### 🛠️ Technical Architectural Overhaul
- **Next.js 16 & React 19 Migration**: Replaced Vite with Next.js App Router for server-side rendering, automatic code splitting, and zero-prefetch route efficiency.
- **Data & Persistence with Prisma & PostgreSQL**: Engineered a PostgreSQL backend schema using Prisma ORM hosted on Neon, replacing MySQL for enhanced reliability and serverless connection pooling.
- **High-Performance Leaderboards**: Optimized total rank calculations by replacing O(n log n) in-memory array processing with database-native `DENSE_RANK()` SQL window functions, achieving O(1) app-tier runtime execution.
- **Enterprise-Grade Security & Auth**: Integrated Auth.js / NextAuth with credential-based logins, account lockout protection, audit logging, rate-limiting middleware, and mandatory PII masking in error logs.
- **Vulnerability Remediation**: Upgraded core dependencies (`zod`, `react-hook-form`, `pg`, `@tanstack/react-query`, `lucide-react`) to maintain a clean security footprint.

### 🎮 Product & Gameplay Highlights
- **195 Countries & 1,186+ Prompts**: Comprehensive question bank spanning Capitals, Flags, Borders, Landmarks, Famous People, Currencies, Languages, and World Regions.
- **Dynamic Game Modes**: Features Classic (ranked), Practice (with 50/50 hints), Sprint (60-second time trial), Survival (3-lives sudden death), and a global Daily Challenge refreshed daily at 00:00 UTC.
- **Interactive Map Pin & Stats War**: Point-based spatial geography and country stat comparison challenges built with interactive mapping tools.

Whether you're looking to challenge your geography skills or explore the codebase for full-stack Next.js patterns, GeoBrains is completely open source!

Check out the code and start playing:
👉 **Repository**: [Insert GitHub Link]
👉 **Live Demo**: [Insert Live URL]

We’d love your feedback! What geography category or game mode would you like to see next?

#NextJS #ReactJS #WebDevelopment #FullStack #TypeScript #OpenSource #SoftwareEngineering #TechUpdate

---

## 3. Reddit Post 🤖

**Target Subreddits**: `r/webdev`, `r/SideProject`, `r/geography`, `r/reactjs`

**Title**: I rebuilt my geography quiz game GeoBrains with Next.js 16 App Router, React 19, and Prisma – 195 countries, 5 game modes, and zero-vulnerability stack!

**Body**:

Hey everyone! 👋

I wanted to share a major overhaul of my open-source project, **GeoBrains** – a feature-packed geography learning app designed to make discovering the world engaging and fast.

### 🌟 What is GeoBrains?
GeoBrains is an interactive geography platform covering all **195 countries** with **1,186+ multiple-choice prompts** across 8 core categories:
- 🏛️ Capitals
- 🚩 Flags
- 🗺️ Borders
- 📍 Landmarks
- 👤 Famous People
- 💵 Currencies
- 🗣️ Languages
- 🌏 World Regions

### 🎮 Game Modes
- **Classic**: Ranked rounds where completed rounds save to your account and feature on the global leaderboard.
- **Practice**: Learn at your own pace with 50/50 hints and full explanations.
- **Sprint**: 60-second speed run against the clock.
- **Survival**: 3 lives – how far can you go without a single mistake?
- **Daily Challenge**: 10 shared daily questions refreshed globally at midnight UTC.
- **Map Pin & Stats War**: Interactive spatial placement and country stat comparison mini-games.

---

### 💻 Technical Highlights for Developers
We recently completed a full migration from a Vite SPA to **Next.js 16 App Router** with **React 19**:

1. **Database Window Functions for Leaderboards**: Initially, user rank calculations fetched all score summaries into node memory to sort ($O(n \log n)$). We replaced this with a native `DENSE_RANK() OVER (ORDER BY SUM(value) DESC)` PostgreSQL query using Prisma `$queryRaw`, drastically speeding up API response times.
2. **NextAuth / Auth.js Security**: Integrated credential login with account lockout counters, audit logging, middleware route protection, and console PII masking (redacting user IDs in logs).
3. **Data Integrity & Bundle Optimization**: Pre-bundled metadata for guest gameplay offline readiness while securing full dataset server-side.
4. **Vulnerability Fixes**: Upgraded dependencies (`pg`, `react-hook-form`, `zod`, `@tanstack/react-query`, etc.) to keep Snyk/security audits 100% clean.

---

### 🔗 Try it out / Source Code
The repository is fully open source under the MIT license!

- 🐙 **GitHub Repository**: [Insert Link]
- 🌐 **Live Application**: [Insert Link]

I'd love to hear your feedback on the UI/UX, feature suggestions, or performance ideas! What's your favorite geography trivia category?

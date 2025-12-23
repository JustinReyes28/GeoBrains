# Agent Configuration: GeoBrains 🌍

Welcome, Agent. This document provides essential context and instructions for collaborating on the GeoBrains project.

## 🚀 Project Overview
GeoBrains is a premium geography quiz application built with Next.js. It features an interactive map-based quiz experience, user authentication, and global leaderboards.

## 🛠 Tech Stack
- **Framework**: [Next.js 16+ (App Router)](https://nextjs.org/docs)
- **Frontend**: 
  - [React 19](https://react.dev/)
  - [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/postcss`)
  - [Leaflet.js](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) for map visualizations
  - [Lucide React](https://lucide.dev/) for iconography
- **Data Fetching**: [TanStack Query (React Query) v5](https://tanstack.com/query/latest)
- **Database & ORM**: 
  - [Prisma v7+](https://www.prisma.io/)
  - [PostgreSQL](https://www.postgresql.org/) (hosted on Neon/Vercel)
- **Email Service**: [Nodemailer](https://nodemailer.com/) with Google SMTP
- **Authentication**: [NextAuth.js (Auth.js) v5 Beta](https://authjs.dev/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## 📂 Project Structure
- `app/`: Next.js App Router directory (Routes, Layouts, Server Actions)
- `components/`: Reusable UI components
- `src/`: Core application logic (lib, services, types)
- `prisma/`: Database schema and migration files
- `public/`: Static assets

## 🎨 Design Principles (CRITICAL)
- **Premium Aesthetics**: Use rich color palettes, smooth gradients, and glassmorphism.
- **Dynamic UI**: Implement micro-animations and hover effects.
- **Responsiveness**: Ensure the app works flawlessly on mobile and desktop.
- **SEO**: Use semantic HTML, proper heading hierarchy, and descriptive meta tags.

## 📝 Coding Standards
- **TypeScript**: Use strict typing. Avoid `any`.
- **Server Components**: Prefer Server Components for data fetching where possible.
- **Component Structure**: Keep components small and focused. Use `tailwind-merge` and `clsx` for dynamic classes.
- **Security**: Always validate inputs with Zod. Use secure hashing (bcryptjs) for passwords.

## 🛡️ Critical Security Requirements

### 1. Input Validation & Sanitization
- Always validate and sanitize ALL user inputs before processing
- Use parameterized queries/prepared statements for database operations (NEVER string concatenation)
- Validate data types, ranges, formats, and lengths
- Implement allowlists over denylists when possible
- Escape output based on context (HTML, SQL, shell, etc.)

### 2. Authentication & Authorization
- Never hardcode credentials, API keys, or secrets
- Use environment variables or secure secret management systems
- Implement proper session management with secure tokens
- Apply principle of least privilege for all access controls
- Verify authorization checks on every protected resource/action

### 3. Data Protection
- Encrypt sensitive data at rest and in transit (use TLS 1.2+)
- Use strong, modern cryptographic algorithms (bcrypt, Argon2 for passwords)
- Never roll your own crypto—use established libraries
- Implement proper key management practices
- Hash passwords with salt before storage (NEVER store plaintext)

### 4. Injection Prevention
- **SQL Injection**: Use ORMs or parameterized queries exclusively
- **XSS**: Sanitize and escape all dynamic content in web outputs
- **Command Injection**: Avoid shell execution; if necessary, use safe APIs with strict input validation
- **Path Traversal**: Validate and sanitize file paths, use allowlists for file access
- **LDAP/XML/NoSQL Injection**: Use safe APIs and input validation

### 5. Error Handling & Logging
- Never expose sensitive information in error messages
- Log security events (failed logins, access violations) but sanitize sensitive data
- Implement proper exception handling (don't expose stack traces to users)
- Use structured logging with appropriate severity levels

### 6. Dependency & Configuration Security
- Use up-to-date, well-maintained libraries
- Avoid dependencies with known vulnerabilities
- Implement Content Security Policy (CSP) for web applications
- Disable unnecessary features and services
- Set secure HTTP headers (X-Frame-Options, X-Content-Type-Options, etc.)

### 7. Rate Limiting & DoS Protection
- Implement rate limiting on APIs and sensitive endpoints
- Add timeout mechanisms for operations
- Validate resource consumption (file sizes, request sizes)
- Protect against resource exhaustion attacks

### 8. Secure Defaults
- Fail securely (deny access by default)
- Minimize attack surface (disable debug modes in production)
- Use secure session cookies (HttpOnly, Secure, SameSite flags)
- Implement CSRF protection for state-changing operations

## ⚙️ Key Workflows

### Database
- **Generate Client**: `npx prisma generate`
- **Apply Migrations**: `npx prisma migrate dev`
- **Prisma Studio**: `npx prisma studio`

### Development
- **Dev Server**: `npm run dev` (Runs on port 3000)
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## ⚠️ Important Files
- `prisma/schema.prisma`: The source of truth for the database schema.
- `middleware.ts`: Handles authentication and rate limiting.
- `app/layout.tsx`: Root layout with provider setup.
- `.env`: Environment variables (do not commit).

# Booking Network Global Group — Official Corporate Portal & Enterprise Governance System

Official global corporate portal and enterprise administration platform for **Booking Network Global Group** (부킹네트워크글로벌그룹).

> **"Architecting the Global Digital Backbone. Connecting Next-Generation Platforms."**

---

## 1. Group Architecture & Mission

Booking Network Global Group operates as a premier Global IT Platform Group and digital infrastructure holding entity. The group architects, governs, and scales mission-critical edge computing, streaming AI engines, zero-trust financial architectures, and cross-border platform ecosystems.

### 6 Core Business & Technology Divisions

| Code | Division Name | Category | Primary Mandate |
|---|---|---|---|
| **BNG-INFRA-01** | **Global Cloud & Distributed Infrastructure** | Core Infrastructure | 45+ global edge POPs, carrier-grade multi-cloud routing, 99.999% SLA availability |
| **BNG-DATA-02** | **AI & Data Intelligence Engine** | AI & Big Data | Streaming data pipelines, vector search indexing, predictive analytical intelligence |
| **BNG-MESH-03** | **Global B2B Network & API Mesh** | B2B Platform & API | Sub-15ms universal API gateway, partner mesh interconnection, cross-border telemetry |
| **BNG-TRUST-04** | **Enterprise FinTech & Trust Architecture** | FinTech & Cybersecurity | Zero-trust compliance (SOC 2 Type II, PCI-DSS L1), cryptographic data ledgers |
| **BNG-STUDIO-05** | **Next-Gen Digital Ecosystem Studio** | Platform Incubation & Scale | Modular platform scaffolding, design systems, joint venture tech incubation |
| **BNG-ESG-06** | **Global ESG & Sustainable Tech Initiative** | ESG & Governance | Carbon-aware cloud scheduling, 100% digital accessibility (WCAG 2.2 AAA), ethical AI |

---

## 2. Infrastructure & Deployment Architecture

### Canonical Endpoints & Identity Disambiguation

- **Official Live Portal (Cloudflare Workers)**: [`https://company.dnjstjq0824.workers.dev`](https://company.dnjstjq0824.workers.dev)
- **Official Source Code Repository**: [`https://github.com/dnjstjq0824-byte/company.git`](https://github.com/dnjstjq0824-byte/company.git) (`main` branch)
- **Cloudflare Project**: `company` (Workers & Pages)

> [!WARNING]
> **Domain Disambiguation Notice**:
> The domain `company.pages.dev` belongs to an unrelated third party ("Web Hosting Perú") and is **NOT** associated with Booking Network Global Group. All official deployments operate strictly on Cloudflare Workers at `company.dnjstjq0824.workers.dev` or the official corporate domain `bookingnetwork.com`.

### Edge Runtime Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Runtime Target**: Cloudflare Workers via `@opennextjs/cloudflare`
- **Asset Serving**: Cloudflare Workers Assets (`ASSETS` binding)
- **Build Pipeline**: Standalone Next.js compilation + OpenNext edge packaging (`npm run build`)
- **Version Integrity**: Dynamic commit tracking via Git SHA or CI environment variables (`CF_PAGES_COMMIT_SHA`, `WORKERS_CI_COMMIT_SHA`, `GITHUB_SHA`, `COMMIT_SHA`)
- **Security Headers**: HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Commit-Hash`, `X-App-Version`

---

## 3. Directory Structure

```text
├── prisma/
│   ├── schema.prisma        # Database schema (Platform, NewsPost, GlobalHub, Admin, Inquiries, Logs)
│   ├── seed.ts              # Seeding script for 6 Core Divisions, Hubs, News, and Site Settings
│   └── dev.db               # Local SQLite database (development only)
├── public/
│   ├── logos/
│   │   └── booking-network.svg  # Official lattice digital backbone monogram
│   └── uploads/             # Media assets
├── src/
│   ├── app/
│   │   ├── (public)         # /, /about, /platforms, /platforms/[slug], /newsroom, /newsroom/[slug], /contact, /privacy, /terms
│   │   ├── admin/           # /admin, /admin/platforms, /admin/newsroom, /admin/network, /admin/content, /admin/inquiries, /admin/settings, /admin/security
│   │   ├── api/             # /api/contact, /api/version, /api/admin/*
│   │   ├── globals.css      # Custom styling, fonts, and dark theme variables
│   │   ├── layout.tsx       # Root layout with LanguageProvider and global announcement bar
│   │   ├── robots.ts        # Dynamic robots.txt
│   │   └── sitemap.ts       # Dynamic sitemap.xml with live platform routes
│   ├── components/
│   │   ├── ArchitectureBlueprint.tsx   # Interactive 4-tier system blueprint
│   │   ├── BentoGrid.tsx               # Strategic governance asymmetric grid
│   │   ├── NetworkTopologyMatrix.tsx   # Real-time infrastructure telemetry matrix
│   │   ├── NewsroomSection.tsx         # Public news & IR cards
│   │   ├── PlatformCard.tsx            # Division card with division codes & metrics
│   │   ├── admin/                      # AdminShell and management components
│   │   └── Header.tsx / Footer.tsx     # Corporate navigation with EN|KO switcher
│   └── lib/
│       ├── auth.ts          # Fail-closed JWT authentication & audit logging
│       ├── data.ts          # High-performance cached database queries with fallbacks
│       ├── default-data.ts  # Fallback & seed datasets for 6 divisions, hubs & news
│       ├── i18n.tsx         # Bilingual dictionary and React LanguageContext
│       ├── prisma.ts        # Prisma client proxy with database connectivity checks
│       └── version.ts       # Version and commit SHA resolution
├── wrangler.jsonc           # Cloudflare Workers configuration
├── next.config.ts           # Next.js configuration with security headers & git resolution
└── package.json
```

---

## 4. Local Development & Setup

### Prerequisites
- Node.js 18.18+ or 20+ / 24+
- npm 10+
- Git

### 1. Installation
```bash
npm clean-install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `.env` contains:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-32-byte-hex-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Database Initialization & Seeding
```bash
npx prisma db push
npm run db:seed
```
*Note: The seed script outputs Super Admin credentials to `.admin-credentials.local.txt` (excluded by `.gitignore`).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

### 5. Production Build Verification
```bash
npm run build
```
*(Build executes `prisma generate && next build && opennextjs-cloudflare build --skipNextBuild` in standalone mode, guaranteeing zero build loop recursion).*

---

## 5. Security Architecture & Fail-Closed Policies

### Authentication & Session Integrity
- **JWT Signing**: HS256 algorithm via `jose` library with strict 12-hour session expirations.
- **Fail-Closed Gate**: If `AUTH_SECRET` is unset or empty in production:
  - `src/middleware.ts` rejects all `/admin` routes and `/api/admin/*` endpoints immediately.
  - `src/lib/auth.ts` throws an explicit security error preventing token generation.
  - No default, hardcoded, or weak fallback secrets are accepted under any circumstances.
- **Admin Password Storage**: Salted and hashed via `bcryptjs` with 12 salt rounds.

### Database Persistence & Runtime Safety
- The Cloudflare Workers serverless runtime has a stateless, read-only filesystem.
- Local SQLite (`prisma/dev.db`) is strictly for local development and is **not persisted** across worker invocations.
- If `DATABASE_URL` is omitted in production:
  - Public marketing pages render smoothly using default system constants (`src/lib/default-data.ts`).
  - Contact inquiries (`/api/contact`) and Admin CRUD actions return `HTTP 500` rather than silently losing user data or creating phantom records.

---

## 6. Cloudflare Workers Operator Runbook

### A. Health & Deployment Verification
Verify that live edge worker reflects the latest deployment commit:
```bash
# 1. Probe version endpoint
curl -s https://company.dnjstjq0824.workers.dev/api/version

# 2. Inspect response headers
curl -sI https://company.dnjstjq0824.workers.dev/ | grep -E "x-app-version|x-commit-hash"
```
The output `commit` field must match `git rev-parse --short HEAD`.

### B. Deployment via Wrangler CLI
Deploy directly to the `company` Cloudflare Worker:
```bash
# 1. Run local build
npm run cf:build

# 2. Deploy to Cloudflare Workers
npx wrangler deploy
```

### C. Secret Management in Cloudflare
Set production secrets directly in Cloudflare Workers environment:
```bash
# Set mandatory Auth Secret
npx wrangler secret put AUTH_SECRET

# Set Production Database URL (when connecting remote database)
npx wrangler secret put DATABASE_URL
```

### D. Emergency Rollback Procedure
If a deployment introduces regressions or unexpected errors:
```bash
# List recent deployments with IDs
npx wrangler deployments list

# Rollback to the previous stable deployment ID
npx wrangler rollback <DEPLOYMENT_ID>
```
*Alternatively, navigate to Cloudflare Dashboard -> Workers & Pages -> company -> Deployments -> Click (...) next to the target deployment -> Select "Rollback".*

### E. Database Architecture Options for Cloudflare Workers
To enable permanent persistence for admin modifications and customer contact inquiries on Cloudflare Workers, select one of the following production architectures:

1. **Option A: Serverless PostgreSQL (Neon / Supabase)** *(Recommended)*
   - Provision a PostgreSQL database instance on Neon or Supabase.
   - Run `npx prisma migrate deploy` using the external direct connection string.
   - Set `DATABASE_URL` in Cloudflare via `npx wrangler secret put DATABASE_URL` (with pooled connection pooling parameters enabled).
2. **Option B: Cloudflare D1 Native Database**
   - Create a D1 database: `npx wrangler d1 create booking-company-db`.
   - Bind D1 in `wrangler.jsonc` under `d1_databases`.
   - Configure `@prisma/adapter-d1` in `src/lib/prisma.ts`.
3. **Option C: Turso (libSQL)**
   - Create a database: `turso db create booking-company`.
   - Set up `@prisma/adapter-libsql` with the database URL and authentication token.

---

## 7. Legal & Compliance Notice

© 2026 Booking Network Global Group (부킹네트워크글로벌그룹). All rights reserved.
Unpublished administrative endpoints and proprietary API mesh architecture are strictly protected under international intellectual property and cybersecurity laws.

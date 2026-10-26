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

## 2. Technology Stack & Edge Architecture

- **Core Framework**: [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + TypeScript
- **Styling & UI**: Tailwind CSS 3 (Obsidian Navy `#030712`, Cobalt `#2563eb`, Electric Cyan `#38bdf8`) + Lucide Icons + Pretendard / Plus Jakarta Sans fonts
- **Database & ORM**: Prisma 6 ORM with SQLite (`prisma/dev.db`) and zero-change switchable PostgreSQL/Cloudflare D1 compatibility
- **Deployment & Edge Runtime**: Cloudflare Workers / Pages via `@opennextjs/cloudflare` + standalone Node.js server fallback
- **Authentication**: Signed JWT session cookies (`jose`, HS256) with `bcryptjs` password hashing and RBAC (`Super Admin` vs `Content Manager`)
- **Internationalization (i18n)**: English (`en`) & 한국어 (`ko`) runtime language switcher with React Context provider
- **Audit & Governance**: Immutable activity logging capturing admin ID, action, target, client IP address, and user agent

---

## 3. Directory Structure

```text
├── prisma/
│   ├── schema.prisma        # Database schema (Platform, NewsPost, GlobalHub, Admin, Inquiries, Logs)
│   ├── seed.ts              # Seeding script for 6 Core Divisions, Hubs, News, and Site Settings
│   └── dev.db               # SQLite database
├── public/
│   ├── logos/
│   │   └── booking-network.svg  # Official lattice digital backbone monogram
│   └── uploads/             # Media assets
├── src/
│   ├── app/
│   │   ├── (public)         # /, /about, /platforms, /platforms/[slug], /newsroom, /newsroom/[slug], /contact, /privacy, /terms
│   │   ├── admin/           # /admin, /admin/platforms, /admin/newsroom, /admin/network, /admin/content, /admin/inquiries, /admin/settings, /admin/security
│   │   ├── api/             # /api/contact, /api/admin/*
│   │   ├── globals.css      # Custom styling, fonts, and dark theme variables
│   │   └── layout.tsx       # Root layout with LanguageProvider and global announcement bar
│   ├── components/
│   │   ├── ArchitectureBlueprint.tsx   # Interactive 4-tier system blueprint
│   │   ├── BentoGrid.tsx               # Strategic governance asymmetric grid
│   │   ├── NetworkTopologyMatrix.tsx   # Real-time infrastructure telemetry matrix
│   │   ├── NewsroomSection.tsx         # Public news & IR cards
│   │   ├── PlatformCard.tsx            # Division card with division codes & metrics
│   │   ├── admin/                      # AdminShell and management components
│   │   └── Header.tsx / Footer.tsx     # Corporate navigation with EN|KO switcher
│   └── lib/
│       ├── auth.ts          # JWT session creation, verification & activity logging
│       ├── data.ts          # High-performance cached database queries with fallbacks
│       ├── default-data.ts  # Fallback & seed datasets for 6 divisions, hubs & news
│       ├── i18n.tsx         # Bilingual dictionary and React LanguageContext
│       └── prisma.ts        # Prisma client singleton
```

---

## 4. Local Development & Setup

### Prerequisites
- Node.js 18.18+ or 20+ / 24+
- npm 10+

### 1. Installation
```bash
npm clean-install
```

### 2. Environment Configuration
Ensure `.env` contains:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secure-32-byte-secret-key-here"
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

### 5. Production Build
```bash
npm run build
```
*(Build executes `next build && opennextjs-cloudflare build --skipNextBuild` in standalone mode, guaranteeing zero build loop recursion).*

---

## 5. Enterprise Administration Modules (`/admin/*`)

1. **Executive Command Dashboard** (`/admin`):
   - Real-time strategic telemetry (Core Divisions, Newsroom Disclosures, Infrastructure Nodes, Inquiry triage).
   - System runtime diagnostics (Prisma SQLite, JWT Token Auth, Edge Gateway).
2. **Business & Tech Divisions CMS** (`/admin/platforms`):
   - Full CRUD for the 6 core business pillars with `division_code` (e.g. `BNG-INFRA-01`), icon selector, and dynamic numerical `key_metrics` builder.
3. **Newsroom & IR Disclosures** (`/admin/newsroom`):
   - Press releases, IR disclosures, and technical whitepapers with live Markdown preview and featured homepage toggle.
4. **Global Network & Hubs** (`/admin/network`):
   - Manage regional headquarters, R&D campuses, and edge cloud nodes (Seoul, San Jose, Frankfurt, Dubai).
5. **Website Content CMS** (`/admin/content`):
   - Dynamic array form builder for hero metrics, strategic business areas, and rich Markdown editor for legal privacy/terms.
6. **Enterprise Inquiries CRM** (`/admin/inquiries`):
   - Filterable CRM with priority classification (Urgent/High/Normal/Low), department dispatch, internal governance notes, and CSV export.
7. **Corporate Settings & Governance** (`/admin/settings`):
   - Group identity, bilingual Korean/English titles, default language (`en`/`ko`), and global top announcement bar toggle.
8. **Security Governance & Audit Trail** (`/admin/security`):
   - Role-Based Access Control (`Super Admin` vs `Content Manager`), credential rotation, and audit logs with IP addresses and user agents.

---

## 6. Security & Legal Notice

© 2026 Booking Network Global Group (부킹네트워크글로벌그룹). All rights reserved.
Unpublished administrative endpoints and proprietary API mesh architecture are strictly protected under international intellectual property and cybersecurity laws.

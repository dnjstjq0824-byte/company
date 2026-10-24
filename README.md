# Booking Network Co., Ltd. — Official Corporate Website & Platform Portfolio

Official global corporate portal and digital platform portfolio directory for **Booking Network Co., Ltd.**

**"Connecting Platforms. Expanding Possibilities."**

---

## 1. Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) + React 19 + TypeScript |
| **Styling** | Tailwind CSS 3 (Clean White, Dark Navy `#0b192c`, Electric Blue `#2563eb`, Dark Mode support) |
| **Database & ORM** | Prisma 6 ORM with persistent SQLite (`prisma/dev.db`) out of the box; zero-change switchable to PostgreSQL via `DATABASE_URL` |
| **Authentication** | Administrator-only HTTP-only signed JWT sessions (`jose`) + `bcryptjs` password hashing + IP rate limiting |
| **Email Notifications** | `nodemailer` SMTP transport with automatic fallback when SMTP is not yet configured |
| **SEO & Indexing** | Dynamic `/sitemap.xml`, `/robots.txt`, JSON-LD `Organization` structured data, Open Graph metadata, canonical URLs |

---

## 2. Platform Portfolio (10 Initial Seeded Platforms)

1. **OLMOA** (`/platforms/olmoa`) — Global E-Commerce
2. **getforTrip** (`/platforms/getfortrip`) — Online Travel Agency
3. **TripScanner** (`/platforms/tripscanner`) — Travel Metasearch
4. **CryptoScanner** (`/platforms/cryptoscanner`) — Cryptocurrency Information
5. **StockScanner** (`/platforms/stockscanner`) — Stock Market Information
6. **Treewiki** (`/platforms/treewiki`) — Knowledge & Information
7. **treescanr** (`/platforms/treescanr`) — General Search Engine
8. **Global Video Platform** (`/platforms/global-video`) — Video & Media *(provisional label, editable in Admin)*
9. **Global Messenger** (`/platforms/global-messenger`) — Communication *(provisional label, editable in Admin)*
10. **Global Shortform Platform** (`/platforms/global-shortform`) — Short-Form Media *(provisional label, editable in Admin)*

---

## 3. Local Setup & Development Instructions

### Prerequisites
- Node.js 18.18+ or 20+ / 24+
- npm 9+

### Step 1 — Install Dependencies
```bash
npm install
```

### Step 2 — Configure Environment Variables
Copy `.env.example` to `.env` and set your environment variables:
```bash
cp .env.example .env
```
Required variables in `.env`:
- `DATABASE_URL="file:./dev.db"` (or PostgreSQL connection URL in production)
- `AUTH_SECRET="<random-32+-byte-secret>"`
- `NEXT_PUBLIC_SITE_URL="http://localhost:3000"`

### Step 3 — Run Database Migrations & Seed Data
```bash
npx prisma migrate dev
npm run db:seed
```
When `npm run db:seed` runs for the first time, it:
1. Seeds all **10 platform portfolio entries**.
2. Seeds **corporate site settings** and **CMS content pages** (`/`, `/about`, `/privacy`, `/terms`).
3. Securely provisions the initial Super Admin account without hardcoding any password in source code, writing the generated credentials to `.admin-credentials.local.txt` (which is excluded from Git via `.gitignore`).

### Step 4 — Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Step 5 — Production Build & Start
```bash
npm run build
npm run start
```

---

## 4. Administrator Usage Guide

### 4.1 Signing In (`/admin/login`)
- Navigate to `/admin/login`.
- Retrieve your generated administrator credentials from `.admin-credentials.local.txt` (or provision a custom administrator using the CLI command below):
  ```bash
  npm run db:provision-admin -- --email=admin@bookingnetwork.co --password="YourStrongPassword123!"
  ```
- Public visitors cannot register or access any `/admin/*` or `/api/admin/*` routes.

### 4.2 Dashboard Overview (`/admin`)
- Displays real-time database counts for **Total Platforms**, **Live Platforms**, **In-Development / Coming Soon Platforms**, **Unread Contact Inquiries**, **Total Contact Inquiries**, and **Recent Administrative Activity Logs**.

### 4.3 Managing Platforms (`/admin/platforms`)
- **Add / Edit Platforms:** Click **Add New Platform** or the edit icon on any row.
- **Provisional Platform Labels:** Rename *Global Video Platform*, *Global Messenger*, or *Global Shortform Platform* (and update their slugs/logos) at any time as official branding is finalized.
- **Statuses:** Set any platform to `Live`, `Coming Soon`, `In Development`, or `Temporarily Unavailable`.
- **Official External Website Links:** Set `website_url` (e.g., `https://olmoa.com`). For visitor safety, external links are only activated on public cards and detail pages when a valid `http(s)://` URL is configured **and** the platform status is set to `Live`.
- **Publication Control:** Switch between `Published`, `Draft`, or `Archived` to control public visibility and search engine indexing.
- **Logo Uploads:** Upload `.svg`, `.png`, `.jpg`, or `.webp` logos (validated for MIME type, magic bytes, and SVG script sanitization).

### 4.4 Website Content Management (`/admin/content`)
- Edit structured content and SEO metadata for:
  - **Homepage (`/`)**: Hero badge, headline, supporting text, About section, Connected Ecosystem text, and Partnership CTA.
  - **About Us (`/about`)**: Corporate overview, Vision, Mission, Global Platform Strategy.
  - **Privacy Policy (`/privacy`)** & **Terms of Use (`/terms`)**: Full Markdown policy body, status badge, and revision date.

### 4.5 Contact Inquiry Management (`/admin/inquiries`)
- View all inquiries submitted through `/contact`.
- Filter by **Inquiry Type** or **Status** (`New`, `In Progress`, `Resolved`), or search by sender name, email, organization, or subject.
- Record **Private Administrator Notes** on any inquiry.
- Click **Export Inquiries to CSV** to download a complete spreadsheet of all inquiries.

### 4.6 Corporate Settings (`/admin/settings`)
- Configure **Company Display Name**, **Tagline**, **Corporate Email**, **Telephone**, **Business Address**, **Operating Hours**, **Website Domain**, **Social Media Links**, **Brand Logo**, and **Favicon**.
- Any contact detail left blank is automatically hidden on the public website so unverified or placeholder contact details are never displayed.

### 4.7 Security & Activity Audit Logs (`/admin/security`)
- Rotate your administrator password.
- Provision additional authorized administrators (`Super Admin` or `Content Manager`) or deactivate accounts.
- Audit the chronological **Administrator Activity Log**.

---

## 5. Production Deployment & PostgreSQL Migration

To switch from local SQLite to managed **PostgreSQL** in production:
1. Update `provider = "postgresql"` in `prisma/schema.prisma`.
2. Set `DATABASE_URL="postgresql://user:password@host:5432/booking_network?schema=public"` in your production environment variables.
3. Run `npx prisma migrate deploy && npm run db:seed`.


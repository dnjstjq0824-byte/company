import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const INITIAL_PLATFORMS = [
  {
    name: "OLMOA",
    slug: "olmoa",
    category: "Global E-Commerce",
    short_description:
      "A global open marketplace designed to connect buyers and sellers across markets.",
    full_description:
      "OLMOA is an open digital commerce marketplace built by Booking Network Co., Ltd. to facilitate cross-market product discovery and merchant connectivity. Designed with modular storefront capabilities and transparent catalog organization, OLMOA empowers independent sellers, brands, and buyers to participate in digital trade through an accessible online marketplace architecture.",
    logo: "/logos/olmoa.svg",
    features: JSON.stringify([
      "Multi-category global product marketplace architecture",
      "Merchant storefront and catalog management tools",
      "Cross-border product discovery and structured search",
      "Localized category browsing and buyer-seller inquiry flows",
      "Scalable listing infrastructure for independent businesses",
    ]),
    target_audience:
      "Global online shoppers, independent merchants, retail brands, and cross-border commerce suppliers looking for an open marketplace environment.",
    business_purpose:
      "To establish a flexible and accessible digital commerce hub within the Booking Network portfolio that connects diverse sellers and consumers across international markets.",
    website_url: "",
    platform_status: "In Development",
    publication_status: "Published",
    display_order: 1,
    seo_title: "OLMOA — Global E-Commerce Marketplace | Booking Network Co., Ltd.",
    seo_description:
      "Explore OLMOA, a global open marketplace by Booking Network Co., Ltd. designed to connect buyers and sellers across international markets.",
  },
  {
    name: "getforTrip",
    slug: "getfortrip",
    category: "Online Travel Agency",
    short_description:
      "A global online travel platform designed to help travelers discover and book travel services.",
    full_description:
      "getforTrip is an online travel agency (OTA) platform within the Booking Network ecosystem focused on simplifying travel planning and reservation workflows. It brings together accommodations, destination experiences, and travel services into an intuitive booking interface designed for modern leisure and business travelers.",
    logo: "/logos/getfortrip.svg",
    features: JSON.stringify([
      "End-to-end online accommodation and travel service discovery",
      "Streamlined itinerary planning and reservation workflows",
      "Destination guides and curated travel service categories",
      "Flexible filter criteria for global travel requirements",
      "Dedicated traveler support and booking management interface",
    ]),
    target_audience:
      "Individual travelers, families, business professionals, and hospitality service providers seeking direct online travel booking capabilities.",
    business_purpose:
      "To deliver direct digital travel booking experiences that connect hospitality and travel service providers with international travelers.",
    website_url: "",
    platform_status: "In Development",
    publication_status: "Published",
    display_order: 2,
    seo_title: "getforTrip — Online Travel Agency Platform | Booking Network Co., Ltd.",
    seo_description:
      "Learn about getforTrip, a global online travel platform by Booking Network Co., Ltd. designed to help travelers discover and book travel services.",
  },
  {
    name: "TripScanner",
    slug: "tripscanner",
    category: "Travel Metasearch",
    short_description:
      "A global travel metasearch engine designed to help users discover and compare travel options across providers.",
    full_description:
      "TripScanner operates as an independent travel metasearch engine engineered to aggregate and compare travel options across multiple booking providers and travel operators. Rather than acting as a single vendor, TripScanner empowers travelers with transparent side-by-side comparisons of flights, stays, and travel routes.",
    logo: "/logos/tripscanner.svg",
    features: JSON.stringify([
      "Multi-provider travel rate and availability comparison engine",
      "High-speed metasearch indexing across flights, stays, and transport",
      "Unbiased filtering by schedule, duration, provider, and price tier",
      "Direct referral routing to verified travel service providers",
      "Real-time search normalization across global travel inventories",
    ]),
    target_audience:
      "Value-conscious and research-oriented travelers, digital nomads, and travel planners comparing options across multiple travel agencies and airlines.",
    business_purpose:
      "To provide transparent travel discovery and comparison technology that reduces search friction across the global travel ecosystem.",
    website_url: "",
    platform_status: "Coming Soon",
    publication_status: "Published",
    display_order: 3,
    seo_title: "TripScanner — Global Travel Metasearch Engine | Booking Network Co., Ltd.",
    seo_description:
      "Discover TripScanner, a global travel metasearch engine by Booking Network Co., Ltd. designed to help users discover and compare travel options across providers.",
  },
  {
    name: "CryptoScanner",
    slug: "cryptoscanner",
    category: "Cryptocurrency Information",
    short_description:
      "A global cryptocurrency metasearch and market discovery platform.",
    full_description:
      "CryptoScanner is a dedicated cryptocurrency information and market metasearch platform developed by Booking Network Co., Ltd. It aggregates publicly available digital asset market metrics, exchange listings, and token profiles into a structured analytical reference portal without operating as a custodial exchange or brokerage.",
    logo: "/logos/cryptoscanner.svg",
    features: JSON.stringify([
      "Global digital asset market data aggregation and indexing",
      "Cross-source cryptocurrency price and volume metasearch",
      "Structured asset profiles, sector categorization, and market metrics",
      "Watchlist organization and market movement discovery tools",
      "Informational reference architecture (non-custodial, non-trading portal)",
    ]),
    target_audience:
      "Digital asset researchers, market observers, fintech analysts, and global users seeking organized cryptocurrency market information.",
    business_purpose:
      "To organize fragmented cryptocurrency market information into a fast, accessible metasearch and discovery resource.",
    website_url: "",
    platform_status: "In Development",
    publication_status: "Published",
    display_order: 4,
    seo_title: "CryptoScanner — Cryptocurrency Information & Metasearch | Booking Network Co., Ltd.",
    seo_description:
      "Explore CryptoScanner, a global cryptocurrency metasearch and market discovery platform developed by Booking Network Co., Ltd.",
  },
  {
    name: "StockScanner",
    slug: "stockscanner",
    category: "Stock Market Information",
    short_description:
      "A global stock market metasearch and financial information discovery platform.",
    full_description:
      "StockScanner is a financial information discovery and equity market metasearch platform. It helps users navigate global public company profiles, sector classifications, market indices, and financial disclosures through unified search and screening tools, serving strictly as an information discovery platform rather than an investment brokerage.",
    logo: "/logos/stockscanner.svg",
    features: JSON.stringify([
      "Global equity and market index information metasearch",
      "Multi-criteria company screening by sector, region, and metrics",
      "Consolidated public company reference profiles and financial summaries",
      "Cross-market sector performance and industry taxonomy navigation",
      "Clean, distraction-free financial information research interface",
    ]),
    target_audience:
      "Financial researchers, business analysts, students, and global market followers seeking structured stock market information.",
    business_purpose:
      "To democratize access to structured public market information and company discovery across global financial sectors.",
    website_url: "",
    platform_status: "In Development",
    publication_status: "Published",
    display_order: 5,
    seo_title: "StockScanner — Stock Market Information Platform | Booking Network Co., Ltd.",
    seo_description:
      "Learn about StockScanner, a global stock market metasearch and financial information discovery platform by Booking Network Co., Ltd.",
  },
  {
    name: "Treewiki",
    slug: "treewiki",
    category: "Knowledge & Information",
    short_description:
      "A global collaborative knowledge and information platform.",
    full_description:
      "Treewiki is a structured collaborative knowledge and reference platform designed to organize human knowledge into clear, interconnected topic trees. By combining wiki-style editorial governance with structured taxonomy navigation, Treewiki enables contributors and readers to explore complex subjects with clarity and context.",
    logo: "/logos/treewiki.svg",
    features: JSON.stringify([
      "Hierarchical topic trees and interconnected knowledge graphs",
      "Collaborative article authoring with version history and revision tracking",
      "Citation verification workflows and structured reference templates",
      "Clean, high-readability typography optimized for deep research",
      "Cross-linking between foundational concepts and specialized subtopics",
    ]),
    target_audience:
      "Students, educators, subject-matter contributors, researchers, and curious readers seeking structured encyclopedic knowledge.",
    business_purpose:
      "To build an enduring, well-structured digital knowledge repository that enhances information literacy and collaborative documentation.",
    website_url: "",
    platform_status: "Coming Soon",
    publication_status: "Published",
    display_order: 6,
    seo_title: "Treewiki — Collaborative Knowledge Platform | Booking Network Co., Ltd.",
    seo_description:
      "Discover Treewiki, a global collaborative knowledge and information platform developed by Booking Network Co., Ltd.",
  },
  {
    name: "treescanr",
    slug: "treescanr",
    category: "General Search Engine",
    short_description:
      "A global search engine designed to help users discover information and digital resources across the web.",
    full_description:
      "treescanr is a general-purpose web search and digital resource discovery engine developed by Booking Network Co., Ltd. Built to index and surface relevant websites, informational pages, and public digital resources, treescanr focuses on fast query resolution, clean result presentation, and intuitive topic exploration.",
    logo: "/logos/treescanr.svg",
    features: JSON.stringify([
      "Fast web indexing and multi-domain information retrieval",
      "Minimalist, low-clutter search results presentation",
      "Smart query refinement and topic cluster suggestions",
      "Resource filtering across web pages, documents, and reference portals",
      "Privacy-conscious query handling and safe-search controls",
    ]),
    target_audience:
      "Everyday internet users, professionals, and researchers looking for a clean, reliable general search engine to navigate the open web.",
    business_purpose:
      "To provide foundational search engine technology that connects users directly with relevant web resources and digital information.",
    website_url: "",
    platform_status: "In Development",
    publication_status: "Published",
    display_order: 7,
    seo_title: "treescanr — Global General Search Engine | Booking Network Co., Ltd.",
    seo_description:
      "Explore treescanr, a global search engine by Booking Network Co., Ltd. designed to help users discover information and digital resources across the web.",
  },
  {
    name: "Global Video Platform",
    slug: "global-video",
    category: "Video & Media",
    short_description:
      "A global digital platform for discovering, sharing, and engaging with video content.",
    full_description:
      "Global Video Platform (provisional label) is Booking Network Co., Ltd.'s long-form and on-demand video media initiative. The platform is architected to support creators, educators, and media publishers in distributing high-definition video content while giving viewers structured channels, playlists, and topic-based discovery.",
    logo: "/logos/global-video.svg",
    features: JSON.stringify([
      "High-definition adaptive video streaming and playback architecture",
      "Creator channel management and structured playlist organization",
      "Topic-based video discovery and curated category feeds",
      "Audience engagement tools including comments and community moderation",
      "Provisional branding ready for full commercial identity rollout",
    ]),
    target_audience:
      "Independent video creators, educational publishers, media studios, and global audiences consuming on-demand digital video.",
    business_purpose:
      "To establish a scalable digital video distribution and discovery destination within the Booking Network media ecosystem.",
    website_url: "",
    platform_status: "In Development",
    publication_status: "Published",
    display_order: 8,
    seo_title: "Global Video Platform — Video & Media | Booking Network Co., Ltd.",
    seo_description:
      "Learn about the Global Video Platform by Booking Network Co., Ltd., a digital platform for discovering, sharing, and engaging with video content.",
  },
  {
    name: "Global Messenger",
    slug: "global-messenger",
    category: "Communication",
    short_description:
      "A global messaging platform designed to connect people through digital communication.",
    full_description:
      "Global Messenger (provisional label) is a real-time digital communication platform under development by Booking Network Co., Ltd. Focused on reliable personal and group messaging, media sharing, and cross-device synchronization, it aims to provide clean, dependable communication tools for global users.",
    logo: "/logos/global-messenger.svg",
    features: JSON.stringify([
      "Real-time one-to-one and group messaging architecture",
      "Cross-device message synchronization across web and mobile interfaces",
      "Secure media, document, and voice note sharing capabilities",
      "Organized channel spaces for communities and professional teams",
      "Security-first communication protocols and privacy controls",
    ]),
    target_audience:
      "Individuals, international communities, and distributed teams seeking fast, dependable everyday digital messaging.",
    business_purpose:
      "To power direct human communication and community connectivity as a core pillar of Booking Network's digital ecosystem.",
    website_url: "",
    platform_status: "In Development",
    publication_status: "Published",
    display_order: 9,
    seo_title: "Global Messenger — Digital Communication Platform | Booking Network Co., Ltd.",
    seo_description:
      "Explore Global Messenger by Booking Network Co., Ltd., a global messaging platform designed to connect people through digital communication.",
  },
  {
    name: "Global Shortform Platform",
    slug: "global-shortform",
    category: "Short-Form Media",
    short_description:
      "A global platform focused on discovering, creating, and sharing short-form content.",
    full_description:
      "Global Shortform Platform (provisional label) is Booking Network Co., Ltd.'s mobile-first short-form video and creative media platform. Built for rapid content discovery and effortless creative expression, it enables creators to publish concise vertical video stories and reach audiences through interest-driven feeds.",
    logo: "/logos/global-shortform.svg",
    features: JSON.stringify([
      "Vertical short-form video playback and low-latency feed delivery",
      "Intuitive creator publishing tools and audio-visual tagging",
      "Interest-based content discovery across entertainment, lifestyle, and learning",
      "Interactive creator-audience engagement and remix workflows",
      "Flexible platform identity configurable via the corporate CMS",
    ]),
    target_audience:
      "Short-form digital creators, mobile-first audiences, cultural trendsetters, and brand storytellers.",
    business_purpose:
      "To capture rapid, high-engagement mobile media consumption and empower next-generation digital creators.",
    website_url: "",
    platform_status: "Coming Soon",
    publication_status: "Published",
    display_order: 10,
    seo_title: "Global Shortform Platform — Short-Form Media | Booking Network Co., Ltd.",
    seo_description:
      "Discover the Global Shortform Platform by Booking Network Co., Ltd., focused on discovering, creating, and sharing short-form digital content.",
  },
];

const INITIAL_SETTINGS: Record<string, string> = {
  company_name: "Booking Network Co., Ltd.",
  tagline: "Connecting Platforms. Expanding Possibilities.",
  brand_positioning:
    "A global digital technology company developing and connecting platforms that empower commerce, travel, information discovery, financial market exploration, content sharing, and communication.",
  corporate_email: "",
  telephone: "",
  business_address: "",
  operating_hours: "",
  website_domain: "",
  contact_notification_email: "",
  social_linkedin: "",
  social_x: "",
  social_youtube: "",
  social_github: "",
  footer_copyright: `© ${new Date().getFullYear()} Booking Network Co., Ltd. All rights reserved.`,
  default_seo_title:
    "Booking Network Co., Ltd. | Global Digital Platform Ecosystem",
  default_seo_description:
    "Official corporate portal of Booking Network Co., Ltd. — building a global ecosystem of digital platforms across commerce, travel, search, financial information, knowledge, video, and communication.",
  brand_logo: "/logos/booking-network.svg",
  favicon: "/favicon.ico",
  cookie_consent_enabled: "true",
};

const INITIAL_CONTENT_PAGES = [
  {
    page_slug: "home",
    publication_status: "Published",
    seo_metadata: JSON.stringify({
      title: "Booking Network Co., Ltd. — One Network. A World of Digital Possibilities.",
      description:
        "Booking Network Co., Ltd. is building a global ecosystem of digital platforms connecting commerce, travel, search, knowledge, financial information, entertainment, and communication.",
    }),
    content: JSON.stringify({
      hero_badge: "GLOBAL DIGITAL PLATFORM ECOSYSTEM",
      hero_headline: "One Network. A World of Digital Possibilities.",
      hero_supporting_text:
        "Booking Network Co., Ltd. is building a global ecosystem of digital platforms connecting commerce, travel, search, knowledge, financial information, entertainment, and communication.",
      hero_primary_cta_text: "Explore Our Platforms",
      hero_primary_cta_link: "/platforms",
      hero_secondary_cta_text: "Contact Us",
      hero_secondary_cta_link: "/contact",
      about_heading: "Building Connections Across Digital Industries",
      about_body:
        "Booking Network Co., Ltd. develops and stewards independently operated digital platforms across six foundational sectors of the modern internet. While each platform maintains its own specialized architecture, brand identity, and operational focus, our corporate umbrella provides long-term strategic alignment, governance, and opportunities for cross-sector discovery.",
      business_areas: [
        {
          id: "commerce",
          title: "Global Commerce",
          description:
            "Open digital marketplace architectures designed to connect merchants, brands, and buyers across international markets.",
          icon: "ShoppingBag",
        },
        {
          id: "travel",
          title: "Travel Technology",
          description:
            "Online travel booking and multi-provider metasearch platforms that simplify global itinerary planning and comparison.",
          icon: "Compass",
        },
        {
          id: "search",
          title: "Search & Information Discovery",
          description:
            "General web search technology engineered to index and surface relevant digital resources with clarity and speed.",
          icon: "Search",
        },
        {
          id: "finance",
          title: "Financial Market Information",
          description:
            "Specialized metasearch and market discovery portals for global equities and cryptocurrency market data.",
          icon: "LineChart",
        },
        {
          id: "knowledge",
          title: "Knowledge Platforms",
          description:
            "Collaborative encyclopedic and structured reference systems that organize complex subjects into accessible topic trees.",
          icon: "BookOpen",
        },
        {
          id: "media",
          title: "Digital Media & Communication",
          description:
            "Next-generation platforms for on-demand video, short-form creative storytelling, and real-time digital messaging.",
          icon: "Video",
        },
      ],
      ecosystem_heading: "An Umbrella of Independently Operated Platforms",
      ecosystem_subtitle:
        "Booking Network Co., Ltd. serves as the central corporate entity behind ten specialized platforms. Each service operates with independent branding, dedicated domain routing, and distinct technical infrastructure—ensuring specialized excellence without conflating user accounts or operational boundaries.",
      partnership_headline: "Let's Build New Opportunities Together.",
      partnership_text:
        "Interested in partnerships, business collaboration, or learning more about our platforms? Connect with Booking Network.",
      partnership_cta_text: "Contact Our Team",
      partnership_cta_link: "/contact",
    }),
  },
  {
    page_slug: "about",
    publication_status: "Published",
    seo_metadata: JSON.stringify({
      title: "About Us | Booking Network Co., Ltd.",
      description:
        "Learn about Booking Network Co., Ltd., our corporate vision, mission, business philosophy, and global platform strategy across commerce, travel, search, finance, knowledge, and media.",
    }),
    content: JSON.stringify({
      overview_heading: "Corporate Overview",
      overview_body:
        "Booking Network Co., Ltd. is a global digital technology company dedicated to building, launching, and scaling an ecosystem of specialized online platforms. Our portfolio spans Global E-Commerce, Online Travel, Travel Metasearch, Cryptocurrency & Stock Market Information, Collaborative Knowledge, General Web Search, Video Media, Digital Messaging, and Short-Form Content.\n\nAs the corporate parent and strategic umbrella, Booking Network Co., Ltd. establishes the foundational standards for product quality, information accessibility, security governance, and long-term scalability across every platform we develop.",
      vision:
        "To create a connected digital world where information, commerce, travel, and communication are more accessible across borders.",
      mission:
        "To develop innovative digital platforms that help individuals and businesses discover information, access services, and connect with opportunities worldwide.",
      philosophy_heading: "Our Business Philosophy",
      philosophy_items: [
        {
          title: "Independent Identity, Shared Excellence",
          description:
            "Every platform in the Booking Network portfolio is purpose-built for its specific vertical. Rather than forcing disparate services into a single monolithic app, each platform maintains its own focused user experience and operational independence.",
        },
        {
          title: "Clarity & Utility First",
          description:
            "Whether comparing travel itineraries, researching market data, or exploring collaborative knowledge, our platforms prioritize clean interfaces, structured information, and transparent user journeys.",
        },
        {
          title: "Scalable Global Architecture",
          description:
            "We design our platforms from day one for international audiences, modular expansion, and resilient performance as new services transition from development to public launch.",
        },
      ],
      strategy_heading: "Global Platform Strategy",
      strategy_body:
        "Our multi-sector platform strategy focuses on six interconnected pillars of digital life: how people trade (OLMOA), how they move and explore (getforTrip, TripScanner), how they research financial markets (CryptoScanner, StockScanner), how they find and structure knowledge (Treewiki, treescanr), and how they communicate and share media (Global Video Platform, Global Messenger, Global Shortform Platform).\n\nBy stewarding this diverse portfolio under Booking Network Co., Ltd., we foster cross-disciplinary technical innovation while allowing each platform to evolve at its own pace and serve its target audience directly.",
      innovation_heading: "Areas of Innovation",
      innovation_items: [
        "High-precision metasearch indexing and multi-source data normalization",
        "Scalable open marketplace and digital catalog architectures",
        "Structured knowledge graphs and collaborative editorial tooling",
        "Low-latency media delivery and real-time digital communication systems",
        "Privacy-conscious, accessible, and standards-compliant web engineering",
      ],
      verified_corporate_facts_note:
        "Official corporate registry details, regional office announcements, and verified platform launch dates are published exclusively through administrator-verified updates as they are finalized.",
    }),
  },
  {
    page_slug: "privacy",
    publication_status: "Published",
    seo_metadata: JSON.stringify({
      title: "Privacy Policy | Booking Network Co., Ltd.",
      description:
        "Privacy Policy for the Booking Network Co., Ltd. official corporate website.",
    }),
    content: JSON.stringify({
      title: "Privacy Policy",
      status_badge: "Administrator-Editable Corporate Policy Draft",
      last_updated: "October 2026",
      body: `## 1. Introduction and Scope

This Privacy Policy explains how **Booking Network Co., Ltd.** ("Booking Network", "we", "us", or "our") handles information collected through this official corporate website.

**Important Scope Notice:** This policy applies solely to the Booking Network Co., Ltd. corporate portal. Each individual digital platform developed or operated by Booking Network Co., Ltd. (such as OLMOA, getforTrip, TripScanner, CryptoScanner, StockScanner, Treewiki, treescanr, and our media/communication platforms) operates as a separate service with its own independent privacy policy, terms, and data governance when publicly launched.

## 2. Information We Collect on This Corporate Website

Our public corporate website does **not** require or offer public user registration, user accounts, or payment processing. We collect personal information only when you voluntarily submit an inquiry through our **Contact Us** form:

- **Contact Identifiers:** Full Name, Email Address, and optional Company / Organization name.
- **Inquiry Content:** Inquiry Type, Subject, Message body, and your timestamped Privacy Consent record.
- **Technical & Security Logs:** Basic request metadata (such as rate-limiting counters and standard server security logs) used strictly to protect our website from automated abuse, spam, and unauthorized access.

## 3. How We Use Your Information

We process the information submitted through our Contact Us form exclusively to:

1. Review, route, and respond to your corporate, partnership, or technical inquiry.
2. Maintain an internal record of business correspondence and administrator follow-up notes.
3. Protect the security, integrity, and availability of our corporate website.

We do **not** sell, rent, or trade your personal contact information to third parties.

## 4. Cookies and Consent Preferences

This corporate website uses strictly necessary technical storage (such as your theme preference, cookie consent banner acknowledgment, and—for authorized personnel only—encrypted administrator session cookies). If optional analytics or non-essential cookies are introduced in the future, they will only be activated after obtaining your explicit consent via our cookie preference mechanism.

## 5. Data Retention and Deletion

Contact inquiries are stored securely in our corporate database for the duration necessary to address your inquiry and maintain accurate business correspondence records. Authorized administrators regularly review and can permanently delete obsolete or resolved inquiry records upon request.

## 6. Your Privacy Rights

Depending on your jurisdiction, you may have the right to request access to, correction of, or deletion of personal information you have submitted to us via our Contact Us form. To exercise these rights, please submit a request through our [Contact Us](/contact) page.`,
    }),
  },
  {
    page_slug: "terms",
    publication_status: "Published",
    seo_metadata: JSON.stringify({
      title: "Website Terms of Use | Booking Network Co., Ltd.",
      description:
        "Website Terms of Use for the Booking Network Co., Ltd. official corporate portal.",
    }),
    content: JSON.stringify({
      title: "Website Terms of Use",
      status_badge: "Administrator-Editable Corporate Policy Draft",
      last_updated: "October 2026",
      body: `## 1. Acceptance of Terms

By accessing and browsing the official corporate website of **Booking Network Co., Ltd.**, you agree to comply with and be bound by these Website Terms of Use.

## 2. Purpose of This Corporate Portal

This website serves as the central corporate information portal and platform portfolio directory for **Booking Network Co., Ltd.**

- **Informational Nature:** All information on this website is provided for general corporate informational purposes.
- **No Financial or Brokerage Services:** Descriptions of financial information platforms (such as CryptoScanner and StockScanner) represent software and information discovery initiatives. Booking Network Co., Ltd. does not provide investment advice, securities brokerage, or cryptocurrency trading services through this corporate website.
- **Independent Platform Operations:** Individual platforms listed in our portfolio operate independently and are governed by their own service-specific terms and conditions once launched.

## 3. Intellectual Property

All corporate branding, logos, platform names (including OLMOA, getforTrip, TripScanner, CryptoScanner, StockScanner, Treewiki, treescanr, and associated visual assets), page layouts, and original text on this website are the intellectual property of Booking Network Co., Ltd. and may not be reproduced or misrepresented without prior written permission.

## 4. Acceptable Use

When using this website or submitting an inquiry through our Contact Us page, you agree not to:

1. Submit false, misleading, spam, or automated bulk inquiries.
2. Attempt to probe, scan, or gain unauthorized access to restricted administrator routes (\`/admin\`) or backend APIs.
3. Introduce malicious code, scripts, or denial-of-service traffic.

## 5. External Links to Platform Websites

Where a platform in our portfolio has officially launched and an external website URL is configured by our administrators, following that link will direct you to an external domain governed by that platform's respective terms and policies.

## 6. Changes to These Terms

Booking Network Co., Ltd. reserves the right to update these Website Terms of Use through our content management system. The "Last Updated" date at the top of this page reflects the latest approved revision.`,
    }),
  },
];

async function main() {
  console.log("Seeding Booking Network Co., Ltd. database...");

  for (const platform of INITIAL_PLATFORMS) {
    await prisma.platform.upsert({
      where: { slug: platform.slug },
      update: {
        name: platform.name,
        category: platform.category,
        short_description: platform.short_description,
        full_description: platform.full_description,
        logo: platform.logo,
        features: platform.features,
        target_audience: platform.target_audience,
        business_purpose: platform.business_purpose,
        display_order: platform.display_order,
        seo_title: platform.seo_title,
        seo_description: platform.seo_description,
      },
      create: platform,
    });
  }
  console.log("✔ Seeded 10 platform portfolio entries.");

  for (const [key, value] of Object.entries(INITIAL_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { setting_key: key },
      update: {},
      create: {
        setting_key: key,
        setting_value: value,
      },
    });
  }
  console.log("✔ Seeded corporate site settings.");

  for (const page of INITIAL_CONTENT_PAGES) {
    await prisma.contentPage.upsert({
      where: { page_slug: page.page_slug },
      update: {},
      create: page,
    });
  }
  console.log("✔ Seeded CMS content pages (Home, About, Privacy, Terms).");

  // Secure Admin Provisioning (never hardcode a static password in source code)
  const adminEmail = (
    process.env.INITIAL_ADMIN_EMAIL || "admin@bookingnetwork.co"
  ).toLowerCase();
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const rawPassword =
      process.env.INITIAL_ADMIN_PASSWORD &&
      process.env.INITIAL_ADMIN_PASSWORD.trim().length >= 10
        ? process.env.INITIAL_ADMIN_PASSWORD.trim()
        : `BN-${crypto.randomBytes(9).toString("base64url")}!9a`;

    const passwordHash = await bcrypt.hash(rawPassword, 12);

    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password_hash: passwordHash,
        role: "Super Admin",
        is_active: true,
      },
    });

    await prisma.adminActivityLog.create({
      data: {
        admin_id: admin.id,
        action: "PROVISION_ADMIN",
        target: `Initial Super Admin provisioned (${adminEmail})`,
      },
    });

    // Save generated credentials to gitignored local file so owner can access without hardcoded password in repo
    const credPath = path.join(process.cwd(), ".admin-credentials.local.txt");
    fs.writeFileSync(
      credPath,
      [
        "============================================================",
        "BOOKING NETWORK CO., LTD. — INITIAL ADMIN CREDENTIALS",
        "============================================================",
        `Generated At : ${new Date().toISOString()}`,
        `Login URL    : /admin/login`,
        `Admin Email  : ${adminEmail}`,
        `Password     : ${rawPassword}`,
        "============================================================",
        "IMPORTANT: This file is excluded from git (.gitignore).",
        "Use `npm run db:provision-admin` to rotate or add admins.",
        "",
      ].join("\n"),
      { encoding: "utf8", mode: 0o600 }
    );
    console.log(
      `✔ Provisioned initial administrator (${adminEmail}). Credentials written to .admin-credentials.local.txt`
    );
  } else {
    console.log(`✔ Administrator (${adminEmail}) already exists.`);
  }
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


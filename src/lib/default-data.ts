export interface PlatformDivision {
  id?: string;
  name: string;
  slug: string;
  division_code: string;
  category: string;
  icon_name: string;
  short_description: string;
  full_description: string;
  logo: string | null;
  features: string[];
  key_metrics: Array<{ label: string; value: string }>;
  target_audience: string;
  business_purpose: string;
  website_url: string | null;
  platform_status: string;
  publication_status: string;
  display_order: number;
  seo_title: string;
  seo_description: string;
}

export interface NewsPostItem {
  id?: string;
  title: string;
  slug: string;
  category: "Press Release" | "IR & Governance" | "Technology" | "Global Notice";
  summary: string;
  content: string;
  thumbnail_url?: string | null;
  is_featured: boolean;
  publication_status: "Published" | "Draft" | "Archived";
  published_at: string;
  author_name: string;
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface GlobalHubItem {
  id?: string;
  region: "APAC" | "North America" | "Europe" | "MENA" | "Global";
  city: string;
  country: string;
  hub_type: "Global HQ" | "Regional Hub" | "R&D Center" | "Cloud Node";
  description: string;
  address?: string | null;
  contact_email?: string | null;
  status: "Active" | "Expanding" | "Planned";
  display_order: number;
}

export const DEFAULT_PLATFORMS: PlatformDivision[] = [
  {
    name: "Global Cloud & Distributed Infrastructure",
    slug: "cloud-infrastructure",
    division_code: "BNG-INFRA-01",
    category: "Core Infrastructure",
    icon_name: "Cloud",
    short_description:
      "Ultra-low latency global edge network, multi-region cloud orchestration, and high-availability enterprise infrastructure architecture.",
    full_description:
      "Booking Network Global Group's Global Cloud & Distributed Infrastructure division architects and operates the foundational digital backbone powering modern enterprise applications. Spanning 45+ multi-region cloud edge nodes, intelligent traffic mesh routing, and automated zero-downtime failover systems, this division delivers carrier-grade 99.999% availability and microsecond-level content distribution worldwide.",
    logo: "/logos/booking-network.svg",
    features: [
      "High-throughput distributed edge computing and low-latency packet routing across 45+ global regions",
      "Multi-cloud automated failover orchestration and autonomous disaster recovery protocols",
      "Software-defined networking (SDN) mesh with adaptive load balancing and DDoS mitigation",
      "Enterprise microservices telemetry, real-time observability, and distributed tracing",
      "Sustainable, carbon-optimized datacenter compute scheduling and energy-efficient workloads",
    ],
    key_metrics: [
      { label: "Global Edge POPs", value: "45+" },
      { label: "Availability SLA", value: "99.999%" },
      { label: "Cross-Border Latency", value: "<15ms" },
      { label: "Global Backbone Throughput", value: "100+ Tbps" },
    ],
    target_audience:
      "Global enterprises, high-volume digital platforms, cloud-native scale-ups, and mission-critical distributed systems requiring uninterrupted uptime.",
    business_purpose:
      "To provide the sovereign, high-speed digital foundation for all group operations, strategic joint ventures, and global enterprise partner networks.",
    website_url: null,
    platform_status: "Core Architecture",
    publication_status: "Published",
    display_order: 1,
    seo_title: "Global Cloud & Distributed Infrastructure | Booking Network Global Group",
    seo_description:
      "Explore Booking Network Global Group's Global Cloud & Distributed Infrastructure division, engineering ultra-low latency edge networks and enterprise cloud resilience.",
  },
  {
    name: "AI & Data Intelligence Engine",
    slug: "ai-data-intelligence",
    division_code: "BNG-DATA-02",
    category: "AI & Big Data",
    icon_name: "Cpu",
    short_description:
      "High-scale real-time data pipelines, predictive intelligence frameworks, and next-generation search, matching, and recommendation algorithms.",
    full_description:
      "The AI & Data Intelligence Engine division drives Booking Network Global Group's advanced analytical capabilities and machine learning infrastructures. Processing petabytes of streaming data across global supply and demand vectors, the engine powers hyper-personalized discovery, semantic metasearch, anomaly detection, and automated market intelligence with enterprise-grade data privacy and governance.",
    logo: "/logos/booking-network.svg",
    features: [
      "Real-time streaming ETL pipelines capable of processing millions of events per second",
      "Proprietary vector search and deep semantic ranking engine for cross-border catalog discovery",
      "Enterprise generative AI middleware with strict role-based access control and data residency protection",
      "Predictive demand forecasting, dynamic pricing intelligence, and algorithmic risk telemetry",
      "Federated learning frameworks enabling localized model training without sensitive data movement",
    ],
    key_metrics: [
      { label: "Streaming Events / Sec", value: "12M+" },
      { label: "Vector Search Latency", value: "<8ms" },
      { label: "Data Governance Standard", value: "ISO 27701" },
      { label: "AI Inference Precision", value: "99.4%" },
    ],
    target_audience:
      "Enterprise data teams, algorithmic trading and market researchers, platform operators, and digital service ecosystems seeking intelligent automated decisioning.",
    business_purpose:
      "To transform raw global network data into real-time operational intelligence, powering high-precision search, matching, and strategic decision automation.",
    website_url: null,
    platform_status: "Live",
    publication_status: "Published",
    display_order: 2,
    seo_title: "AI & Data Intelligence Engine | Booking Network Global Group",
    seo_description:
      "Discover the AI & Data Intelligence Engine at Booking Network Global Group, delivering petabyte-scale data pipelines, semantic search, and predictive analytics.",
  },
  {
    name: "Global B2B Network & API Mesh",
    slug: "global-network-mesh",
    division_code: "BNG-MESH-03",
    category: "B2B Platform & API",
    icon_name: "Network",
    short_description:
      "A hyper-connected network bridge delivering real-time interoperability between global enterprise partners, supply chains, and digital service endpoints.",
    full_description:
      "The Global B2B Network & API Mesh serves as the universal digital bridge for Booking Network Global Group's enterprise alliances. By unifying fragmented partner APIs, transactional protocols, and B2B data exchanges into a standardized, high-performance mesh architecture, this division accelerates cross-border collaboration and unlocks frictionless commercial integrations.",
    logo: "/logos/booking-network.svg",
    features: [
      "Unified GraphQL and gRPC gateway mesh with automated protocol translation and schema validation",
      "Sub-millisecond transactional messaging with idempotency and distributed consensus guarantees",
      "Self-service developer sandbox, automated compliance verification, and instant partner onboarding",
      "Dynamic rate limiting, API token lifecycle governance, and granular partner access scopes",
      "Cross-border settlement rails and automated reconciliation telemetry for international trade partners",
    ],
    key_metrics: [
      { label: "Daily API Calls Processed", value: "2.8B+" },
      { label: "Connected Enterprise Partners", value: "1,400+" },
      { label: "Median Mesh Latency", value: "3.2ms" },
      { label: "Transactional SLA", value: "99.99%" },
    ],
    target_audience:
      "Global B2B partners, fintech providers, travel consolidators, e-commerce networks, and corporate enterprise systems integrating cross-platform services.",
    business_purpose:
      "To eliminate technical friction between multinational business partners and create an open, interconnected API ecosystem for global trade.",
    website_url: null,
    platform_status: "Live",
    publication_status: "Published",
    display_order: 3,
    seo_title: "Global B2B Network & API Mesh | Booking Network Global Group",
    seo_description:
      "Learn about Booking Network Global Group's Global B2B Network & API Mesh, enabling real-time interoperability and unified API bridges across worldwide partners.",
  },
  {
    name: "Enterprise FinTech & Trust Architecture",
    slug: "fintech-trust-security",
    division_code: "BNG-TRUST-04",
    category: "FinTech & Cybersecurity",
    icon_name: "ShieldCheck",
    short_description:
      "Zero-trust security governance, international regulatory compliance frameworks, cross-border cryptographic data integrity, and digital trust protocols.",
    full_description:
      "The Enterprise FinTech & Trust Architecture division establishes and enforces security, cryptographic integrity, and regulatory compliance across all Booking Network Global Group operations. Operating under stringent Zero-Trust principles, the division protects sensitive financial telemetry, orchestrates multi-currency clearing protocols, and ensures absolute compliance with international data protection regimes.",
    logo: "/logos/booking-network.svg",
    features: [
      "Zero-Trust Architecture (ZTA) with continuous identity verification and end-to-end payload encryption",
      "Multi-jurisdiction regulatory compliance engine covering GDPR, CCPA, PCI-DSS Level 1, and SOC 2 Type II",
      "Immutable audit trails utilizing distributed cryptographic ledger technology for non-repudiation",
      "Automated vulnerability scanning, threat intelligence feeds, and automated incident containment",
      "High-performance cryptographic key management (HSM) with zero-knowledge verification mechanisms",
    ],
    key_metrics: [
      { label: "Security Compliance", value: "SOC 2 Type II" },
      { label: "Regulatory Standard", value: "PCI-DSS L1" },
      { label: "Cryptographic Standard", value: "AES-256-GCM" },
      { label: "Zero-Trust Coverage", value: "100%" },
    ],
    target_audience:
      "Financial institutions, regulatory bodies, enterprise risk officers, legal compliance departments, and organizations with strict data protection mandates.",
    business_purpose:
      "To safeguard group assets, customer privacy, and enterprise partner data through unyielding security governance and regulatory leadership.",
    website_url: null,
    platform_status: "Core Architecture",
    publication_status: "Published",
    display_order: 4,
    seo_title: "Enterprise FinTech & Trust Architecture | Booking Network Global Group",
    seo_description:
      "Explore Booking Network Global Group's Enterprise FinTech & Trust Architecture, ensuring zero-trust cybersecurity, cryptographic integrity, and global compliance.",
  },
  {
    name: "Next-Gen Digital Ecosystem Studio",
    slug: "digital-ecosystem-studio",
    division_code: "BNG-STUDIO-05",
    category: "Platform Incubation & Scale",
    icon_name: "Boxes",
    short_description:
      "Standardizing global vertical platform architectures, deploying modular SaaS/PaaS frameworks, and governing strategic joint venture tech holdings.",
    full_description:
      "The Next-Gen Digital Ecosystem Studio acts as the incubator, architecture lab, and scaling engine for Booking Network Global Group's expanding platform investments. By cultivating reusable design systems, modular backend micro-engines, and institutional tech governance, the studio rapidly transforms strategic market opportunities into fully governed, production-grade digital enterprises.",
    logo: "/logos/booking-network.svg",
    features: [
      "Turnkey modular platform scaffolding accelerating enterprise time-to-market from quarters to weeks",
      "Enterprise design system and reusable UI/UX component library adhering to WCAG 2.2 AA accessibility",
      "Multi-tenant cloud architecture with isolated data residency and tenant-specific encryption keys",
      "Strategic technology advisory, architectural auditing, and tech debt remediation for joint ventures",
      "Continuous experimentation platform supporting automated multivariate testing and feature flagging",
    ],
    key_metrics: [
      { label: "Incubated Platforms", value: "18+" },
      { label: "Time-to-Market Reduction", value: "-65%" },
      { label: "Core Component Reusability", value: "82%" },
      { label: "Registered Patents & IP", value: "34" },
    ],
    target_audience:
      "Global joint ventures, enterprise spin-offs, corporate venture arms, and internal product teams building next-generation digital services.",
    business_purpose:
      "To systematically engineer and scale high-value platform initiatives under the Booking Network Global Group technology umbrella.",
    website_url: null,
    platform_status: "Expanding",
    publication_status: "Published",
    display_order: 5,
    seo_title: "Next-Gen Digital Ecosystem Studio | Booking Network Global Group",
    seo_description:
      "Discover how the Next-Gen Digital Ecosystem Studio at Booking Network Global Group incubates, architects, and scales enterprise platform frameworks worldwide.",
  },
  {
    name: "Global ESG & Sustainable Tech Initiative",
    slug: "sustainable-tech-esg",
    division_code: "BNG-ESG-06",
    category: "ESG & Governance",
    icon_name: "Globe",
    short_description:
      "Eco-optimized cloud computing, digital accessibility inclusion, transparent algorithmic ethics, and progressive corporate governance.",
    full_description:
      "The Global ESG & Sustainable Tech Initiative embeds environmental stewardship, ethical AI governance, and social accessibility into every layer of Booking Network Global Group's technical infrastructure. By engineering carbon-aware workload scheduling, promoting open digital literacy, and adhering to strict ethical board governance, the group ensures that global scale is matched with sustainable responsibility.",
    logo: "/logos/booking-network.svg",
    features: [
      "Carbon-aware cloud workload orchestration directing non-urgent computing to renewable-powered regions",
      "100% digital accessibility mandate across all public interfaces and documentation (WCAG 2.2 AAA)",
      "Ethical AI oversight board ensuring unbiased algorithmic recommendations and transparency in automated decisions",
      "Digital inclusion grants and open-source infrastructure contributions supporting underserved communities",
      "Annual ESG sustainability reporting verified under international GHG Protocol and SASB standards",
    ],
    key_metrics: [
      { label: "Renewable Energy Compute", value: "88%" },
      { label: "Carbon Intensity Reduction", value: "-42% YoY" },
      { label: "Digital Accessibility Rating", value: "AAA Compliant" },
      { label: "Governance Rating", value: "Tier-1 ESG" },
    ],
    target_audience:
      "Institutional investors, ESG rating agencies, environmental partners, public sector institutions, and socially conscious global consumers.",
    business_purpose:
      "To lead the global technology sector in environmental efficiency, ethical governance, and inclusive digital stewardship.",
    website_url: null,
    platform_status: "Live",
    publication_status: "Published",
    display_order: 6,
    seo_title: "Global ESG & Sustainable Tech Initiative | Booking Network Global Group",
    seo_description:
      "Learn about Booking Network Global Group's commitment to sustainable cloud computing, digital accessibility, ethical AI, and ESG leadership.",
  },
];

export const DEFAULT_NEWS_POSTS: NewsPostItem[] = [
  {
    title: "Booking Network Global Group Announces 2026 Strategic Vision: Architecting the Global Digital Backbone",
    slug: "strategic-vision-2026-global-digital-backbone",
    category: "Press Release",
    summary:
      "Booking Network Global Group officially unveils its unified global platform group architecture, consolidating infrastructure, AI intelligence, and enterprise B2B mesh networks under a single strategic holding.",
    content: `## Executive Overview

**SEOUL & SILICON VALLEY — October 2026** — **Booking Network Global Group**, a premier international IT platform group and digital infrastructure holding, today announced the formal ratification of its **2026–2030 Strategic Technology Roadmap**.

Under the keynote theme *"Architecting the Global Digital Backbone. Connecting Next-Generation Platforms,"* the Group consolidates its operations across six foundational business and technology divisions:

1. **Global Cloud & Distributed Infrastructure**
2. **AI & Data Intelligence Engine**
3. **Global B2B Network & API Mesh**
4. **Enterprise FinTech & Trust Architecture**
5. **Next-Gen Digital Ecosystem Studio**
6. **Global ESG & Sustainable Tech Initiative**

### Strategic Milestones

The newly unified holding structure transitions Booking Network Global Group from vertical application management to institutional digital backbones, providing carrier-grade cloud orchestration, sovereign zero-trust security, and real-time cross-border API bridges for over 1,400 enterprise partners globally.

> "Our mission is not merely to build digital tools, but to architect the resilient, intelligent digital foundation upon which the next century of global trade, information, and human connection will thrive," said the Executive Committee in a joint statement.

### Global Expansion Schedule

The Group will expand its regional operational hubs in **Seoul (Global HQ)**, **San Jose (North America R&D)**, **Frankfurt (European Regulatory & FinTech)**, and **Dubai (MENA Trade Node)**, with institutional investment focused on multi-region low-latency edge deployment and carbon-aware computing topologies.`,
    is_featured: true,
    publication_status: "Published",
    published_at: "2026-10-24T09:00:00.000Z",
    author_name: "Booking Network Global Group PR",
    seo_title: "2026 Strategic Vision: Global Digital Backbone | Booking Network Global Group",
    seo_description:
      "Official press release announcing Booking Network Global Group's 2026 strategic roadmap and global IT platform architecture.",
  },
  {
    title: "Q3 2026 Institutional Briefing: Multi-Region Cloud Infrastructure and Enterprise API Mesh Expansion",
    slug: "q3-2026-institutional-briefing-infrastructure-expansion",
    category: "IR & Governance",
    summary:
      "Executive leadership presents key milestones in multi-region cloud edge deployment, achieving 99.999% network availability across 45 global regions.",
    content: `## Institutional Investor & Governance Briefing — Q3 2026

**Booking Network Global Group** released its quarterly governance and operational briefing today, demonstrating accelerated adoption of its **Global B2B Network & API Mesh** and the expansion of the Group's multi-region edge footprint.

### Key Operational Highlights

- **Infrastructure Availability:** Maintained an unprecedented **99.999% SLA** across all core routing backbones throughout Q3 2026.
- **Enterprise Mesh Volume:** Surpassed **2.8 billion daily API transactions**, representing a 48% YoY increase in cross-border payload volume.
- **Capital Expenditure:** Successfully deployed capital into 12 new cloud edge points of presence (POPs) throughout APAC and Western Europe.

### Governance and Compliance Certification

The Group's Audit & Risk Committee confirmed the successful completion of the **SOC 2 Type II** recertification and the expansion of the Group's Zero-Knowledge cryptographic key management protocol across all enterprise partners.`,
    is_featured: true,
    publication_status: "Published",
    published_at: "2026-10-18T14:30:00.000Z",
    author_name: "Investor Relations & Compliance",
    seo_title: "Q3 2026 Institutional Briefing | Booking Network Global Group",
    seo_description:
      "Read the official Q3 2026 institutional and operational briefing from Booking Network Global Group IR.",
  },
  {
    title: "Whitepaper Release: Zero-Trust Security Protocols for Cross-Border Financial Telemetry",
    slug: "whitepaper-zero-trust-financial-telemetry",
    category: "Technology",
    summary:
      "The Enterprise FinTech & Trust Architecture division publishes comprehensive architectural guidelines on cryptographic integrity and real-time compliance.",
    content: `## Technical Whitepaper: Sovereign Trust in Cross-Border Data Flows

The **Enterprise FinTech & Trust Architecture** division of Booking Network Global Group has released a comprehensive engineering whitepaper addressing multi-jurisdiction data privacy and microsecond payload authentication.

### Core Architectural Pillars

- **Decentralized Identity Verification:** Replacing static credentials with continuous hardware-backed cryptographic proof.
- **Zero-Knowledge Data Validation:** Enabling financial transactions and identity verifications without exposing underlying consumer PII.
- **Automated Jurisdictional Fencing:** Ensuring streaming data strictly conforms to local data residency statutes (GDPR, APPI, CCPA).

The full whitepaper is available to registered enterprise partners and academic researchers through our Global Partnership Portal.`,
    is_featured: false,
    publication_status: "Published",
    published_at: "2026-10-10T11:00:00.000Z",
    author_name: "Enterprise Architecture Committee",
    seo_title: "Whitepaper: Zero-Trust Financial Telemetry | Booking Network Global Group",
    seo_description:
      "Technical whitepaper from Booking Network Global Group on zero-trust architectures for cross-border financial data.",
  },
  {
    title: "Corporate Governance Update: Formation of the Global AI Ethics and Sustainability Advisory Committee",
    slug: "corporate-governance-ai-ethics-advisory-committee",
    category: "Global Notice",
    summary:
      "Independent international experts appointed to govern algorithmic fairness, data residency standards, and carbon-aware computing mandates.",
    content: `## Official Corporate Governance Announcement

In alignment with our founding charter for sustainable digital leadership, the Board of Directors of **Booking Network Global Group** has formally instituted the **Global AI Ethics and Sustainability Advisory Committee (GAESAC)**.

### Mandate and Oversight Authority

1. **Algorithmic Transparency:** Auditing proprietary machine learning models for bias mitigation and equitable access.
2. **Carbon-Aware Scheduling:** Enforcing that non-real-time analytical workloads operate primarily during peak renewable generation cycles.
3. **Data Sovereignty Protection:** Ensuring that group platform initiatives respect national sovereignty and regional privacy rights.

The committee will publish an annual public audit report independently verifying all Group ESG metrics and ethical AI governance compliance.`,
    is_featured: false,
    publication_status: "Published",
    published_at: "2026-10-02T08:00:00.000Z",
    author_name: "Board of Directors Secretariat",
    seo_title: "Corporate Governance: AI Ethics & Sustainability | Booking Network Global Group",
    seo_description:
      "Booking Network Global Group announces the formation of the Global AI Ethics and Sustainability Advisory Committee.",
  },
];

export const DEFAULT_GLOBAL_HUBS: GlobalHubItem[] = [
  {
    region: "APAC",
    city: "Seoul",
    country: "Republic of Korea",
    hub_type: "Global HQ",
    description:
      "Central strategic governance, executive corporate leadership, core architectural design, and global technology holding operations.",
    address: "Teheran-ro, Gangnam-gu, Seoul, Republic of Korea",
    contact_email: "hq@bookingnetwork.com",
    status: "Active",
    display_order: 1,
  },
  {
    region: "North America",
    city: "San Jose, CA",
    country: "United States",
    hub_type: "R&D Center",
    description:
      "Advanced edge computing research, distributed AI model optimization, and North American enterprise alliance coordination.",
    address: "Silicon Valley Technology Center, San Jose, CA, USA",
    contact_email: "na@bookingnetwork.com",
    status: "Active",
    display_order: 2,
  },
  {
    region: "Europe",
    city: "Frankfurt",
    country: "Germany",
    hub_type: "Regional Hub",
    description:
      "European Union regulatory compliance governance, GDPR technical verification, and continental B2B API mesh interconnects.",
    address: "Main Tower Financial District, Frankfurt am Main, Germany",
    contact_email: "eu@bookingnetwork.com",
    status: "Active",
    display_order: 3,
  },
  {
    region: "MENA",
    city: "Dubai",
    country: "United Arab Emirates",
    hub_type: "Cloud Node",
    description:
      "Cross-border digital trade facilitation, Middle East and African regional edge latency optimization, and partner mesh onboarding.",
    address: "DIFC Innovation Center, Dubai, UAE",
    contact_email: "mena@bookingnetwork.com",
    status: "Active",
    display_order: 4,
  },
];

export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  company_name: "Booking Network Global Group",
  company_name_kr: "부킹네트워크글로벌그룹 (Booking Network Global Group)",
  tagline: "Architecting the Global Digital Backbone. Connecting Next-Generation Platforms.",
  tagline_kr: "글로벌 디지털 백본을 설계하고, 차세대 플랫폼 생태계를 연결합니다.",
  brand_positioning:
    "Booking Network Global Group is a premier global IT platform group that architects, governs, and scales enterprise-grade digital infrastructure, intelligent network ecosystems, and cross-border platform technologies across global markets.",
  brand_positioning_kr:
    "부킹네트워크글로벌그룹(Booking Network Global Group)은 글로벌 시장 전반에서 엔터프라이즈급 디지털 인프라, 지능형 네트워크 생태계 및 크로스보더 플랫폼 기술을 설계, 거버넌스 및 확장하는 최고의 글로벌 IT 플랫폼 그룹입니다.",
  corporate_email: "contact@bookingnetwork.com",
  ir_email: "ir@bookingnetwork.com",
  pr_email: "press@bookingnetwork.com",
  telephone: "+82 2-555-0199",
  business_address: "Teheran-ro, Gangnam-gu, Seoul, Republic of Korea",
  operating_hours: "Monday – Friday: 09:00 – 18:00 (KST / UTC+9)",
  website_domain: "https://bookingnetwork.com",
  contact_notification_email: "inquiries@bookingnetwork.com",
  social_linkedin: "https://linkedin.com/company/booking-network-global-group",
  social_x: "https://x.com/BookingNetworkGG",
  social_youtube: "https://youtube.com/@BookingNetworkGlobalGroup",
  social_github: "https://github.com/booking-network-global-group",
  footer_copyright: `© ${new Date().getFullYear()} Booking Network Global Group. All rights reserved.`,
  default_seo_title: "Booking Network Global Group — Official Global IT Platform Group Portal",
  default_seo_description:
    "Official corporate portal of Booking Network Global Group — architecting the global digital backbone across cloud infrastructure, AI intelligence, B2B network mesh, and fintech trust architecture.",
  brand_logo: "/logos/booking-network.svg",
  favicon: "/favicon.ico",
  cookie_consent_enabled: "true",
  default_locale: "en",
  global_announcement_enabled: "true",
  global_announcement_text:
    "Booking Network Global Group ratifies 2026 Strategic Technology Blueprint across 6 Core Divisions.",
  global_announcement_link: "/newsroom/strategic-vision-2026-global-digital-backbone",
};

export const DEFAULT_CONTENT_PAGES: Record<
  string,
  { content: Record<string, unknown>; seo_metadata: { title?: string; description?: string } }
> = {
  home: {
    seo_metadata: {
      title: "Booking Network Global Group — Architecting the Global Digital Backbone",
      description:
        "Official portal of Booking Network Global Group. Architecting enterprise digital infrastructure, AI intelligence, and connected global platforms.",
    },
    content: {
      hero_badge: "BOOKING NETWORK GLOBAL GROUP • GLOBAL IT PLATFORM HOLDING & TECH ECOSYSTEM",
      hero_headline: "Architecting the Global Digital Backbone.",
      hero_supporting_text:
        "Booking Network Global Group architects, governs, and scales mission-critical digital infrastructure, intelligent data engines, and cross-border platform ecosystems connecting global enterprise markets.",
      hero_primary_cta_text: "Explore Core Divisions",
      hero_primary_cta_link: "/platforms",
      hero_secondary_cta_text: "Global Partnerships & IR",
      hero_secondary_cta_link: "/contact",
      hero_metrics: [
        { label: "Core Tech Divisions", value: "6 Pillars" },
        { label: "Global Edge Regions", value: "45+ POPs" },
        { label: "Carrier-Grade Availability", value: "99.999% SLA" },
        { label: "Zero-Trust Security Coverage", value: "100% ZTA" },
      ],
      about_heading: "Strategic Technology Holding & Global Digital Governance",
      about_body:
        "Booking Network Global Group operates as the institutional technology holding entity overseeing six foundational pillars of next-generation digital life. Through continuous capital stewardship, sovereign security protocols, and high-performance edge orchestration, we enable seamless interoperability for thousands of multinational enterprises, institutions, and digital creators worldwide.",
      business_areas: [
        {
          id: "infra",
          title: "Global Cloud & Distributed Infrastructure",
          description:
            "Carrier-grade edge network routing, multi-cloud automated failover, and high-availability datacenter infrastructure across 45+ global regions.",
          icon: "Cloud",
        },
        {
          id: "ai",
          title: "AI & Data Intelligence Engine",
          description:
            "Streaming big-data pipelines processing millions of events per second with semantic vector search and predictive analytical intelligence.",
          icon: "Cpu",
        },
        {
          id: "mesh",
          title: "Global B2B Network & API Mesh",
          description:
            "Sub-millisecond API mesh and universal gateway bridging disparate enterprise partner systems, supply chains, and transactional networks.",
          icon: "Network",
        },
        {
          id: "trust",
          title: "Enterprise FinTech & Trust Architecture",
          description:
            "Zero-trust compliance governance, distributed cryptographic ledgers, and institutional regulatory compliance (SOC 2, PCI-DSS L1, GDPR).",
          icon: "ShieldCheck",
        },
        {
          id: "studio",
          title: "Next-Gen Digital Ecosystem Studio",
          description:
            "Modular platform incubation framework standardizing microservices, high-speed UX systems, and strategic technology joint ventures.",
          icon: "Boxes",
        },
        {
          id: "esg",
          title: "Global ESG & Sustainable Tech Initiative",
          description:
            "Carbon-optimized datacenter compute scheduling, 100% digital accessibility inclusion, and ethical AI algorithmic governance.",
          icon: "Globe",
        },
      ],
      ecosystem_heading: "The 6 Core Business & Technology Divisions",
      ecosystem_subtitle:
        "Engineered for sovereign operational excellence, high-volume transactional throughput, and unyielding enterprise security standards.",
      partnership_headline: "Strategic Alliances, Institutional Investment & Global Enterprise Integration",
      partnership_text:
        "Connect with Booking Network Global Group's executive leadership, institutional investor relations, or enterprise architecture alliance team.",
      partnership_cta_text: "Initiate Strategic Inquiry",
      partnership_cta_link: "/contact",
    },
  },
  about: {
    seo_metadata: {
      title: "About Us — Corporate Governance & Vision | Booking Network Global Group",
      description:
        "Learn about Booking Network Global Group's institutional governance, strategic vision, R&D roadmap, and global regional hubs.",
    },
    content: {
      overview_heading: "Corporate Governance & Strategic Architecture",
      overview_body:
        "Booking Network Global Group is an international IT platform group and digital infrastructure holding company headquartered in Seoul, with operational and research hubs in San Jose, Frankfurt, and Dubai.\n\nOur foundational mandate is to design, govern, and scale the mission-critical digital backbones that empower modern digital commerce, enterprise data intelligence, cross-border financial telemetry, and resilient cloud communications. Rather than operating as isolated software vendors, our group provides centralized architectural governance, institutional risk oversight, and capital stewardship across our six core technical divisions.",
      vision:
        "To engineer an unbreakable, intelligent, and sovereign global digital foundation where information, enterprise trade, and human connectivity flow frictionlessly across borders.",
      mission:
        "To deliver high-availability cloud infrastructure, transparent data intelligence, and zero-trust security standards that empower global enterprises and next-generation platform ecosystems.",
      philosophy_heading: "Institutional Core Principles",
      philosophy_items: [
        {
          title: "Architectural Sovereignty & Resilience",
          description:
            "We design every system for multi-region redundancy, zero-single-point-of-failure topologies, and autonomous failover capabilities exceeding 99.999% availability.",
        },
        {
          title: "Zero-Trust Security by Default",
          description:
            "Security is not a perimeter; it is an intrinsic mathematical property. We enforce continuous cryptographic verification across every internal microservice and external API bridge.",
        },
        {
          title: "Sustainable & Ethical Stewardship",
          description:
            "As we scale computational volume, we aggressively minimize carbon intensity through intelligent renewable workload routing, algorithmic fairness, and strict accessibility mandates.",
        },
      ],
      strategy_heading: "Global Group Technology Roadmap (2026–2030)",
      strategy_body:
        "Over the 2026–2030 strategic horizon, Booking Network Global Group is prioritizing three transformative technological vectors:\n\n1. Autonomous Edge Mesh Computing: Deploying distributed lightweight inference models directly at 100+ edge POPs to eliminate round-trip latency.\n2. Quantum-Resistant Cryptographic Foundations: Upgrading our FinTech and trust architectures to post-quantum cryptographic standards.\n3. Universal B2B Interoperability: Expanding our standardized API mesh to bridge traditional enterprise legacy databases with next-generation decentralized ecosystems.",
      innovation_heading: "Key R&D Focus Areas",
      innovation_items: [
        "Carrier-grade edge networking with microsecond packet routing and autonomous BGP healing",
        "High-scale streaming vector databases and real-time semantic ranking algorithms",
        "Zero-knowledge compliance proofs for cross-border financial settlements",
        "Modular enterprise platform frameworks with instant multi-tenant isolation",
        "Carbon-aware computational dispatch and green datacenter energy telemetry",
      ],
      governance_heading: "Group Governance & Board Oversight",
      governance_body:
        "Booking Network Global Group operates under strict fiduciary governance structured across three independent oversight councils: the Board Audit & Risk Committee, the Global Technology Architecture Advisory Council, and the AI Ethics & Sustainability Committee. This triangular framework guarantees rigorous institutional accountability, regulatory compliance, and alignment with international ESG standards.",
      verified_corporate_facts_note:
        "Official corporate filings, audited financial disclosures, and executive board resolutions are published exclusively through administrator-verified releases in the official Newsroom & IR portal.",
    },
  },
  privacy: {
    seo_metadata: {
      title: "Privacy Policy | Booking Network Global Group",
      description:
        "Official Privacy Policy and Data Governance Statement of Booking Network Global Group.",
    },
    content: {
      title: "Privacy Policy & Data Governance Charter",
      status_badge: "Enterprise Group Corporate Policy",
      last_updated: "October 2026",
      body: `## 1. Introduction and Corporate Scope

This Privacy Policy and Data Governance Charter governs the collection, processing, and protection of information across the official portal of **Booking Network Global Group** ("the Group", "we", "us", or "our").

**Scope of Application:** This policy applies to all executive corporate communications, institutional investor relations portals, and strategic partner inquiry systems operated under the Booking Network Global Group umbrella. Individual enterprise solutions and partner networks operated under our technology holding maintain independent data residency frameworks strictly aligned with local jurisdictional statutes.

## 2. Zero-Trust Information Processing Principles

Our public portal is engineered to maximize privacy and eliminate unnecessary data retention:

- **No Public Registration:** Visitors are not required or prompted to create consumer accounts or submit credentials to access public corporate disclosures.
- **Strict Inquiry Processing:** Data submitted via our [Strategic Contact Portal](/contact) (including name, corporate email, company, and departmental inquiry details) is processed exclusively for official business evaluation, compliance review, and bilateral communication.
- **Cryptographic Encryption:** All transmitted telemetry is secured utilizing TLS 1.3 with AES-256-GCM encryption at rest and in transit.

## 3. Global Regulatory Compliance

Booking Network Global Group actively maintains compliance with premier international data protection and privacy frameworks:

| Regulation | Jurisdiction | Compliance Standard |
| :--- | :--- | :--- |
| **GDPR** (General Data Protection Regulation) | European Union | Full Compliance / DPO Monitored |
| **CCPA / CPRA** | California, USA | Non-Sale / Direct Opt-Out Rights |
| **PIPA** (Personal Information Protection Act) | Republic of Korea | Certified Fiduciary Governance |
| **ISO/IEC 27001 & 27701** | Global | Certified Information & Privacy Management |

## 4. Technical Cookies & Telemetry

This portal utilizes only strictly necessary technical tokens essential for maintaining user interface preferences (such as language selection between **EN** and **KO**), security session state, and DDoS mitigation telemetry. No commercial third-party behavioral tracking or advertising cookies are deployed.

## 5. Exercise of Data Rights & Privacy Office Contact

Individuals and institutional representatives may exercise rights of access, rectification, or erasure by transmitting an authenticated request directly to our **Global Data Protection Officer (DPO)** via our [Contact Portal](/contact) or via electronic mail at \`privacy@bookingnetwork.com\`.`,
    },
  },
  terms: {
    seo_metadata: {
      title: "Terms of Use | Booking Network Global Group",
      description:
        "Official Terms of Use governing access to the Booking Network Global Group portal and digital assets.",
    },
    content: {
      title: "Terms of Use & Legal Notice",
      status_badge: "Enterprise Group Corporate Policy",
      last_updated: "October 2026",
      body: `## 1. Acceptance of Terms

By accessing, viewing, or interacting with the official corporate portal of **Booking Network Global Group** (\`bookingnetwork.com\`), you acknowledge and agree to be bound by these Terms of Use and all applicable international trade, intellectual property, and cybersecurity statutes.

## 2. Institutional Purpose of the Portal

This web portal serves as the authoritative corporate information destination, strategic business division directory, official press newsroom, and investor relations disclosure portal for **Booking Network Global Group**. Material published herein is provided for informational and business evaluation purposes.

## 3. Intellectual Property Rights & Trademarks

All trademarks, service marks, division identifiers (including \`BNG-INFRA-01\`, \`BNG-DATA-02\`, \`BNG-MESH-03\`, \`BNG-TRUST-04\`, \`BNG-STUDIO-05\`, \`BNG-ESG-06\`), architectural blueprints, logos, vector monograms, whitepapers, and software documentation displayed on this website are the proprietary intellectual property of **Booking Network Global Group** or its licensed affiliates. Unauthorized replication, framing, or commercial redistribution is strictly prohibited.

## 4. Forward-Looking Statements Notice

Certain communications, press releases, and IR briefings published within our Newsroom may contain forward-looking statements regarding future technological developments, capital deployments, and market expansions. These statements reflect the Group's strategic outlook as of their respective publication dates and are subject to operational, regulatory, and technological risks.

## 5. Governing Law and Dispute Jurisdiction

These Terms of Use shall be governed by and construed in accordance with the substantive laws of the Republic of Korea, without regard to conflict of law principles. Any legal controversy arising out of or in connection with the portal shall be submitted to the exclusive jurisdiction of the competent courts in Seoul, Republic of Korea.`,
    },
  },
};

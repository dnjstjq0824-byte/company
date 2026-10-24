import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ShoppingBag,
  Compass,
  Search,
  LineChart,
  BookOpen,
  Video,
  Network,
  Shield,
  Globe2,
  Layers,
} from "lucide-react";
import {
  getPublishedPlatforms,
  getContentPageBySlug,
  getAllSiteSettings,
  mapCategoryToFilterGroup,
} from "@/lib/data";
import { PlatformFilterGrid } from "@/components/PlatformFilterGrid";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

interface HomeContent {
  hero_badge?: string;
  hero_headline?: string;
  hero_supporting_text?: string;
  hero_primary_cta_text?: string;
  hero_primary_cta_link?: string;
  hero_secondary_cta_text?: string;
  hero_secondary_cta_link?: string;
  about_heading?: string;
  about_body?: string;
  business_areas?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  ecosystem_heading?: string;
  ecosystem_subtitle?: string;
  partnership_headline?: string;
  partnership_text?: string;
  partnership_cta_text?: string;
  partnership_cta_link?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPageBySlug<HomeContent>("home");
  return {
    title:
      page?.seo_metadata?.title ||
      "Booking Network Co., Ltd. — One Network. A World of Digital Possibilities.",
    description:
      page?.seo_metadata?.description ||
      "Booking Network Co., Ltd. is building a global ecosystem of digital platforms connecting commerce, travel, search, knowledge, financial information, entertainment, and communication.",
    alternates: { canonical: "/" },
  };
}

function getBusinessIcon(iconName: string) {
  switch (iconName) {
    case "ShoppingBag":
      return ShoppingBag;
    case "Compass":
      return Compass;
    case "Search":
      return Search;
    case "LineChart":
      return LineChart;
    case "BookOpen":
      return BookOpen;
    case "Video":
      return Video;
    default:
      return Layers;
  }
}

export default async function HomePage() {
  const [platforms, pageData, settings] = await Promise.all([
    getPublishedPlatforms(),
    getContentPageBySlug<HomeContent>("home"),
    getAllSiteSettings(),
  ]);

  const content = pageData?.content || {};
  const companyName = settings.company_name || "Booking Network Co., Ltd.";
  const tagline =
    settings.tagline || "Connecting Platforms. Expanding Possibilities.";

  const businessAreas = content.business_areas || [
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
  ];

  const sectorGroups = [
    "Commerce",
    "Travel",
    "Financial Information",
    "Search & Knowledge",
    "Media & Communication",
  ];

  return (
    <div>
      {/* SECTION A — HERO */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-600/20 via-navy-900/40 to-navy-950"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            {/* Hero Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric-300">
                <span className="h-2 w-2 rounded-full bg-electric-400" />
                {content.hero_badge || tagline}
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                {content.hero_headline ||
                  "One Network. A World of Digital Possibilities."}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
                {content.hero_supporting_text ||
                  "Booking Network Co., Ltd. is building a global ecosystem of digital platforms connecting commerce, travel, search, knowledge, financial information, entertainment, and communication."}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href={content.hero_primary_cta_link || "/platforms"}
                  className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-electric-600/25 hover:bg-electric-500 transition-all"
                >
                  {content.hero_primary_cta_text || "Explore Our Platforms"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={content.hero_secondary_cta_link || "/contact"}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-navy-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-electric-400 hover:text-white transition-all"
                >
                  {content.hero_secondary_cta_text || "Contact Us"}
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-800/80 pt-8">
                <div>
                  <p className="text-2xl font-extrabold text-white">
                    {platforms.length}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    Digital Platforms in Portfolio
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">6</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    Core Digital Sectors
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-electric-400">
                    Global
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    Multi-Market Architecture
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Interactive Ecosystem Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-slate-800 bg-navy-900/80 p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric-600/20 text-electric-400">
                      <Network className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-electric-400">
                        Corporate Umbrella
                      </p>
                      <p className="text-sm font-bold text-white">
                        {companyName}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-slate-700 bg-navy-950 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                    Portfolio Hub
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {platforms.slice(0, 10).map((p) => (
                    <Link
                      key={p.id}
                      href={`/platforms/${p.slug}`}
                      className="group flex items-center gap-2.5 rounded-xl border border-slate-800/90 bg-navy-950/90 p-2.5 transition-all hover:border-electric-500/60 hover:bg-navy-900"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-navy-900 p-1">
                        {p.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.logo}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-electric-400">
                            {p.name.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white group-hover:text-electric-400 transition-colors">
                          {p.name}
                        </p>
                        <p className="truncate text-[10px] text-slate-400">
                          {p.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-slate-800/80 bg-navy-950/60 px-3.5 py-2.5 text-center text-[11px] text-slate-400">
                  Independent Platforms • Dedicated Identities • Shared Vision
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — ABOUT BOOKING NETWORK */}
      <section className="border-b border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                Corporate Identity
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {content.about_heading ||
                  "Building Connections Across Digital Industries"}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                {content.about_body ||
                  "Booking Network Co., Ltd. develops independent digital platforms while creating opportunities for discovery, access, and connectivity across its broader ecosystem."}
              </p>
              <div className="mt-7">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-electric-600 hover:text-electric-700 dark:text-electric-400 dark:hover:text-electric-300"
                >
                  Read Our Full Corporate Story & Vision
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-navy-900">
                <Globe2 className="h-7 w-7 text-electric-600 dark:text-electric-400" />
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  Independent Services
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Each platform retains its own specialized brand, domain
                  identity, and dedicated operational infrastructure.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-navy-900">
                <Shield className="h-7 w-7 text-electric-600 dark:text-electric-400" />
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  Strategic Governance
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Booking Network Co., Ltd. provides long-term product
                  direction, quality standards, and multi-sector synergy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C — OUR PLATFORMS */}
      <section className="bg-slate-50/70 py-20 dark:bg-navy-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                Platform Portfolio
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Our Platforms
              </h2>
              <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-300">
                Explore the digital platforms developed and stewarded by{" "}
                {companyName}. Filter by business category to learn more about
                each initiative.
              </p>
            </div>
            <Link
              href="/platforms"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-electric-600 hover:underline dark:text-electric-400"
            >
              Open Full Platform Directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <PlatformFilterGrid platforms={platforms} />
        </div>
      </section>

      {/* SECTION D — OUR BUSINESS AREAS */}
      <section className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
              Core Competencies
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Our Business Areas
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Our platform ecosystem focuses on six foundational digital
              industries that connect people with commerce, travel, knowledge,
              and communication.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businessAreas.map((area, idx) => {
              const IconComponent = getBusinessIcon(area.icon);
              return (
                <div
                  key={area.id || idx}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-7 transition-colors hover:border-electric-500/40 dark:border-slate-800 dark:bg-navy-900/60"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-electric-600/10 text-electric-600 dark:bg-electric-500/15 dark:text-electric-400">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                    {area.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION E — CONNECTED ECOSYSTEM */}
      <section className="border-t border-slate-200/80 bg-slate-50 py-20 dark:border-slate-800/80 dark:bg-navy-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
              Ecosystem Architecture
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {content.ecosystem_heading ||
                "An Umbrella of Independently Operated Platforms"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              {content.ecosystem_subtitle ||
                "Booking Network Co., Ltd. serves as the central corporate entity behind ten specialized platforms. Each service operates with independent branding, dedicated domain routing, and distinct technical infrastructure—ensuring specialized excellence without conflating user accounts or operational boundaries."}
            </p>
          </div>

          {/* Visual Corporate Umbrella Diagram */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-950 sm:p-10">
            {/* Top Corporate Node */}
            <div className="mx-auto max-w-md rounded-2xl border-2 border-electric-500 bg-navy-950 p-5 text-center text-white shadow-lg">
              <p className="text-[11px] font-bold uppercase tracking-widest text-electric-400">
                Parent Corporate Entity
              </p>
              <p className="mt-1 text-xl font-extrabold">{companyName}</p>
              <p className="mt-1 text-xs text-slate-300">
                Corporate Strategy • Brand Governance • Portfolio Stewardship
              </p>
            </div>

            {/* Connector Line */}
            <div className="mx-auto h-8 w-0.5 bg-electric-500/50" aria-hidden="true" />

            {/* Sector Columns */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {sectorGroups.map((sector) => {
                const sectorPlatforms = platforms.filter(
                  (p) => mapCategoryToFilterGroup(p.category) === sector
                );
                return (
                  <div
                    key={sector}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-navy-900"
                  >
                    <div className="border-b border-slate-200 pb-2.5 dark:border-slate-800">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-electric-600 dark:text-electric-400">
                        {sector}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-1 flex-col gap-2.5">
                      {sectorPlatforms.map((sp) => (
                        <Link
                          key={sp.id}
                          href={`/platforms/${sp.slug}`}
                          className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm transition-colors hover:border-electric-500 dark:border-slate-800 dark:bg-navy-950"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {sp.name}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {sp.category}
                          </p>
                          <div className="mt-2">
                            <StatusBadge status={sp.platform_status} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-xl bg-slate-100 px-4 py-3 text-center text-xs text-slate-600 dark:bg-navy-900 dark:text-slate-400">
              <strong>Operational Independence Notice:</strong> Each platform in
              the {companyName} ecosystem maintains its own separate website,
              service infrastructure, and user governance upon launch.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F — PARTNERSHIP CTA */}
      <section className="bg-navy-950 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full border border-electric-500/30 bg-electric-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-electric-400">
            Global Collaboration
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {content.partnership_headline ||
              "Let's Build New Opportunities Together."}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            {content.partnership_text ||
              "Interested in partnerships, business collaboration, or learning more about our platforms? Connect with Booking Network."}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href={content.partnership_cta_link || "/contact"}
              className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-electric-600/25 hover:bg-electric-500 transition-all"
            >
              {content.partnership_cta_text || "Contact Our Team"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


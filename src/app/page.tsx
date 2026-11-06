import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import {
  getPublishedPlatforms,
  getContentPageBySlug,
  getPublishedNewsPosts,
} from "@/lib/data";
import { PlatformFilterGrid } from "@/components/PlatformFilterGrid";
import { NetworkTopologyMatrix } from "@/components/NetworkTopologyMatrix";
import { BentoGrid } from "@/components/BentoGrid";
import { ArchitectureBlueprint } from "@/components/ArchitectureBlueprint";
import { NewsroomSection } from "@/components/NewsroomSection";
import { SectionHeader } from "@/components/SectionHeader";

export const dynamic = "force-dynamic";

interface HomeContent {
  hero_badge?: string;
  hero_headline?: string;
  hero_supporting_text?: string;
  hero_primary_cta_text?: string;
  hero_primary_cta_link?: string;
  hero_secondary_cta_text?: string;
  hero_secondary_cta_link?: string;
  hero_metrics?: Array<{ label: string; value: string }>;
  ecosystem_heading?: string;
  ecosystem_subtitle?: string;
  partnership_headline?: string;
  partnership_text?: string;
  partnership_cta_text?: string;
  partnership_cta_link?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPageBySlug<HomeContent>("home");
  const title =
    page?.seo_metadata?.title ||
    "Booking Network Global Group — Architecting the Global Digital Backbone";
  const description =
    page?.seo_metadata?.description ||
    "Official corporate portal of Booking Network Global Group. Architecting enterprise digital infrastructure, AI intelligence, and connected global platforms.";
  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, type: "website", url: "/" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HomePage() {
  const [platforms, newsPosts, pageData] = await Promise.all([
    getPublishedPlatforms(),
    getPublishedNewsPosts(4),
    getContentPageBySlug<HomeContent>("home"),
  ]);

  const content = pageData?.content || {};

  const heroMetrics = content.hero_metrics || [
    { label: "Core Tech Divisions", value: "6 Pillars" },
    { label: "Global Edge Regions", value: "45+ POPs" },
    { label: "Carrier-Grade Availability", value: "99.999% SLA" },
    { label: "Zero-Trust Security Coverage", value: "100% ZTA" },
  ];

  return (
    <div className="flex flex-col">
      {/* ============================================================ */}
      {/* SECTION 1: EXECUTIVE GLOBAL GROUP HERO & TOPOLOGY MATRIX */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-white pt-12 pb-20 dark:bg-obsidian-950 transition-colors">
        {/* Subtle mesh background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-cobalt-500/10 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-6 max-w-2xl">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-bold tabular-nums text-cobalt-600 dark:text-cyan-400">
                  BNGG — 00
                </span>
                <span aria-hidden="true" className="h-px w-12 bg-cobalt-500/50" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {content.hero_badge || "Global IT Platform Holding"}
                </span>
              </div>

              <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                {content.hero_headline || "Architecting the Global Digital Backbone."}
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {content.hero_supporting_text ||
                  "Booking Network Global Group architects, governs, and scales mission-critical digital infrastructure, intelligent data engines, and cross-border platform ecosystems connecting global enterprise markets."}
              </p>

              {/* Hero Action CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  href={content.hero_primary_cta_link || "/platforms"}
                  className="inline-flex items-center gap-2 rounded-full bg-cobalt-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-cobalt-600/25 hover:bg-cobalt-500 transition-colors"
                >
                  <span>{content.hero_primary_cta_text || "Explore Core Divisions"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={content.hero_secondary_cta_link || "/contact"}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 underline decoration-cobalt-500/40 decoration-2 underline-offset-4 hover:decoration-cobalt-500 dark:text-white dark:decoration-cyan-400/40 dark:hover:decoration-cyan-400 transition-colors"
                >
                  <span>{content.hero_secondary_cta_text || "Global Partnerships & IR"}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Executive Subtitle Badge */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <Building2 className="h-4 w-4 text-cobalt-600 dark:text-cyan-400 shrink-0" />
                <span>
                  Headquartered in Seoul • Operational Hubs in San Jose, Frankfurt & Dubai
                </span>
              </div>
            </div>

            {/* Right Interactive Visual: Network Topology Control Matrix */}
            <div className="lg:col-span-6">
              <NetworkTopologyMatrix />
            </div>
          </div>

          {/* Executive Key Metrics Ledger */}
          <div className="mt-16 border-t-2 border-slate-900 pt-6 dark:border-white">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {heroMetrics.map((metric, idx) => (
                <div key={idx}>
                  <span className="block font-mono text-2xl font-extrabold tabular-nums tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {metric.value}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: GROUP IDENTITY & GOVERNANCE BENTO GRID */}
      {/* ============================================================ */}
      <BentoGrid />

      {/* ============================================================ */}
      {/* SECTION 3: 6 CORE BUSINESS & TECHNOLOGY DIVISIONS */}
      {/* ============================================================ */}
      <section className="py-20 bg-white dark:bg-obsidian-950 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            index="02"
            eyebrow="Core Platform Architecture"
            title={content.ecosystem_heading || "The 6 Core Business & Technology Divisions"}
            description={
              content.ecosystem_subtitle ||
              "Engineered for sovereign operational excellence, sub-millisecond edge latency, and unyielding enterprise security standards."
            }
            linkHref="/platforms"
            linkLabel="View Full Division Directory"
          />

          <PlatformFilterGrid platforms={platforms} enableSearch enableStatusFilter />
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: GLOBAL NETWORK & ARCHITECTURE BLUEPRINT */}
      {/* ============================================================ */}
      <ArchitectureBlueprint />

      {/* ============================================================ */}
      {/* SECTION 5: LATEST GROUP NEWSROOM & IR HIGHLIGHTS */}
      {/* ============================================================ */}
      <NewsroomSection posts={newsPosts} />

      {/* ============================================================ */}
      {/* SECTION 6: GLOBAL STRATEGIC ALLIANCE & PARTNERSHIP CTA */}
      {/* ============================================================ */}
      <section className="py-20 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 text-white border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cobalt-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
            Global Enterprise Alliance
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            {content.partnership_headline ||
              "Strategic Alliances, Institutional Investment & Global Enterprise Integration"}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {content.partnership_text ||
              "Connect with Booking Network Global Group's executive leadership, institutional investor relations, or enterprise architecture alliance team to explore cross-border platform integration and joint ventures."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={content.partnership_cta_link || "/contact"}
              className="inline-flex items-center gap-2 rounded-2xl bg-cobalt-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-cobalt-600/30 hover:bg-cobalt-500 transition-all hover:scale-[1.02]"
            >
              <span>{content.partnership_cta_text || "Initiate Strategic Inquiry"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/about#network"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              <span>Explore Global Regional Hubs</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

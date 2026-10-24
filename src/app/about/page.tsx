import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Compass,
  Target,
  Layers,
  Cpu,
  CheckCircle2,
  Globe,
} from "lucide-react";
import {
  getContentPageBySlug,
  getAllSiteSettings,
  getPublishedPlatforms,
} from "@/lib/data";

export const dynamic = "force-dynamic";

interface AboutContent {
  overview_heading?: string;
  overview_body?: string;
  vision?: string;
  mission?: string;
  philosophy_heading?: string;
  philosophy_items?: Array<{ title: string; description: string }>;
  strategy_heading?: string;
  strategy_body?: string;
  innovation_heading?: string;
  innovation_items?: string[];
  verified_corporate_facts_note?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPageBySlug<AboutContent>("about");
  return {
    title: page?.seo_metadata?.title || "About Us | Booking Network Co., Ltd.",
    description:
      page?.seo_metadata?.description ||
      "Learn about Booking Network Co., Ltd., our corporate vision, mission, business philosophy, and global platform strategy.",
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [pageData, settings, platforms] = await Promise.all([
    getContentPageBySlug<AboutContent>("about"),
    getAllSiteSettings(),
    getPublishedPlatforms(),
  ]);

  const content = pageData?.content || {};
  const companyName = settings.company_name || "Booking Network Co., Ltd.";
  const tagline =
    settings.tagline || "Connecting Platforms. Expanding Possibilities.";

  const overviewParagraphs = (
    content.overview_body ||
    `${companyName} is a global digital technology company dedicated to building, launching, and scaling an ecosystem of specialized online platforms.`
  )
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const strategyParagraphs = (
    content.strategy_body ||
    `Our multi-sector platform strategy focuses on six interconnected pillars of digital life.`
  )
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const philosophyItems = content.philosophy_items || [
    {
      title: "Independent Identity, Shared Excellence",
      description:
        "Every platform in the Booking Network portfolio is purpose-built for its specific vertical.",
    },
    {
      title: "Clarity & Utility First",
      description:
        "Our platforms prioritize clean interfaces, structured information, and transparent user journeys.",
    },
    {
      title: "Scalable Global Architecture",
      description:
        "We design our platforms from day one for international audiences and modular expansion.",
    },
  ];

  const innovationItems = content.innovation_items || [
    "High-precision metasearch indexing and multi-source data normalization",
    "Scalable open marketplace and digital catalog architectures",
    "Structured knowledge graphs and collaborative editorial tooling",
    "Low-latency media delivery and real-time digital communication systems",
    "Privacy-conscious, accessible, and standards-compliant web engineering",
  ];

  return (
    <div>
      {/* Page Header */}
      <section className="bg-navy-950 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-electric-400">
              <Globe className="h-3.5 w-3.5" />
              About {companyName}
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {tagline}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              {settings.brand_positioning ||
                "A global digital technology company developing and connecting platforms that empower commerce, travel, information discovery, financial market exploration, content sharing, and communication."}
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                Who We Are
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {content.overview_heading || "Company Overview"}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {overviewParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-navy-900">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Corporate Profile Summary
                </h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="border-b border-slate-200/80 pb-3 dark:border-slate-800">
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Official Entity Name
                    </dt>
                    <dd className="mt-1 font-bold text-slate-900 dark:text-white">
                      {companyName}
                    </dd>
                  </div>
                  <div className="border-b border-slate-200/80 pb-3 dark:border-slate-800">
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Primary Business Model
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700 dark:text-slate-200">
                      Global Digital Platform Ecosystem & Corporate Holding
                      Portal
                    </dd>
                  </div>
                  <div className="border-b border-slate-200/80 pb-3 dark:border-slate-800">
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Active Portfolio Scope
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700 dark:text-slate-200">
                      {platforms.length} Digital Platforms across 6 Core Sectors
                    </dd>
                  </div>
                  {settings.business_address?.trim() && (
                    <div className="border-b border-slate-200/80 pb-3 dark:border-slate-800">
                      <dt className="text-xs font-semibold uppercase text-slate-400">
                        Registered Address
                      </dt>
                      <dd className="mt-1 font-medium text-slate-700 dark:text-slate-200">
                        {settings.business_address}
                      </dd>
                    </div>
                  )}
                  {settings.corporate_email?.trim() && (
                    <div>
                      <dt className="text-xs font-semibold uppercase text-slate-400">
                        Official Corporate Contact
                      </dt>
                      <dd className="mt-1 font-medium text-electric-600 dark:text-electric-400">
                        {settings.corporate_email}
                      </dd>
                    </div>
                  )}
                </dl>
                {content.verified_corporate_facts_note && (
                  <p className="mt-5 rounded-xl bg-white p-3 text-xs text-slate-500 dark:bg-navy-950 dark:text-slate-400">
                    {content.verified_corporate_facts_note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="border-y border-slate-200/80 bg-slate-50/80 py-16 dark:border-slate-800 dark:bg-navy-900/40 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Vision Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-navy-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-600/10 text-electric-600 dark:bg-electric-500/20 dark:text-electric-400">
                <Compass className="h-6 w-6" />
              </div>
              <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                Corporate Vision
              </span>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                Our Vision
              </h2>
              <blockquote className="mt-4 text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                &ldquo;
                {content.vision ||
                  "To create a connected digital world where information, commerce, travel, and communication are more accessible across borders."}
                &rdquo;
              </blockquote>
            </div>

            {/* Mission Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-navy-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-600/10 text-electric-600 dark:bg-electric-500/20 dark:text-electric-400">
                <Target className="h-6 w-6" />
              </div>
              <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                Corporate Mission
              </span>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                Our Mission
              </h2>
              <blockquote className="mt-4 text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                &ldquo;
                {content.mission ||
                  "To develop innovative digital platforms that help individuals and businesses discover information, access services, and connect with opportunities worldwide."}
                &rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Our Business Philosophy */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
              Guiding Principles
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {content.philosophy_heading || "Our Business Philosophy"}
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {philosophyItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-navy-900"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-950 text-xs font-bold text-electric-400">
                  0{idx + 1}
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Platform Strategy & Areas of Innovation */}
      <section className="border-t border-slate-200/80 bg-slate-50/70 py-16 dark:border-slate-800 dark:bg-navy-900/40 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Global Platform Strategy */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                <Layers className="h-4 w-4" />
                Ecosystem Direction
              </div>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {content.strategy_heading || "Global Platform Strategy"}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {strategyParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/platforms"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white hover:bg-navy-800 dark:bg-electric-600 dark:hover:bg-electric-500 transition-colors"
                >
                  Explore All {platforms.length} Platforms
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Areas of Innovation */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-navy-900">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                  <Cpu className="h-4 w-4" />
                  R&D Focus
                </div>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                  {content.innovation_heading || "Areas of Innovation"}
                </h2>
                <ul className="mt-6 space-y-4">
                  {innovationItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-electric-600 dark:text-electric-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Contact CTA */}
      <section className="bg-navy-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Connect With {companyName}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-300">
            Have questions about our corporate ecosystem, strategic partnerships,
            or individual platform initiatives? Reach out to our team directly.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-electric-500 transition-colors"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/platforms"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-navy-900 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-electric-400 hover:text-white transition-colors"
            >
              Browse Platform Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


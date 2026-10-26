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
  Building2,
  ShieldCheck,
  Scale,
  MapPin,
  Mail,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  getContentPageBySlug,
  getAllSiteSettings,
  getPublishedPlatforms,
  getActiveGlobalHubs,
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
  governance_heading?: string;
  governance_body?: string;
  verified_corporate_facts_note?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPageBySlug<AboutContent>("about");
  return {
    title:
      page?.seo_metadata?.title ||
      "About Us — Corporate Governance & Vision | Booking Network Global Group",
    description:
      page?.seo_metadata?.description ||
      "Learn about Booking Network Global Group's institutional governance, strategic vision, R&D roadmap, and global regional hubs.",
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [pageData, settings, platforms, globalHubs] = await Promise.all([
    getContentPageBySlug<AboutContent>("about"),
    getAllSiteSettings(),
    getPublishedPlatforms(),
    getActiveGlobalHubs(),
  ]);

  const content = pageData?.content || {};
  const companyName = settings.company_name || "Booking Network Global Group";
  const tagline =
    settings.tagline ||
    "Architecting the Global Digital Backbone. Connecting Next-Generation Platforms.";

  const overviewParagraphs = (
    content.overview_body ||
    `${companyName} is an international IT platform group and digital infrastructure holding company headquartered in Seoul, with operational and research hubs in San Jose, Frankfurt, and Dubai.\n\nOur foundational mandate is to design, govern, and scale the mission-critical digital backbones that empower modern digital commerce, enterprise data intelligence, cross-border financial telemetry, and resilient cloud communications.`
  )
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const strategyParagraphs = (
    content.strategy_body ||
    `Over the 2026–2030 strategic horizon, Booking Network Global Group is prioritizing three transformative technological vectors: Autonomous Edge Mesh Computing, Quantum-Resistant Cryptographic Foundations, and Universal B2B Interoperability.`
  )
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const philosophyItems = content.philosophy_items || [
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
  ];

  const innovationItems = content.innovation_items || [
    "Carrier-grade edge networking with microsecond packet routing and autonomous BGP healing",
    "High-scale streaming vector databases and real-time semantic ranking algorithms",
    "Zero-knowledge compliance proofs for cross-border financial settlements",
    "Modular enterprise platform frameworks with instant multi-tenant isolation",
    "Carbon-aware computational dispatch and green datacenter energy telemetry",
  ];

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-slate-50/50 py-20 dark:border-white/10 dark:bg-obsidian-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cobalt-500/20 bg-cobalt-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Corporate Overview & Governance</span>
            </div>

            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {content.overview_heading || "Corporate Governance & Strategic Architecture"}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Overview Body */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {overviewParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Vision & Mission Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-200/90 bg-slate-50/80 p-7 dark:border-white/10 dark:bg-obsidian-900/80 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400 mb-4">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Corporate Vision
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {content.vision ||
                    "To engineer an unbreakable, intelligent, and sovereign global digital foundation where information, enterprise trade, and human connectivity flow frictionlessly across borders."}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/90 bg-slate-50/80 p-7 dark:border-white/10 dark:bg-obsidian-900/80 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-white/10 dark:text-cyan-400 mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Corporate Mission
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {content.mission ||
                    "To deliver high-availability cloud infrastructure, transparent data intelligence, and zero-trust security standards that empower global enterprises and next-generation platform ecosystems."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Core Principles */}
      <section className="py-20 bg-slate-50/60 dark:bg-obsidian-900/40 border-y border-slate-200/80 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {content.philosophy_heading || "Institutional Core Principles"}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200/90 bg-white p-8 dark:border-white/10 dark:bg-obsidian-900 shadow-sm"
              >
                <div className="text-xs font-mono font-bold text-cobalt-600 dark:text-cyan-400 uppercase tracking-wider mb-3">
                  Principle 0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Board Oversight */}
      <section id="governance" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cobalt-500/20 bg-cobalt-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cyan-400">
              Institutional Governance Framework
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {content.governance_heading || "Group Governance & Board Oversight"}
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {content.governance_body ||
                "Booking Network Global Group operates under strict fiduciary governance structured across three independent oversight councils: the Board Audit & Risk Committee, the Global Technology Architecture Advisory Council, and the AI Ethics & Sustainability Committee."}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-white/10 dark:bg-obsidian-900 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Board Audit & Risk Committee
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Oversees institutional compliance, financial reporting integrity, and internal cybersecurity risk controls across all subsidiaries.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-white/10 dark:bg-obsidian-900 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-white/10 dark:text-cyan-400 mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tech Architecture Advisory Council
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Ratifies core infrastructure specifications, zero-trust protocols, cross-region mesh standards, and cloud availability criteria.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-white/10 dark:bg-obsidian-900 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-white/10 dark:text-emerald-400 mb-4">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Ethics & Sustainability Committee
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Independent oversight ensuring algorithmic impartiality, carbon-aware compute scheduling, and universal digital accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Roadmap (2026-2030) & R&D Areas */}
      <section id="roadmap" className="py-20 bg-slate-50/60 dark:bg-obsidian-900/40 border-t border-slate-200/80 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cobalt-500/20 bg-cobalt-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cyan-400">
                2026–2030 Strategy
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {content.strategy_heading || "Global Group Technology Roadmap"}
              </h2>
              <div className="mt-6 space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {strategyParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-8 dark:border-white/10 dark:bg-obsidian-900 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                  {content.innovation_heading || "Key R&D Focus Areas"}
                </h3>
                <ul className="space-y-4">
                  {innovationItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-cobalt-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
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

      {/* Global Regional Hubs (#network) */}
      <section id="network" className="py-20 border-t border-slate-200/80 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cobalt-500/20 bg-cobalt-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cyan-400">
              Global Regional Infrastructure
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Global Regional Hubs & Operational Topology
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Strategic operational, research, and regulatory centers coordinating sovereign platform operations across major global economic corridors.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalHubs.map((hub) => (
              <div
                key={hub.city}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 dark:border-white/10 dark:bg-obsidian-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-md bg-cobalt-50 dark:bg-white/10 px-2 py-0.5 text-[10px] font-mono font-bold text-cobalt-600 dark:text-cyan-400">
                      {hub.region}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-500">
                      ● {hub.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {hub.city}, {hub.country}
                  </h3>
                  <span className="text-xs font-semibold text-cobalt-600 dark:text-cyan-400 block mt-0.5">
                    {hub.hub_type}
                  </span>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {hub.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  {hub.address && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{hub.address}</span>
                    </div>
                  )}
                  {hub.contact_email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${hub.contact_email}`} className="hover:text-cobalt-600 dark:hover:text-cyan-400">
                        {hub.contact_email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-obsidian-950 text-white text-center border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
            Engage with Booking Network Global Group
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Explore strategic partnership opportunities, investor relations briefings, or join our global technology research teams.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-cobalt-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-cobalt-500 transition-colors"
            >
              <span>Contact Group Leadership</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

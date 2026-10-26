import type { Metadata } from "next";
import Link from "next/link";
import { Layers, ArrowRight, Sparkles } from "lucide-react";
import { getPublishedPlatforms, getAllSiteSettings } from "@/lib/data";
import { PlatformFilterGrid } from "@/components/PlatformFilterGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Business & Technology Divisions | Booking Network Global Group",
  description:
    "Explore the 6 core business and technology divisions architected, governed, and scaled by Booking Network Global Group across cloud infrastructure, AI intelligence, B2B mesh, and fintech trust.",
  alternates: { canonical: "/platforms" },
};

export default async function PlatformsDirectoryPage() {
  const [platforms, settings] = await Promise.all([
    getPublishedPlatforms(),
    getAllSiteSettings(),
  ]);

  const companyName = settings.company_name || "Booking Network Global Group";

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      {/* Header Banner */}
      <section className="bg-obsidian-950 py-16 text-white sm:py-24 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-cobalt-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              Core Technology & Business Divisions
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Global IT Platform Divisions & Core Architecture
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
              {companyName} architects and governs the sovereign digital foundation powering modern enterprise ecosystems—spanning distributed cloud edge backbones, streaming AI intelligence, cross-border API mesh networks, and zero-trust cybersecurity protocols.
            </p>
          </div>
        </div>
      </section>

      {/* Directory Content */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PlatformFilterGrid
            platforms={platforms}
            enableSearch={true}
            enableStatusFilter={true}
          />
        </div>
      </section>

      {/* Bottom Partnership CTA */}
      <section className="border-t border-slate-200 bg-slate-50/70 py-16 dark:border-white/10 dark:bg-obsidian-900/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Interested in Strategic Division Integration?
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Connect with {companyName} regarding enterprise technology alliances, API mesh onboarding, or joint-venture platform development.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-cobalt-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-cobalt-500 transition-colors"
          >
            <span>Contact Enterprise Leadership</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

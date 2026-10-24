import type { Metadata } from "next";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { getPublishedPlatforms, getAllSiteSettings } from "@/lib/data";
import { PlatformFilterGrid } from "@/components/PlatformFilterGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Platforms — Global Platform Directory",
  description:
    "Explore all ten digital platforms developed and operated by Booking Network Co., Ltd. across e-commerce, travel, search, financial information, knowledge, video, and communication.",
  alternates: { canonical: "/platforms" },
};

export default async function PlatformsDirectoryPage() {
  const [platforms, settings] = await Promise.all([
    getPublishedPlatforms(),
    getAllSiteSettings(),
  ]);

  const companyName = settings.company_name || "Booking Network Co., Ltd.";

  return (
    <div>
      {/* Header Banner */}
      <section className="bg-navy-950 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-electric-400">
              <Layers className="h-3.5 w-3.5" />
              Platform Portfolio Directory
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Our Platforms
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              {companyName} develops and stewards independent digital platforms
              spanning commerce, online travel, travel metasearch, financial and
              cryptocurrency market discovery, collaborative knowledge, web
              search, video, messaging, and short-form media.
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
      <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-navy-900/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              Interested in Platform Collaboration?
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Connect with {companyName} regarding platform partnerships,
              merchant onboarding, or media inquiries.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-electric-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-electric-700 transition-colors"
          >
            Contact Our Team
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}


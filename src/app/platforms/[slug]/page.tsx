import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Users,
  Briefcase,
  Layers,
  Globe,
  Cloud,
  Cpu,
  Network,
  ShieldCheck,
  Boxes,
  Activity,
} from "lucide-react";
import {
  getPublishedPlatformBySlug,
  getPublishedPlatforms,
  getAllSiteSettings,
  isVerifiedExternalUrl,
} from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { PlatformCard } from "@/components/PlatformCard";

export const dynamic = "force-dynamic";

function getDivisionIcon(iconName: string) {
  switch (iconName) {
    case "Cloud":
      return Cloud;
    case "Cpu":
      return Cpu;
    case "Network":
      return Network;
    case "ShieldCheck":
      return ShieldCheck;
    case "Boxes":
      return Boxes;
    case "Globe":
      return Globe;
    default:
      return Layers;
  }
}

export async function generateMetadata(context: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await context.params;
  const platform = await getPublishedPlatformBySlug(slug);

  if (!platform) {
    return {
      title: "Division Not Found",
    };
  }

  const title =
    platform.seo_title ||
    `${platform.name} — ${platform.category} | Booking Network Global Group`;
  const description =
    platform.seo_description || platform.short_description;

  return {
    title,
    description,
    alternates: {
      canonical: `/platforms/${platform.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/platforms/${platform.slug}`,
      images: platform.logo ? [{ url: platform.logo }] : undefined,
    },
  };
}

export default async function PlatformDetailPage(context: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await context.params;
  const [platform, allPlatforms, settings] = await Promise.all([
    getPublishedPlatformBySlug(slug),
    getPublishedPlatforms(),
    getAllSiteSettings(),
  ]);

  if (!platform) {
    notFound();
  }

  const companyName = settings.company_name || "Booking Network Global Group";
  const hasVerifiedUrl = isVerifiedExternalUrl(
    platform.website_url,
    platform.platform_status
  );

  const relatedPlatforms = allPlatforms
    .filter((p) => p.id !== platform.id)
    .slice(0, 3);

  const descriptionParagraphs = (
    platform.full_description || platform.short_description
  )
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const IconComponent = getDivisionIcon(platform.icon_name);

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      {/* Division Hero Header */}
      <section className="bg-obsidian-950 py-16 text-white sm:py-24 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-cobalt-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Business & Technology Divisions</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-400 border border-white/10">
                  {platform.division_code || "BNG-CORE"}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {platform.category}
                </span>
                <StatusBadge status={platform.platform_status} />
              </div>

              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {platform.name}
              </h1>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
                {platform.short_description}
              </p>
            </div>

            {/* Division Icon Badge */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-obsidian-900 border-2 border-white/10 p-5 shadow-2xl text-cyan-400">
              <IconComponent className="h-12 w-12" />
            </div>
          </div>

          {/* Key Metrics Chips Banner */}
          {platform.key_metrics && platform.key_metrics.length > 0 && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
              {platform.key_metrics.map((metric, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <span className="block text-xl sm:text-2xl font-mono font-extrabold text-white mt-1 tabular-nums">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Technical Specs & Architectural Overview */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 8 Cols: Comprehensive Description & Capabilities */}
            <div className="lg:col-span-8 space-y-12">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Architectural Blueprint & Scope
                </h2>
                <div className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  {descriptionParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Core Features */}
              {platform.features && platform.features.length > 0 && (
                <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-8 dark:border-white/10 dark:bg-obsidian-900/60 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Core Technical Capabilities & Specifications
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {platform.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-cobalt-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Mandate, Target Ecosystem & CTA */}
            <div className="lg:col-span-4 space-y-6">
              {/* Target Ecosystem */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 dark:border-white/10 dark:bg-obsidian-900 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400 mb-4">
                  <Users className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Target Ecosystem & Partners
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {platform.target_audience}
                </p>
              </div>

              {/* Strategic Mandate */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 dark:border-white/10 dark:bg-obsidian-900 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-white/10 dark:text-cyan-400 mb-4">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Strategic Mandate in Group
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {platform.business_purpose}
                </p>
              </div>

              {/* Action Box */}
              <div className="rounded-3xl border border-cobalt-500/20 bg-gradient-to-b from-cobalt-500/10 to-transparent p-7 text-center">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Collaborate with this Division
                </h4>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Request architectural documentation, API credentials, or explore strategic joint ventures.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cobalt-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-cobalt-500 transition-colors"
                >
                  <span>Submit Partnership Request</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Divisions */}
      {relatedPlatforms.length > 0 && (
        <section className="py-20 bg-slate-50/60 dark:bg-obsidian-900/40 border-t border-slate-200/80 dark:border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">
              Explore Adjacent Technology Divisions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPlatforms.map((p) => (
                <PlatformCard key={p.slug} platform={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

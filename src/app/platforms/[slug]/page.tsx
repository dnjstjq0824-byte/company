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
} from "lucide-react";
import {
  getPublishedPlatformBySlug,
  getPublishedPlatforms,
  getAllSiteSettings,
  isVerifiedExternalUrl,
  mapCategoryToFilterGroup,
} from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { PlatformCard } from "@/components/PlatformCard";

export const dynamic = "force-dynamic";

export async function generateMetadata(context: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await context.params;
  const platform = await getPublishedPlatformBySlug(slug);

  if (!platform) {
    return {
      title: "Platform Not Found",
    };
  }

  const title =
    platform.seo_title ||
    `${platform.name} — ${platform.category} | Booking Network Co., Ltd.`;
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

  const companyName = settings.company_name || "Booking Network Co., Ltd.";
  const hasVerifiedUrl = isVerifiedExternalUrl(
    platform.website_url,
    platform.platform_status
  );

  const currentGroup = mapCategoryToFilterGroup(platform.category);
  const relatedPlatforms = allPlatforms
    .filter((p) => p.id !== platform.id)
    .sort((a, b) => {
      const aSame = mapCategoryToFilterGroup(a.category) === currentGroup ? 0 : 1;
      const bSame = mapCategoryToFilterGroup(b.category) === currentGroup ? 0 : 1;
      return aSame - bSame || a.display_order - b.display_order;
    })
    .slice(0, 3);

  const descriptionParagraphs = (
    platform.full_description || platform.short_description
  )
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div>
      {/* Platform Hero Header */}
      <section className="bg-navy-950 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/platforms"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-electric-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Platform Directory
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-navy-900 p-3 shadow-xl">
                {platform.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={platform.logo}
                    alt={`${platform.name} logo`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-2xl font-extrabold text-electric-400">
                    {platform.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-electric-400">
                    {platform.category}
                  </span>
                  <StatusBadge status={platform.platform_status} size="md" />
                </div>

                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {platform.name}
                </h1>

                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  {platform.short_description}
                </p>
              </div>
            </div>

            {/* Official Website Link Action */}
            <div className="flex flex-col items-start gap-3 sm:flex-row lg:flex-col lg:items-end">
              {hasVerifiedUrl ? (
                <a
                  href={platform.website_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-electric-600/25 hover:bg-electric-500 transition-all"
                >
                  Visit Official Platform
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-navy-900/90 px-5 py-3.5 text-left lg:text-right">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Official Website Status
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-amber-300">
                    {platform.platform_status === "Coming Soon"
                      ? "Official Website Coming Soon"
                      : platform.platform_status === "Temporarily Unavailable"
                      ? "Platform Temporarily Unavailable"
                      : "Platform Currently in Development"}
                  </span>
                </div>
              )}

              <Link
                href={`/contact?platform=${encodeURIComponent(platform.name)}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-electric-400 transition-colors"
              >
                Inquire About {platform.name}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left 7 Cols: Overview & Key Features */}
            <div className="space-y-12 lg:col-span-7">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                  Platform Overview
                </span>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                  About {platform.name}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {descriptionParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              {platform.features.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                    Capabilities & Architecture
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                    Key Features
                  </h2>
                  <ul className="mt-5 grid grid-cols-1 gap-3.5">
                    {platform.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-navy-900/60"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-electric-600 dark:text-electric-400" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right 5 Cols: Target Audience, Business Purpose, Metadata */}
            <div className="space-y-6 lg:col-span-5">
              {/* Target Audience */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-navy-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-600/10 text-electric-600 dark:bg-electric-500/20 dark:text-electric-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Target Audience
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {platform.target_audience ||
                    "Global users and businesses within the platform's dedicated digital vertical."}
                </p>
              </div>

              {/* Business Purpose */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-navy-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-600/10 text-electric-600 dark:bg-electric-500/20 dark:text-electric-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Business Purpose
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {platform.business_purpose ||
                    `Developed as an independent service within the ${companyName} digital ecosystem.`}
                </p>
              </div>

              {/* Ecosystem Summary Card */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-navy-900/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Portfolio Details
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-slate-800">
                    <dt className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Globe className="h-4 w-4" />
                      Parent Organization
                    </dt>
                    <dd className="font-semibold text-slate-900 dark:text-white">
                      {companyName}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-slate-800">
                    <dt className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Layers className="h-4 w-4" />
                      Business Category
                    </dt>
                    <dd className="font-semibold text-slate-900 dark:text-white">
                      {platform.category}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500 dark:text-slate-400">
                      Current Status
                    </dt>
                    <dd>
                      <StatusBadge status={platform.platform_status} />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Platforms */}
      {relatedPlatforms.length > 0 && (
        <section className="border-t border-slate-200/80 bg-slate-50/70 py-16 dark:border-slate-800 dark:bg-navy-900/40 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
                  Explore Ecosystem
                </span>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                  Related Platforms
                </h2>
              </div>
              <Link
                href="/platforms"
                className="text-sm font-semibold text-electric-600 hover:underline dark:text-electric-400"
              >
                View All Platforms
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPlatforms.map((rel) => (
                <PlatformCard key={rel.id} platform={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="bg-navy-950 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Partner or Inquire About {platform.name}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
            Interested in business collaboration, platform integration, or
            launch updates for {platform.name}? Connect with the {companyName}{" "}
            team.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href={`/contact?platform=${encodeURIComponent(platform.name)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-electric-500 transition-colors"
            >
              Contact Us About {platform.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


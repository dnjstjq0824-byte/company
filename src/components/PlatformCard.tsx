import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ParsedPlatform, isVerifiedExternalUrl } from "@/lib/data";
import { StatusBadge } from "./StatusBadge";

export function PlatformCard({ platform }: { platform: ParsedPlatform }) {
  const hasLiveUrl = isVerifiedExternalUrl(
    platform.website_url,
    platform.platform_status
  );

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-electric-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-navy-900/90 dark:hover:border-electric-500/50">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-navy-950 p-1.5 dark:border-slate-700">
              {platform.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={platform.logo}
                  alt={`${platform.name} logo`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              ) : (
                <span className="text-base font-bold text-electric-400">
                  {platform.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-electric-600 dark:text-electric-400">
                {platform.category}
              </span>
              <h3 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900 group-hover:text-electric-600 dark:text-white dark:group-hover:text-electric-400 transition-colors">
                <Link href={`/platforms/${platform.slug}`} className="focus:outline-none">
                  {platform.name}
                </Link>
              </h3>
            </div>
          </div>
          <StatusBadge status={platform.platform_status} />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
          {platform.short_description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/80">
        <Link
          href={`/platforms/${platform.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-electric-600 dark:text-slate-100 dark:hover:text-electric-400 transition-colors"
        >
          Learn More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {hasLiveUrl ? (
          <a
            href={platform.website_url!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-electric-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-electric-700 transition-colors"
          >
            Visit Platform
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {platform.platform_status === "Coming Soon"
              ? "Launch Pending"
              : platform.platform_status}
          </span>
        )}
      </div>
    </article>
  );
}


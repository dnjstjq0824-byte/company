"use client";

import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Cloud,
  Cpu,
  Network,
  ShieldCheck,
  Boxes,
  Globe,
  Layers,
} from "lucide-react";
import { ParsedPlatform, isVerifiedExternalUrl } from "@/lib/data";
import { StatusBadge } from "./StatusBadge";
import { useLanguage } from "@/lib/i18n";

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

export function PlatformCard({ platform }: { platform: ParsedPlatform }) {
  const { locale, t } = useLanguage();
  const IconComponent = getDivisionIcon(platform.icon_name);
  const hasLiveUrl = isVerifiedExternalUrl(
    platform.website_url,
    platform.platform_status
  );

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-500/50 hover:shadow-xl dark:border-white/10 dark:bg-obsidian-900/90 dark:hover:border-cyan-400/50">
      <div>
        {/* Top Header: Monogram/Icon + Division Code + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-cobalt-50/60 p-2.5 text-cobalt-600 dark:border-white/10 dark:bg-white/10 dark:text-cyan-400 group-hover:scale-105 transition-transform duration-300">
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-cobalt-50 px-2 py-0.5 text-[10px] font-mono font-bold text-cobalt-600 dark:bg-white/10 dark:text-cyan-400">
                  {platform.division_code || "BNG-CORE"}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {platform.category}
                </span>
              </div>
              <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-cobalt-600 dark:text-white dark:group-hover:text-cyan-400 transition-colors">
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

        {/* Key Metrics Chips */}
        {platform.key_metrics && platform.key_metrics.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-2">
            {platform.key_metrics.slice(0, 2).map((metric, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-2 text-left dark:border-white/5 dark:bg-white/5"
              >
                <span className="block text-[10px] uppercase font-semibold text-slate-400 truncate">
                  {metric.label}
                </span>
                <span className="block text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link & Action */}
      <div className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
        <Link
          href={`/platforms/${platform.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cobalt-600 hover:text-cobalt-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
        >
          <span>{locale === "ko" ? "상세 아키텍처 보기" : "Architecture Details"}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>

        {hasLiveUrl ? (
          <a
            href={platform.website_url!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cobalt-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-cobalt-500 transition-colors"
          >
            <span>{locale === "ko" ? "포털 이동" : "Endpoint"}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
            {platform.platform_status}
          </span>
        )}
      </div>
    </article>
  );
}

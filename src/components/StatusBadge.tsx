"use client";

import { useLanguage } from "@/lib/i18n";

const STATUS_LABEL_KEYS: Record<string, "statusCoreArch" | "statusLive" | "statusExpanding" | "statusRnd" | "statusComingSoon" | "statusInDev" | "statusUnavailable"> = {
  "Core Architecture": "statusCoreArch",
  Live: "statusLive",
  Expanding: "statusExpanding",
  "R&D Phase": "statusRnd",
  "Coming Soon": "statusComingSoon",
  "In Development": "statusInDev",
  "Temporarily Unavailable": "statusUnavailable",
};

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "md";
}) {
  const { t } = useLanguage();
  const normalized = status || "In Development";
  const labelKey = STATUS_LABEL_KEYS[normalized];
  const label = labelKey ? t.filters[labelKey] : normalized;

  let colorClasses =
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/70";
  let dotClass = "bg-blue-500";

  if (normalized === "Live") {
    colorClasses =
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/70";
    dotClass = "bg-emerald-500 animate-pulse";
  } else if (normalized === "Expanding") {
    colorClasses =
      "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/70";
    dotClass = "bg-cyan-500 animate-pulse";
  } else if (normalized === "R&D Phase") {
    colorClasses =
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/70";
    dotClass = "bg-amber-500";
  } else if (normalized === "Coming Soon") {
    colorClasses =
      "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/70";
    dotClass = "bg-orange-500";
  } else if (normalized === "In Development") {
    colorClasses =
      "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    dotClass = "bg-slate-400";
  } else if (normalized === "Temporarily Unavailable") {
    colorClasses =
      "bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-800/60 dark:text-stone-300 dark:border-stone-700";
    dotClass = "bg-stone-400";
  }

  const sizeClasses =
    size === "md"
      ? "px-3 py-1 text-xs font-semibold"
      : "px-2.5 py-0.5 text-[11px] font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses} ${sizeClasses} tracking-wide`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      {label}
    </span>
  );
}


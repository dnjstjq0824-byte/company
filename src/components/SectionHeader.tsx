import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel,
  tone = "light",
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  tone?: "light" | "dark";
}) {
  const titleColor =
    tone === "dark" ? "text-white" : "text-slate-900 dark:text-white";
  const descColor =
    tone === "dark" ? "text-slate-400" : "text-slate-600 dark:text-slate-400";
  const ruleColor =
    tone === "dark" ? "bg-white/15" : "bg-slate-200 dark:bg-white/10";

  return (
    <div className="mb-12">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs font-bold tabular-nums text-cobalt-600 dark:text-cyan-400">
          {index}
        </span>
        <span className={`h-px flex-1 ${ruleColor}`} aria-hidden="true" />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {eyebrow}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h2
            className={`font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${titleColor}`}
          >
            {title}
          </h2>
          {description && (
            <p className={`mt-3 text-sm leading-relaxed sm:text-base ${descColor}`}>
              {description}
            </p>
          )}
        </div>

        {linkHref && linkLabel && (
          <Link
            href={linkHref}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-cobalt-600 hover:text-cobalt-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <span>{linkLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

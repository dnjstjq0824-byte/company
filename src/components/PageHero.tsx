export function PageHero({
  index,
  eyebrow,
  title,
  description,
  tone = "dark",
  meta,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  tone?: "dark" | "light";
  meta?: string;
}) {
  const dark = tone === "dark";

  return (
    <section
      className={
        dark
          ? "relative overflow-hidden border-b border-white/10 bg-obsidian-950 py-16 text-white sm:py-24"
          : "relative overflow-hidden border-b border-slate-200/80 bg-white py-16 dark:border-white/10 dark:bg-obsidian-950 sm:py-24"
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full bg-cobalt-500/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold tabular-nums text-cyan-400">
              {index}
            </span>
            <span
              aria-hidden="true"
              className={`h-px w-12 ${dark ? "bg-cyan-500/50" : "bg-cobalt-500/50"}`}
            />
            <span
              className={`font-mono text-[11px] font-semibold uppercase tracking-[0.2em] ${
                dark ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {eyebrow}
            </span>
          </div>

          <h1
            className={`mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl ${
              dark ? "text-white" : "text-slate-900 dark:text-white"
            }`}
          >
            {title}
          </h1>

          <p
            className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${
              dark ? "text-slate-300" : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {description}
          </p>

          {meta && (
            <p
              className={`mt-5 font-mono text-xs ${
                dark ? "text-slate-500" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {meta}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

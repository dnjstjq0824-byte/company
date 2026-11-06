"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function CookieBanner({ enabled = true }: { enabled?: boolean }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!enabled) return;
    const saved = localStorage.getItem("bn_cookie_consent");
    if (!saved) {
      setVisible(true);
    }
  }, [enabled]);

  if (!visible || pathname?.startsWith("/admin")) {
    return null;
  }

  const handleConsent = (choice: "essential" | "all") => {
    localStorage.setItem(
      "bn_cookie_consent",
      JSON.stringify({
        choice,
        timestamp: new Date().toISOString(),
      })
    );
    setVisible(false);
  };

  return (
    <aside
      aria-label="Privacy and cookie consent banner"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-obsidian-900/95"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">
              {t.cookie.title}
            </p>
            <p className="mt-0.5">
              {t.cookie.lead}{" "}
              <Link
                href="/privacy"
                className="font-semibold text-cobalt-600 underline hover:text-cobalt-700 dark:text-cyan-400"
              >
                {t.cookie.privacyPolicy}
              </Link>{" "}
              {t.cookie.tail}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-obsidian-950 dark:text-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            {t.cookie.essentialOnly}
          </button>
          <button
            type="button"
            onClick={() => handleConsent("all")}
            className="rounded-xl bg-cobalt-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-cobalt-500 transition-colors"
          >
            {t.cookie.acceptAll}
          </button>
        </div>
      </div>
    </aside>
  );
}


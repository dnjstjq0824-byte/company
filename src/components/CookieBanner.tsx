"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export function CookieBanner({ enabled = true }: { enabled?: boolean }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

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
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-navy-900/95"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-electric-50 text-electric-600 dark:bg-electric-900/30 dark:text-electric-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">
              Privacy & Cookie Preferences
            </p>
            <p className="mt-0.5">
              Booking Network Co., Ltd. uses strictly necessary technical storage
              to remember your display and privacy preferences. Non-essential
              cookies remain disabled unless you explicitly opt in. Read our{" "}
              <Link
                href="/privacy"
                className="font-semibold text-electric-600 underline hover:text-electric-700 dark:text-electric-400"
              >
                Privacy Policy
              </Link>{" "}
              for details.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-navy-950 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => handleConsent("all")}
            className="rounded-xl bg-electric-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-electric-700 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}


"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public portal error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cobalt-600 dark:text-cyan-400">
        Service interruption
      </span>
      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        The page could not be rendered. Our team has been notified through
        automatic diagnostics. Please try again, or return to the homepage.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-[11px] text-slate-400">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-cobalt-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cobalt-600/25 hover:bg-cobalt-500 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

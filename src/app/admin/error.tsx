"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin console error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-electric-400">
        Console fault
      </span>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white">
        Admin module failed to load
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        The requested administration view could not be rendered. Check database
        connectivity, then retry. If the fault persists, inspect the worker
        logs.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-[11px] text-slate-500">
          Reference: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-xl bg-electric-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:bg-electric-500 transition-all"
      >
        Retry module
      </button>
    </div>
  );
}

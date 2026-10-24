import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-electric-600/10 text-electric-600 dark:bg-electric-500/20 dark:text-electric-400">
        <Compass className="h-8 w-8" />
      </div>
      <span className="mt-6 text-xs font-bold uppercase tracking-widest text-electric-600 dark:text-electric-400">
        Error 404
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
        Page or Platform Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
        The requested corporate page or platform entry does not exist or has not
        been publicly published yet.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-5 py-3 text-sm font-bold text-white hover:bg-electric-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Homepage
        </Link>
        <Link
          href="/platforms"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-navy-900 dark:text-slate-200"
        >
          Browse Platform Directory
        </Link>
      </div>
    </div>
  );
}


import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  Tag,
  FileText,
  TrendingUp,
  Cpu,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import { getPublishedNewsPosts, getAllSiteSettings } from "@/lib/data";
import { NewsroomFilterView } from "@/components/NewsroomFilterView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsroom & Investor Relations | Booking Network Global Group",
  description:
    "Official newsroom, press releases, corporate governance announcements, and investor relations disclosures of Booking Network Global Group.",
  alternates: { canonical: "/newsroom" },
};

export default async function NewsroomPage() {
  const [posts, settings] = await Promise.all([
    getPublishedNewsPosts(),
    getAllSiteSettings(),
  ]);

  const companyName = settings.company_name || "Booking Network Global Group";

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      {/* Hero Header */}
      <section className="bg-obsidian-950 py-16 text-white sm:py-24 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-cobalt-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              Official Corporate Disclosures
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Newsroom & Investor Relations
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
              The official communications and disclosure center for {companyName}. Access verified press releases, quarterly institutional briefings, technological whitepapers, and board governance notices.
            </p>
          </div>
        </div>
      </section>

      {/* Main Filterable News Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NewsroomFilterView posts={posts} />
        </div>
      </section>
    </div>
  );
}


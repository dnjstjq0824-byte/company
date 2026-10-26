import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getContentPageBySlug, getAllSiteSettings } from "@/lib/data";
import { renderPolicyBody } from "@/components/PolicyRenderer";

export const dynamic = "force-dynamic";

interface PolicyContent {
  title?: string;
  status_badge?: string;
  last_updated?: string;
  body?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPageBySlug<PolicyContent>("privacy");
  return {
    title: page?.seo_metadata?.title || "Privacy Policy | Booking Network Global Group",
    description:
      page?.seo_metadata?.description ||
      "Official Privacy Policy and Data Governance Statement of Booking Network Global Group.",
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const [pageData, settings] = await Promise.all([
    getContentPageBySlug<PolicyContent>("privacy"),
    getAllSiteSettings(),
  ]);

  const content = pageData?.content || {};
  const companyName = settings.company_name || "Booking Network Global Group";

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      <section className="bg-obsidian-950 py-16 text-white sm:py-20 border-b border-white/10 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            {content.status_badge || "Enterprise Group Corporate Policy"}
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            {content.title || "Privacy Policy & Data Governance Charter"}
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Entity: {companyName} • Last Updated:{" "}
            {content.last_updated || "October 2026"}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm dark:border-white/10 dark:bg-obsidian-900">
            {renderPolicyBody(content.body || "")}
          </div>
        </div>
      </section>
    </div>
  );
}

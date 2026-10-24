import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { getContentPageBySlug, getAllSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

interface PolicyContent {
  title?: string;
  status_badge?: string;
  last_updated?: string;
  body?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPageBySlug<PolicyContent>("terms");
  return {
    title: page?.seo_metadata?.title || "Website Terms of Use",
    description:
      page?.seo_metadata?.description ||
      "Website Terms of Use for Booking Network Co., Ltd.",
    alternates: { canonical: "/terms" },
  };
}

function renderPolicyBody(text: string) {
  const blocks = text.split("\n\n");
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={idx}
          className="mt-8 font-display text-xl font-extrabold text-slate-900 dark:text-white"
        >
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").map((line) => line.replace(/^-\s+/, ""));
      return (
        <ul
          key={idx}
          className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
        >
          {items.map((li, i) => (
            <li key={i}>{li.replace(/\*\*/g, "")}</li>
          ))}
        </ul>
      );
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s+/, ""));
      return (
        <ol
          key={idx}
          className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
        >
          {items.map((li, i) => (
            <li key={i}>{li.replace(/\*\*/g, "")}</li>
          ))}
        </ol>
      );
    }
    return (
      <p
        key={idx}
        className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
      >
        {trimmed.replace(/\*\*/g, "")}
      </p>
    );
  });
}

export default async function TermsPage() {
  const [pageData, settings] = await Promise.all([
    getContentPageBySlug<PolicyContent>("terms"),
    getAllSiteSettings(),
  ]);

  const content = pageData?.content || {};
  const companyName = settings.company_name || "Booking Network Co., Ltd.";

  return (
    <div>
      <section className="bg-navy-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-3.5 py-1 text-xs font-semibold text-electric-400">
            <FileText className="h-3.5 w-3.5" />
            {content.status_badge || "Corporate Legal Terms"}
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            {content.title || "Website Terms of Use"}
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Entity: {companyName} • Last Updated:{" "}
            {content.last_updated || "October 2026"}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-navy-900 sm:p-10">
            {renderPolicyBody(
              content.body ||
                `By accessing this official corporate website of ${companyName}, you agree to these Website Terms of Use.`
            )}

            <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              For legal or corporate inquiries, please reach out via our{" "}
              <Link
                href="/contact"
                className="font-semibold text-electric-600 underline dark:text-electric-400"
              >
                Contact Us
              </Link>{" "}
              page.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getContentPageBySlug, getAllSiteSettings } from "@/lib/data";
import { renderPolicyBody } from "@/components/PolicyRenderer";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

interface PolicyContent {
  title?: string;
  status_badge?: string;
  last_updated?: string;
  body?: string;
}

const DEFAULT_PRIVACY_BODY = `## 1. Data We Collect
We collect corporate inquiry details you submit (name, email, organization, message), strictly necessary technical logs, and your stored privacy preferences.

## 2. How We Use Data
Inquiry data is routed only to the designated group department for response purposes. We never sell inquiry information or transfer it to external commercial parties.

## 3. Data Retention
Inquiry records are retained only as long as needed to handle your request and meet legal obligations, then securely deleted.

## 4. Your Rights
You may request access, correction, or deletion of your inquiry data at any time via the contact channels listed on this portal.

## 5. Contact
For privacy questions, contact the Data Governance Office through the official corporate email published on this site.`;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPageBySlug<PolicyContent>("privacy");
  const title = page?.seo_metadata?.title || "Privacy Policy | Booking Network Global Group";
  const description =
    page?.seo_metadata?.description ||
    "Official Privacy Policy and Data Governance Statement of Booking Network Global Group.";
  return {
    title,
    description,
    alternates: { canonical: "/privacy" },
    openGraph: { title, description, type: "website", url: "/privacy" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PrivacyPage() {
  const [pageData, settings] = await Promise.all([
    getContentPageBySlug<PolicyContent>("privacy"),
    getAllSiteSettings(),
  ]);

  const content = pageData?.content || {};
  const companyName = settings.company_name || "Booking Network Global Group";
  const isKo = (await cookies()).get("bng_locale")?.value === "ko";

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      <PageHero
        index="§ 1"
        eyebrow={content.status_badge || (isKo ? "엔터프라이즈 그룹 기업 정책" : "Enterprise Group Corporate Policy")}
        title={content.title || (isKo ? "개인정보 처리방침 & 데이터 거버넌스 헌장" : "Privacy Policy & Data Governance Charter")}
        description={
          isKo
            ? `${companyName}의 공식 개인정보 및 데이터 거버넌스 약속입니다.`
            : `Official privacy and data governance commitments of ${companyName}.`
        }
        meta={isKo ? `주체: ${companyName} • 최종 업데이트: ${content.last_updated || "2026년 10월"}` : `Entity: ${companyName} • Last Updated: ${content.last_updated || "October 2026"}`}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm dark:border-white/10 dark:bg-obsidian-900">
            {renderPolicyBody(content.body || DEFAULT_PRIVACY_BODY)}
          </div>
        </div>
      </section>
    </div>
  );
}

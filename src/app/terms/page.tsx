import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getContentPageBySlug, getAllSiteSettings } from "@/lib/data";
import { renderPolicyBody } from "@/components/PolicyRenderer";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

interface TermsContent {
  title?: string;
  status_badge?: string;
  last_updated?: string;
  body?: string;
}

const DEFAULT_TERMS_BODY = `## 1. Acceptance of Terms
By accessing this portal you agree to these Terms of Use and the Privacy Policy. If you do not agree, please discontinue use.

## 2. Permitted Use
Content on this portal is provided for informational, partnership, and investor-relations purposes. You may not reproduce official disclosures without prior written authorization.

## 3. Intellectual Property
All trademarks, logos, and published materials are the property of Booking Network Global Group or its licensors.

## 4. No Warranty
Portal content is provided "as is" without warranties of any kind. Official disclosures are authoritative only in their published form.

## 5. Contact
For questions about these terms, contact the Legal & Regulatory Compliance office through the official corporate email published on this site.`;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPageBySlug<TermsContent>("terms");
  const title = page?.seo_metadata?.title || "Terms of Use | Booking Network Global Group";
  const description =
    page?.seo_metadata?.description ||
    "Official Terms of Use governing access to the Booking Network Global Group portal and digital assets.";
  return {
    title,
    description,
    alternates: { canonical: "/terms" },
    openGraph: { title, description, type: "website", url: "/terms" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TermsPage() {
  const [pageData, settings] = await Promise.all([
    getContentPageBySlug<TermsContent>("terms"),
    getAllSiteSettings(),
  ]);

  const content = pageData?.content || {};
  const companyName = settings.company_name || "Booking Network Global Group";
  const isKo = (await cookies()).get("bng_locale")?.value === "ko";

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      <PageHero
        index="§ 2"
        eyebrow={content.status_badge || (isKo ? "엔터프라이즈 그룹 기관 약관" : "Enterprise Group Institutional Terms")}
        title={content.title || (isKo ? "이용약관 & 플랫폼 거버넌스 동의서" : "Terms of Use & Platform Governance Agreement")}
        description={
          isKo
            ? `${companyName} 포털 및 디지털 자산 접근에 적용되는 약관입니다.`
            : `Terms governing access to the ${companyName} portal and digital assets.`
        }
        meta={isKo ? `주체: ${companyName} • 최종 업데이트: ${content.last_updated || "2026년 10월"}` : `Entity: ${companyName} • Last Updated: ${content.last_updated || "October 2026"}`}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm dark:border-white/10 dark:bg-obsidian-900">
            {renderPolicyBody(content.body || DEFAULT_TERMS_BODY)}
          </div>
        </div>
      </section>
    </div>
  );
}

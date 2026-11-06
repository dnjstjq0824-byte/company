import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight } from "lucide-react";
import { getPublishedPlatforms, getAllSiteSettings } from "@/lib/data";
import { PlatformFilterGrid } from "@/components/PlatformFilterGrid";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Business & Technology Divisions | Booking Network Global Group",
  description:
    "Explore the 6 core business and technology divisions architected, governed, and scaled by Booking Network Global Group across cloud infrastructure, AI intelligence, B2B mesh, and fintech trust.",
  alternates: { canonical: "/platforms" },
  openGraph: {
    title: "Business & Technology Divisions | Booking Network Global Group",
    description:
      "Explore the 6 core business and technology divisions architected, governed, and scaled by Booking Network Global Group across cloud infrastructure, AI intelligence, B2B mesh, and fintech trust.",
    type: "website",
    url: "/platforms",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business & Technology Divisions | Booking Network Global Group",
    description:
      "Explore the 6 core business and technology divisions architected, governed, and scaled by Booking Network Global Group across cloud infrastructure, AI intelligence, B2B mesh, and fintech trust.",
  },
};

export default async function PlatformsDirectoryPage() {
  const [platforms, settings] = await Promise.all([
    getPublishedPlatforms(),
    getAllSiteSettings(),
  ]);

  const companyName = settings.company_name || "Booking Network Global Group";
  const isKo = (await cookies()).get("bng_locale")?.value === "ko";

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      <PageHero
        index="02"
        eyebrow={isKo ? "핵심 기술 & 사업 부문" : "Core Technology & Business Divisions"}
        title={isKo ? "글로벌 IT 플랫폼 부문 & 핵심 아키텍처" : "Global IT Platform Divisions & Core Architecture"}
        description={
          isKo
            ? `${companyName}는 현대 엔터프라이즈 생태계를 뒷받침하는 주권 디지털 기반을 설계하고 거버넌스합니다. 분산 클라우드 엣지 백본, 스트리밍 AI 인텔리전스, 크로스보더 API 메시 네트워크, 제로트러스트 사이버보안 프로토콜을 아우릅니다.`
            : `${companyName} architects and governs the sovereign digital foundation powering modern enterprise ecosystems—spanning distributed cloud edge backbones, streaming AI intelligence, cross-border API mesh networks, and zero-trust cybersecurity protocols.`
        }
      />

      {/* Directory Content */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PlatformFilterGrid
            platforms={platforms}
            enableSearch={true}
            enableStatusFilter={true}
          />
        </div>
      </section>

      {/* Bottom Partnership CTA */}
      <section className="border-t border-slate-200 bg-slate-50/70 py-16 dark:border-white/10 dark:bg-obsidian-900/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Interested in Strategic Division Integration?
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Connect with {companyName} regarding enterprise technology alliances, API mesh onboarding, or joint-venture platform development.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-cobalt-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-cobalt-500 transition-colors"
          >
            <span>Contact Enterprise Leadership</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

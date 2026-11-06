import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getPublishedNewsPosts, getAllSiteSettings } from "@/lib/data";
import { NewsroomFilterView } from "@/components/NewsroomFilterView";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsroom & Investor Relations | Booking Network Global Group",
  description:
    "Official newsroom, press releases, corporate governance announcements, and investor relations disclosures of Booking Network Global Group.",
  alternates: { canonical: "/newsroom" },
  openGraph: {
    title: "Newsroom & Investor Relations | Booking Network Global Group",
    description:
      "Official newsroom, press releases, corporate governance announcements, and investor relations disclosures of Booking Network Global Group.",
    type: "website",
    url: "/newsroom",
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsroom & Investor Relations | Booking Network Global Group",
    description:
      "Official newsroom, press releases, corporate governance announcements, and investor relations disclosures of Booking Network Global Group.",
  },
};

export default async function NewsroomPage(context: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [posts, settings, searchParams] = await Promise.all([
    getPublishedNewsPosts(),
    getAllSiteSettings(),
    context.searchParams,
  ]);

  const companyName = settings.company_name || "Booking Network Global Group";
  const isKo = (await cookies()).get("bng_locale")?.value === "ko";

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      <PageHero
        index="04"
        eyebrow={isKo ? "공식 기업 공시" : "Official Corporate Disclosures"}
        title={isKo ? "뉴스룸 & 투자자 관계" : "Newsroom & Investor Relations"}
        description={
          isKo
            ? `${companyName}의 공식 커뮤니케이션 및 공시 센터입니다. 검증된 보도자료, 분기별 기관 브리핑, 기술 백서 및 이사회 거버넌스 공지를 확인하세요.`
            : `The official communications and disclosure center for ${companyName}. Access verified press releases, quarterly institutional briefings, technological whitepapers, and board governance notices.`
        }
      />

      {/* Main Filterable News Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NewsroomFilterView posts={posts} initialCategory={searchParams.category} />
        </div>
      </section>
    </div>
  );
}


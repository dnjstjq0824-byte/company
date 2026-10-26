"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Mail, MapPin, Phone, ShieldCheck, ArrowUpRight } from "lucide-react";
import { ParsedPlatform } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

export function Footer({
  settings,
  platforms,
}: {
  settings: Record<string, string>;
  platforms: ParsedPlatform[];
}) {
  const pathname = usePathname();
  const { locale, t } = useLanguage();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const companyName =
    locale === "ko"
      ? settings.company_name_kr || "부킹네트워크글로벌그룹 (Booking Network Global Group)"
      : settings.company_name || "Booking Network Global Group";

  const tagline =
    locale === "ko"
      ? settings.tagline_kr || "글로벌 디지털 백본을 설계하고, 차세대 플랫폼 생태계를 연결합니다."
      : settings.tagline || "Architecting the Global Digital Backbone. Connecting Next-Generation Platforms.";

  const brandPositioning =
    locale === "ko"
      ? settings.brand_positioning_kr ||
        "부킹네트워크글로벌그룹은 글로벌 시장 전반에서 엔터프라이즈급 디지털 인프라, 지능형 데이터 생태계 및 크로스보더 플랫폼 기술을 설계·거버넌스하는 글로벌 IT 플랫폼 그룹입니다."
      : settings.brand_positioning ||
        "Booking Network Global Group is a premier global IT platform group that architects, governs, and scales enterprise-grade digital infrastructure, intelligent network ecosystems, and cross-border platform technologies across global markets.";

  const corporateEmail = settings.corporate_email?.trim() || "contact@bookingnetwork.com";
  const irEmail = settings.ir_email?.trim() || "ir@bookingnetwork.com";
  const telephone = settings.telephone?.trim();
  const businessAddress = settings.business_address?.trim() || "Teheran-ro, Gangnam-gu, Seoul, Republic of Korea";

  const socialLinks = [
    { label: "LinkedIn", url: settings.social_linkedin?.trim() },
    { label: "X (Twitter)", url: settings.social_x?.trim() },
    { label: "YouTube", url: settings.social_youtube?.trim() },
    { label: "GitHub", url: settings.social_github?.trim() },
  ].filter((s) => Boolean(s.url));

  return (
    <footer className="border-t border-slate-200/80 bg-obsidian-950 text-slate-300 dark:border-white/10 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top Corporate Summary */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 pb-14 border-b border-slate-800">
          <div className="lg:col-span-6">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-obsidian-900 border border-slate-700/80 shadow-md">
                {settings.brand_logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.brand_logo}
                    alt={`${companyName} monogram`}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <Globe className="h-6 w-6 text-cyan-400" />
                )}
              </div>
              <div>
                <span className="block text-lg font-extrabold tracking-tight text-white">
                  {companyName}
                </span>
                <span className="block text-xs font-semibold text-cyan-400">
                  {tagline}
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
              {brandPositioning}
            </p>

            {/* Social channels */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                <span className="text-slate-500 uppercase tracking-wider text-[11px]">
                  Global Channels:
                </span>
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>{s.label}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Contact & HQ Quick Card */}
          <div className="lg:col-span-6 flex flex-col justify-center rounded-2xl border border-slate-800 bg-obsidian-900/60 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
                  {locale === "ko" ? "글로벌 본사" : "Global Headquarters"}
                </span>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
                  <span>{businessAddress}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
                  {locale === "ko" ? "공식 이메일" : "Official Communications"}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-cyan-400" />
                    <a href={`mailto:${corporateEmail}`} className="hover:text-white transition-colors">
                      {corporateEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>IR/PR:</span>
                    <a href={`mailto:${irEmail}`} className="hover:text-white transition-colors">
                      {irEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Enterprise Columns */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Group Governance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {locale === "ko" ? "그룹 거버넌스" : "Group Governance"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {locale === "ko" ? "그룹 개요 & 사명" : "Corporate Overview & Mandate"}
                </Link>
              </li>
              <li>
                <Link href="/about#governance" className="hover:text-white transition-colors">
                  {locale === "ko" ? "이사회 & 감독 기구" : "Board & Oversight Councils"}
                </Link>
              </li>
              <li>
                <Link href="/about#roadmap" className="hover:text-white transition-colors">
                  {locale === "ko" ? "기술 로드맵 (2026–2030)" : "Technology Roadmap (2026–2030)"}
                </Link>
              </li>
              <li>
                <Link href="/about#network" className="hover:text-white transition-colors">
                  {locale === "ko" ? "글로벌 거점 허브" : "Global Regional Hubs"}
                </Link>
              </li>
              <li>
                <Link href="/platforms/sustainable-tech-esg" className="hover:text-white transition-colors">
                  {locale === "ko" ? "ESG & 기술 윤리" : "ESG & Technology Ethics"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Business & Technology Divisions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {locale === "ko" ? "6대 핵심 사업·기술 부문" : "Core Tech Divisions"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              {platforms.slice(0, 6).map((div) => (
                <li key={div.slug}>
                  <Link
                    href={`/platforms/${div.slug}`}
                    className="hover:text-white transition-colors truncate block"
                  >
                    {div.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Newsroom & IR */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {locale === "ko" ? "뉴스룸 & 투자자 관계" : "Newsroom & Investor Relations"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/newsroom?category=Press%20Release" className="hover:text-white transition-colors">
                  {locale === "ko" ? "공식 보도자료" : "Press Releases"}
                </Link>
              </li>
              <li>
                <Link href="/newsroom?category=IR%20%26%20Governance" className="hover:text-white transition-colors">
                  {locale === "ko" ? "IR & 공시 정보" : "Institutional Disclosures"}
                </Link>
              </li>
              <li>
                <Link href="/newsroom?category=Technology" className="hover:text-white transition-colors">
                  {locale === "ko" ? "기술 백서" : "Technical Whitepapers"}
                </Link>
              </li>
              <li>
                <Link href="/newsroom?category=Global%20Notice" className="hover:text-white transition-colors">
                  {locale === "ko" ? "글로벌 공지사항" : "Global Notices"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {locale === "ko" ? "IR & 미디어 문의" : "IR & Media Inquiry"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Compliance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {locale === "ko" ? "법무 & 규제 준수" : "Legal & Compliance"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {locale === "ko" ? "개인정보 처리방침" : "Privacy Policy & Data Charter"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {locale === "ko" ? "웹사이트 이용약관" : "Website Terms of Use"}
                </Link>
              </li>
              <li>
                <Link href="/platforms/fintech-trust-security" className="hover:text-white transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{locale === "ko" ? "제로트러스트 거버넌스" : "Zero-Trust Security"}</span>
                </Link>
              </li>
              <li className="pt-3 border-t border-slate-800">
                <Link
                  href="/admin/login"
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {locale === "ko" ? "엔터프라이즈 어드민 포털" : "Enterprise Admin Portal"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row text-xs text-slate-500">
          <p>{t.common.footerCopyright}</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Backbone Status: 99.999% SLA Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

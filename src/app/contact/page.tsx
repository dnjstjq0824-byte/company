import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { getAllSiteSettings } from "@/lib/data";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Strategic Partnerships & Contact | Booking Network Global Group",
  description:
    "Contact Booking Network Global Group for enterprise partnerships, technology integrations, institutional investor relations, or media inquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Strategic Partnerships & Contact | Booking Network Global Group",
    description:
      "Contact Booking Network Global Group for enterprise partnerships, technology integrations, institutional investor relations, or media inquiries.",
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategic Partnerships & Contact | Booking Network Global Group",
    description:
      "Contact Booking Network Global Group for enterprise partnerships, technology integrations, institutional investor relations, or media inquiries.",
  },
};

export default async function ContactPage(context: {
  searchParams: Promise<{ platform?: string }>;
}) {
  const [settings, searchParams] = await Promise.all([
    getAllSiteSettings(),
    context.searchParams,
  ]);

  const companyName = settings.company_name || "Booking Network Global Group";
  const corporateEmail = settings.corporate_email?.trim() || "contact@bookingnetwork.com";
  const irEmail = settings.ir_email?.trim() || "ir@bookingnetwork.com";
  const prEmail = settings.pr_email?.trim() || "press@bookingnetwork.com";
  const telephone = settings.telephone?.trim();
  const businessAddress = settings.business_address?.trim() || "Teheran-ro, Gangnam-gu, Seoul, Republic of Korea";
  const operatingHours = settings.operating_hours?.trim() || "Monday – Friday: 09:00 – 18:00 (KST / UTC+9)";

  const socialLinks = [
    { label: "LinkedIn", url: settings.social_linkedin?.trim() },
    { label: "X (Twitter)", url: settings.social_x?.trim() },
    { label: "YouTube", url: settings.social_youtube?.trim() },
    { label: "GitHub", url: settings.social_github?.trim() },
  ].filter((s) => Boolean(s.url));

  const isKo = (await cookies()).get("bng_locale")?.value === "ko";

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      <PageHero
        index="05"
        eyebrow={isKo ? "글로벌 협력 & 전략 문의" : "Global Engagement & Strategic Inquiries"}
        title={isKo ? "문의 & 전략적 제휴" : "Contact & Strategic Alliance"}
        description={
          isKo
            ? `${companyName}의 경영진, 엔터프라이즈 아키텍처 위원회, 기관 IR 또는 글로벌 미디어 커뮤니케이션팀과 연결하세요.`
            : `Engage with ${companyName}'s executive governance, enterprise architecture council, institutional investor relations, or global media communications.`
        }
      />

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Form Column */}
            <div className="lg:col-span-8">
              <ContactForm initialPlatform={searchParams.platform} />
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6 lg:col-span-4">
              {/* Routing Info Card */}
              <div className="rounded-3xl border border-slate-200/90 bg-slate-50/80 p-7 dark:border-white/10 dark:bg-obsidian-900 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-cobalt-600 dark:text-cyan-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Corporate Routing Protocol
                  </h2>
                </div>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Submissions are reviewed by our corporate triage desk and dispatched directly to the designated department (Partnerships, IR, Architecture, or Legal).
                </p>

                <div className="mt-6 space-y-4 border-t border-slate-200/80 dark:border-white/10 pt-5 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <strong className="block text-slate-900 dark:text-white mb-0.5">
                      General & Partnership:
                    </strong>
                    <a href={`mailto:${corporateEmail}`} className="text-cobalt-600 dark:text-cyan-400 hover:underline">
                      {corporateEmail}
                    </a>
                  </div>

                  <div>
                    <strong className="block text-slate-900 dark:text-white mb-0.5">
                      Investor Relations & Governance:
                    </strong>
                    <a href={`mailto:${irEmail}`} className="text-cobalt-600 dark:text-cyan-400 hover:underline">
                      {irEmail}
                    </a>
                  </div>

                  <div>
                    <strong className="block text-slate-900 dark:text-white mb-0.5">
                      Press & Media Relations:
                    </strong>
                    <a href={`mailto:${prEmail}`} className="text-cobalt-600 dark:text-cyan-400 hover:underline">
                      {prEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Verified Direct Contact */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 dark:border-white/10 dark:bg-obsidian-900 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-cobalt-600 dark:text-cyan-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Global Headquarters
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-cobalt-600 dark:text-cyan-400 mt-0.5" />
                    <span>{businessAddress}</span>
                  </div>

                  {telephone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-cobalt-600 dark:text-cyan-400" />
                      <a href={`tel:${telephone}`} className="hover:text-slate-900 dark:hover:text-white">
                        {telephone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-cobalt-600 dark:text-cyan-400" />
                    <span>{operatingHours}</span>
                  </div>
                </div>
              </div>

              {/* Global Social Channels */}
              {socialLinks.length > 0 && (
                <div className="rounded-3xl border border-slate-200/90 bg-white p-7 dark:border-white/10 dark:bg-obsidian-900 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isKo ? "글로벌 채널" : "Global Channels"}
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                    {socialLinks.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-cobalt-600 hover:underline dark:text-cyan-400"
                        >
                          <span>{s.label}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

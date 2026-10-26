import type { Metadata } from "next";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Globe,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import { getAllSiteSettings } from "@/lib/data";
import { ContactForm } from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Strategic Partnerships & Contact | Booking Network Global Group",
  description:
    "Contact Booking Network Global Group for enterprise partnerships, technology integrations, institutional investor relations, or media inquiries.",
  alternates: { canonical: "/contact" },
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

  return (
    <div className="bg-white dark:bg-obsidian-950 transition-colors">
      {/* Header */}
      <section className="bg-obsidian-950 py-16 text-white sm:py-24 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-cobalt-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              Global Engagement & Strategic Inquiries
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Contact & Strategic Alliance
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
              Engage with {companyName}'s executive governance, enterprise architecture council, institutional investor relations, or global media communications.
            </p>
          </div>
        </div>
      </section>

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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

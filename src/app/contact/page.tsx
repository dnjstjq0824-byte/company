import type { Metadata } from "next";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Globe,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { getAllSiteSettings } from "@/lib/data";
import { ContactForm } from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us — Corporate & Partnership Inquiries",
  description:
    "Contact Booking Network Co., Ltd. for business partnerships, platform collaborations, advertising inquiries, or general corporate communications.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage(context: {
  searchParams: Promise<{ platform?: string }>;
}) {
  const [settings, searchParams] = await Promise.all([
    getAllSiteSettings(),
    context.searchParams,
  ]);

  const companyName = settings.company_name || "Booking Network Co., Ltd.";
  const corporateEmail = settings.corporate_email?.trim();
  const telephone = settings.telephone?.trim();
  const businessAddress = settings.business_address?.trim();
  const operatingHours = settings.operating_hours?.trim();

  const socialLinks = [
    { label: "LinkedIn", url: settings.social_linkedin?.trim() },
    { label: "X (Twitter)", url: settings.social_x?.trim() },
    { label: "YouTube", url: settings.social_youtube?.trim() },
    { label: "GitHub", url: settings.social_github?.trim() },
  ].filter((s) => Boolean(s.url));

  const hasAnyDirectContact = Boolean(
    corporateEmail ||
      telephone ||
      businessAddress ||
      operatingHours ||
      socialLinks.length > 0
  );

  return (
    <div>
      {/* Header */}
      <section className="bg-navy-950 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-electric-400">
              <MessageSquare className="h-3.5 w-3.5" />
              Corporate Communications
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Contact {companyName}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Interested in business partnerships, platform collaboration,
              marketing opportunities, or general corporate inquiries? Send our
              team a message below.
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
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-navy-900">
                <div className="flex items-center gap-2.5">
                  <Globe className="h-5 w-5 text-electric-600 dark:text-electric-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Corporate Inquiry Routing
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  All submissions through this portal are securely encrypted,
                  timestamped, and routed directly to the {companyName}{" "}
                  administration team.
                </p>

                <div className="mt-6 space-y-3 border-t border-slate-200/80 pt-5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  <div>
                    <strong className="block text-slate-900 dark:text-white">
                      Business Partnerships
                    </strong>
                    Strategic alliances, cross-platform ventures, and regional
                    expansion proposals.
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">
                      Platform Collaboration
                    </strong>
                    Merchant, travel provider, data provider, or creator
                    onboarding inquiries for individual platforms.
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">
                      Advertising & Media
                    </strong>
                    Brand sponsorship, media kits, and official press
                    communications.
                  </div>
                </div>
              </div>

              {/* Verified Corporate Contact Details (Only rendered when configured in Admin Settings) */}
              {hasAnyDirectContact && (
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-navy-900">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Official Contact Information
                  </h2>
                  <dl className="mt-5 space-y-4 text-sm">
                    {corporateEmail && (
                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-electric-600 dark:text-electric-400" />
                        <div>
                          <dt className="text-xs font-semibold uppercase text-slate-400">
                            Corporate Email
                          </dt>
                          <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
                            <a
                              href={`mailto:${corporateEmail}`}
                              className="hover:text-electric-600 dark:hover:text-electric-400"
                            >
                              {corporateEmail}
                            </a>
                          </dd>
                        </div>
                      </div>
                    )}

                    {telephone && (
                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-electric-600 dark:text-electric-400" />
                        <div>
                          <dt className="text-xs font-semibold uppercase text-slate-400">
                            Telephone
                          </dt>
                          <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
                            <a
                              href={`tel:${telephone}`}
                              className="hover:text-electric-600 dark:hover:text-electric-400"
                            >
                              {telephone}
                            </a>
                          </dd>
                        </div>
                      </div>
                    )}

                    {businessAddress && (
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-600 dark:text-electric-400" />
                        <div>
                          <dt className="text-xs font-semibold uppercase text-slate-400">
                            Business Address
                          </dt>
                          <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
                            {businessAddress}
                          </dd>
                        </div>
                      </div>
                    )}

                    {operatingHours && (
                      <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-electric-600 dark:text-electric-400" />
                        <div>
                          <dt className="text-xs font-semibold uppercase text-slate-400">
                            Operating Hours
                          </dt>
                          <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
                            {operatingHours}
                          </dd>
                        </div>
                      </div>
                    )}
                  </dl>

                  {socialLinks.length > 0 && (
                    <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Official Social Channels
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {socialLinks.map((s) => (
                          <a
                            key={s.label}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-electric-500 hover:text-electric-600 dark:border-slate-700 dark:text-slate-300"
                          >
                            {s.label}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


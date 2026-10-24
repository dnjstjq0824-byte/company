"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { ParsedPlatform } from "@/lib/data";

export function Footer({
  settings,
  platforms,
}: {
  settings: Record<string, string>;
  platforms: ParsedPlatform[];
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const companyName = settings.company_name || "Booking Network Co., Ltd.";
  const tagline =
    settings.tagline || "Connecting Platforms. Expanding Possibilities.";
  const brandPositioning =
    settings.brand_positioning ||
    "A global digital technology company developing and connecting platforms that empower commerce, travel, information discovery, financial market exploration, content sharing, and communication.";

  const corporateEmail = settings.corporate_email?.trim();
  const telephone = settings.telephone?.trim();
  const businessAddress = settings.business_address?.trim();

  const socialLinks = [
    { label: "LinkedIn", url: settings.social_linkedin?.trim() },
    { label: "X (Twitter)", url: settings.social_x?.trim() },
    { label: "YouTube", url: settings.social_youtube?.trim() },
    { label: "GitHub", url: settings.social_github?.trim() },
  ].filter((s) => Boolean(s.url));

  return (
    <footer className="border-t border-slate-200 bg-navy-950 text-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Column 1: Corporate Identity */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 border border-slate-800">
                {settings.brand_logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.brand_logo}
                    alt={`${companyName} logo`}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <Globe className="h-5 w-5 text-electric-400" />
                )}
              </div>
              <div>
                <span className="block text-lg font-extrabold tracking-tight text-white">
                  {companyName}
                </span>
                <span className="block text-xs font-medium text-electric-400">
                  {tagline}
                </span>
              </div>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {brandPositioning}
            </p>

            {/* Only render verified contact details when configured by admin */}
            {(corporateEmail || telephone || businessAddress) && (
              <div className="mt-6 space-y-2.5 border-t border-slate-800/80 pt-5 text-sm text-slate-300">
                {corporateEmail && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-electric-400" />
                    <a
                      href={`mailto:${corporateEmail}`}
                      className="hover:text-white transition-colors"
                    >
                      {corporateEmail}
                    </a>
                  </div>
                )}
                {telephone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-electric-400" />
                    <a
                      href={`tel:${telephone}`}
                      className="hover:text-white transition-colors"
                    >
                      {telephone}
                    </a>
                  </div>
                )}
                {businessAddress && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                    <span>{businessAddress}</span>
                  </div>
                )}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-navy-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-electric-500 hover:text-white transition-colors"
                  >
                    {social.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Platform Ecosystem (1-5) */}
          <div className="sm:col-span-6 lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Portfolio
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {platforms.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/platforms/${p.slug}`}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-electric-400 transition-colors"
                  >
                    <span>{p.name}</span>
                    <span className="text-[11px] text-slate-500">
                      ({p.category})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform Ecosystem (6-10) */}
          <div className="sm:col-span-6 lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Search, Knowledge & Media
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {platforms.slice(5, 10).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/platforms/${p.slug}`}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-electric-400 transition-colors"
                  >
                    <span>{p.name}</span>
                    <span className="text-[11px] text-slate-500">
                      ({p.category})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Corporate Navigation & Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Corporate & Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-electric-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-electric-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/platforms"
                  className="text-slate-400 hover:text-electric-400 transition-colors"
                >
                  Our Platforms
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-electric-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-400 hover:text-electric-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-400 hover:text-electric-400 transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            {settings.footer_copyright ||
              `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
          </p>
          <p className="text-center sm:text-right">
            Official Corporate Portal — Independent Platform Identities &
            Operations
          </p>
        </div>
      </div>
    </footer>
  );
}


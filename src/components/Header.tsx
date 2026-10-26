"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  Globe,
  Cloud,
  Cpu,
  Network,
  ShieldCheck,
  Boxes,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { ParsedPlatform } from "@/lib/data";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "@/lib/i18n";

function getDivisionIcon(iconName: string) {
  switch (iconName) {
    case "Cloud":
      return Cloud;
    case "Cpu":
      return Cpu;
    case "Network":
      return Network;
    case "ShieldCheck":
      return ShieldCheck;
    case "Boxes":
      return Boxes;
    case "Globe":
      return Globe;
    default:
      return Layers;
  }
}

export function Header({
  companyName,
  brandLogo,
  platforms,
  announcement,
}: {
  companyName: string;
  brandLogo?: string;
  platforms: ParsedPlatform[];
  announcement?: { enabled: boolean; text: string; link: string };
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const displayName = locale === "ko" ? "부킹네트워크글로벌그룹" : "Booking Network Global Group";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-obsidian-950/95 transition-colors">
      {/* Optional Global Announcement Bar */}
      {announcement?.enabled && announcement.text && (
        <div className="bg-gradient-to-r from-cobalt-600 via-indigo-600 to-cyan-600 px-4 py-1.5 text-center text-xs font-medium text-white shadow-inner">
          <Link
            href={announcement.link || "/newsroom"}
            className="inline-flex items-center gap-1.5 hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 animate-pulse text-cyan-200" />
            <span>{announcement.text}</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group focus:outline-none"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-obsidian-900 border border-slate-700/60 dark:border-white/15 shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
            {brandLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandLogo}
                alt={`${companyName} monogram`}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Globe className="h-6 w-6 text-cyan-400" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              {displayName}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cobalt-600 dark:text-cyan-400">
              {t.brand.badge}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex lg:items-center lg:gap-1.5 xl:gap-2"
        >
          {/* 1. Group Overview */}
          <Link
            href="/about"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/about"
                ? "bg-slate-100 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400 font-semibold"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            {t.nav.overview}
          </Link>

          {/* 2. Business & Technology Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
          >
            <Link
              href="/platforms"
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/platforms")
                  ? "bg-slate-100 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400 font-semibold"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <span>{t.nav.divisions}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  megaMenuOpen ? "rotate-180 text-cobalt-600 dark:text-cyan-400" : ""
                }`}
              />
            </Link>

            {megaMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-[640px] pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-obsidian-900">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/10">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cyan-400">
                        {t.brand.groupName}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {t.common.coreDivisionsHeading}
                      </h4>
                    </div>
                    <Link
                      href="/platforms"
                      className="text-xs font-semibold text-cobalt-600 hover:text-cobalt-700 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1"
                    >
                      {locale === "ko" ? "전체 아키텍처 보기" : "View All Divisions"}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {platforms.slice(0, 6).map((div) => {
                      const IconComponent = getDivisionIcon(div.icon_name);
                      return (
                        <Link
                          key={div.slug}
                          href={`/platforms/${div.slug}`}
                          className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 group"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cobalt-50 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cobalt-600 dark:group-hover:text-cyan-400 truncate">
                                {div.name}
                              </span>
                            </div>
                            <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                              {div.category} • {div.division_code}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Global Network */}
          <Link
            href="/about#network"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
          >
            {t.nav.network}
          </Link>

          {/* 4. Newsroom & IR */}
          <Link
            href="/newsroom"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/newsroom")
                ? "bg-slate-100 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400 font-semibold"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            {t.nav.newsroom}
          </Link>

          {/* 5. Partnership & Contact */}
          <Link
            href="/contact"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/contact"
                ? "bg-slate-100 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400 font-semibold"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            {t.nav.contact}
          </Link>
        </nav>

        {/* Right Utility: Language Switcher, Theme Toggle, Contact CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher (EN | KO) */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5 text-xs font-semibold dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                locale === "en"
                  ? "bg-white text-cobalt-600 shadow-sm dark:bg-cobalt-600 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              EN
            </button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              onClick={() => setLocale("ko")}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                locale === "ko"
                  ? "bg-white text-cobalt-600 shadow-sm dark:bg-cobalt-600 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              KO
            </button>
          </div>

          <ThemeToggle />

          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-cobalt-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-cobalt-500 transition-colors"
          >
            <span>{t.nav.contact}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-6 dark:border-white/10 dark:bg-obsidian-950 lg:hidden">
          <div className="space-y-1">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {t.nav.overview}
            </Link>
            <Link
              href="/platforms"
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {t.nav.divisions}
            </Link>
            <div className="pl-4 space-y-1 my-2 border-l border-slate-200 dark:border-white/10">
              {platforms.slice(0, 6).map((div) => (
                <Link
                  key={div.slug}
                  href={`/platforms/${div.slug}`}
                  className="block py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-cobalt-600 dark:hover:text-cyan-400"
                >
                  • {div.name}
                </Link>
              ))}
            </div>
            <Link
              href="/about#network"
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {t.nav.network}
            </Link>
            <Link
              href="/newsroom"
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {t.nav.newsroom}
            </Link>
            <Link
              href="/contact"
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

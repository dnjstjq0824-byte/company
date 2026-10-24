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
  Layers,
} from "lucide-react";
import { ParsedPlatform } from "@/lib/data";
import { ThemeToggle } from "./ThemeToggle";
import { StatusBadge } from "./StatusBadge";

export function Header({
  companyName,
  brandLogo,
  platforms,
}: {
  companyName: string;
  brandLogo?: string;
  platforms: ParsedPlatform[];
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-navy-950/95">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 border border-slate-800 shadow-sm overflow-hidden">
            {brandLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandLogo}
                alt={`${companyName} logo`}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Globe className="h-5 w-5 text-electric-400" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-lg">
              {companyName}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Global Platform Ecosystem
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex md:items-center md:gap-1 lg:gap-2"
        >
          <Link
            href="/"
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-slate-100 text-electric-600 dark:bg-navy-900 dark:text-electric-400"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white"
            }`}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              pathname === "/about"
                ? "bg-slate-100 text-electric-600 dark:bg-navy-900 dark:text-electric-400"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white"
            }`}
          >
            About Us
          </Link>

          {/* Mega Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
          >
            <button
              type="button"
              aria-expanded={megaMenuOpen}
              onClick={() => setMegaMenuOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                pathname?.startsWith("/platforms")
                  ? "bg-slate-100 text-electric-600 dark:bg-navy-900 dark:text-electric-400"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white"
              }`}
            >
              <span>Our Platforms</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-150 ${
                  megaMenuOpen ? "rotate-180 text-electric-600" : ""
                }`}
              />
            </button>

            {megaMenuOpen && (
              <div className="absolute left-1/2 top-full w-[680px] -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-navy-900">
                  <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-electric-600 dark:text-electric-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Platform Portfolio ({platforms.length} Services)
                      </span>
                    </div>
                    <Link
                      href="/platforms"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-electric-600 hover:underline dark:text-electric-400"
                    >
                      View Full Directory
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {platforms.slice(0, 10).map((item) => (
                      <Link
                        key={item.id}
                        href={`/platforms/${item.slug}`}
                        className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-navy-800/60"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-950 p-1 border border-slate-800">
                          {item.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.logo}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold text-electric-400">
                              {item.name.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {item.name}
                            </p>
                            <StatusBadge status={item.platform_status} />
                          </div>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {item.category}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              pathname === "/contact"
                ? "bg-slate-100 text-electric-600 dark:bg-navy-900 dark:text-electric-400"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white"
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <ThemeToggle />
          <Link
            href="/platforms"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-navy-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Explore Ecosystem
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-electric-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-electric-700 transition-colors"
          >
            Partner With Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-navy-900"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-6 pt-4 dark:border-slate-800 dark:bg-navy-950 md:hidden">
          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              className="rounded-lg px-3 py-2.5 text-base font-semibold text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-navy-900"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-3 py-2.5 text-base font-semibold text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-navy-900"
            >
              About Us
            </Link>
            <Link
              href="/platforms"
              className="rounded-lg px-3 py-2.5 text-base font-semibold text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-navy-900"
            >
              Our Platforms ({platforms.length})
            </Link>
            <div className="grid grid-cols-1 gap-1 pl-4 pt-1 pb-2">
              {platforms.map((p) => (
                <Link
                  key={p.id}
                  href={`/platforms/${p.slug}`}
                  className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-navy-900"
                >
                  <span>{p.name}</span>
                  <span className="text-xs text-slate-400">{p.category}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/contact"
              className="rounded-lg px-3 py-2.5 text-base font-semibold text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-navy-900"
            >
              Contact Us
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Link
              href="/platforms"
              className="w-full rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-800 dark:border-slate-800 dark:text-slate-200"
            >
              Explore Our Platforms
            </Link>
            <Link
              href="/contact"
              className="w-full rounded-xl bg-electric-600 py-2.5 text-center text-sm font-semibold text-white"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


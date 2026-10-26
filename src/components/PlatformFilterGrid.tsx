"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { ParsedPlatform, mapCategoryToFilterGroup } from "@/lib/data";
import { PlatformCard } from "./PlatformCard";
import { useLanguage } from "@/lib/i18n";

const FILTER_GROUPS = [
  "All Divisions",
  "Core Infrastructure",
  "AI & Big Data",
  "B2B Platform & API",
  "FinTech & Cybersecurity",
  "Platform Incubation",
  "ESG & Governance",
];

export function PlatformFilterGrid({
  platforms,
  enableSearch = false,
  enableStatusFilter = false,
}: {
  platforms: ParsedPlatform[];
  enableSearch?: boolean;
  enableStatusFilter?: boolean;
}) {
  const [selectedGroup, setSelectedGroup] = useState("All Divisions");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const { locale } = useLanguage();

  const filtered = useMemo(() => {
    return platforms.filter((platform) => {
      const matchesGroup =
        selectedGroup === "All Divisions" ||
        mapCategoryToFilterGroup(platform.category) === selectedGroup;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        platform.platform_status === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        platform.name.toLowerCase().includes(q) ||
        platform.category.toLowerCase().includes(q) ||
        platform.division_code.toLowerCase().includes(q) ||
        platform.short_description.toLowerCase().includes(q);

      return matchesGroup && matchesStatus && matchesSearch;
    });
  }, [platforms, selectedGroup, statusFilter, searchQuery]);

  return (
    <div>
      {/* Controls Bar */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Pills */}
        <div
          role="tablist"
          aria-label="Filter divisions by technology sector"
          className="flex flex-wrap items-center gap-2"
        >
          {FILTER_GROUPS.map((group) => {
            const active = selectedGroup === group;
            return (
              <button
                key={group}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedGroup(group)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-cobalt-600 text-white shadow-md shadow-cobalt-600/20"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-cobalt-400 hover:text-cobalt-600 dark:border-white/10 dark:bg-obsidian-900 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>

        {/* Optional Search & Status Filters */}
        {(enableSearch || enableStatusFilter) && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {enableSearch && (
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === "ko" ? "부문명, 코드, 분야 검색..." : "Search division by code or tech..."}
                  className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-10 pr-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-900 dark:text-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            {enableStatusFilter && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-900 dark:text-slate-200"
              >
                <option value="All Statuses">All Operational Statuses</option>
                <option value="Core Architecture">Core Architecture</option>
                <option value="Live">Live</option>
                <option value="Expanding">Expanding</option>
                <option value="R&D Phase">R&D Phase</option>
              </select>
            )}
          </div>
        )}
      </div>

      {/* Grid of Division Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-white/15">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {locale === "ko" ? "선택한 조건의 기술 부문이 없습니다." : "No business & technology divisions match your criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((platform) => (
            <PlatformCard key={platform.slug} platform={platform} />
          ))}
        </div>
      )}
    </div>
  );
}

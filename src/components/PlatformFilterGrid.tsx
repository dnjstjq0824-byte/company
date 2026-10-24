"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ParsedPlatform, mapCategoryToFilterGroup } from "@/lib/data";
import { PlatformCard } from "./PlatformCard";

const FILTER_GROUPS = [
  "All Platforms",
  "Commerce",
  "Travel",
  "Search & Knowledge",
  "Financial Information",
  "Media & Communication",
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
  const [selectedGroup, setSelectedGroup] = useState("All Platforms");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filtered = useMemo(() => {
    return platforms.filter((platform) => {
      const matchesGroup =
        selectedGroup === "All Platforms" ||
        mapCategoryToFilterGroup(platform.category) === selectedGroup;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        platform.platform_status === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        platform.name.toLowerCase().includes(q) ||
        platform.category.toLowerCase().includes(q) ||
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
          aria-label="Filter platforms by business sector"
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
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? "bg-electric-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-electric-400 hover:text-electric-600 dark:border-slate-800 dark:bg-navy-900 dark:text-slate-300 dark:hover:border-electric-500"
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
                  placeholder="Search platform by name or sector..."
                  aria-label="Search platforms by name or category"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-electric-500 focus:outline-none dark:border-slate-800 dark:bg-navy-900 dark:text-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search query"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {enableStatusFilter && (
              <div className="relative flex items-center">
                <SlidersHorizontal className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter platforms by operational status"
                  className="rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 focus:border-electric-500 focus:outline-none dark:border-slate-800 dark:bg-navy-900 dark:text-slate-200"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Live">Live</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="In Development">In Development</option>
                  <option value="Temporarily Unavailable">
                    Temporarily Unavailable
                  </option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-12 text-center dark:border-slate-800 dark:bg-navy-900/40">
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            No matching platforms found
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try clearing your search query or selecting a different business
            category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedGroup("All Platforms");
              setSearchQuery("");
              setStatusFilter("All Statuses");
            }}
            className="mt-4 inline-flex items-center rounded-xl bg-electric-600 px-4 py-2 text-xs font-semibold text-white hover:bg-electric-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}


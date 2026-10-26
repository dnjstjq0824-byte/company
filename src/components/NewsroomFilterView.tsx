"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
  FileText,
  TrendingUp,
  Cpu,
  Bell,
  X,
} from "lucide-react";
import { ParsedNewsPost } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

const CATEGORIES = [
  "All",
  "Press Release",
  "IR & Governance",
  "Technology",
  "Global Notice",
];

function getCategoryIcon(cat: string) {
  switch (cat) {
    case "Press Release":
      return FileText;
    case "IR & Governance":
      return TrendingUp;
    case "Technology":
      return Cpu;
    case "Global Notice":
      return Bell;
    default:
      return FileText;
  }
}

export function NewsroomFilterView({ posts }: { posts: ParsedNewsPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { locale, t } = useLanguage();

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === "All" || post.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);

      return matchesCat && matchesQuery;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Category Pills & Search Controls */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  active
                    ? "bg-cobalt-600 text-white shadow-md shadow-cobalt-600/20"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-cobalt-400 hover:text-cobalt-600 dark:border-white/10 dark:bg-obsidian-900 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                }`}
              >
                {cat === "All" && locale === "ko" ? "전체 보기" : cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "ko" ? "공시·기사 검색..." : "Search releases & disclosures..."}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-900 dark:text-white"
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
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-white/15">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {locale === "ko" ? "검색 조건에 일치하는 기사가 없습니다." : "No announcements match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const CatIcon = getCategoryIcon(post.category);
            return (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cobalt-500/50 hover:shadow-xl dark:border-white/10 dark:bg-obsidian-900/90 dark:hover:border-cyan-400/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 rounded-lg bg-cobalt-50 dark:bg-white/10 px-2.5 py-1 text-[11px] font-bold text-cobalt-600 dark:text-cyan-400">
                      <CatIcon className="h-3.5 w-3.5" />
                      <span>{post.category}</span>
                    </div>

                    {post.is_featured && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-amber-500/20">
                        <Sparkles className="h-2.5 w-2.5" />
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-cobalt-600 dark:text-white dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/newsroom/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.published_at).toLocaleDateString(
                      locale === "ko" ? "ko-KR" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </span>
                  <Link
                    href={`/newsroom/${post.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-cobalt-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform"
                  >
                    <span>{locale === "ko" ? "전문 보기" : "Read More"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}


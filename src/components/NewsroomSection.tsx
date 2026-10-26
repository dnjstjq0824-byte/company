"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Tag, ArrowUpRight, Sparkles } from "lucide-react";
import { ParsedNewsPost } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

export function NewsroomSection({ posts }: { posts: ParsedNewsPost[] }) {
  const { locale, t } = useLanguage();

  if (!posts || posts.length === 0) {
    return null;
  }

  const featured = posts.find((p) => p.is_featured) || posts[0];
  const regularPosts = posts.filter((p) => p.slug !== featured.slug).slice(0, 3);

  return (
    <section className="py-20 bg-white dark:bg-obsidian-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cobalt-500/20 bg-cobalt-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cyan-400">
              Newsroom & IR Disclosures
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t.common.latestNewsHeading}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {t.common.latestNewsSubtitle}
            </p>
          </div>
          <Link
            href="/newsroom"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cobalt-600 hover:text-cobalt-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <span>{t.actions.viewAll}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured Editorial Post (7 cols) */}
          <div className="lg:col-span-7">
            <article className="group h-full flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-slate-50/60 p-8 dark:border-white/10 dark:bg-obsidian-900/60 transition-all duration-300 hover:border-cobalt-500/50 hover:shadow-xl">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-cobalt-600 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    <Sparkles className="h-3 w-3" />
                    {t.common.featured}
                  </span>
                  <span className="rounded-lg bg-white dark:bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {featured.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(featured.published_at).toLocaleDateString(
                      locale === "ko" ? "ko-KR" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </span>
                </div>

                <h3 className="mt-5 text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-cobalt-600 dark:text-white dark:group-hover:text-cyan-400 transition-colors leading-snug">
                  <Link href={`/newsroom/${featured.slug}`}>
                    {featured.title}
                  </Link>
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-4">
                  {featured.summary}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {featured.author_name}
                </span>
                <Link
                  href={`/newsroom/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cobalt-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{locale === "ko" ? "전문 보기" : "Read Full Release"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          </div>

          {/* List of 3 Recent Releases (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {regularPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex-1 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-white/10 dark:bg-obsidian-900/60 hover:border-cobalt-500/40 dark:hover:border-cyan-400/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-cobalt-600 dark:text-cyan-400">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(post.published_at).toLocaleDateString(
                        locale === "ko" ? "ko-KR" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm sm:text-base font-bold text-slate-900 group-hover:text-cobalt-600 dark:text-white dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                    <Link href={`/newsroom/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex justify-end">
                  <Link
                    href={`/newsroom/${post.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-cobalt-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{locale === "ko" ? "전문 보기" : "View"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


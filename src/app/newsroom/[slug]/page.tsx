import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Tag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  getPublishedNewsPostBySlug,
  getPublishedNewsPosts,
  getAllSiteSettings,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(context: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await context.params;
  const post = await getPublishedNewsPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  const title =
    post.seo_title ||
    `${post.title} | Booking Network Global Group Newsroom`;
  const description = post.seo_description || post.summary;

  return {
    title,
    description,
    alternates: {
      canonical: `/newsroom/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/newsroom/${post.slug}`,
      publishedTime: post.published_at.toISOString(),
      authors: [post.author_name],
      images: post.thumbnail_url ? [{ url: post.thumbnail_url }] : undefined,
    },
  };
}

// Simple markdown renderer for article body
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-list`} className="my-4 space-y-2 list-disc pl-6 text-slate-700 dark:text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const renderInline = (text: string) => {
    // Basic bold **text** and italic *text* and link [text](url)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            className="text-cobalt-600 dark:text-cyan-400 underline hover:opacity-80"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
      inList = true;
      listItems.push(trimmed.replace(/^[-*]\s+|\d+\.\s+/, ""));
      return;
    } else {
      flushList(`flush-${index}`);
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="mt-8 mb-3 text-xl font-extrabold text-slate-900 dark:text-white">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="mt-10 mb-4 text-2xl font-extrabold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-white/10">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="mt-12 mb-6 text-3xl font-extrabold text-slate-900 dark:text-white">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote key={index} className="my-6 border-l-4 border-cobalt-600 pl-4 italic text-slate-700 dark:text-slate-300 py-1 bg-slate-50 dark:bg-white/5 rounded-r-xl">
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
    } else if (trimmed === "") {
      // blank line
    } else {
      elements.push(
        <p key={index} className="my-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList("end");
  return elements;
}

export default async function NewsDetailPage(context: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await context.params;
  const [post, allPosts, settings] = await Promise.all([
    getPublishedNewsPostBySlug(slug),
    getPublishedNewsPosts(4),
    getAllSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="bg-white dark:bg-obsidian-950 transition-colors py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/newsroom"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cobalt-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Newsroom & IR</span>
        </Link>

        {/* Article Meta Header */}
        <div className="border-b border-slate-200 dark:border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-md bg-cobalt-50 px-2.5 py-1 text-xs font-bold text-cobalt-600 dark:bg-white/10 dark:text-cyan-400">
              {post.category}
            </span>
            {post.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-amber-500/20">
                <Sparkles className="h-2.5 w-2.5" />
                Featured
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author_name}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-obsidian-900/80">
            <p className="text-base sm:text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              "{post.summary}"
            </p>
          </div>
        </div>

        {/* Article Body */}
        <div className="py-10 prose-headings:font-extrabold">
          {renderMarkdown(post.content)}
        </div>

        {/* Official Disclaimers */}
        <div className="mt-12 rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-white/10 dark:bg-obsidian-900 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
            Official Corporate Notice
          </p>
          This document is published by Booking Network Global Group for informational and official disclosure purposes. For institutional inquiries or media reproduction authorizations, contact \`press@bookingnetwork.com\`.
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
              More from Newsroom & IR
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/newsroom/${item.slug}`}
                  className="rounded-2xl border border-slate-200/80 p-5 dark:border-white/10 dark:bg-obsidian-900/60 hover:border-cobalt-500 dark:hover:border-cyan-400 transition-all group"
                >
                  <span className="text-[11px] font-bold text-cobalt-600 dark:text-cyan-400 block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cobalt-600 dark:group-hover:text-cyan-400 line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}


"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

interface CmsPageRecord {
  page_slug: string;
  publication_status: string;
  seo_metadata: {
    title?: string;
    description?: string;
  };
  content: Record<string, unknown>;
}

const PAGE_TABS = [
  { slug: "home", label: "Homepage (/)" },
  { slug: "about", label: "About Us (/about)" },
  { slug: "privacy", label: "Privacy Policy (/privacy)" },
  { slug: "terms", label: "Terms of Use (/terms)" },
];

export default function AdminContentPage() {
  const [pages, setPages] = useState<Record<string, CmsPageRecord>>({});
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        if (data.pages) {
          const map: Record<string, CmsPageRecord> = {};
          for (const p of data.pages) {
            map[p.page_slug] = p;
          }
          setPages(map);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currentPage = pages[activeTab];

  const updateField = (key: string, value: unknown) => {
    setPages((prev) => {
      const existing = prev[activeTab] || {
        page_slug: activeTab,
        publication_status: "Published",
        seo_metadata: {},
        content: {},
      };
      return {
        ...prev,
        [activeTab]: {
          ...existing,
          content: {
            ...existing.content,
            [key]: value,
          },
        },
      };
    });
  };

  const updateSeo = (key: "title" | "description", value: string) => {
    setPages((prev) => {
      const existing = prev[activeTab] || {
        page_slug: activeTab,
        publication_status: "Published",
        seo_metadata: {},
        content: {},
      };
      return {
        ...prev,
        [activeTab]: {
          ...existing,
          seo_metadata: {
            ...existing.seo_metadata,
            [key]: value,
          },
        },
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage) return;

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_slug: activeTab,
          publication_status: currentPage.publication_status || "Published",
          seo_metadata: currentPage.seo_metadata,
          content: currentPage.content,
        }),
      });
      if (res.ok) {
        setFeedback(
          `Saved and published changes to '${activeTab}' page successfully.`
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading Website Content Management System...
      </div>
    );
  }

  const c = (currentPage?.content || {}) as Record<string, unknown>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
            Website Content Management (CMS)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage headlines, corporate vision & mission, business area
            descriptions, legal policies, and page-specific SEO metadata.
          </p>
        </div>
        <a
          href={activeTab === "home" ? "/" : `/${activeTab}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-navy-900 dark:text-slate-200"
        >
          Preview Live Page
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => {
              setActiveTab(tab.slug);
              setFeedback(null);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
              activeTab === tab.slug
                ? "bg-electric-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-navy-900 dark:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900 sm:p-8"
      >
        {/* SEO Section */}
        <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-electric-600 dark:text-electric-400">
            Page SEO Metadata
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                SEO Title
              </label>
              <input
                type="text"
                value={currentPage?.seo_metadata?.title || ""}
                onChange={(e) => updateSeo("title", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                SEO Description
              </label>
              <input
                type="text"
                value={currentPage?.seo_metadata?.description || ""}
                onChange={(e) => updateSeo("description", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
          </div>
        </div>

        {/* HOME PAGE FIELDS */}
        {activeTab === "home" && (
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-electric-600 dark:text-electric-400">
              Homepage Sections
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Hero Badge Label
                </label>
                <input
                  type="text"
                  value={String(c.hero_badge || "")}
                  onChange={(e) => updateField("hero_badge", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={String(c.hero_headline || "")}
                  onChange={(e) => updateField("hero_headline", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Hero Supporting Text
              </label>
              <textarea
                rows={3}
                value={String(c.hero_supporting_text || "")}
                onChange={(e) =>
                  updateField("hero_supporting_text", e.target.value)
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                About Section Heading
              </label>
              <input
                type="text"
                value={String(c.about_heading || "")}
                onChange={(e) => updateField("about_heading", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                About Section Description
              </label>
              <textarea
                rows={3}
                value={String(c.about_body || "")}
                onChange={(e) => updateField("about_body", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Connected Ecosystem Heading
                </label>
                <input
                  type="text"
                  value={String(c.ecosystem_heading || "")}
                  onChange={(e) =>
                    updateField("ecosystem_heading", e.target.value)
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Partnership CTA Headline
                </label>
                <input
                  type="text"
                  value={String(c.partnership_headline || "")}
                  onChange={(e) =>
                    updateField("partnership_headline", e.target.value)
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Partnership CTA Supporting Text
              </label>
              <textarea
                rows={2}
                value={String(c.partnership_text || "")}
                onChange={(e) =>
                  updateField("partnership_text", e.target.value)
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
          </div>
        )}

        {/* ABOUT US PAGE FIELDS */}
        {activeTab === "about" && (
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-electric-600 dark:text-electric-400">
              About Us Content
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Company Overview Body
              </label>
              <textarea
                rows={5}
                value={String(c.overview_body || "")}
                onChange={(e) => updateField("overview_body", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Corporate Vision Statement
                </label>
                <textarea
                  rows={3}
                  value={String(c.vision || "")}
                  onChange={(e) => updateField("vision", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Corporate Mission Statement
                </label>
                <textarea
                  rows={3}
                  value={String(c.mission || "")}
                  onChange={(e) => updateField("mission", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Global Platform Strategy Body
              </label>
              <textarea
                rows={4}
                value={String(c.strategy_body || "")}
                onChange={(e) => updateField("strategy_body", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
          </div>
        )}

        {/* PRIVACY & TERMS FIELDS */}
        {(activeTab === "privacy" || activeTab === "terms") && (
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-electric-600 dark:text-electric-400">
              Legal Policy Document
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Document Title
                </label>
                <input
                  type="text"
                  value={String(c.title || "")}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Status Label
                </label>
                <input
                  type="text"
                  value={String(c.status_badge || "")}
                  onChange={(e) => updateField("status_badge", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Last Updated Label
                </label>
                <input
                  type="text"
                  value={String(c.last_updated || "")}
                  onChange={(e) => updateField("last_updated", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Policy Content (Markdown Supported)
              </label>
              <textarea
                rows={14}
                value={String(c.body || "")}
                onChange={(e) => updateField("body", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 font-mono text-xs leading-relaxed dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-electric-700 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save & Publish Content
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


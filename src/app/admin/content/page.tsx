"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  FileEdit,
  Layers,
  Shield,
  HelpCircle,
} from "lucide-react";

interface CmsPageRecord {
  page_slug: string;
  publication_status: string;
  seo_metadata: {
    title?: string;
    description?: string;
  };
  content: Record<string, any>;
}

const PAGE_TABS = [
  { slug: "home", label: "Homepage (/)" },
  { slug: "about", label: "About Us (/about)" },
  { slug: "privacy", label: "Privacy Policy (/privacy)" },
  { slug: "terms", label: "Terms of Service (/terms)" },
];

export default function AdminContentPage() {
  const [pages, setPages] = useState<Record<string, CmsPageRecord>>({});
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [previewLegal, setPreviewLegal] = useState(false);

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
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-electric-400" />
        Loading Website Content Management System...
      </div>
    );
  }

  const c = (currentPage?.content || {}) as Record<string, any>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Website Content Management (CMS)
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Dynamically customize global group headlines, corporate statements, architecture summaries, and legal policies.
          </p>
        </div>
        <a
          href={activeTab === "home" ? "/" : `/${activeTab}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-electric-500/50 hover:bg-slate-800 transition-all"
        >
          Preview Live Page
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
        </a>
      </div>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => {
              setActiveTab(tab.slug);
              setFeedback(null);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab.slug
                ? "bg-electric-600 text-white shadow-md shadow-electric-600/30"
                : "border border-slate-800 bg-slate-900/70 text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm sm:p-8"
      >
        {/* SEO Section */}
        <div className="border-b border-slate-800 pb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-400">
            Page SEO Metadata & OpenGraph
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-200">
                SEO Title
              </label>
              <input
                type="text"
                value={currentPage?.seo_metadata?.title || ""}
                onChange={(e) => updateSeo("title", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200">
                SEO Meta Description
              </label>
              <input
                type="text"
                value={currentPage?.seo_metadata?.description || ""}
                onChange={(e) => updateSeo("description", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* HOME PAGE CMS */}
        {activeTab === "home" && (
          <div className="space-y-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-400">
              Homepage Content Modules
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-200">
                  Hero Badge Text
                </label>
                <input
                  type="text"
                  value={String(c.hero_badge || "")}
                  onChange={(e) => updateField("hero_badge", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200">
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  value={String(c.hero_headline || "")}
                  onChange={(e) => updateField("hero_headline", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200">
                Hero Supporting Paragraph
              </label>
              <textarea
                rows={3}
                value={String(c.hero_supporting_text || "")}
                onChange={(e) => updateField("hero_supporting_text", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            {/* Hero Metrics Dynamic Array */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs">Hero Metrics Ribbon</span>
                  <p className="text-[10px] text-slate-400">Numbers displayed right beneath the hero headline</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const list = Array.isArray(c.hero_metrics) ? [...c.hero_metrics] : [];
                    list.push({ label: "Metric", value: "100%" });
                    updateField("hero_metrics", list);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700"
                >
                  <Plus className="h-3 w-3" />
                  Add Metric
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Array.isArray(c.hero_metrics) &&
                  c.hero_metrics.map((m: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-2">
                      <input
                        type="text"
                        value={m.value || ""}
                        onChange={(e) => {
                          const next = [...c.hero_metrics];
                          next[idx] = { ...next[idx], value: e.target.value };
                          updateField("hero_metrics", next);
                        }}
                        placeholder="Value (e.g. 99.999% SLA)"
                        className="w-1/2 rounded border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-xs text-white"
                      />
                      <input
                        type="text"
                        value={m.label || ""}
                        onChange={(e) => {
                          const next = [...c.hero_metrics];
                          next[idx] = { ...next[idx], label: e.target.value };
                          updateField("hero_metrics", next);
                        }}
                        placeholder="Label (e.g. Uptime)"
                        className="flex-1 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = c.hero_metrics.filter((_: any, i: number) => i !== idx);
                          updateField("hero_metrics", next);
                        }}
                        className="rounded p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* About Section */}
            <div className="border-t border-slate-800 pt-5 space-y-4">
              <h3 className="font-bold text-white text-xs">About Holding Section</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200">Heading</label>
                  <input
                    type="text"
                    value={String(c.about_heading || "")}
                    onChange={(e) => updateField("about_heading", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200">Description</label>
                  <textarea
                    rows={3}
                    value={String(c.about_body || "")}
                    onChange={(e) => updateField("about_body", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Partnership CTA Section */}
            <div className="border-t border-slate-800 pt-5 space-y-4">
              <h3 className="font-bold text-white text-xs">Partnership & Investor CTA</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200">Headline</label>
                  <input
                    type="text"
                    value={String(c.partnership_headline || "")}
                    onChange={(e) => updateField("partnership_headline", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200">Button Text</label>
                  <input
                    type="text"
                    value={String(c.partnership_cta_text || "")}
                    onChange={(e) => updateField("partnership_cta_text", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200">Supporting Copy</label>
                <textarea
                  rows={2}
                  value={String(c.partnership_text || "")}
                  onChange={(e) => updateField("partnership_text", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABOUT PAGE CMS */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-400">
              Corporate Governance & Vision Content
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-200">Corporate Overview Body</label>
              <textarea
                rows={5}
                value={String(c.overview_body || "")}
                onChange={(e) => updateField("overview_body", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-200">Corporate Vision Statement</label>
                <textarea
                  rows={3}
                  value={String(c.vision || "")}
                  onChange={(e) => updateField("vision", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200">Corporate Mission Statement</label>
                <textarea
                  rows={3}
                  value={String(c.mission || "")}
                  onChange={(e) => updateField("mission", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Strategic Roadmap */}
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Technology Roadmap & Strategic Vectors
              </label>
              <textarea
                rows={5}
                value={String(c.strategy_body || "")}
                onChange={(e) => updateField("strategy_body", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none leading-relaxed font-mono"
              />
            </div>

            {/* Governance Section */}
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Board Oversight & Triangular Governance Mandate
              </label>
              <textarea
                rows={4}
                value={String(c.governance_body || "")}
                onChange={(e) => updateField("governance_body", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* PRIVACY & TERMS LEGAL CMS */}
        {(activeTab === "privacy" || activeTab === "terms") && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-400">
                Legal Policy Document Editor
              </h2>
              <button
                type="button"
                onClick={() => setPreviewLegal(!previewLegal)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                <Eye className="h-3.5 w-3.5" />
                {previewLegal ? "Edit Raw Markdown" : "Live Markdown Preview"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-slate-200">Policy Title</label>
                <input
                  type="text"
                  value={String(c.title || "")}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200">Status Badge</label>
                <input
                  type="text"
                  value={String(c.status_badge || "")}
                  onChange={(e) => updateField("status_badge", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200">Last Revised Label</label>
                <input
                  type="text"
                  value={String(c.last_updated || "")}
                  onChange={(e) => updateField("last_updated", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>
            </div>

            {previewLegal ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 max-h-[60vh] overflow-y-auto prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-line text-xs font-sans text-slate-300 leading-relaxed">
                  {String(c.body || "")}
                </pre>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-200">
                  Policy Text (Full Markdown, Tables, and Section Headings Supported)
                </label>
                <textarea
                  rows={16}
                  value={String(c.body || "")}
                  onChange={(e) => updateField("body", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-xs text-slate-200 leading-relaxed focus:border-electric-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end border-t border-slate-800 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:bg-electric-500 disabled:opacity-60 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save & Publish Live Content
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Loader2,
  Newspaper,
  Check,
  X,
  Star,
  Calendar,
} from "lucide-react";
import { ParsedNewsPost } from "@/lib/data";

const CATEGORIES = [
  "Press Release",
  "IR & Governance",
  "Technology",
  "Global Notice",
];

const PUBLICATION_STATUSES = ["Published", "Draft", "Archived"];

interface NewsFormState {
  id?: string;
  title: string;
  slug: string;
  category: "Press Release" | "IR & Governance" | "Technology" | "Global Notice";
  summary: string;
  content: string;
  thumbnail_url: string;
  is_featured: boolean;
  publication_status: string;
  published_at: string;
  author_name: string;
  seo_title: string;
  seo_description: string;
}

const EMPTY_FORM: NewsFormState = {
  title: "",
  slug: "",
  category: "Press Release",
  summary: "",
  content: "",
  thumbnail_url: "",
  is_featured: false,
  publication_status: "Published",
  published_at: new Date().toISOString().slice(0, 16),
  author_name: "Booking Network Global Group Communications",
  seo_title: "",
  seo_description: "",
};

export default function AdminNewsroomPage() {
  const [posts, setPosts] = useState<ParsedNewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [form, setForm] = useState<NewsFormState>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/newsroom");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to load news posts." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreateModal = () => {
    setForm({
      ...EMPTY_FORM,
      published_at: new Date().toISOString().slice(0, 16),
    });
    setPreviewMode(false);
    setModalOpen(true);
    setFeedback(null);
  };

  const openEditModal = (p: ParsedNewsPost) => {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      summary: p.summary,
      content: p.content,
      thumbnail_url: p.thumbnail_url || "",
      is_featured: p.is_featured,
      publication_status: p.publication_status,
      published_at: new Date(p.published_at).toISOString().slice(0, 16),
      author_name: p.author_name,
      seo_title: p.seo_title || "",
      seo_description: p.seo_description || "",
    });
    setPreviewMode(false);
    setModalOpen(true);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category,
      summary: form.summary.trim(),
      content: form.content.trim(),
      thumbnail_url: form.thumbnail_url.trim() || null,
      is_featured: form.is_featured,
      publication_status: form.publication_status,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
      author_name: form.author_name.trim(),
      seo_title: form.seo_title.trim() || undefined,
      seo_description: form.seo_description.trim() || undefined,
    };

    try {
      const url = form.id
        ? `/api/admin/newsroom/${form.id}`
        : "/api/admin/newsroom";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Failed to save news release." });
      } else {
        setModalOpen(false);
        setFeedback({
          type: "success",
          text: `News release '${payload.title}' saved successfully.`,
        });
        await fetchPosts();
      }
    } catch {
      setFeedback({ type: "error", text: "Network error while saving news release." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/newsroom/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        setFeedback({
          type: "success",
          text: "News release deleted successfully.",
        });
        await fetchPosts();
      } else {
        const data = await res.json();
        setFeedback({
          type: "error",
          text: data.error || "Failed to delete post.",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Error deleting news release." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Newsroom & IR Disclosures CMS
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Publish press releases, investor relations disclosures, technology breakthroughs, and global notices.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-electric-500 shadow-md shadow-electric-600/30 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create News Release
        </button>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold ${
            feedback.type === "success"
              ? "border border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
              : "border border-red-500/30 bg-red-950/40 text-red-300"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-electric-400" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm font-bold text-white">No news releases recorded</p>
            <p className="mt-1 text-xs text-slate-400">
              Create official company releases to showcase in the public Newsroom.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Category & Date</th>
                  <th className="px-5 py-3.5">Headline & Slug</th>
                  <th className="px-5 py-3.5">Featured</th>
                  <th className="px-5 py-3.5">Publication</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div>
                        <span className="font-mono text-xs font-bold text-electric-400 bg-slate-800 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        <p className="mt-1 font-mono text-[11px] text-slate-400">
                          {new Date(p.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-white text-sm line-clamp-1">{p.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          /newsroom/{p.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {p.is_featured ? (
                        <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                          <Star className="h-3 w-3 fill-amber-300" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold ${
                          p.publication_status === "Published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : p.publication_status === "Draft"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {p.publication_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/newsroom/${p.slug}`}
                          target="_blank"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                          title="View Live Page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-electric-400 transition-colors"
                          title="Edit News Release"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id)}
                              className="rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-red-500"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="rounded-lg bg-slate-800 px-1.5 py-1 text-[10px] text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                            title="Delete Release"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {form.id ? "Edit Newsroom Release" : "Publish New Newsroom Release"}
                </h3>
                <p className="text-xs text-slate-400">
                  Global disclosure & media announcement authoring
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    previewMode
                      ? "border-electric-500 bg-electric-500/20 text-electric-300"
                      : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {previewMode ? "Form View" : "Live Preview"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-electric-400 bg-electric-500/10 border border-electric-500/30 px-2.5 py-1 rounded-md">
                      {form.category}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {new Date(form.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold text-white leading-tight">
                    {form.title || "Headline Preview"}
                  </h2>
                  <p className="mt-3 text-sm font-semibold text-slate-300 border-l-2 border-electric-500 pl-4 py-1">
                    {form.summary || "Executive summary preview..."}
                  </p>
                  <div className="mt-6 border-t border-slate-800 pt-6 text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                    {form.content || "Full article body preview..."}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
                <div>
                  <label className="block font-bold text-slate-200">Headline Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
                      setForm((prev) => ({
                        ...prev,
                        title,
                        slug: prev.id ? prev.slug : slug,
                      }));
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    placeholder="e.g. Booking Network Global Group Reports Strong Q3 Growth in Edge Computing"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-bold text-slate-200">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-300 focus:border-electric-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200">Publication Status</label>
                    <select
                      value={form.publication_status}
                      onChange={(e) => setForm({ ...form, publication_status: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    >
                      {PUBLICATION_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-200">Publication Date & Time</label>
                    <input
                      type="datetime-local"
                      value={form.published_at}
                      onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200">Author / Department</label>
                    <input
                      type="text"
                      value={form.author_name}
                      onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                      placeholder="e.g. Corporate Communications & IR Committee"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-200">Executive Summary Abstract *</label>
                  <textarea
                    required
                    rows={2}
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    placeholder="Short 2-3 sentence overview displayed on news cards and SEO summary."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200">Full Content Body (Markdown supported) *</label>
                  <textarea
                    required
                    rows={8}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono text-xs focus:border-electric-500 focus:outline-none"
                    placeholder="Write the full press release in Markdown format..."
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 text-electric-600 focus:ring-electric-500"
                  />
                  <label htmlFor="is_featured" className="text-xs font-bold text-white cursor-pointer select-none">
                    Feature on Homepage News Highlights
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-5 py-2 text-xs font-bold text-white hover:bg-electric-500 shadow-lg shadow-electric-600/30 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {form.id ? "Update Release" : "Publish Release"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


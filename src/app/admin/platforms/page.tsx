"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Upload,
  Check,
  X,
  Eye,
  Loader2,
} from "lucide-react";
import { ParsedPlatform } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

const PLATFORM_STATUSES = [
  "Live",
  "Coming Soon",
  "In Development",
  "Temporarily Unavailable",
];

const PUBLICATION_STATUSES = ["Published", "Draft", "Archived"];

interface PlatformFormState {
  id?: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  logo: string;
  featuresText: string;
  target_audience: string;
  business_purpose: string;
  website_url: string;
  platform_status: string;
  publication_status: string;
  display_order: number;
  seo_title: string;
  seo_description: string;
}

const EMPTY_FORM: PlatformFormState = {
  name: "",
  slug: "",
  category: "Global E-Commerce",
  short_description: "",
  full_description: "",
  logo: "/logos/booking-network.svg",
  featuresText: "",
  target_audience: "",
  business_purpose: "",
  website_url: "",
  platform_status: "In Development",
  publication_status: "Published",
  display_order: 11,
  seo_title: "",
  seo_description: "",
};

export default function AdminPlatformsPage() {
  const [platforms, setPlatforms] = useState<ParsedPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [form, setForm] = useState<PlatformFormState>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/platforms");
      const data = await res.json();
      if (data.platforms) {
        setPlatforms(data.platforms);
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to load platforms." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const openCreateModal = () => {
    setForm({
      ...EMPTY_FORM,
      display_order: platforms.length + 1,
    });
    setPreviewMode(false);
    setModalOpen(true);
  };

  const openEditModal = (p: ParsedPlatform) => {
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      short_description: p.short_description,
      full_description: p.full_description,
      logo: p.logo || "/logos/booking-network.svg",
      featuresText: p.features.join("\n"),
      target_audience: p.target_audience || "",
      business_purpose: p.business_purpose || "",
      website_url: p.website_url || "",
      platform_status: p.platform_status,
      publication_status: p.publication_status,
      display_order: p.display_order,
      seo_title: p.seo_title || "",
      seo_description: p.seo_description || "",
    });
    setPreviewMode(false);
    setModalOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Logo upload failed.",
        });
      } else {
        setForm((prev) => ({ ...prev, logo: data.url }));
        setFeedback({
          type: "success",
          text: "Logo uploaded and verified.",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Error uploading file." });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      category: form.category,
      short_description: form.short_description,
      full_description: form.full_description,
      logo: form.logo,
      features: form.featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      target_audience: form.target_audience,
      business_purpose: form.business_purpose,
      website_url: form.website_url,
      platform_status: form.platform_status,
      publication_status: form.publication_status,
      display_order: Number(form.display_order),
      seo_title: form.seo_title,
      seo_description: form.seo_description,
    };

    try {
      const url = form.id
        ? `/api/admin/platforms/${form.id}`
        : "/api/admin/platforms";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Failed to save platform.",
        });
        setSaving(false);
        return;
      }

      setFeedback({
        type: "success",
        text: `Platform '${data.platform.name}' saved and published changes synced.`,
      });
      setModalOpen(false);
      await fetchPlatforms();
    } catch {
      setFeedback({
        type: "error",
        text: "Network error while saving platform.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/platforms/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFeedback({
          type: "success",
          text: "Platform entry deleted.",
        });
        setDeleteConfirmId(null);
        await fetchPlatforms();
      } else {
        const data = await res.json();
        setFeedback({
          type: "error",
          text: data.error || "Failed to delete platform.",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Error deleting platform." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
            Platform Portfolio Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add, edit, reorder, configure statuses, or update official URLs for
            all platforms in the Booking Network ecosystem.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-electric-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Platform
        </button>
      </div>

      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Platforms Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading platform portfolio...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-navy-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Platform</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Publication</th>
                  <th className="px-4 py-3.5">Official URL</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {platforms.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-navy-800/40"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                      #{p.display_order}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-navy-950 p-1 dark:border-slate-700">
                          {p.logo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.logo}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {p.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            /platforms/{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {p.category}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={p.platform_status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                          p.publication_status === "Published"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {p.publication_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      {p.website_url ? (
                        <a
                          href={p.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-electric-600 hover:underline dark:text-electric-400"
                        >
                          {p.website_url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">Not configured</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/platforms/${p.slug}`}
                          target="_blank"
                          title="View Public Detail Page"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-navy-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          title="Edit Platform"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:border-electric-500 hover:text-electric-600 dark:border-slate-700 dark:text-slate-300"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {deleteConfirmId === p.id ? (
                          <div className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 dark:bg-red-950">
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id)}
                              className="text-xs font-bold text-red-600 hover:underline dark:text-red-400"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-xs text-slate-500"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            title="Delete Platform"
                            className="rounded-lg border border-slate-200 p-1.5 text-red-600 hover:bg-red-50 dark:border-slate-700 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Add/Edit Platform Modal with Live Preview */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-navy-900 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                  {form.id ? `Edit Platform: ${form.name}` : "Add New Platform"}
                </h2>
                <p className="text-xs text-slate-500">
                  All changes update the public portfolio directory and dynamic
                  detail page.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {previewMode ? "Back to Editor" : "Preview Card"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="py-8">
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live Portfolio Card & Detail Preview
                </p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-navy-950">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900 p-2 border border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.logo || "/logos/booking-network.svg"}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-electric-600">
                          {form.category}
                        </span>
                        <StatusBadge status={form.platform_status} />
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {form.name || "Untitled Platform"}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {form.short_description}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {form.full_description}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Platform Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          name: val,
                          slug: prev.id
                            ? prev.slug
                            : val
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-|-$/g, ""),
                        }));
                      }}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Business Category *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.category}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Platform Status
                    </label>
                    <select
                      value={form.platform_status}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          platform_status: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    >
                      {PLATFORM_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Publication Status
                    </label>
                    <select
                      value={form.publication_status}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          publication_status: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    >
                      {PUBLICATION_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={form.display_order}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          display_order: Number(e.target.value),
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Official Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.website_url}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          website_url: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Platform Logo Path or Upload
                  </label>
                  <div className="mt-1.5 flex items-center gap-3">
                    <input
                      type="text"
                      value={form.logo}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, logo: e.target.value }))
                      }
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:bg-navy-800">
                      <Upload className="h-3.5 w-3.5" />
                      {uploading ? "Uploading..." : "Upload Logo"}
                      <input
                        type="file"
                        accept=".svg,.png,.jpg,.jpeg,.webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Short Description (Card Summary) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={form.short_description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        short_description: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Full Overview Description
                  </label>
                  <textarea
                    rows={4}
                    value={form.full_description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        full_description: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Key Features (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={form.featuresText}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        featuresText: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Target Audience
                    </label>
                    <textarea
                      rows={2}
                      value={form.target_audience}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          target_audience: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Business Purpose
                    </label>
                    <textarea
                      rows={2}
                      value={form.business_purpose}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          business_purpose: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={form.seo_title}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          seo_title: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      SEO Description
                    </label>
                    <input
                      type="text"
                      value={form.seo_description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          seo_description: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-electric-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-electric-700 disabled:opacity-60"
                  >
                    <Check className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Platform"}
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


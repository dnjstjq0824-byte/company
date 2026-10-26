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
  Layers,
  Server,
  Cpu,
  Network,
  ShieldCheck,
  Sparkles,
  Leaf,
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

const CATEGORIES = [
  "Core Infrastructure",
  "AI & Big Data",
  "B2B Platform & API",
  "FinTech & Cybersecurity",
  "Platform Incubation",
  "ESG & Governance",
];

const ICONS = ["Server", "Cpu", "Network", "ShieldCheck", "Sparkles", "Leaf", "Layers"];

interface MetricItem {
  label: string;
  value: string;
}

interface PlatformFormState {
  id?: string;
  name: string;
  slug: string;
  division_code: string;
  category: string;
  icon_name: string;
  short_description: string;
  full_description: string;
  logo: string;
  featuresText: string;
  key_metrics: MetricItem[];
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
  division_code: "BNG-CORE-01",
  category: "Core Infrastructure",
  icon_name: "Server",
  short_description: "",
  full_description: "",
  logo: "/logos/booking-network.svg",
  featuresText: "",
  key_metrics: [
    { label: "Uptime SLA", value: "99.999%" },
    { label: "Global Reach", value: "140+ Nodes" },
  ],
  target_audience: "Enterprise & Global Partners",
  business_purpose: "Core platform backbone for Booking Network Global Group",
  website_url: "",
  platform_status: "Live",
  publication_status: "Published",
  display_order: 1,
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
      setFeedback({ type: "error", text: "Failed to load platform divisions." });
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
    setFeedback(null);
  };

  const openEditModal = (p: ParsedPlatform) => {
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      division_code: p.division_code || "",
      category: p.category,
      icon_name: p.icon_name || "Layers",
      short_description: p.short_description,
      full_description: p.full_description,
      logo: p.logo || "/logos/booking-network.svg",
      featuresText: Array.isArray(p.features) ? p.features.join("\n") : "",
      key_metrics: Array.isArray(p.key_metrics) && p.key_metrics.length > 0
        ? p.key_metrics
        : [{ label: "Target SLA", value: "99.99%" }],
      target_audience: p.target_audience,
      business_purpose: p.business_purpose,
      website_url: p.website_url || "",
      platform_status: p.platform_status,
      publication_status: p.publication_status,
      display_order: p.display_order,
      seo_title: p.seo_title || "",
      seo_description: p.seo_description || "",
    });
    setPreviewMode(false);
    setModalOpen(true);
    setFeedback(null);
  };

  const handleMetricChange = (index: number, field: "label" | "value", val: string) => {
    setForm((prev) => {
      const next = [...prev.key_metrics];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, key_metrics: next };
    });
  };

  const addMetric = () => {
    setForm((prev) => ({
      ...prev,
      key_metrics: [...prev.key_metrics, { label: "", value: "" }],
    }));
  };

  const removeMetric = (index: number) => {
    setForm((prev) => ({
      ...prev,
      key_metrics: prev.key_metrics.filter((_, idx) => idx !== index),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, logo: data.url }));
        setFeedback({
          type: "success",
          text: "Asset logo successfully uploaded.",
        });
      } else {
        setFeedback({
          type: "error",
          text: data.error || "Failed to upload asset.",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Error during file upload." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      division_code: form.division_code.trim(),
      category: form.category.trim(),
      icon_name: form.icon_name.trim(),
      short_description: form.short_description.trim(),
      full_description: form.full_description.trim() || form.short_description.trim(),
      logo: form.logo.trim() || "/logos/booking-network.svg",
      features: form.featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      key_metrics: form.key_metrics.filter((m) => m.label && m.value),
      target_audience: form.target_audience.trim(),
      business_purpose: form.business_purpose.trim(),
      website_url: form.website_url.trim() || null,
      platform_status: form.platform_status,
      publication_status: form.publication_status,
      display_order: Number(form.display_order) || 99,
      seo_title: form.seo_title.trim() || undefined,
      seo_description: form.seo_description.trim() || undefined,
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
        setFeedback({ type: "error", text: data.error || "Failed to save division." });
      } else {
        setModalOpen(false);
        setFeedback({
          type: "success",
          text: `Division '${payload.name}' saved successfully.`,
        });
        await fetchPlatforms();
      }
    } catch {
      setFeedback({ type: "error", text: "Network error while saving." });
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
        setDeleteConfirmId(null);
        setFeedback({
          type: "success",
          text: "Division record deleted successfully.",
        });
        await fetchPlatforms();
      } else {
        const data = await res.json();
        setFeedback({
          type: "error",
          text: data.error || "Failed to delete division.",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Error deleting division record." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Business & Technology Divisions CMS
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure the 6 core business pillars, infrastructure codes, capabilities, key metrics, and service availability for Booking Network Global Group.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-electric-500 shadow-md shadow-electric-600/30 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Division
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

      {/* Platforms Table / Grid */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-electric-400" />
          </div>
        ) : platforms.length === 0 ? (
          <div className="py-16 text-center">
            <Layers className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm font-bold text-white">No divisions registered</p>
            <p className="mt-1 text-xs text-slate-400">
              Create a division to showcase on the global platform portal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Code / Order</th>
                  <th className="px-5 py-3.5">Division & Category</th>
                  <th className="px-5 py-3.5">Key Metrics</th>
                  <th className="px-5 py-3.5">Operational Status</th>
                  <th className="px-5 py-3.5">Publish</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {platforms.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-electric-400 bg-slate-800 px-2 py-0.5 rounded">
                          {p.division_code || `DIV-0${p.display_order}`}
                        </span>
                        <span className="text-[11px] text-slate-500">#{p.display_order}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-white text-sm">{p.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {p.category} • /platforms/{p.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {p.key_metrics && p.key_metrics.length > 0 ? (
                          p.key_metrics.slice(0, 2).map((m, idx) => (
                            <span
                              key={idx}
                              className="rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-300"
                            >
                              <strong className="text-white">{m.value}</strong> {m.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-[10px]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={p.platform_status} />
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
                          href={`/platforms/${p.slug}`}
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
                          title="Edit Division"
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
                            title="Delete Division"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {form.id ? `Edit Division: ${form.name}` : "Create Business & Tech Division"}
                </h3>
                <p className="text-xs text-slate-400">
                  {form.id ? "Update strategic division profile & operational parameters" : "Provision a new strategic technology division"}
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
                  {previewMode ? "Form View" : "Preview"}
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
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-electric-400 bg-electric-500/10 border border-electric-500/30 px-2.5 py-1 rounded-md">
                      {form.division_code || "BNG-DIV-01"}
                    </span>
                    <StatusBadge status={form.platform_status} />
                  </div>
                  <h4 className="mt-3 text-xl font-bold text-white">{form.name || "Division Title"}</h4>
                  <p className="mt-1 text-xs text-slate-400">{form.category} • /platforms/{form.slug || "slug"}</p>
                  <p className="mt-4 text-sm text-slate-300">{form.short_description || "Short description preview..."}</p>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {form.key_metrics.map((m, idx) => (
                      <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                        <p className="font-mono text-lg font-black text-white">{m.value || "—"}</p>
                        <p className="text-[11px] text-slate-400">{m.label || "Metric"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
                {/* Basic info row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-bold text-slate-200">Division Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
                        setForm((prev) => ({
                          ...prev,
                          name,
                          slug: prev.id ? prev.slug : slug,
                        }));
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                      placeholder="e.g. Global Cloud & Distributed Infrastructure"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200">Division Code *</label>
                    <input
                      type="text"
                      required
                      value={form.division_code}
                      onChange={(e) => setForm({ ...form, division_code: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-electric-400 focus:border-electric-500 focus:outline-none"
                      placeholder="e.g. BNG-INFRA-01"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-300 focus:border-electric-500 focus:outline-none"
                      placeholder="e.g. cloud-infrastructure"
                    />
                  </div>
                </div>

                {/* Category & Icon row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block font-bold text-slate-200">Category Area</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200">Icon Emblem</label>
                    <select
                      value={form.icon_name}
                      onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    >
                      {ICONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200">Platform Status</label>
                    <select
                      value={form.platform_status}
                      onChange={(e) => setForm({ ...form, platform_status: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    >
                      {PLATFORM_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
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

                {/* Descriptions */}
                <div>
                  <label className="block font-bold text-slate-200">Short Executive Summary *</label>
                  <textarea
                    required
                    rows={2}
                    value={form.short_description}
                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    placeholder="Brief 1-2 sentence high-level description for cards and overview grids."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200">Full Architectural Description</label>
                  <textarea
                    rows={4}
                    value={form.full_description}
                    onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    placeholder="In-depth details, technology stack, and business model displayed on the division's detail page."
                  />
                </div>

                {/* Key Metrics Dynamic Array */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs">High-Impact Key Metrics</span>
                      <p className="text-[10px] text-slate-400">Numerical KPIs displayed on cards and overview hero (e.g., 99.999% SLA, 140+ PoPs)</p>
                    </div>
                    <button
                      type="button"
                      onClick={addMetric}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      <Plus className="h-3 w-3" />
                      Add Metric
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {form.key_metrics.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                          placeholder="Value (e.g. 99.999% or 140+)"
                          className="w-1/3 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 font-mono text-white focus:border-electric-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={m.label}
                          onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                          placeholder="Label (e.g. Uptime SLA or Global PoPs)"
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-white focus:border-electric-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeMetric(idx)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features (line by line) */}
                <div>
                  <label className="block font-bold text-slate-200">
                    Core Capabilities / Architecture Highlights (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={form.featuresText}
                    onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono text-xs focus:border-electric-500 focus:outline-none"
                    placeholder="Global Edge Multi-Cloud Fabric&#10;Sub-15ms Latency Routing&#10;Zero-Trust Perimeter Security"
                  />
                </div>

                {/* Target Audience & Purpose */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-200">Target Audience</label>
                    <input
                      type="text"
                      value={form.target_audience}
                      onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                      placeholder="e.g. Enterprise Partners, Financial Institutions"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200">Business Purpose</label>
                    <input
                      type="text"
                      value={form.business_purpose}
                      onChange={(e) => setForm({ ...form, business_purpose: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                      placeholder="e.g. Backbone computing and networking layer"
                    />
                  </div>
                </div>

                {/* Order & URL */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-200">Display Order</label>
                    <input
                      type="number"
                      value={form.display_order}
                      onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200">External Platform URL (optional)</label>
                    <input
                      type="url"
                      value={form.website_url}
                      onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
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
                    {form.id ? "Update Division" : "Create Division"}
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

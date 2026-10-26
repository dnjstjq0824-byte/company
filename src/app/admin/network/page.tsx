"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit3,
  Trash2,
  Globe2,
  MapPin,
  Check,
  X,
  Loader2,
  Building2,
  Server,
} from "lucide-react";
import { ParsedGlobalHub } from "@/lib/data";

const REGIONS = ["APAC", "North America", "Europe", "MENA", "Global"];
const HUB_TYPES = ["Global HQ", "Regional Hub", "R&D Center", "Cloud Node"];
const STATUSES = ["Active", "Expanding", "Planned"];

interface HubFormState {
  id?: string;
  region: "APAC" | "North America" | "Europe" | "MENA" | "Global";
  city: string;
  country: string;
  hub_type: "Global HQ" | "Regional Hub" | "R&D Center" | "Cloud Node";
  description: string;
  address: string;
  contact_email: string;
  status: string;
  display_order: number;
}

const EMPTY_FORM: HubFormState = {
  region: "APAC",
  city: "",
  country: "",
  hub_type: "Regional Hub",
  description: "",
  address: "",
  contact_email: "",
  status: "Active",
  display_order: 1,
};

export default function AdminNetworkPage() {
  const [hubs, setHubs] = useState<ParsedGlobalHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [form, setForm] = useState<HubFormState>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchHubs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/network");
      const data = await res.json();
      if (data.hubs) {
        setHubs(data.hubs);
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to load global hubs." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  const openCreateModal = () => {
    setForm({
      ...EMPTY_FORM,
      display_order: hubs.length + 1,
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const openEditModal = (h: ParsedGlobalHub) => {
    setForm({
      id: h.id,
      region: h.region,
      city: h.city,
      country: h.country,
      hub_type: h.hub_type,
      description: h.description,
      address: h.address || "",
      contact_email: h.contact_email || "",
      status: h.status,
      display_order: h.display_order,
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      region: form.region,
      city: form.city.trim(),
      country: form.country.trim(),
      hub_type: form.hub_type,
      description: form.description.trim(),
      address: form.address.trim() || null,
      contact_email: form.contact_email.trim() || null,
      status: form.status,
      display_order: Number(form.display_order) || 99,
    };

    try {
      const url = form.id
        ? `/api/admin/network/${form.id}`
        : "/api/admin/network";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Failed to save global hub." });
      } else {
        setModalOpen(false);
        setFeedback({
          type: "success",
          text: `Global hub node '${payload.city}, ${payload.country}' saved.`,
        });
        await fetchHubs();
      }
    } catch {
      setFeedback({ type: "error", text: "Network error while saving hub node." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/network/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        setFeedback({
          type: "success",
          text: "Global hub node removed successfully.",
        });
        await fetchHubs();
      } else {
        const data = await res.json();
        setFeedback({
          type: "error",
          text: data.error || "Failed to delete hub.",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Error deleting hub node." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Global Network & Regional Hubs CMS
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage worldwide corporate headquarters, regional operational hubs, R&D campuses, and strategic edge nodes.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-electric-500 shadow-md shadow-electric-600/30 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Hub Node
        </button>
      </div>

      {/* Feedback */}
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

      {/* Hubs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-electric-400" />
          </div>
        ) : hubs.length === 0 ? (
          <div className="py-16 text-center">
            <Globe2 className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm font-bold text-white">No global hubs defined</p>
            <p className="mt-1 text-xs text-slate-400">
              Add headquarters and regional offices to display on the company overview.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Order / Region</th>
                  <th className="px-5 py-3.5">City & Country</th>
                  <th className="px-5 py-3.5">Hub Role</th>
                  <th className="px-5 py-3.5">Contact Email</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {hubs.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-electric-400 bg-slate-800 px-2 py-0.5 rounded">
                          {h.region}
                        </span>
                        <span className="text-[11px] text-slate-500">#{h.display_order}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-white text-sm">{h.city}, {h.country}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {h.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-300">
                        {h.hub_type}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-400">
                      {h.contact_email || "—"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold ${
                          h.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : h.status === "Expanding"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(h)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-electric-400 transition-colors"
                          title="Edit Hub Node"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        {deleteConfirmId === h.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(h.id)}
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
                            onClick={() => setDeleteConfirmId(h.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                            title="Delete Hub"
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
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {form.id ? `Edit Hub Node: ${form.city}` : "Register Global Infrastructure Hub"}
                </h3>
                <p className="text-xs text-slate-400">
                  Global footprint node & regional operations profile
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-200">Region Zone *</label>
                  <select
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-200">Hub Role Classification *</label>
                  <select
                    value={form.hub_type}
                    onChange={(e) => setForm({ ...form, hub_type: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                  >
                    {HUB_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-200">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    placeholder="e.g. San Jose"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-200">Country *</label>
                  <input
                    type="text"
                    required
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                    placeholder="e.g. United States"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-200">Mission & Responsibilities *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                  placeholder="e.g. North American AI R&D Center and Silicon Valley Strategic Operations."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200">Campus Address (optional)</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                  placeholder="e.g. 500 Technology Square, San Jose, CA 95110"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-bold text-slate-200">Contact Email</label>
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none font-mono"
                    placeholder="na-hub@bookingnetwork.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-200">Operational Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-200">Display Order</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
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
                  {form.id ? "Update Hub Node" : "Register Node"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


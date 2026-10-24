"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  X,
  Mail,
  Building2,
  Calendar,
} from "lucide-react";

interface InquiryRecord {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  inquiry_type: string;
  subject: string;
  message: string;
  status: string;
  admin_notes: string | null;
  privacy_consent_record: string;
  created_at: string;
  updated_at: string;
}

const INQUIRY_TYPES = [
  "All Types",
  "General Inquiry",
  "Business Partnership",
  "Platform Collaboration",
  "Advertising & Marketing",
  "Technical / Website Issue",
  "Other",
];

const STATUS_FILTERS = ["All Statuses", "New", "In Progress", "Resolved"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState("New");
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (data.inquiries) {
        setInquiries(data.inquiries);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesStatus =
        statusFilter === "All Statuses" || inq.status === statusFilter;
      const matchesType =
        typeFilter === "All Types" || inq.inquiry_type === typeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        inq.full_name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q) ||
        (inq.company || "").toLowerCase().includes(q);
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [inquiries, statusFilter, typeFilter, searchQuery]);

  const unreadCount = useMemo(
    () => inquiries.filter((i) => i.status === "New").length,
    [inquiries]
  );

  const openDetail = (inq: InquiryRecord) => {
    setSelectedInquiry(inq);
    setStatusDraft(inq.status);
    setNotesDraft(inq.admin_notes || "");
    setFeedback(null);
  };

  const handleSaveDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusDraft,
          admin_notes: notesDraft,
        }),
      });
      const data = await res.json();
      if (res.ok && data.inquiry) {
        setSelectedInquiry(data.inquiry);
        setFeedback("Inquiry status and private notes saved.");
        await fetchInquiries();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDeleteConfirmId(null);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      await fetchInquiries();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              Contact Inquiry Inbox
            </h1>
            <span className="rounded-full bg-electric-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {unreadCount} New
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review private inquiries, filter by type or status, record internal
            administrator notes, and export records to CSV.
          </p>
        </div>

        <a
          href="/api/admin/inquiries?format=csv"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-navy-900 dark:text-slate-200"
        >
          <Download className="h-4 w-4 text-electric-600" />
          Export Inquiries to CSV
        </a>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-navy-900 sm:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender, email, company, or subject..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 focus:border-electric-500 focus:outline-none dark:border-slate-700 dark:bg-navy-950 dark:text-white"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-navy-950 dark:text-slate-200"
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-navy-950 dark:text-slate-200"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900 lg:col-span-6">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading inquiries...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No inquiries match the current filter criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => openDetail(inq)}
                    className={`cursor-pointer p-4 transition-colors ${
                      isSelected
                        ? "bg-electric-50/70 dark:bg-electric-950/30"
                        : "hover:bg-slate-50 dark:hover:bg-navy-800/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {inq.subject}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          inq.status === "New"
                            ? "bg-electric-100 text-electric-700 dark:bg-electric-900 dark:text-electric-200"
                            : inq.status === "In Progress"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {inq.full_name} &lt;{inq.email}&gt;
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{inq.inquiry_type}</span>
                      <span>{new Date(inq.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Inspector */}
        <div className="lg:col-span-6">
          {selectedInquiry ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-electric-600 dark:text-electric-400">
                    {selectedInquiry.inquiry_type}
                  </span>
                  <h2 className="mt-1 font-display text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedInquiry.subject}
                  </h2>
                </div>
                {deleteConfirmId === selectedInquiry.id ? (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-1.5 dark:bg-red-950">
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="text-xs font-bold text-red-600 dark:text-red-400"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-xs text-slate-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(selectedInquiry.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 text-xs dark:bg-navy-950 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-electric-600" />
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400">
                      Sender
                    </span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="font-bold text-slate-900 hover:underline dark:text-white"
                    >
                      {selectedInquiry.full_name} ({selectedInquiry.email})
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-electric-600" />
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400">
                      Organization
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedInquiry.company || "Not specified"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Calendar className="h-4 w-4 text-electric-600" />
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400">
                      Received Timestamp
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(selectedInquiry.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Inquiry Message
                </h3>
                <div className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-navy-950 dark:text-slate-200">
                  {selectedInquiry.message}
                </div>
              </div>

              <form
                onSubmit={handleSaveDetail}
                className="mt-6 space-y-4 border-t border-slate-200 pt-5 dark:border-slate-800"
              >
                {feedback && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{feedback}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Inquiry Status
                  </label>
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-navy-950"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Private Administrator Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Add internal follow-up notes (never visible to public visitors)..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-electric-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Update Status & Notes"}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-navy-900/30">
              Select an inquiry from the inbox list to inspect full details,
              update workflow status, or add private administrator notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


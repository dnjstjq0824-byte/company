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
  AlertCircle,
  Clock,
  User,
  ExternalLink,
} from "lucide-react";

interface InquiryRecord {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  inquiry_type: string;
  department: string | null;
  priority: string | null;
  assigned_to: string | null;
  subject: string;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

const STATUS_FILTERS = ["All Statuses", "New", "In Progress", "Resolved"];
const PRIORITY_FILTERS = ["All Priorities", "Urgent", "High", "Normal", "Low"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusDraft, setStatusDraft] = useState("New");
  const [priorityDraft, setPriorityDraft] = useState("Normal");
  const [assignedDraft, setAssignedDraft] = useState("");
  const [departmentDraft, setDepartmentDraft] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
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
      const matchesPriority =
        priorityFilter === "All Priorities" ||
        (inq.priority || "Normal") === priorityFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        inq.full_name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q) ||
        (inq.company || "").toLowerCase().includes(q) ||
        (inq.department || "").toLowerCase().includes(q);
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [inquiries, statusFilter, priorityFilter, searchQuery]);

  const openDetail = (inq: InquiryRecord) => {
    setSelectedInquiry(inq);
    setStatusDraft(inq.status);
    setPriorityDraft(inq.priority || "Normal");
    setAssignedDraft(inq.assigned_to || "");
    setDepartmentDraft(inq.department || "Enterprise Strategic Alliances");
    setNotesDraft(inq.admin_notes || "");
  };

  const handleUpdate = async () => {
    if (!selectedInquiry) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusDraft,
          priority: priorityDraft,
          assigned_to: assignedDraft.trim() || null,
          department: departmentDraft.trim() || null,
          admin_notes: notesDraft,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries((prev) =>
          prev.map((i) => (i.id === selectedInquiry.id ? data.inquiry : i))
        );
        setSelectedInquiry(data.inquiry);
        setFeedback("Inquiry updated successfully.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
        setDeleteConfirmId(null);
        setFeedback("Inquiry deleted successfully.");
      }
    } catch {
      setFeedback("Failed to delete inquiry.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Enterprise Inquiries & CRM
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Triage strategic partnership requests, enterprise cloud integrations, and institutional investor communications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/inquiries?format=csv"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-electric-500/50 hover:bg-slate-800 transition-all"
          >
            <Download className="h-4 w-4 text-electric-400" />
            Export CSV
          </a>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs font-semibold text-emerald-300">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}>
            <X className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by sender, company, subject, department..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-electric-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
        >
          {PRIORITY_FILTERS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Main Grid: List & Detail Pane */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left List */}
        <div className="lg:col-span-6 xl:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-electric-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching inquiries found.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => openDetail(inq)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? "border-electric-500/60 bg-electric-950/20"
                        : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-xs truncate">
                        {inq.subject}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {inq.priority === "Urgent" && (
                          <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/30">
                            Urgent
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            inq.status === "New"
                              ? "bg-electric-500/20 text-electric-300 border border-electric-500/30"
                              : inq.status === "In Progress"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {inq.full_name} {inq.company ? `• ${inq.company}` : ""}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{inq.inquiry_type}</span>
                      <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-6 xl:col-span-7">
          {selectedInquiry ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
              {/* Detail Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-electric-400 font-bold bg-slate-800 px-2 py-0.5 rounded">
                    ID: {selectedInquiry.id.slice(0, 8)}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      <Mail className="h-3.5 w-3.5 text-electric-400" />
                      Reply via Email
                    </a>
                    {deleteConfirmId === selectedInquiry.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(selectedInquiry.id)}
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
                        onClick={() => setDeleteConfirmId(selectedInquiry.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="mt-3 text-lg font-bold text-white">
                  {selectedInquiry.subject}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span>From: <strong className="text-white">{selectedInquiry.full_name}</strong></span>
                  <span>Email: <strong className="text-white">{selectedInquiry.email}</strong></span>
                  {selectedInquiry.company && (
                    <span>Org: <strong className="text-white">{selectedInquiry.company}</strong></span>
                  )}
                  <span>Received: {new Date(selectedInquiry.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                  Inquiry Message
                </p>
                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* CRM Triage Controls */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Status</label>
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Priority Level</label>
                  <select
                    value={priorityDraft}
                    onChange={(e) => setPriorityDraft(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Assigned To</label>
                  <input
                    type="text"
                    value={assignedDraft}
                    onChange={(e) => setAssignedDraft(e.target.value)}
                    placeholder="e.g. Lead Architect"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300">Internal Governance Notes</label>
                <textarea
                  rows={4}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Record internal review notes, call logs, NDA statuses, or escalation notes..."
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-electric-600/30 hover:bg-electric-500 disabled:opacity-60 transition-all"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save CRM Status & Notes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500">
              <Mail className="h-10 w-10 text-slate-700 mb-2" />
              <p className="font-bold text-white">No Inquiry Selected</p>
              <p className="mt-1 text-slate-400">Select an inquiry from the left panel to review details, assign departments, and record notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

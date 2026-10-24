"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  UserPlus,
  Activity,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

interface ActivityLogItem {
  id: string;
  action: string;
  target: string;
  created_at: string;
  admin: { email: string; role: string };
}

export default function AdminSecurityPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("Content Manager");

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/security");
      const data = await res.json();
      if (data.admins) {
        setAdmins(data.admins);
        setLogs(data.logs || []);
        setCurrentAdminId(data.currentAdminId || "");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = await fetch("/api/admin/security", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "change_password",
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setFeedback({
        type: "error",
        text: data.error || "Failed to update password.",
      });
    } else {
      setFeedback({
        type: "success",
        text: "Your administrator password has been updated.",
      });
      setCurrentPassword("");
      setNewPassword("");
      await loadData();
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = await fetch("/api/admin/security", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_admin",
        email: newAdminEmail,
        password: newAdminPassword,
        role: newAdminRole,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setFeedback({
        type: "error",
        text: data.error || "Failed to provision administrator.",
      });
    } else {
      setFeedback({
        type: "success",
        text: `Provisioned administrator ${data.admin.email}.`,
      });
      setNewAdminEmail("");
      setNewAdminPassword("");
      await loadData();
    }
  };

  const handleToggleAdmin = async (targetId: string) => {
    setFeedback(null);
    const res = await fetch("/api/admin/security", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle_status",
        target_id: targetId,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setFeedback({
        type: "error",
        text: data.error || "Failed to update account status.",
      });
    } else {
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading Security & Activity Audit Logs...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          Administrator Security & Activity Audit Log
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage authorized administrator accounts, rotate passwords, and audit
          all recorded website content and configuration modifications.
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Rotate Password */}
        <form
          onSubmit={handleChangePassword}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900"
        >
          <div className="flex items-center gap-2.5">
            <KeyRound className="h-5 w-5 text-electric-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Change Your Administrator Password
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                New Password (minimum 10 characters)
              </label>
              <input
                type="password"
                required
                minLength={10}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-electric-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-electric-700"
            >
              Update Password
            </button>
          </div>
        </form>

        {/* Provision Additional Admin */}
        <form
          onSubmit={handleCreateAdmin}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900"
        >
          <div className="flex items-center gap-2.5">
            <UserPlus className="h-5 w-5 text-electric-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Provision Authorized Administrator
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Role
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                >
                  <option value="Content Manager">Content Manager</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Initial Password (minimum 10 characters)
              </label>
              <input
                type="password"
                required
                minLength={10}
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-navy-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-navy-800 dark:bg-electric-600"
            >
              Provision Account
            </button>
          </div>
        </form>
      </div>

      {/* Provisioned Administrators List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          <ShieldCheck className="h-5 w-5 text-electric-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Provisioned Administrator Accounts ({admins.length})
          </h2>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-400 dark:border-slate-800">
              <tr>
                <th className="py-2.5">Email</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Last Login</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {admins.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {a.email}
                  </td>
                  <td className="py-3">{a.role}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 font-bold ${
                        a.is_active
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {a.is_active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">
                    {a.last_login_at
                      ? new Date(a.last_login_at).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="py-3 text-right">
                    {a.id !== currentAdminId && (
                      <button
                        type="button"
                        onClick={() => handleToggleAdmin(a.id)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 font-semibold hover:bg-slate-50 dark:border-slate-700"
                      >
                        {a.is_active ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Activity Log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          <Activity className="h-5 w-5 text-electric-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Administrator Activity Audit Log
          </h2>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col justify-between gap-1 py-3 text-xs sm:flex-row sm:items-center"
            >
              <div>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-bold text-slate-800 dark:bg-navy-950 dark:text-electric-400">
                  {log.action}
                </span>
                <span className="ml-2.5 font-medium text-slate-700 dark:text-slate-200">
                  {log.target}
                </span>
              </div>
              <div className="text-slate-400">
                {log.admin?.email} •{" "}
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


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
  Filter,
  Globe,
  Terminal,
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
  ip_address: string | null;
  user_agent: string | null;
  metadata: string | null;
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
  const [actionFilter, setActionFilter] = useState("ALL");

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

  const currentAdmin = admins.find((a) => a.id === currentAdminId);
  const isSuperAdmin = currentAdmin?.role === "Super Admin";

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

  const filteredLogs = logs.filter((log) => {
    if (actionFilter === "ALL") return true;
    return log.action.includes(actionFilter);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-electric-400" />
        Loading Security & Activity Audit Logs...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Enterprise Security Governance & Audit Trail
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage administrative RBAC privileges, rotate session credentials, and inspect immutable audit logs with client telemetry.
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-xs font-semibold ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
              : "border-red-500/30 bg-red-950/40 text-red-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Rotate Password */}
        <form
          onSubmit={handleChangePassword}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <KeyRound className="h-4 w-4 text-electric-400" />
            <h2 className="text-sm font-bold text-white">
              Change Your Account Password
            </h2>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Available to all authenticated administrators regardless of role level.
          </p>

          <div className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-200">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-200">
                New Password (minimum 10 characters)
              </label>
              <input
                type="password"
                required
                minLength={10}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-electric-600 px-5 py-2 text-xs font-bold text-white hover:bg-electric-500 shadow-md shadow-electric-600/30 transition-all"
            >
              Update Password
            </button>
          </div>
        </form>

        {/* Provision Additional Admin */}
        <form
          onSubmit={handleCreateAdmin}
          className={`rounded-2xl border p-6 shadow-sm ${
            isSuperAdmin
              ? "border-slate-800 bg-slate-900/70"
              : "border-slate-800/40 bg-slate-950/40 opacity-75"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserPlus className="h-4 w-4 text-electric-400" />
              <h2 className="text-sm font-bold text-white">
                Provision Authorized Administrator
              </h2>
            </div>
            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-400 uppercase">
              Super Admin Required
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Grant role-based access for Group Content Managers or Super Administrators.
          </p>

          <fieldset disabled={!isSuperAdmin} className="mt-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-slate-200">Admin Email</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="operator@bookingnetwork.com"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-electric-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-200">Security Role</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-electric-500 focus:outline-none"
                >
                  <option value="Content Manager">Content Manager</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-200">
                Initial Password (minimum 10 characters)
              </label>
              <input
                type="password"
                required
                minLength={10}
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!isSuperAdmin}
              className="rounded-xl bg-electric-600 px-5 py-2 text-xs font-bold text-white hover:bg-electric-500 disabled:opacity-40 transition-all"
            >
              Provision Account
            </button>
          </fieldset>
        </form>
      </div>

      {/* Provisioned Administrators List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <ShieldCheck className="h-4 w-4 text-electric-400" />
          <h2 className="text-sm font-bold text-white">
            Active Administrator Accounts ({admins.length})
          </h2>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 font-mono text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-2.5">Email Identity</th>
                <th className="py-2.5">Role Level</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Last Login</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {admins.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 font-mono font-bold text-white">
                    {a.email}
                    {a.id === currentAdminId && (
                      <span className="ml-2 rounded bg-electric-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-electric-300 border border-electric-500/30">
                        Current Session
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className="font-mono text-slate-300">{a.role}</span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                        a.is_active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {a.is_active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-400 text-[11px]">
                    {a.last_login_at
                      ? new Date(a.last_login_at).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="py-3 text-right">
                    {isSuperAdmin && a.id !== currentAdminId && (
                      <button
                        type="button"
                        onClick={() => handleToggleAdmin(a.id)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700"
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

      {/* Activity Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-electric-400" />
            <h2 className="text-sm font-bold text-white">
              Administrator Governance Audit Trail
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] text-white focus:outline-none"
            >
              <option value="ALL">All Actions</option>
              <option value="PLATFORM">Division Updates</option>
              <option value="NEWS">Newsroom Posts</option>
              <option value="GLOBAL_HUB">Global Hubs</option>
              <option value="CONTENT">Content CMS</option>
              <option value="INQUIRY">Inquiries</option>
              <option value="ADMIN">Admin & Auth</option>
            </select>
          </div>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto divide-y divide-slate-800/80">
          {filteredLogs.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-500">
              No audit records matching filter.
            </p>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col justify-between gap-1 py-3 text-xs sm:flex-row sm:items-center"
              >
                <div>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-electric-400 border border-slate-700">
                    {log.action}
                  </span>
                  <span className="ml-2.5 font-medium text-slate-200">
                    {log.target}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  {log.ip_address && (
                    <span className="text-slate-500">[{log.ip_address}]</span>
                  )}
                  <span>{log.admin?.email}</span>
                  <span>•</span>
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

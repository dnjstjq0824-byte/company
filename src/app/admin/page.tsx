import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Layers,
  Newspaper,
  Globe2,
  Inbox,
  MailWarning,
  Activity,
  ArrowRight,
  FileEdit,
  Settings,
  ShieldCheck,
  Server,
  Database,
  ExternalLink,
} from "lucide-react";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const [
    totalDivisions,
    liveDivisions,
    totalNews,
    totalHubs,
    unreadInquiries,
    totalInquiries,
    recentLogs,
    recentInquiries,
    divisions,
  ] = await Promise.all([
    prisma.platform.count(),
    prisma.platform.count({ where: { platform_status: "Live" } }),
    prisma.newsPost.count(),
    prisma.globalHub.count({ where: { status: "Active" } }),
    prisma.contactInquiry.count({ where: { status: "New" } }),
    prisma.contactInquiry.count(),
    prisma.adminActivityLog.findMany({
      include: { admin: { select: { email: true, role: true } } },
      orderBy: { created_at: "desc" },
      take: 8,
    }),
    prisma.contactInquiry.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
    }),
    prisma.platform.findMany({
      orderBy: { display_order: "asc" },
      take: 6,
    }),
  ]);

  const statCards = [
    {
      label: "Business & Tech Divisions",
      value: `${liveDivisions} / ${totalDivisions}`,
      sub: "Active strategic business units",
      icon: Layers,
      href: "/admin/platforms",
      tag: "Active Core",
    },
    {
      label: "Newsroom & IR Disclosures",
      value: totalNews,
      sub: "Press releases, IR & technical notices",
      icon: Newspaper,
      href: "/admin/newsroom",
      tag: "Global Media",
    },
    {
      label: "Global Infrastructure Hubs",
      value: totalHubs,
      sub: "Strategic nodes across APAC, NA, EU, MENA",
      icon: Globe2,
      href: "/admin/network",
      tag: "Network Grid",
    },
    {
      label: "Actionable Inquiries",
      value: unreadInquiries,
      sub: `${totalInquiries} total partnership inquiries`,
      icon: MailWarning,
      href: "/admin/inquiries",
      tag: unreadInquiries > 0 ? "Requires Review" : "All Clear",
      highlight: unreadInquiries > 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/20 bg-electric-500/10 px-3 py-1 text-[11px] font-mono font-semibold text-electric-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            OPERATIONAL CONSOLE — LEVEL 04 GOVERNANCE
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
            Booking Network Global Group Executive Command
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Unified governance telemetry for 6 core business divisions, global edge infrastructure nodes, investor relations publications, and enterprise partnership inquiries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/platforms"
            className="inline-flex items-center gap-1.5 rounded-xl bg-electric-600 px-4 py-2 text-xs font-bold text-white hover:bg-electric-500 shadow-lg shadow-electric-600/30 transition-all"
          >
            <Layers className="h-4 w-4" />
            Divisions CMS
          </Link>
          <Link
            href="/admin/newsroom"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-electric-500/50 hover:bg-slate-800 transition-all"
          >
            <Newspaper className="h-4 w-4 text-electric-400" />
            Post News / IR
          </Link>
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-electric-500/50 hover:bg-slate-800 transition-all"
          >
            <FileEdit className="h-4 w-4" />
            Website CMS
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all ${
                card.highlight
                  ? "border-amber-500/40 bg-amber-950/20 hover:border-amber-400"
                  : "border-slate-800 bg-slate-900/70 hover:border-electric-500/50 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  {card.tag}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 group-hover:bg-electric-500/20 text-electric-400 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 font-mono text-3xl font-extrabold text-white">
                {card.value}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-200">
                {card.label}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {card.sub}
              </p>
            </Link>
          );
        })}
      </div>

      {/* System Health Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">System Runtime & Data Engine Diagnostics</p>
              <p className="text-[11px] text-slate-400">Zero downtime architecture • Cloudflare Edge & Prisma ORM Engine</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Prisma SQLite: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">JWT Token Auth: Validated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Edge Gateway: Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Core Divisions Snapshot */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">
                Core Divisions Ecosystem ({divisions.length})
              </h2>
              <p className="text-xs text-slate-400">
                Strategic tech business pillars in Booking Network Global Group
              </p>
            </div>
            <Link
              href="/admin/platforms"
              className="inline-flex items-center gap-1 text-xs font-semibold text-electric-400 hover:text-electric-300 hover:underline"
            >
              Configure All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-800/80">
            {divisions.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between py-3.5 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-electric-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {d.division_code || `#${d.display_order}`}
                  </span>
                  <div>
                    <p className="font-bold text-white">
                      {d.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {d.category} • /platforms/{d.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={d.platform_status} />
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-mono font-semibold ${
                      d.publication_status === "Published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {d.publication_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inquiries & Audit Trail */}
        <div className="space-y-6 lg:col-span-5">
          {/* Recent Inquiries */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  Enterprise Partnership Inquiries
                </h2>
                <p className="text-xs text-slate-400">Global client and institutional submissions</p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-electric-400 hover:text-electric-300 hover:underline"
              >
                Open Inbox →
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                No inquiries submitted yet.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-slate-800/80">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-bold text-white">
                        {inq.subject}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
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
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {inq.full_name} ({inq.email}) • {inq.inquiry_type}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit Logs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-electric-400" />
                <h2 className="text-base font-bold text-white">
                  Audit Trail & Governance Logs
                </h2>
              </div>
              <Link
                href="/admin/security"
                className="text-xs font-semibold text-electric-400 hover:text-electric-300 hover:underline"
              >
                Audit Log →
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-mono font-bold text-slate-200">
                    <span className="text-[11px] text-electric-400">{log.action}</span>
                    <span className="text-[10px] font-normal text-slate-500">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 truncate">
                    {log.target}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Layers,
  CheckCircle2,
  Clock,
  Inbox,
  MailWarning,
  Activity,
  ArrowRight,
  FileEdit,
  Settings,
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
    totalPlatforms,
    livePlatforms,
    inDevPlatforms,
    unreadInquiries,
    totalInquiries,
    recentLogs,
    recentInquiries,
    platforms,
  ] = await Promise.all([
    prisma.platform.count(),
    prisma.platform.count({ where: { platform_status: "Live" } }),
    prisma.platform.count({
      where: {
        platform_status: { in: ["In Development", "Coming Soon"] },
      },
    }),
    prisma.contactInquiry.count({ where: { status: "New" } }),
    prisma.contactInquiry.count(),
    prisma.adminActivityLog.findMany({
      include: { admin: { select: { email: true } } },
      orderBy: { created_at: "desc" },
      take: 8,
    }),
    prisma.contactInquiry.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
    }),
    prisma.platform.findMany({
      orderBy: { display_order: "asc" },
      take: 10,
    }),
  ]);

  const statCards = [
    {
      label: "Total Platforms",
      value: totalPlatforms,
      sub: "Portfolio records in database",
      icon: Layers,
      href: "/admin/platforms",
    },
    {
      label: "Live Platforms",
      value: livePlatforms,
      sub: "Actively launched services",
      icon: CheckCircle2,
      href: "/admin/platforms",
    },
    {
      label: "In-Development / Coming Soon",
      value: inDevPlatforms,
      sub: "Pipeline & pre-launch services",
      icon: Clock,
      href: "/admin/platforms",
    },
    {
      label: "Unread Contact Inquiries",
      value: unreadInquiries,
      sub: "Marked as 'New' in inbox",
      icon: MailWarning,
      href: "/admin/inquiries",
    },
    {
      label: "Total Contact Inquiries",
      value: totalInquiries,
      sub: "All recorded submissions",
      icon: Inbox,
      href: "/admin/inquiries",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Administrator Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time database metrics, platform portfolio statuses, and recent
            administrative updates.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/platforms"
            className="inline-flex items-center gap-1.5 rounded-xl bg-electric-600 px-4 py-2 text-xs font-bold text-white hover:bg-electric-700 transition-colors"
          >
            <Layers className="h-4 w-4" />
            Manage Platforms
          </Link>
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-navy-900 dark:text-slate-200"
          >
            <FileEdit className="h-4 w-4" />
            Edit Website Content
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-navy-900 dark:text-slate-200"
          >
            <Settings className="h-4 w-4" />
            Corporate Settings
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-electric-500 dark:border-slate-800 dark:bg-navy-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.label}
                </span>
                <Icon className="h-4 w-4 text-electric-600 dark:text-electric-400" />
              </div>
              <p className="mt-3 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {card.sub}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Platform Portfolio Snapshot */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Platform Ecosystem Status ({platforms.length})
            </h2>
            <Link
              href="/admin/platforms"
              className="inline-flex items-center gap-1 text-xs font-semibold text-electric-600 hover:underline dark:text-electric-400"
            >
              Manage All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-slate-400">
                    #{p.display_order}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {p.category} • /platforms/{p.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={p.platform_status} />
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      p.publication_status === "Published"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {p.publication_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Activity & Recent Inquiries */}
        <div className="space-y-6 lg:col-span-5">
          {/* Recent Contact Inquiries */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Contact Inquiries
              </h2>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-electric-600 hover:underline dark:text-electric-400"
              >
                Open Inbox →
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                No contact inquiries have been submitted yet.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {inq.subject}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          inq.status === "New"
                            ? "bg-electric-100 text-electric-700 dark:bg-electric-950 dark:text-electric-300"
                            : inq.status === "In Progress"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {inq.full_name} ({inq.email}) • {inq.inquiry_type}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Website Content Updates / Activity Logs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-electric-600 dark:text-electric-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Administrative Activity
                </h2>
              </div>
              <Link
                href="/admin/security"
                className="text-xs font-semibold text-electric-600 hover:underline dark:text-electric-400"
              >
                Full Log →
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-navy-950"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{log.action}</span>
                    <span className="text-[11px] font-normal text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
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


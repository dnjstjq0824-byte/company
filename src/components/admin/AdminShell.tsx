"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  FileEdit,
  Inbox,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
  { href: "/admin/platforms", label: "Platform Management", icon: Layers },
  { href: "/admin/content", label: "Website Content (CMS)", icon: FileEdit },
  { href: "/admin/inquiries", label: "Contact Inquiries", icon: Inbox },
  { href: "/admin/settings", label: "Corporate Settings", icon: Settings },
  { href: "/admin/security", label: "Security & Activity", icon: ShieldAlert },
];

export function AdminShell({
  admin,
  unreadCount,
  children,
}: {
  admin: { id: string; email: string; role: string };
  unreadCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-navy-950 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-navy-950 text-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-800 p-5">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-electric-400">
            Corporate Admin Portal
          </span>
          <span className="mt-0.5 block text-base font-extrabold text-white">
            Booking Network
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Admin Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-electric-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-navy-900 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.href === "/admin/inquiries" && unreadCount > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      active
                        ? "bg-white text-electric-700"
                        : "bg-electric-600 text-white"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-navy-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-electric-500 hover:text-white transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <div className="rounded-xl bg-navy-900/80 p-3 text-xs">
            <p className="truncate font-bold text-white">{admin.email}</p>
            <p className="mt-0.5 text-[11px] text-electric-400">{admin.role}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/50 hover:text-white transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile/Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-navy-900">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Booking Network Co., Ltd. — System Administration
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-semibold text-electric-600 hover:underline dark:text-electric-400"
            >
              Public Portal →
            </Link>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}


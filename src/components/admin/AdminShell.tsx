"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Newspaper,
  Globe2,
  FileEdit,
  Inbox,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Executive Command", icon: LayoutDashboard },
  { href: "/admin/platforms", label: "Business & Tech Divisions", icon: Layers },
  { href: "/admin/newsroom", label: "Newsroom & IR", icon: Newspaper },
  { href: "/admin/network", label: "Global Network & Hubs", icon: Globe2 },
  { href: "/admin/content", label: "Website Content (CMS)", icon: FileEdit },
  { href: "/admin/inquiries", label: "Enterprise Inquiries", icon: Inbox },
  { href: "/admin/settings", label: "Corporate Settings", icon: Settings },
  { href: "/admin/security", label: "Security & Audit Trail", icon: ShieldAlert },
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
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-electric-500/30 selection:text-white">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-navy-950/95 backdrop-blur-xl text-slate-200">
        <div className="border-b border-slate-800/80 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-electric-500/10 border border-electric-500/30">
              <span className="font-mono text-xs font-black text-electric-400">BN</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-electric-400">
                Enterprise Command
              </span>
              <span className="block text-sm font-extrabold tracking-tight text-white">
                Booking Network
              </span>
            </div>
          </div>
          <p className="mt-1 text-[10px] text-slate-400 truncate">
            Global Group Portal Admin
          </p>
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Admin Navigation">
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
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-electric-600 text-white shadow-sm shadow-electric-600/30"
                    : "text-slate-300 hover:bg-slate-900/90 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-white" />
                  <span>{item.label}</span>
                </span>
                {item.href === "/admin/inquiries" && unreadCount > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active
                        ? "bg-white text-electric-700"
                        : "bg-electric-600 text-white animate-pulse"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/80 p-4 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-electric-500/50 hover:bg-slate-900 hover:text-white transition-all"
          >
            <span>View Public Portal</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          <div className="rounded-xl border border-slate-800/60 bg-slate-900/80 p-3 text-xs">
            <p className="truncate font-bold text-white text-[11px]">{admin.email}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] font-mono font-medium text-electric-400 uppercase">
                {admin.role}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-950/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/40 hover:text-white transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 bg-slate-950">
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between border-b border-slate-800/80 bg-navy-950/60 backdrop-blur-md px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Booking Network Global Group
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-medium text-slate-300">
              Enterprise Governance & Operations
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-electric-400 hover:text-electric-300 hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

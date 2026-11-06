import { getAuthenticatedAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    // Login route is allowed by middleware; render children directly without AdminShell
    return <>{children}</>;
  }

  let unreadCount = 0;
  try {
    unreadCount = await prisma.contactInquiry.count({
      where: { status: "New" },
    });
  } catch {
    unreadCount = 0;
  }

  return (
    <AdminShell admin={admin} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}


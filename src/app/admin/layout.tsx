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

  const unreadCount = await prisma.contactInquiry.count({
    where: { status: "New" },
  });

  return (
    <AdminShell admin={admin} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}


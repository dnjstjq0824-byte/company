import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [admins, logs] = await Promise.all([
    prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
      },
      orderBy: { created_at: "asc" },
    }),
    prisma.adminActivityLog.findMany({
      include: {
        admin: {
          select: { email: true, role: true },
        },
      },
      orderBy: { created_at: "desc" },
      take: 100,
    }),
  ]);

  return NextResponse.json({ admins, currentAdminId: admin.id, logs });
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip_address = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const user_agent = request.headers.get("user-agent") || "";

  try {
    const body = await request.json();
    const action = String(body.action || "");

    // 1. Password change: Any authenticated admin can change their own password
    if (action === "change_password") {
      const currentPassword = String(body.current_password || "");
      const newPassword = String(body.new_password || "");

      if (newPassword.length < 10) {
        return NextResponse.json(
          { error: "New password must be at least 10 characters long." },
          { status: 400 }
        );
      }

      const fullAdmin = await prisma.admin.findUnique({
        where: { id: admin.id },
      });
      if (!fullAdmin) {
        return NextResponse.json({ error: "Admin not found." }, { status: 404 });
      }

      const valid = await bcrypt.compare(
        currentPassword,
        fullAdmin.password_hash
      );
      if (!valid) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await prisma.admin.update({
        where: { id: admin.id },
        data: { password_hash: newHash },
      });

      await logAdminActivity(
        admin.id,
        "CHANGE_ADMIN_PASSWORD",
        `Changed account password for ${admin.email}`,
        { ip_address, user_agent }
      );

      return NextResponse.json({
        success: true,
        message: "Password updated successfully.",
      });
    }

    // All following account provisioning/status modification actions require Super Admin privileges
    if (admin.role !== "Super Admin") {
      return NextResponse.json(
        { error: "Only Super Admins can provision or modify administrator accounts." },
        { status: 403 }
      );
    }

    if (action === "create_admin") {
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const password = String(body.password || "");
      const role =
        body.role === "Super Admin" ? "Super Admin" : "Content Manager";

      if (!email || !email.includes("@")) {
        return NextResponse.json(
          { error: "Valid administrator email is required." },
          { status: 400 }
        );
      }
      if (password.length < 10) {
        return NextResponse.json(
          { error: "Password must be at least 10 characters long." },
          { status: 400 }
        );
      }

      const exists = await prisma.admin.findUnique({ where: { email } });
      if (exists) {
        return NextResponse.json(
          { error: "An administrator with that email already exists." },
          { status: 409 }
        );
      }

      const password_hash = await bcrypt.hash(password, 12);
      const created = await prisma.admin.create({
        data: {
          email,
          password_hash,
          role,
          is_active: true,
        },
        select: {
          id: true,
          email: true,
          role: true,
          is_active: true,
          last_login_at: true,
          created_at: true,
        },
      });

      await logAdminActivity(
        admin.id,
        "PROVISION_ADDITIONAL_ADMIN",
        `Provisioned administrator ${created.email} (${created.role})`,
        { ip_address, user_agent }
      );

      return NextResponse.json({ admin: created }, { status: 201 });
    }

    if (action === "toggle_status") {
      const targetId = String(body.target_id || "");
      if (targetId === admin.id) {
        return NextResponse.json(
          { error: "You cannot deactivate your own active session account." },
          { status: 400 }
        );
      }

      const target = await prisma.admin.findUnique({ where: { id: targetId } });
      if (!target) {
        return NextResponse.json(
          { error: "Target administrator not found." },
          { status: 404 }
        );
      }

      const updated = await prisma.admin.update({
        where: { id: targetId },
        data: { is_active: !target.is_active },
        select: {
          id: true,
          email: true,
          role: true,
          is_active: true,
          last_login_at: true,
          created_at: true,
        },
      });

      await logAdminActivity(
        admin.id,
        "TOGGLE_ADMIN_STATUS",
        `Set administrator ${updated.email} active=${updated.is_active}`,
        { ip_address, user_agent }
      );

      return NextResponse.json({ admin: updated });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    console.error("Admin management error:", error);
    return NextResponse.json(
      { error: "Failed to process administrator action." },
      { status: 500 }
    );
  }
}

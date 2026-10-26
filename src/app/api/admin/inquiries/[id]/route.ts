import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";

const VALID_STATUSES = ["New", "In Progress", "Resolved"];
const VALID_PRIORITIES = ["Urgent", "High", "Normal", "Low"];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const existing = await prisma.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Contact inquiry not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const status =
      body.status && VALID_STATUSES.includes(body.status)
        ? body.status
        : existing.status;
    const priority =
      body.priority && VALID_PRIORITIES.includes(body.priority)
        ? body.priority
        : existing.priority || "Normal";
    const department =
      body.department !== undefined
        ? String(body.department).trim()
        : existing.department;
    const assigned_to =
      body.assigned_to !== undefined
        ? body.assigned_to ? String(body.assigned_to).trim() : null
        : existing.assigned_to;
    const admin_notes =
      body.admin_notes !== undefined
        ? String(body.admin_notes).trim()
        : existing.admin_notes;

    let resolved_at = existing.resolved_at;
    if (status === "Resolved" && !existing.resolved_at) {
      resolved_at = new Date();
    } else if (status !== "Resolved") {
      resolved_at = null;
    }

    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: {
        status,
        priority,
        department,
        assigned_to,
        admin_notes,
        resolved_at,
      },
    });

    await logAdminActivity(
      admin.id,
      "UPDATE_INQUIRY",
      `Updated inquiry from ${existing.email} (status: ${updated.status}, priority: ${updated.priority})`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    return NextResponse.json({ inquiry: updated });
  } catch (error) {
    console.error("Failed to update inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const existing = await prisma.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Contact inquiry not found." },
        { status: 404 }
      );
    }

    await prisma.contactInquiry.delete({ where: { id } });

    await logAdminActivity(
      admin.id,
      "DELETE_INQUIRY",
      `Deleted inquiry '${existing.subject}' from ${existing.email}`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry." },
      { status: 500 }
    );
  }
}

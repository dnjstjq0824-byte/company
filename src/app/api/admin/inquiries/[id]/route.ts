import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";

const VALID_STATUSES = ["New", "In Progress", "Resolved"];

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
    const admin_notes =
      body.admin_notes !== undefined
        ? String(body.admin_notes).trim()
        : existing.admin_notes;

    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: {
        status,
        admin_notes,
      },
    });

    await logAdminActivity(
      admin.id,
      "UPDATE_INQUIRY",
      `Updated inquiry from ${existing.email} (status: ${updated.status})`
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
  _request: NextRequest,
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
      `Deleted inquiry '${existing.subject}' from ${existing.email}`
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


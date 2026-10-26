import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";

const VALID_REGIONS = ["APAC", "North America", "Europe", "MENA", "Global"];
const VALID_HUB_TYPES = ["Global HQ", "Regional Hub", "R&D Center", "Cloud Node"];
const VALID_STATUSES = ["Active", "Expanding", "Planned"];

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
    const existing = await prisma.globalHub.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Global hub not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const region =
      body.region && VALID_REGIONS.includes(body.region)
        ? body.region
        : existing.region;
    const city =
      body.city !== undefined ? String(body.city).trim() : existing.city;
    const country =
      body.country !== undefined ? String(body.country).trim() : existing.country;
    const hub_type =
      body.hub_type && VALID_HUB_TYPES.includes(body.hub_type)
        ? body.hub_type
        : existing.hub_type;
    const description =
      body.description !== undefined
        ? String(body.description).trim()
        : existing.description;
    const address =
      body.address !== undefined
        ? body.address ? String(body.address).trim() : null
        : existing.address;
    const contact_email =
      body.contact_email !== undefined
        ? body.contact_email ? String(body.contact_email).trim() : null
        : existing.contact_email;
    const status =
      body.status && VALID_STATUSES.includes(body.status)
        ? body.status
        : existing.status;
    const display_order =
      body.display_order !== undefined && Number.isFinite(Number(body.display_order))
        ? Number(body.display_order)
        : existing.display_order;

    const updated = await prisma.globalHub.update({
      where: { id },
      data: {
        region,
        city,
        country,
        hub_type,
        description,
        address,
        contact_email,
        status,
        display_order,
      },
    });

    await logAdminActivity(
      admin.id,
      "UPDATE_GLOBAL_HUB",
      `Updated global hub '${updated.city}, ${updated.country}' (${updated.status})`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");

    return NextResponse.json({ hub: updated });
  } catch (error) {
    console.error("Error updating global hub:", error);
    return NextResponse.json(
      { error: "Failed to update global hub." },
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
    const existing = await prisma.globalHub.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Global hub not found." },
        { status: 404 }
      );
    }

    await prisma.globalHub.delete({ where: { id } });

    await logAdminActivity(
      admin.id,
      "DELETE_GLOBAL_HUB",
      `Deleted global hub '${existing.city}, ${existing.country}'`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting global hub:", error);
    return NextResponse.json(
      { error: "Failed to delete global hub." },
      { status: 500 }
    );
  }
}


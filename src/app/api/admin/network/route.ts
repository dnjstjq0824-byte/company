import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";

const VALID_REGIONS = ["APAC", "North America", "Europe", "MENA", "Global"];
const VALID_HUB_TYPES = ["Global HQ", "Regional Hub", "R&D Center", "Cloud Node"];
const VALID_STATUSES = ["Active", "Expanding", "Planned"];

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hubs = await prisma.globalHub.findMany({
    orderBy: [{ display_order: "asc" }, { city: "asc" }],
  });

  return NextResponse.json({ hubs });
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const region = VALID_REGIONS.includes(body.region) ? body.region : "APAC";
    const city = String(body.city || "").trim();
    const country = String(body.country || "").trim();
    const hub_type = VALID_HUB_TYPES.includes(body.hub_type)
      ? body.hub_type
      : "Regional Hub";
    const description = String(body.description || "").trim();
    const address = body.address ? String(body.address).trim() : null;
    const contact_email = body.contact_email ? String(body.contact_email).trim() : null;
    const status = VALID_STATUSES.includes(body.status) ? body.status : "Active";
    const display_order = Number.isFinite(Number(body.display_order))
      ? Number(body.display_order)
      : 99;

    if (!city || !country || !description) {
      return NextResponse.json(
        { error: "City, country, and description are required." },
        { status: 400 }
      );
    }

    const created = await prisma.globalHub.create({
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
      "CREATE_GLOBAL_HUB",
      `Added global hub node '${city}, ${country}' (${hub_type})`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");

    return NextResponse.json({ hub: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating global hub:", error);
    return NextResponse.json(
      { error: "Failed to create global hub." },
      { status: 500 }
    );
  }
}


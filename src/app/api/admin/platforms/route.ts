import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";
import { parsePlatformRecord } from "@/lib/data";

const VALID_STATUSES = [
  "Live",
  "Coming Soon",
  "In Development",
  "Temporarily Unavailable",
];

const VALID_PUB_STATUSES = ["Published", "Draft", "Archived"];

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.platform.findMany({
    orderBy: [{ display_order: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({
    platforms: rows.map(parsePlatformRecord),
  });
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const slug = String(body.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");
    const division_code = String(body.division_code || "").trim();
    const category = String(body.category || "").trim();
    const icon_name = String(body.icon_name || "Layers").trim();
    const short_description = String(body.short_description || "").trim();
    const full_description = String(body.full_description || "").trim();
    const logo = body.logo ? String(body.logo).trim() : "/logos/booking-network.svg";
    const target_audience = String(body.target_audience || "").trim();
    const business_purpose = String(body.business_purpose || "").trim();
    const website_url = body.website_url ? String(body.website_url).trim() : "";
    const platform_status = VALID_STATUSES.includes(body.platform_status)
      ? body.platform_status
      : "Live";
    const publication_status = VALID_PUB_STATUSES.includes(body.publication_status)
      ? body.publication_status
      : "Published";
    const display_order = Number.isFinite(Number(body.display_order))
      ? Number(body.display_order)
      : 99;
    const seo_title = body.seo_title ? String(body.seo_title).trim() : "";
    const seo_description = body.seo_description
      ? String(body.seo_description).trim()
      : "";

    if (!name || !slug || !category || !short_description) {
      return NextResponse.json(
        {
          error:
            "Division name, slug, category, and short description are required.",
        },
        { status: 400 }
      );
    }

    if (website_url) {
      try {
        const parsed = new URL(website_url);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          return NextResponse.json(
            { error: "Website URL must start with https:// or http://" },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Please provide a valid Website URL (e.g., https://example.com)." },
          { status: 400 }
        );
      }
    }

    const existing = await prisma.platform.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: `A platform division with slug '${slug}' already exists.` },
        { status: 409 }
      );
    }

    const featuresArray = Array.isArray(body.features)
      ? body.features.map((f: unknown) => String(f).trim()).filter(Boolean)
      : String(body.features || "")
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean);

    let keyMetricsString = "[]";
    if (Array.isArray(body.key_metrics)) {
      keyMetricsString = JSON.stringify(
        body.key_metrics
          .map((m: { label?: string; value?: string }) => ({
            label: String(m.label || "").trim(),
            value: String(m.value || "").trim(),
          }))
          .filter((m: { label: string; value: string }) => m.label && m.value)
      );
    }

    const created = await prisma.platform.create({
      data: {
        name,
        slug,
        division_code: division_code || `BNG-${slug.slice(0, 5).toUpperCase()}`,
        category,
        icon_name,
        short_description,
        full_description: full_description || short_description,
        logo,
        features: JSON.stringify(featuresArray),
        key_metrics: keyMetricsString,
        target_audience,
        business_purpose,
        website_url,
        platform_status,
        publication_status,
        display_order,
        seo_title: seo_title || `${name} (${division_code}) | Booking Network Global Group`,
        seo_description: seo_description || short_description,
      },
    });

    await logAdminActivity(
      admin.id,
      "CREATE_PLATFORM",
      `Created platform division '${name}' (${created.division_code})`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    revalidatePath("/");
    revalidatePath("/platforms");
    revalidatePath(`/platforms/${slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json(
      { platform: parsePlatformRecord(created) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating platform division:", error);
    return NextResponse.json(
      { error: "Failed to create platform division entry." },
      { status: 500 }
    );
  }
}

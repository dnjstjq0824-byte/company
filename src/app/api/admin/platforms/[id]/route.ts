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
    const existing = await prisma.platform.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Platform division not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const name =
      body.name !== undefined ? String(body.name).trim() : existing.name;
    const slug =
      body.slug !== undefined
        ? String(body.slug)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, "-")
            .replace(/^-|-$/g, "")
        : existing.slug;
    const division_code =
      body.division_code !== undefined
        ? String(body.division_code).trim()
        : existing.division_code;
    const category =
      body.category !== undefined
        ? String(body.category).trim()
        : existing.category;
    const icon_name =
      body.icon_name !== undefined
        ? String(body.icon_name).trim()
        : existing.icon_name;
    const short_description =
      body.short_description !== undefined
        ? String(body.short_description).trim()
        : existing.short_description;
    const full_description =
      body.full_description !== undefined
        ? String(body.full_description).trim()
        : existing.full_description;
    const logo =
      body.logo !== undefined ? String(body.logo).trim() : existing.logo;
    const target_audience =
      body.target_audience !== undefined
        ? String(body.target_audience).trim()
        : existing.target_audience;
    const business_purpose =
      body.business_purpose !== undefined
        ? String(body.business_purpose).trim()
        : existing.business_purpose;
    const website_url =
      body.website_url !== undefined
        ? String(body.website_url).trim()
        : existing.website_url;
    const platform_status =
      body.platform_status && VALID_STATUSES.includes(body.platform_status)
        ? body.platform_status
        : existing.platform_status;
    const publication_status =
      body.publication_status &&
      VALID_PUB_STATUSES.includes(body.publication_status)
        ? body.publication_status
        : existing.publication_status;
    const display_order =
      body.display_order !== undefined &&
      Number.isFinite(Number(body.display_order))
        ? Number(body.display_order)
        : existing.display_order;
    const seo_title =
      body.seo_title !== undefined
        ? String(body.seo_title).trim()
        : existing.seo_title;
    const seo_description =
      body.seo_description !== undefined
        ? String(body.seo_description).trim()
        : existing.seo_description;

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

    if (slug !== existing.slug) {
      const slugConflict = await prisma.platform.findUnique({ where: { slug } });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { error: `Another platform division already uses slug '${slug}'.` },
          { status: 409 }
        );
      }
    }

    let featuresString = existing.features;
    if (body.features !== undefined) {
      const featuresArray = Array.isArray(body.features)
        ? body.features.map((f: unknown) => String(f).trim()).filter(Boolean)
        : String(body.features || "")
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean);
      featuresString = JSON.stringify(featuresArray);
    }

    let keyMetricsString = existing.key_metrics;
    if (body.key_metrics !== undefined) {
      if (Array.isArray(body.key_metrics)) {
        keyMetricsString = JSON.stringify(
          body.key_metrics
            .map((m: { label?: string; value?: string }) => ({
              label: String(m.label || "").trim(),
              value: String(m.value || "").trim(),
            }))
            .filter((m: { label: string; value: string }) => m.label && m.value)
        );
      } else if (typeof body.key_metrics === "string") {
        keyMetricsString = body.key_metrics;
      }
    }

    const updated = await prisma.platform.update({
      where: { id },
      data: {
        name,
        slug,
        division_code,
        category,
        icon_name,
        short_description,
        full_description,
        logo,
        features: featuresString,
        key_metrics: keyMetricsString,
        target_audience,
        business_purpose,
        website_url,
        platform_status,
        publication_status,
        display_order,
        seo_title,
        seo_description,
      },
    });

    await logAdminActivity(
      admin.id,
      "UPDATE_PLATFORM",
      `Updated platform division '${updated.name}' (${updated.division_code})`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    revalidatePath("/");
    revalidatePath("/platforms");
    revalidatePath(`/platforms/${existing.slug}`);
    revalidatePath(`/platforms/${updated.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ platform: parsePlatformRecord(updated) });
  } catch (error) {
    console.error("Error updating platform division:", error);
    return NextResponse.json(
      { error: "Failed to update platform division entry." },
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
    const existing = await prisma.platform.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Platform division not found." },
        { status: 404 }
      );
    }

    await prisma.platform.delete({ where: { id } });

    await logAdminActivity(
      admin.id,
      "DELETE_PLATFORM",
      `Deleted platform division '${existing.name}' (${existing.division_code || existing.slug})`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    revalidatePath("/");
    revalidatePath("/platforms");
    revalidatePath(`/platforms/${existing.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting platform division:", error);
    return NextResponse.json(
      { error: "Failed to delete platform division entry." },
      { status: 500 }
    );
  }
}

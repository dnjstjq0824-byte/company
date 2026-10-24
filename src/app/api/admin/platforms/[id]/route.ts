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
        { error: "Platform not found." },
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
    const category =
      body.category !== undefined
        ? String(body.category).trim()
        : existing.category;
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
          { error: `Another platform already uses slug '${slug}'.` },
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

    const updated = await prisma.platform.update({
      where: { id },
      data: {
        name,
        slug,
        category,
        short_description,
        full_description,
        logo,
        features: featuresString,
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
      `Updated platform '${updated.name}' (status: ${updated.platform_status}, pub: ${updated.publication_status})`
    );

    revalidatePath("/");
    revalidatePath("/platforms");
    revalidatePath(`/platforms/${existing.slug}`);
    revalidatePath(`/platforms/${updated.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ platform: parsePlatformRecord(updated) });
  } catch (error) {
    console.error("Error updating platform:", error);
    return NextResponse.json(
      { error: "Failed to update platform entry." },
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
    const existing = await prisma.platform.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Platform not found." },
        { status: 404 }
      );
    }

    await prisma.platform.delete({ where: { id } });

    await logAdminActivity(
      admin.id,
      "DELETE_PLATFORM",
      `Deleted platform '${existing.name}' (${existing.slug})`
    );

    revalidatePath("/");
    revalidatePath("/platforms");
    revalidatePath(`/platforms/${existing.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting platform:", error);
    return NextResponse.json(
      { error: "Failed to delete platform entry." },
      { status: 500 }
    );
  }
}


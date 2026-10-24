import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pages = await prisma.contentPage.findMany({
    orderBy: { page_slug: "asc" },
  });

  const parsed = pages.map((p) => {
    let content = {};
    let seo_metadata = {};
    try {
      content = JSON.parse(p.content);
    } catch {
      content = {};
    }
    try {
      seo_metadata = JSON.parse(p.seo_metadata);
    } catch {
      seo_metadata = {};
    }
    return {
      ...p,
      content,
      seo_metadata,
    };
  });

  return NextResponse.json({ pages: parsed });
}

export async function PUT(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const page_slug = String(body.page_slug || "").trim().toLowerCase();
    if (!page_slug) {
      return NextResponse.json(
        { error: "page_slug is required." },
        { status: 400 }
      );
    }

    const content =
      typeof body.content === "string"
        ? body.content
        : JSON.stringify(body.content || {});

    const seo_metadata =
      typeof body.seo_metadata === "string"
        ? body.seo_metadata
        : JSON.stringify(body.seo_metadata || {});

    const publication_status =
      body.publication_status === "Draft" ? "Draft" : "Published";

    const updated = await prisma.contentPage.upsert({
      where: { page_slug },
      update: {
        content,
        seo_metadata,
        publication_status,
      },
      create: {
        page_slug,
        content,
        seo_metadata,
        publication_status,
      },
    });

    await logAdminActivity(
      admin.id,
      "UPDATE_CONTENT_PAGE",
      `Updated website content page '${page_slug}'`
    );

    revalidatePath("/");
    revalidatePath(`/${page_slug === "home" ? "" : page_slug}`);

    return NextResponse.json({
      page: {
        ...updated,
        content: JSON.parse(updated.content),
        seo_metadata: JSON.parse(updated.seo_metadata),
      },
    });
  } catch (error) {
    console.error("Failed to update content page:", error);
    return NextResponse.json(
      { error: "Failed to save content page." },
      { status: 500 }
    );
  }
}


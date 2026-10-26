import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";

const VALID_CATEGORIES = [
  "Press Release",
  "IR & Governance",
  "Technology",
  "Global Notice",
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
    const existing = await prisma.newsPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "News post not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const title =
      body.title !== undefined ? String(body.title).trim() : existing.title;
    const slug =
      body.slug !== undefined
        ? String(body.slug)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, "-")
            .replace(/^-|-$/g, "")
        : existing.slug;
    const category =
      body.category && VALID_CATEGORIES.includes(body.category)
        ? body.category
        : existing.category;
    const summary =
      body.summary !== undefined ? String(body.summary).trim() : existing.summary;
    const content =
      body.content !== undefined ? String(body.content).trim() : existing.content;
    const thumbnail_url =
      body.thumbnail_url !== undefined
        ? body.thumbnail_url ? String(body.thumbnail_url).trim() : null
        : existing.thumbnail_url;
    const is_featured =
      body.is_featured !== undefined ? Boolean(body.is_featured) : existing.is_featured;
    const publication_status =
      body.publication_status && VALID_PUB_STATUSES.includes(body.publication_status)
        ? body.publication_status
        : existing.publication_status;
    const published_at =
      body.published_at ? new Date(body.published_at) : existing.published_at;
    const author_name =
      body.author_name !== undefined
        ? String(body.author_name).trim()
        : existing.author_name;
    const seo_title =
      body.seo_title !== undefined
        ? body.seo_title ? String(body.seo_title).trim() : null
        : existing.seo_title;
    const seo_description =
      body.seo_description !== undefined
        ? body.seo_description ? String(body.seo_description).trim() : null
        : existing.seo_description;

    if (slug !== existing.slug) {
      const slugConflict = await prisma.newsPost.findUnique({ where: { slug } });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { error: `Another news post already uses slug '${slug}'.` },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.newsPost.update({
      where: { id },
      data: {
        title,
        slug,
        category,
        summary,
        content,
        thumbnail_url,
        is_featured,
        publication_status,
        published_at,
        author_name,
        seo_title,
        seo_description,
      },
    });

    await logAdminActivity(
      admin.id,
      "UPDATE_NEWS_POST",
      `Updated news post '${updated.title}' (${updated.publication_status})`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    revalidatePath("/");
    revalidatePath("/newsroom");
    revalidatePath(`/newsroom/${existing.slug}`);
    revalidatePath(`/newsroom/${updated.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ post: updated });
  } catch (error) {
    console.error("Error updating news post:", error);
    return NextResponse.json(
      { error: "Failed to update news post." },
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
    const existing = await prisma.newsPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "News post not found." },
        { status: 404 }
      );
    }

    await prisma.newsPost.delete({ where: { id } });

    await logAdminActivity(
      admin.id,
      "DELETE_NEWS_POST",
      `Deleted news post '${existing.title}' (${existing.slug})`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    revalidatePath("/");
    revalidatePath("/newsroom");
    revalidatePath(`/newsroom/${existing.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news post:", error);
    return NextResponse.json(
      { error: "Failed to delete news post." },
      { status: 500 }
    );
  }
}


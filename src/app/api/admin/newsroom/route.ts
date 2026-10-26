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

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.newsPost.findMany({
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    let slug = String(body.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!slug && title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);
    }

    const category = VALID_CATEGORIES.includes(body.category)
      ? body.category
      : "Press Release";
    const summary = String(body.summary || "").trim();
    const content = String(body.content || "").trim();
    const thumbnail_url = body.thumbnail_url ? String(body.thumbnail_url).trim() : null;
    const is_featured = Boolean(body.is_featured);
    const publication_status = VALID_PUB_STATUSES.includes(body.publication_status)
      ? body.publication_status
      : "Published";
    const published_at = body.published_at ? new Date(body.published_at) : new Date();
    const author_name = String(body.author_name || "Global Communications").trim();
    const seo_title = body.seo_title ? String(body.seo_title).trim() : null;
    const seo_description = body.seo_description ? String(body.seo_description).trim() : null;

    if (!title || !slug || !summary || !content) {
      return NextResponse.json(
        { error: "Title, slug, summary, and content are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.newsPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: `A news post with slug '${slug}' already exists.` },
        { status: 409 }
      );
    }

    const created = await prisma.newsPost.create({
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
        seo_title: seo_title || `${title} | Booking Network Global Group Newsroom`,
        seo_description: seo_description || summary,
      },
    });

    await logAdminActivity(
      admin.id,
      "CREATE_NEWS_POST",
      `Published news post '${title}' (/newsroom/${slug})`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    revalidatePath("/");
    revalidatePath("/newsroom");
    revalidatePath(`/newsroom/${slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ post: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating news post:", error);
    return NextResponse.json(
      { error: "Failed to create news post." },
      { status: 500 }
    );
  }
}


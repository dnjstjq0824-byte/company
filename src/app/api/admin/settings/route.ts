import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";
import { getAllSiteSettings } from "@/lib/data";

const ALLOWED_SETTING_KEYS = [
  "company_name",
  "tagline",
  "brand_positioning",
  "corporate_email",
  "telephone",
  "business_address",
  "operating_hours",
  "website_domain",
  "contact_notification_email",
  "social_linkedin",
  "social_x",
  "social_youtube",
  "social_github",
  "footer_copyright",
  "default_seo_title",
  "default_seo_description",
  "brand_logo",
  "favicon",
  "cookie_consent_enabled",
];

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getAllSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates = body.settings;
    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Invalid settings payload." },
        { status: 400 }
      );
    }

    const updatedKeys: string[] = [];

    for (const key of ALLOWED_SETTING_KEYS) {
      if (updates[key] !== undefined) {
        const val = String(updates[key] ?? "").trim();
        await prisma.siteSetting.upsert({
          where: { setting_key: key },
          update: { setting_value: val },
          create: { setting_key: key, setting_value: val },
        });
        updatedKeys.push(key);
      }
    }

    await logAdminActivity(
      admin.id,
      "UPDATE_SITE_SETTINGS",
      `Updated corporate settings (${updatedKeys.length} fields)`
    );

    revalidatePath("/", "layout");

    const settings = await getAllSiteSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to save corporate settings:", error);
    return NextResponse.json(
      { error: "Failed to save corporate settings." },
      { status: 500 }
    );
  }
}


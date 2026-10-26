import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  DEFAULT_PLATFORMS,
  DEFAULT_NEWS_POSTS,
  DEFAULT_GLOBAL_HUBS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_CONTENT_PAGES,
} from "../src/lib/default-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Booking Network Global Group database...");

  // 1. Seed or update Site Settings
  console.log("-> Seeding Site Settings...");
  for (const [key, value] of Object.entries(DEFAULT_SITE_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { setting_key: key },
      update: { setting_value: value },
      create: { setting_key: key, setting_value: value },
    });
  }

  // 2. Seed or update 6 Core Business & Technology Divisions
  console.log("-> Seeding 6 Core Business & Technology Divisions...");
  // Clear any existing legacy platforms first to ensure 0 legacy records
  await prisma.platform.deleteMany({});
  for (const div of DEFAULT_PLATFORMS) {
    await prisma.platform.create({
      data: {
        name: div.name,
        slug: div.slug,
        division_code: div.division_code,
        category: div.category,
        icon_name: div.icon_name,
        short_description: div.short_description,
        full_description: div.full_description,
        logo: div.logo,
        features: JSON.stringify(div.features),
        key_metrics: JSON.stringify(div.key_metrics),
        target_audience: div.target_audience,
        business_purpose: div.business_purpose,
        website_url: div.website_url,
        platform_status: div.platform_status,
        publication_status: div.publication_status,
        display_order: div.display_order,
        seo_title: div.seo_title,
        seo_description: div.seo_description,
      },
    });
  }

  // 3. Seed News Posts
  console.log("-> Seeding Newsroom & IR Posts...");
  await prisma.newsPost.deleteMany({});
  for (const post of DEFAULT_NEWS_POSTS) {
    await prisma.newsPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        category: post.category,
        summary: post.summary,
        content: post.content,
        thumbnail_url: post.thumbnail_url,
        is_featured: post.is_featured,
        publication_status: post.publication_status,
        published_at: new Date(post.published_at),
        author_name: post.author_name,
        seo_title: post.seo_title,
        seo_description: post.seo_description,
      },
    });
  }

  // 4. Seed Global Hubs
  console.log("-> Seeding Global Network Hubs...");
  await prisma.globalHub.deleteMany({});
  for (const hub of DEFAULT_GLOBAL_HUBS) {
    await prisma.globalHub.create({
      data: {
        region: hub.region,
        city: hub.city,
        country: hub.country,
        hub_type: hub.hub_type,
        description: hub.description,
        address: hub.address,
        contact_email: hub.contact_email,
        status: hub.status,
        display_order: hub.display_order,
      },
    });
  }

  // 5. Seed Content Pages
  console.log("-> Seeding Content Pages...");
  for (const [slug, data] of Object.entries(DEFAULT_CONTENT_PAGES)) {
    await prisma.contentPage.upsert({
      where: { page_slug: slug },
      update: {
        content: JSON.stringify(data.content),
        seo_metadata: JSON.stringify(data.seo_metadata),
      },
      create: {
        page_slug: slug,
        content: JSON.stringify(data.content),
        seo_metadata: JSON.stringify(data.seo_metadata),
        publication_status: "Published",
      },
    });
  }

  // 6. Ensure Super Admin Account
  console.log("-> Checking Super Admin Account...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@bookingnetwork.com";
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const defaultPassword =
      process.env.ADMIN_PASSWORD ||
      crypto.randomBytes(8).toString("base64").slice(0, 12) + "A1!";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    const createdAdmin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password_hash: passwordHash,
        role: "Super Admin",
        is_active: true,
      },
    });

    console.log(`✅ Default Super Admin created: ${adminEmail}`);
    console.log(`🔑 Credentials saved locally if needed.`);

    const credsPath = path.join(process.cwd(), ".admin-credentials.local.txt");
    fs.writeFileSync(
      credsPath,
      `BOOKING NETWORK GLOBAL GROUP — ADMIN CREDENTIALS\n` +
        `Generated: ${new Date().toISOString()}\n` +
        `Email: ${adminEmail}\n` +
        `Password: ${defaultPassword}\n` +
        `Role: Super Admin\n\n` +
        `Keep this file private and do not commit it to version control.\n`
    );
  } else {
    console.log(`ℹ️ Admin already exists: ${adminEmail}`);
  }

  console.log("✨ Booking Network Global Group database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

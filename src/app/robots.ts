import type { MetadataRoute } from "next";
import { getAllSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getAllSiteSettings();
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    settings.website_domain ||
    "https://company.dnjstjq0824.workers.dev"
  ).replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/platforms", "/platforms/", "/contact", "/privacy", "/terms"],
        disallow: ["/admin", "/admin/", "/api/admin", "/api/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


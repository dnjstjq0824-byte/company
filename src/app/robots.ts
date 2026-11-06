import type { MetadataRoute } from "next";
import { getAllSiteSettings } from "@/lib/data";
import { siteBaseUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getAllSiteSettings();
  const baseUrl = siteBaseUrl(settings);

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/platforms", "/platforms/", "/newsroom", "/newsroom/", "/contact", "/privacy", "/terms"],
        disallow: ["/admin", "/admin/", "/api/admin", "/api/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


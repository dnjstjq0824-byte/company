import { getPrisma } from "./prisma";
import {
  DEFAULT_PLATFORMS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_CONTENT_PAGES,
} from "./default-data";

export interface ParsedPlatform {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  logo: string | null;
  features: string[];
  target_audience: string;
  business_purpose: string;
  website_url: string | null;
  platform_status: string;
  publication_status: string;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: Date;
  updated_at: Date;
}

export function parsePlatformRecord(record: {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  logo: string | null;
  features: string;
  target_audience: string;
  business_purpose: string;
  website_url: string | null;
  platform_status: string;
  publication_status: string;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: Date;
  updated_at: Date;
}): ParsedPlatform {
  let parsedFeatures: string[] = [];
  try {
    const raw = JSON.parse(record.features);
    if (Array.isArray(raw)) {
      parsedFeatures = raw.map((item) => String(item));
    }
  } catch {
    parsedFeatures = record.features
      ? record.features.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];
  }

  return {
    ...record,
    features: parsedFeatures,
  };
}

export async function getPublishedPlatforms(): Promise<ParsedPlatform[]> {
  const db = getPrisma();
  if (!db) {
    return DEFAULT_PLATFORMS.map((p, idx) => ({
      ...p,
      id: `default-${idx}`,
      created_at: new Date(),
      updated_at: new Date(),
    }));
  }

  try {
    const rows = await db.platform.findMany({
      where: { publication_status: "Published" },
      orderBy: [{ display_order: "asc" }, { name: "asc" }],
    });
    if (rows.length === 0) {
      return DEFAULT_PLATFORMS.map((p, idx) => ({
        ...p,
        id: `default-${idx}`,
        created_at: new Date(),
        updated_at: new Date(),
      }));
    }
    return rows.map(parsePlatformRecord);
  } catch {
    return DEFAULT_PLATFORMS.map((p, idx) => ({
      ...p,
      id: `default-${idx}`,
      created_at: new Date(),
      updated_at: new Date(),
    }));
  }
}

export async function getPublishedPlatformBySlug(
  slug: string
): Promise<ParsedPlatform | null> {
  const db = getPrisma();
  if (!db) {
    const found = DEFAULT_PLATFORMS.find((p) => p.slug === slug);
    if (!found) return null;
    return {
      ...found,
      id: `default-${found.slug}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  try {
    const row = await db.platform.findFirst({
      where: {
        slug,
        publication_status: "Published",
      },
    });
    if (!row) {
      const found = DEFAULT_PLATFORMS.find((p) => p.slug === slug);
      if (!found) return null;
      return {
        ...found,
        id: `default-${found.slug}`,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }
    return parsePlatformRecord(row);
  } catch {
    const found = DEFAULT_PLATFORMS.find((p) => p.slug === slug);
    if (!found) return null;
    return {
      ...found,
      id: `default-${found.slug}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}

export async function getAllSiteSettings(): Promise<Record<string, string>> {
  const db = getPrisma();
  if (!db) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const rows = await db.siteSetting.findMany();
    if (rows.length === 0) {
      return DEFAULT_SITE_SETTINGS;
    }
    const map: Record<string, string> = { ...DEFAULT_SITE_SETTINGS };
    for (const row of rows) {
      map[row.setting_key] = row.setting_value;
    }
    return map;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getContentPageBySlug<T = Record<string, unknown>>(
  slug: string
): Promise<{
  id: string;
  page_slug: string;
  content: T;
  publication_status: string;
  seo_metadata: { title?: string; description?: string; og_image?: string };
  updated_at: Date;
} | null> {
  const db = getPrisma();
  const defaultPage = DEFAULT_CONTENT_PAGES[slug];

  if (!db) {
    if (!defaultPage) return null;
    return {
      id: `default-${slug}`,
      page_slug: slug,
      content: defaultPage.content as T,
      publication_status: "Published",
      seo_metadata: defaultPage.seo_metadata,
      updated_at: new Date(),
    };
  }

  try {
    const row = await db.contentPage.findUnique({
      where: { page_slug: slug },
    });
    if (!row) {
      if (!defaultPage) return null;
      return {
        id: `default-${slug}`,
        page_slug: slug,
        content: defaultPage.content as T,
        publication_status: "Published",
        seo_metadata: defaultPage.seo_metadata,
        updated_at: new Date(),
      };
    }

    let contentObj: T = {} as T;
    let seoObj: { title?: string; description?: string; og_image?: string } = {};
    try {
      contentObj = JSON.parse(row.content);
    } catch {
      contentObj = (defaultPage?.content as T) || ({} as T);
    }
    try {
      seoObj = JSON.parse(row.seo_metadata);
    } catch {
      seoObj = defaultPage?.seo_metadata || {};
    }

    return {
      id: row.id,
      page_slug: row.page_slug,
      content: contentObj,
      publication_status: row.publication_status,
      seo_metadata: seoObj,
      updated_at: row.updated_at,
    };
  } catch {
    if (!defaultPage) return null;
    return {
      id: `default-${slug}`,
      page_slug: slug,
      content: defaultPage.content as T,
      publication_status: "Published",
      seo_metadata: defaultPage.seo_metadata,
      updated_at: new Date(),
    };
  }
}

export function mapCategoryToFilterGroup(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("commerce") || lower.includes("marketplace") || lower.includes("retail")) {
    return "Commerce";
  }
  if (lower.includes("travel") || lower.includes("trip") || lower.includes("hospitality")) {
    return "Travel";
  }
  if (
    lower.includes("search") ||
    lower.includes("knowledge") ||
    lower.includes("wiki") ||
    (lower.includes("information") &&
      !lower.includes("crypto") &&
      !lower.includes("stock") &&
      !lower.includes("financial"))
  ) {
    return "Search & Knowledge";
  }
  if (
    lower.includes("crypto") ||
    lower.includes("stock") ||
    lower.includes("financial") ||
    lower.includes("market") ||
    lower.includes("finance")
  ) {
    return "Financial Information";
  }
  if (
    lower.includes("video") ||
    lower.includes("media") ||
    lower.includes("communication") ||
    lower.includes("messenger") ||
    lower.includes("short")
  ) {
    return "Media & Communication";
  }
  return "Other";
}

export function isVerifiedExternalUrl(
  url: string | null | undefined,
  status: string
): boolean {
  if (!url || !url.trim()) return false;
  if (status !== "Live") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

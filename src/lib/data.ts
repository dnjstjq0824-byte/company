import { getPrisma } from "./prisma";
import {
  DEFAULT_PLATFORMS,
  DEFAULT_NEWS_POSTS,
  DEFAULT_GLOBAL_HUBS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_CONTENT_PAGES,
  type PlatformDivision,
  type NewsPostItem,
  type GlobalHubItem,
} from "./default-data";

export interface ParsedPlatform {
  id: string;
  name: string;
  slug: string;
  division_code: string;
  category: string;
  icon_name: string;
  short_description: string;
  full_description: string;
  logo: string | null;
  features: string[];
  key_metrics: Array<{ label: string; value: string }>;
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

export interface ParsedNewsPost {
  id: string;
  title: string;
  slug: string;
  category: "Press Release" | "IR & Governance" | "Technology" | "Global Notice";
  summary: string;
  content: string;
  thumbnail_url: string | null;
  is_featured: boolean;
  publication_status: string;
  published_at: Date;
  author_name: string;
  seo_title: string | null;
  seo_description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ParsedGlobalHub {
  id: string;
  region: "APAC" | "North America" | "Europe" | "MENA" | "Global";
  city: string;
  country: string;
  hub_type: "Global HQ" | "Regional Hub" | "R&D Center" | "Cloud Node";
  description: string;
  address: string | null;
  contact_email: string | null;
  status: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export function parsePlatformRecord(record: {
  id: string;
  name: string;
  slug: string;
  division_code?: string | null;
  category: string;
  icon_name?: string | null;
  short_description: string;
  full_description: string;
  logo: string | null;
  features: string;
  key_metrics?: string | null;
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

  let parsedMetrics: Array<{ label: string; value: string }> = [];
  try {
    if (record.key_metrics) {
      const raw = JSON.parse(record.key_metrics);
      if (Array.isArray(raw)) {
        parsedMetrics = raw.map((m) => ({
          label: String(m.label || ""),
          value: String(m.value || ""),
        }));
      }
    }
  } catch {
    parsedMetrics = [];
  }

  return {
    ...record,
    division_code: record.division_code || "",
    icon_name: record.icon_name || "Layers",
    features: parsedFeatures,
    key_metrics: parsedMetrics,
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

export async function getPublishedNewsPosts(limit?: number): Promise<ParsedNewsPost[]> {
  const db = getPrisma();
  if (!db) {
    const list = DEFAULT_NEWS_POSTS.map((p, idx) => ({
      ...p,
      id: `default-${idx}`,
      thumbnail_url: p.thumbnail_url || null,
      seo_title: p.seo_title || null,
      seo_description: p.seo_description || null,
      published_at: new Date(p.published_at),
      created_at: new Date(p.published_at),
      updated_at: new Date(p.published_at),
    }));
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }

  try {
    const rows = await db.newsPost.findMany({
      where: { publication_status: "Published" },
      orderBy: [{ published_at: "desc" }],
      take: limit,
    });
    if (rows.length === 0) {
      const list = DEFAULT_NEWS_POSTS.map((p, idx) => ({
        ...p,
        id: `default-${idx}`,
        thumbnail_url: p.thumbnail_url || null,
        seo_title: p.seo_title || null,
        seo_description: p.seo_description || null,
        published_at: new Date(p.published_at),
        created_at: new Date(p.published_at),
        updated_at: new Date(p.published_at),
      }));
      return typeof limit === "number" ? list.slice(0, limit) : list;
    }
    return rows as ParsedNewsPost[];
  } catch {
    const list = DEFAULT_NEWS_POSTS.map((p, idx) => ({
      ...p,
      id: `default-${idx}`,
      thumbnail_url: p.thumbnail_url || null,
      seo_title: p.seo_title || null,
      seo_description: p.seo_description || null,
      published_at: new Date(p.published_at),
      created_at: new Date(p.published_at),
      updated_at: new Date(p.published_at),
    }));
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }
}

export async function getPublishedNewsPostBySlug(slug: string): Promise<ParsedNewsPost | null> {
  const db = getPrisma();
  if (!db) {
    const found = DEFAULT_NEWS_POSTS.find((p) => p.slug === slug);
    if (!found) return null;
    return {
      ...found,
      id: `default-${found.slug}`,
      thumbnail_url: found.thumbnail_url || null,
      seo_title: found.seo_title || null,
      seo_description: found.seo_description || null,
      published_at: new Date(found.published_at),
      created_at: new Date(found.published_at),
      updated_at: new Date(found.published_at),
    };
  }

  try {
    const row = await db.newsPost.findFirst({
      where: { slug, publication_status: "Published" },
    });
    if (!row) {
      const found = DEFAULT_NEWS_POSTS.find((p) => p.slug === slug);
      if (!found) return null;
      return {
        ...found,
        id: `default-${found.slug}`,
        thumbnail_url: found.thumbnail_url || null,
        seo_title: found.seo_title || null,
        seo_description: found.seo_description || null,
        published_at: new Date(found.published_at),
        created_at: new Date(found.published_at),
        updated_at: new Date(found.published_at),
      };
    }
    return row as ParsedNewsPost;
  } catch {
    const found = DEFAULT_NEWS_POSTS.find((p) => p.slug === slug);
    if (!found) return null;
    return {
      ...found,
      id: `default-${found.slug}`,
      thumbnail_url: found.thumbnail_url || null,
      seo_title: found.seo_title || null,
      seo_description: found.seo_description || null,
      published_at: new Date(found.published_at),
      created_at: new Date(found.published_at),
      updated_at: new Date(found.published_at),
    };
  }
}

export async function getActiveGlobalHubs(): Promise<ParsedGlobalHub[]> {
  const db = getPrisma();
  if (!db) {
    return DEFAULT_GLOBAL_HUBS.map((h, idx) => ({
      ...h,
      id: `default-${idx}`,
      address: h.address || null,
      contact_email: h.contact_email || null,
      created_at: new Date(),
      updated_at: new Date(),
    }));
  }

  try {
    const rows = await db.globalHub.findMany({
      where: { status: "Active" },
      orderBy: [{ display_order: "asc" }, { city: "asc" }],
    });
    if (rows.length === 0) {
      return DEFAULT_GLOBAL_HUBS.map((h, idx) => ({
        ...h,
        id: `default-${idx}`,
        address: h.address || null,
        contact_email: h.contact_email || null,
        created_at: new Date(),
        updated_at: new Date(),
      }));
    }
    return rows as ParsedGlobalHub[];
  } catch {
    return DEFAULT_GLOBAL_HUBS.map((h, idx) => ({
      ...h,
      id: `default-${idx}`,
      address: h.address || null,
      contact_email: h.contact_email || null,
      created_at: new Date(),
      updated_at: new Date(),
    }));
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
  if (lower.includes("infra") || lower.includes("cloud") || lower.includes("network")) {
    return "Core Infrastructure";
  }
  if (lower.includes("ai") || lower.includes("data") || lower.includes("intelligence")) {
    return "AI & Big Data";
  }
  if (lower.includes("b2b") || lower.includes("mesh") || lower.includes("api")) {
    return "B2B Platform & API";
  }
  if (lower.includes("fintech") || lower.includes("trust") || lower.includes("security") || lower.includes("cyber")) {
    return "FinTech & Cybersecurity";
  }
  if (lower.includes("studio") || lower.includes("ecosystem") || lower.includes("incubation") || lower.includes("scale")) {
    return "Platform Incubation";
  }
  if (lower.includes("esg") || lower.includes("sustainable") || lower.includes("governance")) {
    return "ESG & Governance";
  }
  return "All Divisions";
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

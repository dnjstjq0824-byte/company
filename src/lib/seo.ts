export const DEFAULT_SITE_URL = "https://bookingnetwork.com";

/**
 * Single source of truth for the site base URL.
 * Precedence (used by layout, sitemap, robots, and page metadata):
 * CMS setting `website_domain` > NEXT_PUBLIC_SITE_URL > default corporate domain.
 */
export function siteBaseUrl(settings: Record<string, string>): string {
  return (
    settings.website_domain ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_SITE_URL
  ).replace(/\/$/, "");
}

export function absoluteUrl(settings: Record<string, string>, path: string): string {
  return `${siteBaseUrl(settings)}${path.startsWith("/") ? path : `/${path}`}`;
}

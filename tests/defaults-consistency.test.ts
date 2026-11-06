import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CONTENT_PAGES,
  DEFAULT_NEWS_POSTS,
  DEFAULT_PLATFORMS,
  DEFAULT_SITE_SETTINGS,
} from "../src/lib/default-data";

const UNIFIED_PLATFORM_STATUSES = [
  "Core Architecture",
  "Live",
  "Expanding",
  "R&D Phase",
  "Coming Soon",
  "In Development",
  "Temporarily Unavailable",
];

const VALID_NEWS_CATEGORIES = [
  "Press Release",
  "IR & Governance",
  "Technology",
  "Global Notice",
];

describe("default-data consistency", () => {
  it("exposes every site-setting key the portal reads", () => {
    const required = [
      "company_name",
      "company_name_kr",
      "tagline",
      "tagline_kr",
      "brand_positioning",
      "brand_positioning_kr",
      "corporate_email",
      "ir_email",
      "pr_email",
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
      "default_locale",
      "global_announcement_enabled",
      "global_announcement_text",
      "global_announcement_link",
    ];
    for (const key of required) {
      assert.ok(
        typeof DEFAULT_SITE_SETTINGS[key] === "string",
        `missing site setting: ${key}`
      );
    }
  });

  it("points the default favicon at a shipped asset", () => {
    assert.notEqual(DEFAULT_SITE_SETTINGS.favicon, "/favicon.ico");
    assert.ok(DEFAULT_SITE_SETTINGS.favicon.startsWith("/"));
  });

  it("keeps default platform statuses inside the unified set", () => {
    assert.ok(DEFAULT_PLATFORMS.length > 0);
    const slugs = new Set<string>();
    for (const platform of DEFAULT_PLATFORMS) {
      assert.ok(
        UNIFIED_PLATFORM_STATUSES.includes(platform.platform_status),
        `status ${platform.platform_status} is outside the unified set`
      );
      assert.ok(platform.slug.length > 0);
      assert.ok(!slugs.has(platform.slug), `duplicate slug: ${platform.slug}`);
      slugs.add(platform.slug);
    }
  });

  it("keeps default news categories valid with unique slugs", () => {
    assert.ok(DEFAULT_NEWS_POSTS.length > 0);
    const slugs = new Set<string>();
    for (const post of DEFAULT_NEWS_POSTS) {
      assert.ok(
        VALID_NEWS_CATEGORIES.includes(post.category),
        `invalid category: ${post.category}`
      );
      assert.ok(!slugs.has(post.slug), `duplicate slug: ${post.slug}`);
      slugs.add(post.slug);
      assert.ok(!Number.isNaN(new Date(post.published_at).getTime()));
    }
  });

  it("provides every CMS-managed content page", () => {
    for (const slug of ["home", "about", "privacy", "terms"]) {
      assert.ok(DEFAULT_CONTENT_PAGES[slug], `missing content page: ${slug}`);
    }
  });
});

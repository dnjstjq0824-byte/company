import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isVerifiedExternalUrl,
  mapCategoryToFilterGroup,
  parsePlatformRecord,
} from "../src/lib/data";

describe("mapCategoryToFilterGroup", () => {
  it("maps known categories to filter groups", () => {
    assert.equal(mapCategoryToFilterGroup("Core Infrastructure"), "Core Infrastructure");
    assert.equal(mapCategoryToFilterGroup("AI & Big Data"), "AI & Big Data");
    assert.equal(mapCategoryToFilterGroup("B2B Platform & API"), "B2B Platform & API");
    assert.equal(mapCategoryToFilterGroup("FinTech & Cybersecurity"), "FinTech & Cybersecurity");
    assert.equal(mapCategoryToFilterGroup("Platform Incubation & Scale"), "Platform Incubation");
    assert.equal(mapCategoryToFilterGroup("ESG & Governance"), "ESG & Governance");
  });

  it("falls back to All Divisions for unknown categories", () => {
    assert.equal(mapCategoryToFilterGroup("Quantum Widgets"), "All Divisions");
    assert.equal(mapCategoryToFilterGroup(""), "All Divisions");
  });
});

describe("isVerifiedExternalUrl", () => {
  it("accepts http(s) URLs only for Live divisions", () => {
    assert.equal(isVerifiedExternalUrl("https://example.com", "Live"), true);
    assert.equal(isVerifiedExternalUrl("http://example.com", "Live"), true);
    assert.equal(isVerifiedExternalUrl("https://example.com", "Core Architecture"), false);
    assert.equal(isVerifiedExternalUrl("https://example.com", "Expanding"), false);
  });

  it("rejects empty, blank, and malformed URLs", () => {
    assert.equal(isVerifiedExternalUrl(null, "Live"), false);
    assert.equal(isVerifiedExternalUrl(undefined, "Live"), false);
    assert.equal(isVerifiedExternalUrl("   ", "Live"), false);
    assert.equal(isVerifiedExternalUrl("not-a-url", "Live"), false);
    assert.equal(isVerifiedExternalUrl("ftp://example.com", "Live"), false);
    assert.equal(isVerifiedExternalUrl("javascript:alert(1)", "Live"), false);
  });
});

describe("parsePlatformRecord", () => {
  const base = {
    id: "id-1",
    name: "Test Division",
    slug: "test-division",
    category: "Core Infrastructure",
    short_description: "short",
    full_description: "full",
    logo: null,
    features: "[]",
    target_audience: "everyone",
    business_purpose: "purpose",
    website_url: null,
    platform_status: "Live",
    publication_status: "Published",
    display_order: 1,
    seo_title: null,
    seo_description: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  it("parses JSON feature arrays", () => {
    const parsed = parsePlatformRecord({
      ...base,
      features: JSON.stringify(["a", "b"]),
      key_metrics: JSON.stringify([{ label: "SLA", value: "99.9%" }]),
    });
    assert.deepEqual(parsed.features, ["a", "b"]);
    assert.deepEqual(parsed.key_metrics, [{ label: "SLA", value: "99.9%" }]);
  });

  it("falls back to newline splitting for legacy feature text", () => {
    const parsed = parsePlatformRecord({ ...base, features: "one\ntwo\n" });
    assert.deepEqual(parsed.features, ["one", "two"]);
  });

  it("defaults missing icon and tolerates malformed metrics", () => {
    const parsed = parsePlatformRecord({
      ...base,
      icon_name: null,
      division_code: null,
      key_metrics: "{broken",
    });
    assert.equal(parsed.icon_name, "Layers");
    assert.equal(parsed.division_code, "");
    assert.deepEqual(parsed.key_metrics, []);
  });
});

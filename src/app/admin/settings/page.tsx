"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Loader2, CheckCircle2, Globe, Bell, Shield, Layers } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateKey = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleFileUpload = async (
    key: "brand_logo" | "favicon",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(key);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        updateKey(key, data.url);
        setFeedback(`Uploaded ${key === "brand_logo" ? "Brand Logo" : "Favicon"} asset.`);
      }
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings(data.settings);
        setFeedback(
          "Corporate settings successfully saved and published across the global portal."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-electric-400" />
        Loading Corporate Settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Corporate Settings & Global Brand Governance
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure Booking Network Global Group's corporate nomenclature, internationalization defaults, announcement banners, and regulatory communications.
        </p>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm sm:p-8"
      >
        {/* 1. Brand Identity */}
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-400 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            1. Global Brand Identity & Monogram
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Official English Group Name *
              </label>
              <input
                type="text"
                required
                value={settings.company_name || "Booking Network Global Group"}
                onChange={(e) => updateKey("company_name", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Official Korean Group Name
              </label>
              <input
                type="text"
                value={settings.company_name_kr || "부킹네트워크글로벌그룹 (Booking Network Global Group)"}
                onChange={(e) => updateKey("company_name_kr", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Global Tagline (English)
              </label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) => updateKey("tagline", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Global Tagline (Korean)
              </label>
              <input
                type="text"
                value={settings.tagline_kr || ""}
                onChange={(e) => updateKey("tagline_kr", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-200">
              Institutional Brand Positioning
            </label>
            <textarea
              rows={2}
              value={settings.brand_positioning || ""}
              onChange={(e) => updateKey("brand_positioning", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Brand Logo Path
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="text"
                  value={settings.brand_logo || "/logos/booking-network.svg"}
                  onChange={(e) => updateKey("brand_logo", e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white focus:border-electric-500 focus:outline-none"
                />
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingKey === "brand_logo" ? "..." : "Upload"}
                  <input
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg,.webp"
                    onChange={(e) => handleFileUpload("brand_logo", e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200">
                Favicon Path
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="text"
                  value={settings.favicon || "/favicon.ico"}
                  onChange={(e) => updateKey("favicon", e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white focus:border-electric-500 focus:outline-none"
                />
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingKey === "favicon" ? "..." : "Upload"}
                  <input
                    type="file"
                    accept=".ico,.svg,.png"
                    onChange={(e) => handleFileUpload("favicon", e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Global Portal Features: Locale & Announcement Bar */}
        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-400 flex items-center gap-2">
            <Globe className="h-3.5 w-3.5" />
            2. Language & Global Announcement Bar
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Default Portal Language
              </label>
              <select
                value={settings.default_locale || "en"}
                onChange={(e) => updateKey("default_locale", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              >
                <option value="en">English (Global Default)</option>
                <option value="ko">한국어 (Korean)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Top Announcement Bar Status
              </label>
              <select
                value={settings.announcement_bar_enabled || "true"}
                onChange={(e) => updateKey("announcement_bar_enabled", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              >
                <option value="true">Enabled (Visible at top of site)</option>
                <option value="false">Disabled (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Announcement Headline / Notice Text
              </label>
              <input
                type="text"
                value={settings.announcement_bar_text || ""}
                onChange={(e) => updateKey("announcement_bar_text", e.target.value)}
                placeholder="e.g. Booking Network Global Group Strategic Vision 2026..."
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Announcement Link Target
              </label>
              <input
                type="text"
                value={settings.announcement_bar_link || ""}
                onChange={(e) => updateKey("announcement_bar_link", e.target.value)}
                placeholder="/newsroom/... or https://..."
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Corporate Contact Channels */}
        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-400">
            3. Corporate Communications & Inquiries
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-200">
                General Corporate Email
              </label>
              <input
                type="email"
                value={settings.corporate_email || "contact@bookingnetwork.com"}
                onChange={(e) => updateKey("corporate_email", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200">
                Inquiry Dispatch Notification Email
              </label>
              <input
                type="email"
                value={settings.contact_notification_email || ""}
                onChange={(e) => updateKey("contact_notification_email", e.target.value)}
                placeholder="admin@bookingnetwork.com"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200">
                Telephone Hotline
              </label>
              <input
                type="text"
                value={settings.telephone || "+82 2-555-0199"}
                onChange={(e) => updateKey("telephone", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-200">
              Corporate Headquarters Address
            </label>
            <input
              type="text"
              value={settings.business_address || "Teheran-ro, Gangnam-gu, Seoul, Republic of Korea"}
              onChange={(e) => updateKey("business_address", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 4. Domain & Social Links */}
        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric-400">
            4. Domain, Legal Copyright & Institutional Social Links
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-200">
                Canonical Base URL
              </label>
              <input
                type="url"
                value={settings.website_domain || "https://bookingnetwork.com"}
                onChange={(e) => updateKey("website_domain", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.footer_copyright || `© ${new Date().getFullYear()} Booking Network Global Group. All rights reserved.`}
                onChange={(e) => updateKey("footer_copyright", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200">
                LinkedIn Company URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/company/bookingnetwork"
                value={settings.social_linkedin || ""}
                onChange={(e) => updateKey("social_linkedin", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200">
                GitHub Organization URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/bookingnetwork"
                value={settings.social_github || ""}
                onChange={(e) => updateKey("social_github", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-electric-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-800 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-600/30 hover:bg-electric-500 disabled:opacity-60 transition-all"
          >
            <Save className="h-4 w-4" />
            {saving ? "Publishing Settings..." : "Save & Publish Corporate Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

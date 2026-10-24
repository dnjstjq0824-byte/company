"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Loader2, CheckCircle2 } from "lucide-react";

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
          "Corporate settings saved and published across the public portal."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading Corporate Settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          Corporate Settings & Identity Configuration
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure official corporate identity, contact information, social
          media channels, default SEO metadata, and brand assets. Unconfigured
          contact fields remain cleanly hidden on the public website.
        </p>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900 sm:p-8"
      >
        {/* 1. Corporate Identity */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-electric-600 dark:text-electric-400">
            1. Corporate Identity & Brand Assets
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Company Display Name
              </label>
              <input
                type="text"
                value={settings.company_name || ""}
                onChange={(e) => updateKey("company_name", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Corporate Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) => updateKey("tagline", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
              Brand Positioning Statement
            </label>
            <textarea
              rows={2}
              value={settings.brand_positioning || ""}
              onChange={(e) => updateKey("brand_positioning", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Brand Logo Path
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="text"
                  value={settings.brand_logo || ""}
                  onChange={(e) => updateKey("brand_logo", e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:bg-navy-800">
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
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Favicon Path
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="text"
                  value={settings.favicon || ""}
                  onChange={(e) => updateKey("favicon", e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
                />
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:bg-navy-800">
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

        {/* 2. Verified Corporate Contact Details */}
        <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-electric-600 dark:text-electric-400">
            2. Verified Corporate Contact Details (Leave blank to hide on public
            pages)
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Official Corporate Email
              </label>
              <input
                type="email"
                placeholder="Not yet configured"
                value={settings.corporate_email || ""}
                onChange={(e) => updateKey("corporate_email", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Contact Inquiry Notification Recipient Email
              </label>
              <input
                type="email"
                placeholder="Defaults to administrator email"
                value={settings.contact_notification_email || ""}
                onChange={(e) =>
                  updateKey("contact_notification_email", e.target.value)
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Telephone Number
              </label>
              <input
                type="text"
                placeholder="Not yet configured"
                value={settings.telephone || ""}
                onChange={(e) => updateKey("telephone", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Operating Hours
              </label>
              <input
                type="text"
                placeholder="e.g., Monday – Friday, 09:00 – 18:00 UTC"
                value={settings.operating_hours || ""}
                onChange={(e) => updateKey("operating_hours", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Business Address
              </label>
              <input
                type="text"
                placeholder="Not yet configured"
                value={settings.business_address || ""}
                onChange={(e) => updateKey("business_address", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
          </div>
        </div>

        {/* 3. Domain, SEO & Social Links */}
        <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-electric-600 dark:text-electric-400">
            3. Domain, Default SEO & Social Media Links
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Official Website Domain (Canonical Base URL)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={settings.website_domain || ""}
                onChange={(e) => updateKey("website_domain", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.footer_copyright || ""}
                onChange={(e) => updateKey("footer_copyright", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Default SEO Title
              </label>
              <input
                type="text"
                value={settings.default_seo_title || ""}
                onChange={(e) => updateKey("default_seo_title", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Default SEO Description
              </label>
              <input
                type="text"
                value={settings.default_seo_description || ""}
                onChange={(e) =>
                  updateKey("default_seo_description", e.target.value)
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                LinkedIn URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/company/..."
                value={settings.social_linkedin || ""}
                onChange={(e) => updateKey("social_linkedin", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                X (Twitter) URL
              </label>
              <input
                type="url"
                placeholder="https://x.com/..."
                value={settings.social_x || ""}
                onChange={(e) => updateKey("social_x", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                YouTube URL
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/..."
                value={settings.social_youtube || ""}
                onChange={(e) => updateKey("social_youtube", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                GitHub URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={settings.social_github || ""}
                onChange={(e) => updateKey("social_github", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-navy-950"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-electric-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-electric-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving Settings..." : "Save Corporate Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}


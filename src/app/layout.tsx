import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getAllSiteSettings, getPublishedPlatforms } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSiteSettings();
  const companyName = settings.company_name || "Booking Network Global Group";
  const title =
    settings.default_seo_title ||
    `${companyName} — Official Global IT Platform Group Portal`;
  const description =
    settings.default_seo_description ||
    "Official corporate portal of Booking Network Global Group — architecting the global digital backbone across cloud infrastructure, AI intelligence, B2B network mesh, and fintech trust architecture.";

  const baseUrl = (
    settings.website_domain ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://bookingnetwork.com"
  ).replace(/\/$/, "");

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${companyName}`,
    },
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      siteName: companyName,
      title,
      description,
      url: baseUrl,
      images: [
        {
          url: settings.brand_logo || "/logos/booking-network.svg",
          width: 512,
          height: 512,
          alt: companyName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: settings.favicon || "/logos/booking-network.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, platforms] = await Promise.all([
    getAllSiteSettings(),
    getPublishedPlatforms(),
  ]);

  const companyName = settings.company_name || "Booking Network Global Group";
  const baseUrl = (
    settings.website_domain ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://bookingnetwork.com"
  ).replace(/\/$/, "");

  const socialUrls = [
    settings.social_linkedin,
    settings.social_x,
    settings.social_youtube,
    settings.social_github,
  ]
    .map((s) => s?.trim())
    .filter(Boolean);

  const organizationSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    alternateName: "부킹네트워크글로벌그룹",
    url: baseUrl,
    logo: `${baseUrl}${settings.brand_logo || "/logos/booking-network.svg"}`,
    description:
      settings.brand_positioning ||
      "Booking Network Global Group is a premier global IT platform group that architects, governs, and scales enterprise-grade digital infrastructure, intelligent network ecosystems, and cross-border platform technologies across global markets.",
  };

  if (settings.corporate_email?.trim()) {
    organizationSchema.email = settings.corporate_email.trim();
  }
  if (settings.telephone?.trim()) {
    organizationSchema.telephone = settings.telephone.trim();
  }
  if (socialUrls.length > 0) {
    organizationSchema.sameAs = socialUrls;
  }

  const announcement = {
    enabled: settings.global_announcement_enabled === "true",
    text: settings.global_announcement_text || "",
    link: settings.global_announcement_link || "/newsroom",
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-sans bg-white dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-cobalt-600 selection:text-white transition-colors duration-200">
        <LanguageProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-cobalt-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
          >
            Skip to main content
          </a>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />

          <Header
            companyName={companyName}
            brandLogo={settings.brand_logo}
            platforms={platforms}
            announcement={announcement}
          />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer settings={settings} platforms={platforms} />

          <CookieBanner
            enabled={settings.cookie_consent_enabled !== "false"}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}

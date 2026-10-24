import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getAllSiteSettings, getPublishedPlatforms } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

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
  const companyName = settings.company_name || "Booking Network Co., Ltd.";
  const title =
    settings.default_seo_title ||
    `${companyName} | Global Digital Platform Ecosystem`;
  const description =
    settings.default_seo_description ||
    "Official corporate portal of Booking Network Co., Ltd. — building a global ecosystem of digital platforms across commerce, travel, search, financial information, knowledge, video, and communication.";

  const baseUrl = (
    settings.website_domain ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
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

  const companyName = settings.company_name || "Booking Network Co., Ltd.";
  const baseUrl = (
    settings.website_domain ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
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
    url: baseUrl,
    logo: `${baseUrl}${settings.brand_logo || "/logos/booking-network.svg"}`,
    description:
      settings.brand_positioning ||
      "A global digital technology company developing and connecting platforms that empower commerce, travel, information discovery, financial market exploration, content sharing, and communication.",
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

  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-electric-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
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
        />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer settings={settings} platforms={platforms} />

        <CookieBanner
          enabled={settings.cookie_consent_enabled !== "false"}
        />
      </body>
    </html>
  );
}


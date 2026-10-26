import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendInquiryNotificationEmail } from "@/lib/email";
import { getAllSiteSettings } from "@/lib/data";

const ALLOWED_INQUIRY_TYPES = [
  "Strategic Partnership",
  "Investor Relations (IR)",
  "Media & Press",
  "Enterprise Technology & API",
  "Global Careers",
  "General Corporate Inquiry",
  // Backwards compatibility:
  "General Inquiry",
  "Business Partnership",
  "Platform Collaboration",
  "Advertising & Marketing",
  "Technical / Website Issue",
  "Other",
];

function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local-client";

    const rate = checkRateLimit(`contact:${ip}`, 8, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Too many submissions from your connection. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    // Honeypot anti-spam check
    if (body.website_honeypot && String(body.website_honeypot).trim() !== "") {
      return NextResponse.json({
        success: true,
        message:
          "Thank you for contacting Booking Network Global Group. Your message has been received.",
      });
    }

    const full_name = sanitizeText(body.full_name, 120);
    const email = sanitizeText(body.email, 160).toLowerCase();
    const company = sanitizeText(body.company, 150);
    const department = sanitizeText(body.department, 80) || "Global Partnership";
    const inquiry_type = sanitizeText(body.inquiry_type, 80);
    const priority = sanitizeText(body.priority, 40) || "Normal";
    const subject = sanitizeText(body.subject, 200);
    const message = sanitizeText(body.message, 5000);
    const privacy_consent = Boolean(body.privacy_consent);

    const fieldErrors: Record<string, string> = {};

    if (!full_name || full_name.length < 2) {
      fieldErrors.full_name = "Please enter your full name (at least 2 characters).";
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      fieldErrors.email = "Please enter a valid email address.";
    }
    if (!ALLOWED_INQUIRY_TYPES.includes(inquiry_type)) {
      fieldErrors.inquiry_type = "Please select a valid inquiry type.";
    }
    if (!subject || subject.length < 3) {
      fieldErrors.subject = "Please enter a subject (at least 3 characters).";
    }
    if (!message || message.length < 10) {
      fieldErrors.message = "Please enter a detailed message (at least 10 characters).";
    }
    if (!privacy_consent) {
      fieldErrors.privacy_consent =
        "You must consent to the Privacy Policy before submitting an inquiry.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          error: "Please correct the highlighted fields and try again.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const consentRecord = JSON.stringify({
      consented: true,
      timestamp: new Date().toISOString(),
      policy_version: "2026-10-v2-bngg",
      ip_snippet: ip.slice(0, 16),
      user_agent: request.headers.get("user-agent")?.slice(0, 150) || "",
    });

    let savedId = "demo-" + Date.now();
    if (prisma) {
      const created = await prisma.contactInquiry.create({
        data: {
          full_name,
          email,
          company: company || null,
          department,
          inquiry_type,
          priority: ["Low", "Normal", "High", "Urgent"].includes(priority) ? priority : "Normal",
          subject,
          message,
          status: "New",
          privacy_consent_record: consentRecord,
        },
      });
      savedId = created.id;
    }

    // Attempt email notification asynchronously
    try {
      const settings = await getAllSiteSettings();
      const notificationRecipient =
        settings.contact_notification_email?.trim() ||
        settings.corporate_email?.trim() ||
        process.env.NOTIFICATION_EMAIL ||
        "";

      await sendInquiryNotificationEmail(
        {
          id: savedId,
          full_name,
          email,
          company,
          inquiry_type,
          subject,
          message,
          created_at: new Date(),
        },
        notificationRecipient
      );
    } catch {
      // Non-blocking email error
    }

    return NextResponse.json({
      success: true,
      id: savedId,
      message:
        "Thank you for contacting Booking Network Global Group. Your inquiry has been logged and routed to our team.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        error:
          "An unexpected server error occurred. Please try again or reach our team via corporate email.",
      },
      { status: 500 }
    );
  }
}

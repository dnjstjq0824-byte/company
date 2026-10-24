import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendInquiryNotificationEmail } from "@/lib/email";
import { getAllSiteSettings } from "@/lib/data";

const ALLOWED_INQUIRY_TYPES = [
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
      // Silently succeed for bots without storing spam
      return NextResponse.json({
        success: true,
        message:
          "Thank you for contacting Booking Network Co., Ltd. Your message has been received. Our team will review your inquiry.",
      });
    }

    const full_name = sanitizeText(body.full_name, 120);
    const email = sanitizeText(body.email, 160).toLowerCase();
    const company = sanitizeText(body.company, 150);
    const inquiry_type = sanitizeText(body.inquiry_type, 80);
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

    // Duplicate submission protection within 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const recentDuplicate = await prisma.contactInquiry.findFirst({
      where: {
        email,
        subject,
        message,
        created_at: { gte: twoMinutesAgo },
      },
    });

    if (recentDuplicate) {
      return NextResponse.json(
        {
          error:
            "This exact inquiry was just received moments ago. Our team has your message on file.",
        },
        { status: 409 }
      );
    }

    const consentRecord = JSON.stringify({
      consented: true,
      timestamp: new Date().toISOString(),
      policy_version: "October 2026",
      statement:
        "I consent to Booking Network Co., Ltd. collecting and processing my submitted information to respond to this inquiry in accordance with the Privacy Policy.",
    });

    const created = await prisma.contactInquiry.create({
      data: {
        full_name,
        email,
        company: company || null,
        inquiry_type,
        subject,
        message,
        status: "New",
        privacy_consent_record: consentRecord,
      },
    });

    // Trigger notification email asynchronously or safely without exposing credentials
    const settings = await getAllSiteSettings();
    const notificationRecipient =
      settings.contact_notification_email || settings.corporate_email || "";

    await sendInquiryNotificationEmail(created, notificationRecipient);

    return NextResponse.json(
      {
        success: true,
        id: created.id,
        created_at: created.created_at,
        message:
          "Thank you for contacting Booking Network Co., Ltd. Your message has been received. Our team will review your inquiry.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      {
        error:
          "An unexpected server error occurred while processing your inquiry. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}


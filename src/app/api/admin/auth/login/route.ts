import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession, logAdminActivity } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local-client";

    const rateKey = `admin-login:${ip}`;
    const rate = checkRateLimit(rateKey, 6, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid login request." },
        { status: 400 }
      );
    }

    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Administrator email and password are required." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin || !admin.is_active) {
      return NextResponse.json(
        { error: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, admin.password_hash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    resetRateLimit(rateKey);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { last_login_at: new Date() },
    });

    await createAdminSession({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await logAdminActivity(
      admin.id,
      "ADMIN_LOGIN",
      `Administrator signed in (${admin.email})`
    );

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Authentication service error." },
      { status: 500 }
    );
  }
}


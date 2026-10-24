import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE_NAME = "bn_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecretKey(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    "bn_fallback_dev_secret_do_not_use_in_prod_9876543210";
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function signAdminToken(payload: {
  id: string;
  email: string;
  role: string;
}): Promise<string> {
  return new SignJWT({
    sub: payload.id,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecretKey());
}

export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub || !payload.email) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      role: String(payload.role || "Administrator"),
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export async function createAdminSession(admin: {
  id: string;
  email: string;
  role: string;
}) {
  const token = await signAdminToken(admin);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyAdminToken(token);
  if (!payload) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      role: true,
      is_active: true,
      last_login_at: true,
      created_at: true,
    },
  });

  if (!admin || !admin.is_active) return null;
  return admin;
}

export async function logAdminActivity(
  adminId: string,
  action: string,
  target: string
) {
  try {
    await prisma.adminActivityLog.create({
      data: {
        admin_id: adminId,
        action,
        target,
      },
    });
  } catch (err) {
    console.error("Failed to record admin activity:", err);
  }
}

export const ADMIN_COOKIE_NAME = SESSION_COOKIE_NAME;


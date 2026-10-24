import { NextResponse } from "next/server";
import {
  destroyAdminSession,
  getAuthenticatedAdmin,
  logAdminActivity,
} from "@/lib/auth";

export async function POST() {
  const admin = await getAuthenticatedAdmin();
  if (admin) {
    await logAdminActivity(
      admin.id,
      "ADMIN_LOGOUT",
      `Administrator signed out (${admin.email})`
    );
  }
  await destroyAdminSession();
  return NextResponse.json({ success: true });
}


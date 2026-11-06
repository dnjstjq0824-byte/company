import { NextResponse } from "next/server";
import { APP_VERSION, COMMIT_SHA, BUILD_TIMESTAMP } from "@/lib/version";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let database: "connected" | "unreachable" | "unconfigured" = "unconfigured";
  const db = getPrisma();
  if (db) {
    try {
      await db.$queryRaw`SELECT 1`;
      database = "connected";
    } catch {
      database = "unreachable";
    }
  }

  return NextResponse.json({
    group: "Booking Network Global Group",
    version: APP_VERSION,
    commit: COMMIT_SHA,
    buildTime: BUILD_TIMESTAMP,
    environment: process.env.NODE_ENV || "production",
    edgeRuntime: "cloudflare-workers",
    status: database === "unreachable" ? "degraded" : "operational",
    database,
  });
}


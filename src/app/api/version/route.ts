import { NextResponse } from "next/server";
import { APP_VERSION, COMMIT_SHA, BUILD_TIMESTAMP } from "@/lib/version";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    group: "Booking Network Global Group",
    version: APP_VERSION,
    commit: COMMIT_SHA,
    buildTime: BUILD_TIMESTAMP,
    environment: process.env.NODE_ENV || "production",
    edgeRuntime: "cloudflare-workers",
    status: "operational",
  });
}


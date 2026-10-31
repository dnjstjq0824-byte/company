import type { NextConfig } from "next";
import { execSync } from "child_process";

function resolveCommitSha(): string {
  const envSha =
    process.env.CF_PAGES_COMMIT_SHA ||
    process.env.WORKERS_CI_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.COMMIT_SHA;
  if (envSha && envSha.trim().length >= 7) {
    return envSha.trim().slice(0, 7);
  }
  try {
    const gitSha = execSync("git rev-parse HEAD").toString().trim();
    if (gitSha && gitSha.length >= 7) {
      return gitSha.slice(0, 7);
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}

const commitSha = resolveCommitSha();
const buildTimestamp = new Date().toISOString();

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_APP_VERSION: "1.0.1",
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
    NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
  },
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-App-Version", value: `1.0.1-${commitSha}` },
          { key: "X-Commit-Hash", value: commitSha },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;

export const APP_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION || "1.0.1";

export const COMMIT_SHA =
  process.env.NEXT_PUBLIC_COMMIT_SHA ||
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ||
  process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 7) ||
  process.env.GITHUB_SHA?.slice(0, 7) ||
  process.env.COMMIT_SHA?.slice(0, 7) ||
  "unknown";

export const BUILD_TIMESTAMP =
  process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || "unknown";

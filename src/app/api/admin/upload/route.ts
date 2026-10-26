import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

function sanitizeSvgContent(svgText: string): string {
  return svgText
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript\s*:/gi, "");
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No valid file provided." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size must be between 1 byte and 2 MB." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_MIME_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Allowed formats: PNG, JPG, WEBP, SVG, ICO.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    // Perform binary signature / content security verification
    if (ext === ".png") {
      const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
      if (buffer.subarray(0, 4).compare(pngMagic) !== 0) {
        return NextResponse.json(
          { error: "File content does not match a valid PNG image." },
          { status: 400 }
        );
      }
    } else if (ext === ".jpg") {
      if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
        return NextResponse.json(
          { error: "File content does not match a valid JPEG image." },
          { status: 400 }
        );
      }
    } else if (ext === ".svg") {
      const rawText = buffer.toString("utf8");
      if (!rawText.includes("<svg")) {
        return NextResponse.json(
          { error: "Invalid SVG file structure." },
          { status: 400 }
        );
      }
      const cleanSvg = sanitizeSvgContent(rawText);
      buffer = Buffer.from(cleanSvg, "utf8");
    }

    let publicUrl: string;

    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const safeBaseName = file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 32);

      const uniqueName = `${safeBaseName || "asset"}-${crypto
        .randomBytes(4)
        .toString("hex")}${ext}`;
      const targetPath = path.join(uploadsDir, uniqueName);

      await fs.writeFile(targetPath, buffer);
      publicUrl = `/uploads/${uniqueName}`;
    } catch (fsErr) {
      // Serverless or read-only filesystem fallback: return base64 data URL
      console.warn("Filesystem write unavailable, using inline Data URL fallback:", fsErr);
      publicUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    await logAdminActivity(
      admin.id,
      "UPLOAD_ASSET",
      `Uploaded asset ${publicUrl.startsWith("data:") ? "[Inline Base64 Asset]" : publicUrl}`,
      {
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
      }
    );

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file upload." },
      { status: 500 }
    );
  }
}

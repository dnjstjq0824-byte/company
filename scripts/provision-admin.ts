import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function provision() {
  const args = process.argv.slice(2);
  const emailArg = args.find((a) => a.startsWith("--email="))?.split("=")[1];
  const passwordArg = args
    .find((a) => a.startsWith("--password="))
    ?.split("=")[1];
  const roleArg =
    args.find((a) => a.startsWith("--role="))?.split("=")[1] || "Super Admin";

  const email = (
    emailArg ||
    process.env.INITIAL_ADMIN_EMAIL ||
    "admin@bookingnetwork.co"
  )
    .trim()
    .toLowerCase();

  const rawPassword =
    passwordArg && passwordArg.trim().length >= 10
      ? passwordArg.trim()
      : process.env.INITIAL_ADMIN_PASSWORD &&
        process.env.INITIAL_ADMIN_PASSWORD.trim().length >= 10
      ? process.env.INITIAL_ADMIN_PASSWORD.trim()
      : `BN-${crypto.randomBytes(9).toString("base64url")}!9a`;

  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password_hash: passwordHash,
      role: roleArg,
      is_active: true,
    },
    create: {
      email,
      password_hash: passwordHash,
      role: roleArg,
      is_active: true,
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      admin_id: admin.id,
      action: "PROVISION_OR_ROTATE_ADMIN",
      target: `Provisioned/rotated credentials for ${email}`,
    },
  });

  const credPath = path.join(process.cwd(), ".admin-credentials.local.txt");
  fs.writeFileSync(
    credPath,
    [
      "============================================================",
      "BOOKING NETWORK CO., LTD. — ADMIN CREDENTIALS",
      "============================================================",
      `Updated At   : ${new Date().toISOString()}`,
      `Login URL    : /admin/login`,
      `Admin Email  : ${email}`,
      `Password     : ${rawPassword}`,
      `Role         : ${roleArg}`,
      "============================================================",
      "IMPORTANT: This file is excluded from git (.gitignore).",
      "",
    ].join("\n"),
    { encoding: "utf8", mode: 0o600 }
  );

  console.log(`✔ Admin account '${email}' provisioned/updated.`);
  console.log(`✔ Credentials written to .admin-credentials.local.txt`);
}

provision()
  .catch((e) => {
    console.error("Failed to provision admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


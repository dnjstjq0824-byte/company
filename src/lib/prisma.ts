import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | null = null;

export function getPrisma(): PrismaClient | null {
  if (typeof process === "undefined" || !process.env.DATABASE_URL) {
    return null;
  }
  if (!prismaInstance) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
    }
    prismaInstance = globalForPrisma.prisma;
  }
  return prismaInstance;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    if (!client) {
      throw new Error("DATABASE_URL is not configured.");
    }
    const val = (client as unknown as Record<string, unknown>)[prop as string];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});

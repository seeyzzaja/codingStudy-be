import "dotenv/config";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import prisma from "#utils/prisma";

const adminName = process.env.ADMIN_NAME || "Super Admin";
const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

export async function seedAdmin() {
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail,
    },

    update: {
      name: adminName,
      password: hashedPassword,
      role: UserRole.ADMIN,
      deletedAt: null,
    },

    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log("Admin berhasil dibuat");

  return admin;
}
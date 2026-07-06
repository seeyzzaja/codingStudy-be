import "dotenv/config";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import prisma from "#utils/prisma";

const adminName = process.env.ADMIN_NAME || "Super Admin";
const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

async function seedAdmin() {
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
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

  console.log("Admin seed berhasil dijalankan.");
  console.log(`Email: ${admin.email}`);
  console.log(`Role: ${admin.role}`);
}

seedAdmin()
  .catch((error) => {
    console.error("Gagal menjalankan admin seed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "#utils/prisma";

const adminName = process.env.ADMIN_NAME || "Super Admin";
const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

export async function seedAdmin() {
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminRole = await prisma.role.findUnique({
    where: {
      name: "ADMIN",
    },
  });

  if (!adminRole) {
    throw new Error(
      "Role ADMIN tidak ditemukan. Jalankan seedRole terlebih dahulu."
    );
  }

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail,
    },

    update: {
      name: adminName,
      password: hashedPassword,
      deletedAt: null,
      isVerified: true,
      onboardingCompleted: true,
      role: {
        connect: {
          id: adminRole.id,
        },
      },
    },

    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      isVerified: true,
      onboardingCompleted: true,
      role: {
        connect: {
          id: adminRole.id,
        },
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
      onboardingCompleted: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  console.log("✅ Admin berhasil dibuat");

  return admin;
}
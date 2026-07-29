import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "#utils/prisma";

const mentorPassword =
  process.env.MENTOR_PASSWORD || "mentor12345";

const mentorName = process.env.MENTOR_NAME ||"Mentor Backend";
const mentorEmail = process.env.MENTOR_EMAIL || "mentor@example.com";

export async function seedMentor() {
  const hashedPassword = await bcrypt.hash(
    mentorPassword,
    10
  );

  // Cari role MENTOR
  const mentorRole = await prisma.role.findUnique({
    where: {
      name: "MENTOR",
    },
  });

  if (!mentorRole) {
    throw new Error(
      "Role MENTOR tidak ditemukan. Jalankan seedRole terlebih dahulu."
    );
  }

  const mentor = await prisma.user.upsert({
    where: {
      email: mentorEmail,
    },

    update: {
      name: mentorName,
      password: hashedPassword,
      isVerified: true,
      onboardingCompleted: true,
      deletedAt: null,
      role: {
        connect: {
          id: mentorRole.id,
        },
      },
    },

    create: {
      name: mentorName,
      email: mentorEmail,
      password: hashedPassword,
      isVerified: true,
      onboardingCompleted: true,
      role: {
        connect: {
          id: mentorRole.id,
        },
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  console.log("✅ Mentor berhasil dibuat");

  return mentor;
}
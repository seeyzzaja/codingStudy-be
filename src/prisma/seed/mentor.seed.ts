import "dotenv/config";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import prisma from "#utils/prisma";

const mentorPassword =
  process.env.MENTOR_PASSWORD || "mentor12345";

export async function seedMentor() {
  const hashedPassword = await bcrypt.hash(
    mentorPassword,
    10
  );

  const mentor = await prisma.user.upsert({
    where: {
      name: "Mentor Backend",
      email: "mentor@example.com",
    },

    update: {
      name: "Mentor Backend",
      password: hashedPassword,
      role: UserRole.MENTOR,
      deletedAt: null,
    },

    create: {
      name: "Mentor Backend",
      email: "mentor@example.com",
      password: hashedPassword,
      role: UserRole.MENTOR,
    },
  });

  console.log("Mentor berhasil dibuat");

  return mentor;
}
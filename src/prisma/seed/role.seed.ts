import prisma from "#utils/prisma";

export async function seedRole() {
  console.log("🌱 Seeding Roles...");

  await prisma.role.createMany({
    data: [
      {
        name: "ADMIN",
        description: "Administrator",
      },
      {
        name: "MENTOR",
        description: "Mentor yang mengelola course",
      },
      {
        name: "STUDENT",
        description: "Pengguna biasa",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Roles berhasil dibuat");
}
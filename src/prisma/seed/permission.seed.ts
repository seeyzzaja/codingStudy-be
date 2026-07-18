import prisma from "#prisma";

export async function seedPermission() {
  const permissions = [
    {
      name: "user.read",
      description: "Melihat daftar user",
    },
    {
      name: "user.create",
      description: "Membuat user",
    },
    {
      name: "user.update",
      description: "Mengubah user",
    },
    {
      name: "user.delete",
      description: "Menghapus user",
    },
    {
      name: "course.read",
      description: "Melihat course",
    },
    {
      name: "course.create",
      description: "Membuat course",
    },
    {
      name: "course.update",
      description: "Mengubah course",
    },
    {
      name: "course.delete",
      description: "Menghapus course",
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        name: permission.name,
      },
      update: permission,
      create: permission,
    });
  }

  console.log("Permission berhasil dibuat");
}
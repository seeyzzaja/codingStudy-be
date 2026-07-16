import prisma from "#prisma";

export async function seedRolePermission() {
  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany();

  const roleMap = roles.reduce<Record<string, number>>((acc, role) => {
    acc[role.name] = role.id;
    return acc;
  }, {});

  const permissionMap = permissions.reduce<Record<string, number>>(
    (acc, permission) => {
      acc[permission.name] = permission.id;
      return acc;
    },
    {}
  );

  const rolePermissions: Record<string, string[]> = {
    ADMIN: [
      "user.read",
      "user.create",
      "user.update",
      "user.delete",
      "course.read",
      "course.create",
      "course.update",
      "course.delete",
    ],

    MENTOR: [
      "course.read",
      "course.create",
      "course.update",
      "course.delete",
    ],

    STUDENT: ["course.read"],
  };

  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const roleId = roleMap[roleName];

    if (roleId === undefined) {
      throw new Error(`Role "${roleName}" tidak ditemukan`);
    }

    for (const permissionName of permissionNames) {
      const permissionId = permissionMap[permissionName];

      if (permissionId === undefined) {
        throw new Error(`Permission "${permissionName}" tidak ditemukan`);
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
    }
  }

  console.log("✅ Role Permission berhasil dibuat");
}
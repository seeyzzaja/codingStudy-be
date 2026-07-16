import prisma from "#utils/prisma";

import { seedAdmin } from "./admin.seed.js";
import { seedMentor } from "./mentor.seed.js";
import { seedCategory } from "./category.seed.js";
import { seedClass } from "./class.seed.js";
import { seedRole } from "./role.seed.js";
import { seedPermission } from "./permission.seed.js";
import { seedRolePermission } from "./role-permission.seed.js";

async function main() {
  console.log("Menjalankan Seeder...");
  await seedRole();

  await seedPermission();

  await seedRolePermission();

  await seedAdmin();

  await seedMentor();

  await seedCategory();

  await seedClass();

  

  console.log("Semua Seeder berhasil dijalankan");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

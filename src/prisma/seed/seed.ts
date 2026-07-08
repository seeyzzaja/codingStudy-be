import prisma from "#utils/prisma";

import { seedAdmin } from "./admin.seed";
import { seedMentor } from "./mentor.seed";
import { seedCategory } from "./category.seed";
import { seedClass } from "./class.seed";

async function main() {

  console.log("Menjalankan Seeder...");


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
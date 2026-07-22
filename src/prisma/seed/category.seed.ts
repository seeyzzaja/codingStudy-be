import prisma from "#utils/prisma";

const categories = [
  {
    name: "Backend",
    description: "Belajar Backend Development",
  },
  {
    name: "Frontend",
    description: "Belajar Frontend Development",
  },
  {
    name: "Mobile",
    description: "Belajar Mobile Development",
  },
];

export async function seedCategory() {
  const result = [];

  for (const category of categories) {
    const data = await prisma.category.upsert({
      where: {
        name: category.name,
      },

      update: {
        description: category.description,
        deletedAt: null,
      },

      create: category,
    });

    result.push(data);
  }

  console.log("Category berhasil dibuat");

  return result;
}
import { Prisma, ClassStatus } from "@prisma/client";
import prisma from "#utils/prisma";

export async function seedClass() {
  const mentor = await prisma.user.findFirst({
    where: {
      role: {
        name: "MENTOR",
      },
      deletedAt: null,
    },
  });

  if (!mentor) {
    throw new Error("Mentor tidak ditemukan. Jalankan mentor.seed terlebih dahulu.");
  }

  const backend = await prisma.category.findUnique({
    where: {
      name: "Backend",
    },
  });

  const frontend = await prisma.category.findUnique({
    where: {
      name: "Frontend",
    },
  });

  const mobile = await prisma.category.findUnique({
    where: {
      name: "Mobile",
    },
  });

  if (!backend || !frontend || !mobile) {
    throw new Error(
      "Category belum tersedia. Jalankan category.seed terlebih dahulu."
    );
  }

  const classes = [
    {
      title: "Node.js Fundamental",
      description: "Belajar Node.js dari dasar.",
      price: new Prisma.Decimal(150000),
      categoryId: backend.id,
    },
    {
      title: "React Fundamental",
      description: "Belajar React dari dasar.",
      price: new Prisma.Decimal(200000),
      categoryId: frontend.id,
    },
    {
      title: "Flutter Basic",
      description: "Belajar Flutter dari dasar.",
      price: new Prisma.Decimal(180000),
      categoryId: mobile.id,
    },
  ];

  for (const item of classes) {
    const existingClass = await prisma.class.findFirst({
      where: {
        title: item.title,
      },
    });

    if (existingClass) {
      console.log(`Class "${item.title}" sudah ada.`);
      continue;
    }

    await prisma.class.create({
      data: {
        mentorId: mentor.id,
        categoryId: item.categoryId,

        title: item.title,
        description: item.description,

        price: item.price,
        thumbnailUrl: null,

        status: ClassStatus.PUBLISHED,
      },
    });

    console.log(` Class "${item.title}" berhasil dibuat.`);
  }

  console.log("Seeder Class selesai.");
}
import type { ClassStatus, Prisma } from "@prisma/client";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";

const courseSelect = {
  id: true,
  mentorId: true,
  title: true,
  description: true,
  price: true,
  thumbnailUrl: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  mentor: {
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
  },
} satisfies Prisma.ClassSelect;

type CourseRecord = Prisma.ClassGetPayload<{
  select: typeof courseSelect;
}>;

type AuthUser = {
  id: number;
  role?: string;
};

export type CreateCourseInput = {
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  status?: ClassStatus;
};

export type UpdateCourseInput = Partial<CreateCourseInput> & {
  thumbnailUrl?: string | null;
};

export type ListCoursesQuery = {
  search?: string;
  status?: ClassStatus;
  mentorId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "updatedAt" | "price" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

const activeCourseWhere = {
  deletedAt: null,
} satisfies Prisma.ClassWhereInput;

const serializeCourse = (course: CourseRecord) => ({
  ...course,
  price: course.price.toString(),
});

const ensureCourseManagePermission = (
  course: CourseRecord,
  authUser: AuthUser
) => {
  if (!authUser.role) {
    throw new AppError("Role user tidak ditemukan", 403);
  }

  if (authUser.role === "MENTOR" && course.mentorId === authUser.id) {
    return;
  }

  throw new AppError("Anda tidak memiliki akses ke course ini", 403);
};

const resolveMentorId = (authUser: AuthUser) => {
  if (!authUser.role) {
    throw new AppError("Role user tidak ditemukan", 403);
  }

  if (authUser.role === "MENTOR") {
    return authUser.id;
  }

  throw new AppError(
    "Hanya mentor yang bisa mengelola course",
    403
  );
};

const buildCourseFilters = (
  query: ListCoursesQuery
): Prisma.ClassWhereInput => {
  const filters: Prisma.ClassWhereInput[] = [activeCourseWhere];

  if (query.search) {
    filters.push({
      OR: [
        {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.status) {
    filters.push({ status: query.status });
  }

  if (query.mentorId) {
    filters.push({ mentorId: query.mentorId });
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filters.push({
      price: {
        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
      },
    });
  }

  return {
    AND: filters,
  };
};

const courseService = {
  async create(data: CreateCourseInput, authUser: AuthUser) {
    const mentorId =resolveMentorId(authUser);

    return serializeCourse(
      await prisma.class.create({
        data: {
          mentorId,
          title: data.title,
          description: data.description,
          price: data.price,
          ...(data.thumbnailUrl ? { thumbnailUrl: data.thumbnailUrl } : {}),
          ...(data.status ? { status: data.status } : {}),
        },
        select: courseSelect,
      })
    );
  },

  async findAll(query: ListCoursesQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      throw new AppError("minPrice tidak boleh lebih besar dari maxPrice", 400);
    }

    const where = buildCourseFilters(query);
    const orderBy = {
      [query.sortBy ?? "createdAt"]: query.sortOrder ?? "desc",
    } satisfies Prisma.ClassOrderByWithRelationInput;

    const [items, total] = await prisma.$transaction([
      prisma.class.findMany({
        where,
        select: courseSelect,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.class.count({ where }),
    ]);

    return {
      data: items.map(serializeCourse),
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  },

  async findById(id: string) {
    const course = await prisma.class.findFirst({
      where: {
        id,
        ...activeCourseWhere,
      },
      select: courseSelect,
    });

    if (!course) {
      throw new AppError("Course tidak ditemukan", 404);
    }

    return serializeCourse(course);
  },

  async update(id: string, data: UpdateCourseInput, authUser: AuthUser) {
    const course = await prisma.class.findFirst({
      where: {
        id,
        ...activeCourseWhere,
      },
      select: courseSelect,
    });

    if (!course) {
      throw new AppError("Course tidak ditemukan", 404);
    }

    ensureCourseManagePermission(course, authUser);

    const updateData: Prisma.ClassUpdateInput = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.thumbnailUrl !== undefined
        ? { thumbnailUrl: data.thumbnailUrl }
        : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    };

    return serializeCourse(
      await prisma.class.update({
        where: { id },
        data: updateData,
        select: courseSelect,
      })
    );
  },

  async softDelete(id: string, authUser: AuthUser) {
    const course = await prisma.class.findFirst({
      where: {
        id,
        ...activeCourseWhere,
      },
      select: courseSelect,
    });

    if (!course) {
      throw new AppError("Course tidak ditemukan", 404);
    }

    ensureCourseManagePermission(course, authUser);

    await prisma.class.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};

export default courseService;

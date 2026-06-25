-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "judul" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "harga" DECIMAL(12,2) NOT NULL,
    "thumbnail_url" TEXT,
    "status" "ClassStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "classes_mentor_id_idx" ON "classes"("mentor_id");

-- CreateIndex
CREATE INDEX "classes_status_idx" ON "classes"("status");

-- CreateIndex
CREATE INDEX "classes_deleted_at_idx" ON "classes"("deleted_at");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

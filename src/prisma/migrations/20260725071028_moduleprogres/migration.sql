-- AlterTable
ALTER TABLE "modules" ADD COLUMN     "durationSeconds" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "module_progress" (
    "id" UUID NOT NULL,
    "userId" INTEGER NOT NULL,
    "moduleId" UUID NOT NULL,
    "watchedSeconds" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "module_progress_userId_idx" ON "module_progress"("userId");

-- CreateIndex
CREATE INDEX "module_progress_moduleId_idx" ON "module_progress"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "module_progress_userId_moduleId_key" ON "module_progress"("userId", "moduleId");

-- AddForeignKey
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

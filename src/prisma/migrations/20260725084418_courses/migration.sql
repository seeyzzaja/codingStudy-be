-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_category_id_fkey";

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

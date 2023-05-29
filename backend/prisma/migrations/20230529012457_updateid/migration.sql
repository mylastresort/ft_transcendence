/*
  Warnings:

  - Changed the type of `id_42` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "id_42",
ADD COLUMN     "id_42" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_id_42_key" ON "users"("id_42");

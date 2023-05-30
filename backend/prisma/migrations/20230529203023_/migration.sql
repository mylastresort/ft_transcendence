/*
  Warnings:

  - You are about to drop the column `is2fa` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is2fa",
ADD COLUMN     "twoFactorAuth" BOOLEAN DEFAULT false;

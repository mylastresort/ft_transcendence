/*
  Warnings:

  - You are about to drop the column `friendId` on the `Friend` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendId_fkey";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "friendId";

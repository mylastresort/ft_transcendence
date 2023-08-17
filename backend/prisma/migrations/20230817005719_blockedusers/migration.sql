/*
  Warnings:

  - You are about to drop the column `blocked` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the `_BlockedBy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlockedBy" DROP CONSTRAINT "_BlockedBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlockedBy" DROP CONSTRAINT "_BlockedBy_B_fkey";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "blocked";

-- DropTable
DROP TABLE "_BlockedBy";

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "blockedUserId" INTEGER NOT NULL,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

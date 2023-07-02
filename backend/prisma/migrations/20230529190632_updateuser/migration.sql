-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "imgProfile" TEXT,
ADD COLUMN     "lastName" TEXT,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_42" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_42_key" ON "users"("id_42");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

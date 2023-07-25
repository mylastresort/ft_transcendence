-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "gameid" TEXT,
ADD COLUMN     "receiverId" INTEGER,
ADD COLUMN     "senderId" INTEGER;

-- CreateTable
CREATE TABLE "Achievement" (
    "description" TEXT,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "lastPlayed" TIMESTAMP(3) NOT NULL,
    "level" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Room" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "games" INTEGER NOT NULL DEFAULT 0,
    "hostId" INTEGER NOT NULL,
    "id" TEXT NOT NULL,
    "isInvite" BOOLEAN NOT NULL DEFAULT false,
    "loserUserId" INTEGER,
    "map" TEXT NOT NULL,
    "maxGames" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "startedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "winnerPostLevel" DOUBLE PRECISION,
    "winnerUserId" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AchievementToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PlayerRooms" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_name_key" ON "Achievement"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_AchievementToPlayer_AB_unique" ON "_AchievementToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_AchievementToPlayer_B_index" ON "_AchievementToPlayer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerRooms_AB_unique" ON "_PlayerRooms"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerRooms_B_index" ON "_PlayerRooms"("B");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_loserUserId_fkey" FOREIGN KEY ("loserUserId") REFERENCES "Player"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_winnerUserId_fkey" FOREIGN KEY ("winnerUserId") REFERENCES "Player"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementToPlayer" ADD CONSTRAINT "_AchievementToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementToPlayer" ADD CONSTRAINT "_AchievementToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerRooms" ADD CONSTRAINT "_PlayerRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerRooms" ADD CONSTRAINT "_PlayerRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

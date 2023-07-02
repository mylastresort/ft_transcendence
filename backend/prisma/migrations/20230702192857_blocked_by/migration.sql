-- CreateTable
CREATE TABLE "_BlockedBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlockedBy_AB_unique" ON "_BlockedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockedBy_B_index" ON "_BlockedBy"("B");

-- AddForeignKey
ALTER TABLE "_BlockedBy" ADD CONSTRAINT "_BlockedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Friend"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedBy" ADD CONSTRAINT "_BlockedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

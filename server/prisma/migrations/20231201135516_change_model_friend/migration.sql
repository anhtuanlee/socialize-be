/*
  Warnings:

  - You are about to drop the `FriendRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_senderId_fkey";

-- DropTable
DROP TABLE "FriendRequest";

-- DropEnum
DROP TYPE "FriendshipStatus";

-- CreateTable
CREATE TABLE "_Receiver" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Receiver_AB_unique" ON "_Receiver"("A", "B");

-- CreateIndex
CREATE INDEX "_Receiver_B_index" ON "_Receiver"("B");

-- AddForeignKey
ALTER TABLE "_Receiver" ADD CONSTRAINT "_Receiver_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Receiver" ADD CONSTRAINT "_Receiver_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

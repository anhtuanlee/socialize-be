/*
  Warnings:

  - The required column `id` was added to the `FriendOfUser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "FriendOfUser_user_name_friend_name_key";

-- AlterTable
ALTER TABLE "FriendOfUser" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "FriendOfUser_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "FriendOfUser_user_name_friend_name_idx" ON "FriendOfUser"("user_name", "friend_name");

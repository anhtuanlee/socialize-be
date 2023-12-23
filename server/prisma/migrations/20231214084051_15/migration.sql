/*
  Warnings:

  - You are about to drop the `_friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusSelf" AS ENUM ('SELF', 'FRIEND', 'PENDING', 'STRANGER');

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_B_fkey";

-- DropTable
DROP TABLE "_friends";

-- CreateTable
CREATE TABLE "FriendOfUser" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "friend_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "relation_ship" "RelationshipStatus" NOT NULL DEFAULT 'FRIEND',

    CONSTRAINT "FriendOfUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FriendOfUser_user_name_friend_name_idx" ON "FriendOfUser"("user_name", "friend_name");

-- CreateIndex
CREATE UNIQUE INDEX "FriendOfUser_user_name_friend_name_key" ON "FriendOfUser"("user_name", "friend_name");

-- AddForeignKey
ALTER TABLE "FriendOfUser" ADD CONSTRAINT "FriendOfUser_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendOfUser" ADD CONSTRAINT "FriendOfUser_friend_name_fkey" FOREIGN KEY ("friend_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

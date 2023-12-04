/*
  Warnings:

  - The primary key for the `FriendOfUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_name,friend_name]` on the table `FriendOfUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FriendOfUser" DROP CONSTRAINT "FriendOfUser_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "FriendOfUser_user_name_friend_name_key" ON "FriendOfUser"("user_name", "friend_name");

/*
  Warnings:

  - You are about to drop the `Friendship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_friend_name_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user_name_fkey";

-- DropTable
DROP TABLE "Friendship";

-- CreateTable
CREATE TABLE "FriendOfUser" (
    "user_name" TEXT NOT NULL,
    "friend_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "relation_ship" "RelationshipStatus" NOT NULL DEFAULT 'FRIEND',

    CONSTRAINT "FriendOfUser_pkey" PRIMARY KEY ("user_name","friend_name")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" TEXT NOT NULL,
    "friend_name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Friend_friend_name_key" ON "Friend"("friend_name");

-- AddForeignKey
ALTER TABLE "FriendOfUser" ADD CONSTRAINT "FriendOfUser_friend_name_fkey" FOREIGN KEY ("friend_name") REFERENCES "Friend"("friend_name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendOfUser" ADD CONSTRAINT "FriendOfUser_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE CASCADE ON UPDATE CASCADE;

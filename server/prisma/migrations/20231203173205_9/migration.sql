/*
  Warnings:

  - You are about to drop the `_friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_B_fkey";

-- DropTable
DROP TABLE "_friends";

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "friend_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "relation_ship" "RelationshipStatus" NOT NULL DEFAULT 'FRIEND',

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_user_name_key" ON "Friendship"("user_name");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend_name_fkey" FOREIGN KEY ("friend_name") REFERENCES "User"("user_name") ON DELETE CASCADE ON UPDATE CASCADE;

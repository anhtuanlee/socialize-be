/*
  Warnings:

  - You are about to drop the column `friend_name` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `relationship` on the `Friend` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friend_name_fkey";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "friend_name",
DROP COLUMN "relationship";

-- CreateTable
CREATE TABLE "Friendship" (
    "friend_name" TEXT NOT NULL,
    "relationship" "RelationshipStatus" NOT NULL DEFAULT 'STRANGER',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("friend_name")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend_name_fkey" FOREIGN KEY ("friend_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

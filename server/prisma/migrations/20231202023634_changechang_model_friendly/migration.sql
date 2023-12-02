/*
  Warnings:

  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Receiver` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TypeStatusInvite" AS ENUM ('PENDING', 'ACCEPT', 'REJECT');

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_user_name_fkey";

-- DropForeignKey
ALTER TABLE "_Receiver" DROP CONSTRAINT "_Receiver_A_fkey";

-- DropForeignKey
ALTER TABLE "_Receiver" DROP CONSTRAINT "_Receiver_B_fkey";

-- DropTable
DROP TABLE "Friend";

-- DropTable
DROP TABLE "_Receiver";

-- CreateTable
CREATE TABLE "Friendly" (
    "user_name" TEXT NOT NULL,
    "invite_friend_status" "TypeStatusInvite" NOT NULL DEFAULT 'PENDING',
    "relationship" "RelationshipStatus" NOT NULL DEFAULT 'FRIEND'
);

-- CreateIndex
CREATE UNIQUE INDEX "Friendly_user_name_key" ON "Friendly"("user_name");

-- AddForeignKey
ALTER TABLE "Friendly" ADD CONSTRAINT "Friendly_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

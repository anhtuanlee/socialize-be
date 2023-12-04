/*
  Warnings:

  - The primary key for the `Friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `Friend` table. All the data in the column will be lost.
  - Added the required column `invited_name` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invition_name` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_user_name_fkey";

-- AlterTable
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_pkey",
DROP COLUMN "id",
DROP COLUMN "userId",
DROP COLUMN "user_name",
ADD COLUMN     "invited_name" TEXT NOT NULL,
ADD COLUMN     "invition_name" TEXT NOT NULL,
ADD CONSTRAINT "Friend_pkey" PRIMARY KEY ("invition_name", "invited_name");

-- CreateTable
CREATE TABLE "_UserFriends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFriends_AB_unique" ON "_UserFriends"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFriends_B_index" ON "_UserFriends"("B");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_invition_name_fkey" FOREIGN KEY ("invition_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_invited_name_fkey" FOREIGN KEY ("invited_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

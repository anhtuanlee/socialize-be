/*
  Warnings:

  - You are about to drop the column `userId` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `View` table. All the data in the column will be lost.
  - Added the required column `userName` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_userId_fkey";

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "View" DROP COLUMN "userId",
ALTER COLUMN "userName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
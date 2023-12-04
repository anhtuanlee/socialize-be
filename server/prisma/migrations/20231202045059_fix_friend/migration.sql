/*
  Warnings:

  - The required column `id` was added to the `Friend` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Friend_user_name_key";

-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Friend_pkey" PRIMARY KEY ("id");

/*
  Warnings:

  - Added the required column `user_name` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "user_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "user_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "user_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "View" ADD COLUMN     "user_name" TEXT NOT NULL;

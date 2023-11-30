/*
  Warnings:

  - Added the required column `userName` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "View" ADD COLUMN     "userName" TEXT NOT NULL;

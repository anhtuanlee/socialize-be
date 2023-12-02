/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name,email,phone]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name,email,phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_user_name_email_fkey";

-- DropIndex
DROP INDEX "Auth_user_name_email_key";

-- DropIndex
DROP INDEX "User_user_name_email_key";

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "phone" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_phone_key" ON "Auth"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_user_name_email_phone_key" ON "Auth"("user_name", "email", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_email_phone_key" ON "User"("user_name", "email", "phone");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_user_name_email_phone_fkey" FOREIGN KEY ("user_name", "email", "phone") REFERENCES "User"("user_name", "email", "phone") ON DELETE CASCADE ON UPDATE CASCADE;

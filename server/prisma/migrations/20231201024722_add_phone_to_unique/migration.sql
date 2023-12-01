/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName,email,phone]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName,email,phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_userName_email_fkey";

-- DropIndex
DROP INDEX "Auth_userName_email_key";

-- DropIndex
DROP INDEX "User_userName_email_key";

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "phone" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_phone_key" ON "Auth"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userName_email_phone_key" ON "Auth"("userName", "email", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_email_phone_key" ON "User"("userName", "email", "phone");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userName_email_phone_fkey" FOREIGN KEY ("userName", "email", "phone") REFERENCES "User"("userName", "email", "phone") ON DELETE CASCADE ON UPDATE CASCADE;

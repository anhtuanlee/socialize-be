/*
  Warnings:

  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bithday` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'MANAGER');

-- CreateEnum
CREATE TYPE "TypeAuth" AS ENUM ('JWT', 'EMAIl');

-- CreateEnum
CREATE TYPE "TypeGender" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullName",
ADD COLUMN     "bithday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "TypeGender" NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userName_key" ON "Auth"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userName_email_key" ON "Auth"("userName", "email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_email_key" ON "User"("userName", "email");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userName_email_fkey" FOREIGN KEY ("userName", "email") REFERENCES "User"("userName", "email") ON DELETE RESTRICT ON UPDATE CASCADE;

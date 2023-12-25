-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_user_name_email_phone_fkey";

-- AlterTable
ALTER TABLE "Auth" ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_user_name_email_phone_fkey" FOREIGN KEY ("user_name", "email", "phone") REFERENCES "User"("user_name", "email", "phone") ON DELETE CASCADE ON UPDATE CASCADE;

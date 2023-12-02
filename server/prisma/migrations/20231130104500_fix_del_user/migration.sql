-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_user_name_email_fkey";

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_user_name_email_fkey" FOREIGN KEY ("user_name", "email") REFERENCES "User"("user_name", "email") ON DELETE CASCADE ON UPDATE CASCADE;

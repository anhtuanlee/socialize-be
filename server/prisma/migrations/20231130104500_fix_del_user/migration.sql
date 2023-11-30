-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_userName_email_fkey";

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userName_email_fkey" FOREIGN KEY ("userName", "email") REFERENCES "User"("userName", "email") ON DELETE CASCADE ON UPDATE CASCADE;

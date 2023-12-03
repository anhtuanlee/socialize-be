-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friend_name_fkey";

-- AlterTable
ALTER TABLE "Friend" ALTER COLUMN "friend_name" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friend_name_fkey" FOREIGN KEY ("friend_name") REFERENCES "User"("user_name") ON DELETE SET NULL ON UPDATE CASCADE;

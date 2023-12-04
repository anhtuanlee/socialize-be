-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_friend_name_fkey";

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend_name_fkey" FOREIGN KEY ("friend_name") REFERENCES "User"("user_name") ON DELETE CASCADE ON UPDATE CASCADE;

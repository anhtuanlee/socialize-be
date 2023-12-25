-- DropForeignKey
ALTER TABLE "FriendOfUser" DROP CONSTRAINT "FriendOfUser_friend_name_fkey";

-- DropForeignKey
ALTER TABLE "FriendOfUser" DROP CONSTRAINT "FriendOfUser_user_name_fkey";

-- AddForeignKey
ALTER TABLE "FriendOfUser" ADD CONSTRAINT "FriendOfUser_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendOfUser" ADD CONSTRAINT "FriendOfUser_friend_name_fkey" FOREIGN KEY ("friend_name") REFERENCES "User"("user_name") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - The values [REJECT,REVIEWING] on the enum `TypeStatusInvite` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_UserFriends` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `friend_name` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypeStatusInvite_new" AS ENUM ('PENDING', 'CANCELING', 'ACCEPT');
ALTER TABLE "Friend" ALTER COLUMN "invite_friend_status" DROP DEFAULT;
ALTER TABLE "Friend" ALTER COLUMN "invite_friend_status" TYPE "TypeStatusInvite_new" USING ("invite_friend_status"::text::"TypeStatusInvite_new");
ALTER TYPE "TypeStatusInvite" RENAME TO "TypeStatusInvite_old";
ALTER TYPE "TypeStatusInvite_new" RENAME TO "TypeStatusInvite";
DROP TYPE "TypeStatusInvite_old";
ALTER TABLE "Friend" ALTER COLUMN "invite_friend_status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "_UserFriends" DROP CONSTRAINT "_UserFriends_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFriends" DROP CONSTRAINT "_UserFriends_B_fkey";

-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "friend_name" TEXT NOT NULL,
ALTER COLUMN "relationship" DROP NOT NULL;

-- DropTable
DROP TABLE "_UserFriends";

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friend_name_fkey" FOREIGN KEY ("friend_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

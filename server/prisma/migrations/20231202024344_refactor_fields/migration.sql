/*
  Warnings:

  - You are about to drop the column `id_post` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the `Friendly` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `post_id` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_id_post_fkey";

-- DropForeignKey
ALTER TABLE "Friendly" DROP CONSTRAINT "Friendly_user_name_fkey";

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "id_post",
ADD COLUMN     "post_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Friendly";

-- CreateTable
CREATE TABLE "Friend" (
    "user_name" TEXT NOT NULL,
    "invite_friend_status" "TypeStatusInvite" NOT NULL DEFAULT 'PENDING',
    "relationship" "RelationshipStatus" NOT NULL DEFAULT 'FRIEND'
);

-- CreateIndex
CREATE UNIQUE INDEX "Friend_user_name_key" ON "Friend"("user_name");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

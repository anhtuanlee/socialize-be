/*
  Warnings:

  - The primary key for the `FriendRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Friendship` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `FriendRequest` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_pkey",
ADD COLUMN     "relation_ship" "RelationshipStatus" NOT NULL DEFAULT 'FRIEND',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Friendship_id_seq";

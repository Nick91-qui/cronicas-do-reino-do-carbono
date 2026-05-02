-- CreateEnum
CREATE TYPE "PlayerRole" AS ENUM ('player', 'operator');

-- AlterTable
ALTER TABLE "Player"
ADD COLUMN "role" "PlayerRole" NOT NULL DEFAULT 'player';

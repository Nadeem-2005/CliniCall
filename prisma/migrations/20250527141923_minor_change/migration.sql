/*
  Warnings:

  - You are about to drop the column `userId` on the `Hospital` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_userId_fkey";

-- DropIndex
DROP INDEX "Hospital_userId_key";

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "userId",
ADD COLUMN     "userID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_userID_key" ON "Hospital"("userID");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

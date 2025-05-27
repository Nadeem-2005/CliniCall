/*
  Warnings:

  - You are about to drop the column `userID` on the `Hospital` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_userID_fkey";

-- DropIndex
DROP INDEX "Hospital_userID_key";

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "userID",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_userId_key" ON "Hospital"("userId");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

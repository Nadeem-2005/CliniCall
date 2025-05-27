/*
  Warnings:

  - You are about to drop the column `days` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `timing` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `days_from` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `days_to` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timing_from` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timing_to` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "days",
DROP COLUMN "timing",
ADD COLUMN     "days_from" TEXT NOT NULL,
ADD COLUMN     "days_to" TEXT NOT NULL,
ADD COLUMN     "timing_from" TEXT NOT NULL,
ADD COLUMN     "timing_to" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "timing_from" TEXT NOT NULL,
    "timing_to" TEXT NOT NULL,
    "days_from" TEXT NOT NULL,
    "days_to" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_userID_key" ON "Hospital"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_email_key" ON "Hospital"("email");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

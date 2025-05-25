/*
  Warnings:

  - Added the required column `address` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;

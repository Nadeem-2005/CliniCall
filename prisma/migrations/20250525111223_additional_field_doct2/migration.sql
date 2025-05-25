/*
  Warnings:

  - Added the required column `days` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timing` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "days" TEXT NOT NULL,
ADD COLUMN     "timing" TEXT NOT NULL;

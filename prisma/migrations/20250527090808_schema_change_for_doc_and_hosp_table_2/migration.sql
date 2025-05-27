/*
  Warnings:

  - Added the required column `speciality` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "speciality" TEXT NOT NULL;

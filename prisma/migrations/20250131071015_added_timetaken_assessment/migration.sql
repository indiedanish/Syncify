/*
  Warnings:

  - Added the required column `timeTaken` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "timeTaken" INTEGER NOT NULL;

/*
  Warnings:

  - The `validation` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `validcheck` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "validation",
ADD COLUMN     "validation" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "validcheck" SET NOT NULL;

/*
  Warnings:

  - You are about to drop the `Stuff` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Skills" AS ENUM ('other', 'programming', 'scripting', 'applescript', 'arduino', 'assembly', 'batchfile', 'bootstrap', 'c', 'cpp', 'cryengine', 'csharp', 'css', 'fortran', 'gamemaker', 'godot', 'html', 'java', 'jsts', 'lisp', 'lumberyard', 'matlab', 'nextjs', 'pascal', 'perl', 'php', 'python', 'r', 'react', 'renpy', 'ruby', 'rust', 'scratch', 'sql', 'swift', 'torque', 'unity', 'unreal');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availability" INTEGER[],
ADD COLUMN     "contacts" INTEGER[],
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT 'Change',
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT 'Me',
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "skills" "Skills"[],
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Stuff";

-- DropEnum
DROP TYPE "Condition";

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descrip" TEXT NOT NULL,
    "positions" INTEGER[],
    "members" INTEGER[],
    "admins" INTEGER[],
    "duedate" TEXT NOT NULL,
    "skills" "Skills"[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descrip" TEXT NOT NULL,
    "skills" "Skills"[],
    "datestart" TEXT NOT NULL,
    "dateend" TEXT NOT NULL,
    "project" INTEGER NOT NULL,
    "member" INTEGER NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

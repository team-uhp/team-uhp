-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Skills" AS ENUM ('other', 'programming', 'scripting', 'AppleScript', 'Arduino', 'Assembly', 'Batch', 'Bootstrap', 'C', 'CPP', 'CryEngine', 'Csharp', 'CSS', 'FORTRAN', 'GameMaker', 'Godot', 'HTML', 'Java', 'JS', 'Lisp', 'Lumberyard', 'MATLAB', 'NextJS', 'Pascal', 'Perl', 'PHP', 'Python', 'R', 'React', 'RenPy', 'Ruby', 'Rust', 'Scratch', 'SQL', 'Swift', 'Torque', 'TS', 'Unity', 'Unreal', 'XML');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "skills" "Skills"[] DEFAULT ARRAY[]::"Skills"[],
    "availability" INTEGER[],
    "validation" BOOLEAN NOT NULL DEFAULT false,
    "validcheck" TEXT,
    "passchgcanx" TEXT,
    "validpasschg" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "title" TEXT NOT NULL,
    "descrip" TEXT NOT NULL,
    "duedate" TEXT NOT NULL,
    "skills" "Skills"[] DEFAULT ARRAY[]::"Skills"[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "title" TEXT NOT NULL,
    "descrip" TEXT NOT NULL,
    "skills" "Skills"[] DEFAULT ARRAY[]::"Skills"[],
    "datestart" TEXT NOT NULL,
    "dateend" TEXT NOT NULL,
    "projectId" INTEGER,
    "memberId" INTEGER,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "positionId" INTEGER,
    "application" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMembers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "role" TEXT,

    CONSTRAINT "ProjectMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserContacts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserContacts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjAdmins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProjAdmins_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PositAdmins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PositAdmins_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMembers_userId_projectId_key" ON "ProjectMembers"("userId", "projectId");

-- CreateIndex
CREATE INDEX "_UserContacts_B_index" ON "_UserContacts"("B");

-- CreateIndex
CREATE INDEX "_ProjAdmins_B_index" ON "_ProjAdmins"("B");

-- CreateIndex
CREATE INDEX "_PositAdmins_B_index" ON "_PositAdmins"("B");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "ProjectMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "ProjectMembers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserContacts" ADD CONSTRAINT "_UserContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserContacts" ADD CONSTRAINT "_UserContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjAdmins" ADD CONSTRAINT "_ProjAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjAdmins" ADD CONSTRAINT "_ProjAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PositAdmins" ADD CONSTRAINT "_PositAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PositAdmins" ADD CONSTRAINT "_PositAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

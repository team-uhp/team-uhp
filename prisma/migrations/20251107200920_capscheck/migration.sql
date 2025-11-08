/*
  Warnings:

  - The values [C++,C#] on the enum `Skills` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Skills_new" AS ENUM ('other', 'programming', 'scripting', 'AppleScript', 'Arduino', 'Assembly', 'Batch', 'Bootstrap', 'C', 'CPP', 'CryEngine', 'Csharp', 'CSS', 'FORTRAN', 'GameMaker', 'Godot', 'HTML', 'Java', 'JS', 'Lisp', 'Lumberyard', 'MATLAB', 'NextJS', 'Pascal', 'Perl', 'PHP', 'Python', 'R', 'React', 'RenPy', 'Ruby', 'Rust', 'Scratch', 'SQL', 'Swift', 'Torque', 'TS', 'Unity', 'Unreal', 'XML');
ALTER TABLE "Position" ALTER COLUMN "skills" DROP DEFAULT;
ALTER TABLE "Project" ALTER COLUMN "skills" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "skills" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "skills" TYPE "Skills_new"[] USING ("skills"::text::"Skills_new"[]);
ALTER TABLE "Project" ALTER COLUMN "skills" TYPE "Skills_new"[] USING ("skills"::text::"Skills_new"[]);
ALTER TABLE "Position" ALTER COLUMN "skills" TYPE "Skills_new"[] USING ("skills"::text::"Skills_new"[]);
ALTER TYPE "Skills" RENAME TO "Skills_old";
ALTER TYPE "Skills_new" RENAME TO "Skills";
DROP TYPE "Skills_old";
ALTER TABLE "Position" ALTER COLUMN "skills" SET DEFAULT ARRAY[]::"Skills"[];
ALTER TABLE "Project" ALTER COLUMN "skills" SET DEFAULT ARRAY[]::"Skills"[];
ALTER TABLE "User" ALTER COLUMN "skills" SET DEFAULT ARRAY[]::"Skills"[];
COMMIT;

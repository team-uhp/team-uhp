cat > prisma/migrations/20251209235738_add_saved_projects/migration.sql << 'EOF'
-- CreateTable
CREATE TABLE "_SavedProjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SavedProjects_AB_unique" ON "_SavedProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_SavedProjects_B_index" ON "_SavedProjects"("B");

-- AddForeignKey
ALTER TABLE "_SavedProjects" ADD CONSTRAINT "_SavedProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedProjects" ADD CONSTRAINT "_SavedProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EOF
import React from 'react';
import { getServerSession } from 'next-auth';
import { Container } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import ProjectListClient from './ProjectListClient';
import { Project, Position, Skills } from '@prisma/client';
import { PageIDs } from '@/utilities/ids';

const ProjectListPage = async () => {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string; skills: Skills[] };
    } | null,
  );

  type ProjectWithPositions = Project & { positions: Position[] };

  const projects = (await prisma.project.findMany({
    include: { positions: true },
  })) as ProjectWithPositions[];

  const sessionUser = session?.user as { id: string };
  const user = await prisma.user.findUnique({
    where: { id: Number(sessionUser.id) },
    select: { skills: true },
  });

  const userSkills: Skills[] = user?.skills || [];

  const sortedProjs = projects
    .map((project) => ({
      project,
      matches: project.skills.filter((s) => userSkills.includes(s)).length,
    }))
    .sort((a, b) => b.matches - a.matches);

  return (
    <Container id={PageIDs.projectsList} className="py-3">
      <ProjectListClient projects={sortedProjs} />
    </Container>
  );
};

export default ProjectListPage;

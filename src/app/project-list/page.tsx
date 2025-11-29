import React from 'react';
import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import ProjectCard from '@/components/ProjectCard';
import { PageIDs } from '@/utilities/ids';
import Link from 'next/link';
import { Project, Skills } from '@prisma/client';

/** Render a list of projects for the logged in user. */
const ProjectListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string, skills: Skills[] };
    } | null,
  );
  const projects = await prisma.project.findMany();

  const sessionUser = session?.user as { id: string };
  const user = await prisma.user.findUnique({
    where: { id: Number(sessionUser.id) },
    select: { skills: true },
  });
  const userSkills: Skills[] = user?.skills || [];

  const sortedProjs: Array<{ project: Project; matches: number }> = [];

  projects.forEach((project) => sortedProjs.push(
    { project,
      matches: project.skills.filter(skill => userSkills.includes(skill)).length,
    },
  ));

  sortedProjs.sort((a, b) => b.matches - a.matches);

  return (
    <Container id={PageIDs.projectsList} className="py-3">
      <Row>
        <Col>
          <h2 className="text-center">Projects List</h2>
          <Link href="/project-page/add-project/" className="btn btn-primary"
            style={{
              backgroundColor: '#008091',
              borderColor: 'transparent',
              fontSize: '16px'
            }}>
            Add Project
          </Link>
          <br />
          <br />
          <Row className="g-4">
            {sortedProjs.map((item) => (
              <ProjectCard key={`Project-${item.project.id}`} project={item.project} />
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectListPage;

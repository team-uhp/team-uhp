import React from 'react';
import ProjectInfo from '@/components/ProjectInfo';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';

/**
 * Renders project page.
 * @param params is the project to display.
 */
const ProjectPage = async ({ params }: { params: Promise<{ id: string; }> }) => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions) as {
    user: { email: string; id: string; randomKey: string };
  } | null;
  loggedInProtectedPage(session);

  const userId = Number(session?.user?.id);
  const project = await prisma.project.findUnique({
    where: { id: Number((await params).id) },
    include: { admins: { select: { id: true } } },
  });

  if (project && session?.user && project.admins?.some(a => a.id === userId)) {
    return (
      <Container id={PageIDs.projectPage} fluid className="py-3">
        <Link href="/project-list">Back to List of Projects</Link>
        <Row>
          <ProjectInfo
            key={`Project-${params}`}
            params={{
              id: Number((await params).id),
            }}
          />
        </Row>
        <Col>
          <Link
            href={`/project-opening/add-opening/${(await params).id}`}
            key={`Project-${params}`}
          >
            Recruit for Opening
          </Link>
        </Col>
      </Container>
    );
  }
  return (
    <Container id={PageIDs.projectPage} fluid className="py-3">
      <Link href="/project-list">Back to List of Projects</Link>
      <Row>
        <ProjectInfo
          key={`Project-${params}`}
          params={{
            id: Number((await params).id),
          }}
        />
      </Row>
    </Container>
  );
};

export default ProjectPage;

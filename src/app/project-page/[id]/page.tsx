import React from 'react';
import ProjectInfo from '@/components/ProjectInfo';
import PostedByCard from '@/components/PostedByCard';
import BookmarkButton from '@/components/BookmarkButton';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Col, Container, Row, Button } from 'react-bootstrap';

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
    include: {
      admins: {
        include: { projects: { select: { id: true } } },
      },
    },
  });


  const postedBy = project?.admins?.[0] || null;
  const isAdmin = project && session?.user && project.admins?.some(a => a.id === userId);

  if (isAdmin) {
    return (
      <Container id={PageIDs.projectPage} className="py-3">
      <Link href="/project-list" style={{ color: '#111613' }}>&lt; Back to List of Projects</Link>
        <Row>
          {/* Left column: project info */}
          <Col lg={9}>
            <ProjectInfo
              key={`Project-${params}`}
              params={{
                id: Number((await params).id),
              }}
            />
          </Col>
          <Col lg={3}>
            <PostedByCard admin={postedBy} />
            <div style={{ marginTop: "10px" }}>
            <BookmarkButton />
            </div>
            <Link href={`/project-opening/add-opening/${(await params).id}`} passHref>
              <Button id="recruit-button">
                Recruit for Opening
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
  return (
    <Container id={PageIDs.projectPage} className="py-3">
      <Link href="/project-list" style={{ color: '#111613' }}>&lt; Back to List of Projects</Link>
      <Row>
        <Col lg={9}>
          <ProjectInfo
            key={`Project-${params}`}
            params={{
              id: Number((await params).id),
            }}
          />
        </Col>
        <Col lg={3}>
          <PostedByCard admin={postedBy} />
          <div style={{ marginTop: "10px" }}>
            <BookmarkButton />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectPage;

import React from 'react';
import NotFound from '@/app/not-found';
import OpeningInfo from '@/components/OpeningInfo';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Badge, Container, Row } from 'react-bootstrap';

/**
 * Renders project opening page.
 * @param params is the project to pull openings to display.
 */
const ProjectOpening = async ({ params }: { params: Promise<{
  id: number;
}> }) => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions) as {
    user: { email: string; id: string; randomKey: string };
  } | null;

  if (!session) {
    return NotFound();
  }

  loggedInProtectedPage(session);

  const user = await prisma.user.findUnique({ where: { id: Number(session.user.id) }})
  if (!user) {
    return NotFound();
  }

  const resolvedParams = await params;
  const position = await prisma.position.findUnique({
    where: { id: Number(resolvedParams.id) },
    include: {
      project: {
        select: {
          id: true,
          title: true,
        }
      },
      admins: true,
      applics: {
        include: {
          user: true,
        }
      } },
  });
  if (!position || position == null) {
    return NotFound();
  }

  const apps: { id: number; name: string | null }[] = position.applics.map(application => ({
    id: application.id,
    name: application.user ? `${application.user.firstName} ${application.user.lastName}` : null,
  }));

  if ((position.admins?.some((a) => a.id === user.id) ?? false) || (user.role === 'ADMIN')) {
    return (
      <Container id={PageIDs.openingPage} className="py-3">
        <Link href={`/project-page/${position.project?.id}`} style={{ color: '#111613' }}>Back to Project</Link>
        <OpeningInfo
          key={`Position-${resolvedParams.id}`}
          params={{
            id: resolvedParams.id,
          }}
        />
        <Row>
          <Link href={`/project-opening/edit-opening/${position.id}`}>Edit Opening</Link>
        </Row>
        <h2>Applications</h2>
        <Container id="opening-tags" fluid>
        {apps.map((app) => (
          <Link key={`app-${app.id}`} href={`/project-opening/application/${app.id}`}>
            <Badge
              className="mx-1"
              bg="info"
            >
              {app.name ?? 'N/A'}
            </Badge>
          </Link>
        ))}
      </Container>
      </Container>
    );
  }
  return (
    <Container id={PageIDs.openingPage} className="py-3">
      <Link href={`/project-page/${position.project?.id}`} style={{ color: '#111613' }}>Back to Project</Link>
      <OpeningInfo
        key={`Position-${resolvedParams.id}`}
        params={{
          id: resolvedParams.id,
        }}
      />
    </Container>
  );
};

export default ProjectOpening;

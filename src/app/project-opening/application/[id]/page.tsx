import React from 'react';
import NotFound from '@/app/not-found';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import ApplicationAdmin from '@/components/ApplicationAdmin';
import ApplicationUser from '@/components/ApplicationUser';

/**
 * Renders project opening page.
 * @param params is the project to pull openings to display.
 */
const ApplicationPage = async ({ params }: { params: Promise<{
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
  const applic = await prisma.application.findUnique({
    where: { id: Number(resolvedParams.id) },
    include: {
      position: {
        include: {
          applics: {
            include: {
              user: true,
            },
          },
          admins: true,
          project: true,
        },
      },
    },
  });

  if (!applic || !applic.position) {
    return NotFound();
  }

  if ((applic.position.admins?.some((a) => a.id === user.id) ?? false) || (user.role === 'ADMIN')) {
    return (
      <Container>
        <Link href={`/project-opening/${applic.position.project?.id ?? ''}`}>Back to Opening</Link>
        <ApplicationAdmin
          user={user}
          applic={{
            ...applic,
            projId: applic.position?.project?.id ?? 0,
            application: applic.application ?? '',
          }}
        />
      </Container>
    );
  }
  else if (applic.userId == user.id) {
    return (
      <Container>
        <Link href={`/project-opening/${applic.position.project?.id ?? ''}`}>Back to Opening</Link>
        <ApplicationUser
          user={user}
          applic={{
            ...applic,
            projId: applic.position?.project?.id ?? 0,
            application: applic.application ?? '',
          }}
        />
      </Container>
    );
  }
  return (
    <Container>
      <Link href={`/project-page/${applic.position.id ?? ''}`}>Back to Position</Link>
      <h1>
        Permissions denied.
      </h1>
      <h2>
        You do not have permissions to view this application.
      </h2>
    </Container>
  );
};

export default ApplicationPage;

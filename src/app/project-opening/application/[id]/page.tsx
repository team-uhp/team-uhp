import React from 'react';
import NotFound from '@/app/not-found';
import OpeningInfo from '@/components/OpeningInfo';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import ApplicationAdmin from '@/components/ApplicationAdmin';

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
  return (
    <Container id={PageIDs.openingPage} fluid className="py-3">
      <Link href={`/project-page/${applic.position.id ?? ''}`}>Back to Position</Link>
      <OpeningInfo
        key={`Position-${resolvedParams.id}`}
        params={{
          id: resolvedParams.id,
        }}
      />
    </Container>
  );
};

export default ApplicationPage;

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

  loggedInProtectedPage(session);

  const resolvedParams = await params;
  const position = await prisma.position.findUnique({ where: { id: Number(resolvedParams.id) } });
  if (!position) {
    return NotFound();
  }
  // console.log(project opening);

  const userId = Number(session?.user?.id);

  if (position && session?.user && position.admins.includes(userId)) {
    return (
      <Container id={PageIDs.openingPage} fluid className="py-3">
        <Link href={`/project-page/${position.project}`}>Back to Project</Link>
        <OpeningInfo
          key={`Position-${resolvedParams.id}`}
          params={{
            id: resolvedParams.id,
          }}
        />
        <Link href={`/edit-opening/${position.id}`}>Edit Opening</Link>
      </Container>
    );
  }
  return (
    <Container id={PageIDs.openingPage} fluid className="py-3">
      <Link href={`/project-page/${position.project}`}>Back to Project</Link>
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

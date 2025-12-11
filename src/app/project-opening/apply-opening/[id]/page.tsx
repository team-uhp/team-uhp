import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import ApplyOpeningForm from '@/components/ApplyOpeningForm';
import { prisma } from '@/lib/prisma';
import { Link } from 'react-bootstrap-icons';
import { Row } from 'react-bootstrap';
import NotFound from '@/app/not-found';

/**
 * Renders project opening page.
 * @param params is the project to pull openings to display.
 */
const ApplyOpening = async ({ params }: { params: Promise<{
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

  const positionId = Number((await params).id);
  const position = await prisma.position.findUnique({ where: { id: positionId } });
  if (!position) throw new Error('Position not found');
  if (position.projectId == null) throw new Error('Position has no projectId');
  const project = await prisma.project.findUnique({ where: { id: position.projectId } });
  if (!project) throw new Error('Project not found');

  return (
    <main>
      <Link href={`/project-opening/${position.id}`} style={{ color: '#111613'}}>&lt;&nbsp;Back to Opening</Link>
      <Row>
        <h1 style={{ textAlign: 'center', width: '100%' }}>
          Application for {project.title}
        </h1>
      </Row>
      <ApplyOpeningForm position={position} />
    </main>
  );
};

export default ApplyOpening;

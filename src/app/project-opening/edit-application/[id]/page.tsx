import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import ApplyEditForm from '@/components/ApplyEditForm';
import { prisma } from '@/lib/prisma';
import { Link } from 'react-bootstrap-icons';
import { Row } from 'react-bootstrap';
import NotFound from '@/app/not-found';

/**
 * Renders project opening page.
 * @param params is the project to pull openings to display.
 */
const ApplyEdit = async ({ params }: { params: Promise<{
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

  const applicationId = Number((await params).id);
  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application) throw new Error('Application not found');
  if (application.positionId == null) throw new Error('Application has no positionId');
  const position = await prisma.position.findUnique({ where: { id: application.positionId } });
  if (!position) throw new Error('Position not found');

  return (
    <main>
      <Link href={`/project-opening/${position.id}`}>Back to Position</Link>
      <Row>
        <h1>
          Application for {position.title}
        </h1>
      </Row>
      <ApplyEditForm applic={application} />
    </main>
  );
};

export default ApplyEdit;

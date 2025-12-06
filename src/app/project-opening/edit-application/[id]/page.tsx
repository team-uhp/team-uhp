import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { userProtectedPage } from '@/lib/page-protection';
import ApplyEditForm from '@/components/ApplyEditForm';
import { prisma } from '@/lib/prisma';
import { Link } from 'react-bootstrap-icons';
import { Row } from 'react-bootstrap';

/**
 * Renders project opening page.
 * @param params is the project to pull openings to display.
 */
const ApplyEdit = async ({ params }: { params: Promise<{
  id: number;
}> }) => {

  const applicationId = Number((await params).id);
  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application || !application.userId || !application.positionId) throw new Error('Application not found');
  const position = await prisma.position.findUnique({ where: { id: application.positionId } });
  if (!position) throw new Error('Position not found');

  const session = await getServerSession(authOptions);
  const authUsers: string[] = (await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  })).map(u => u.id.toString());
  authUsers.push(application.userId.toString());

  // Protect the page, only authorized users can access it.
  userProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
    authUsers,
  );

  return (
    <main>
      <Link href={`/project-opening/${position.id}`}>Back to Opening</Link>
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

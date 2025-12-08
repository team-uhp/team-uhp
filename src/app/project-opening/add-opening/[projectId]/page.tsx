import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { userProtectedPage } from '@/lib/page-protection';
import AddOpeningForm from '@/components/AddOpeningForm';
import { prisma } from '@/lib/prisma';

const AddOpening = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;
  const projectIdNum = Number(projectId);
  const proj = await prisma.project.findUnique({
    where: { id: projectIdNum },
    include: { admins: { select: { id: true } } },
  });
  if(!proj) throw new Error('Project not found');
  
  const session = await getServerSession(authOptions);
  const authUsers: string[] = (await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  })).map(u => u.id.toString());

  const projAdminIds: string[] = proj.admins.map((a: { id: number | string }) => a.id.toString());
  authUsers.push(...projAdminIds);

  // Protect the page, only authorized users can access it.
  userProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
    authUsers,
  );

  return (
    <main>
      <AddOpeningForm projectId={projectIdNum} />
    </main>
  );
};

export default AddOpening;

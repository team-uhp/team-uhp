import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { userProtectedPage } from '@/lib/page-protection';
import EditOpeningForm from '@/components/EditOpeningForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Position } from '@prisma/client';

export default async function EditOpening({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;
  const positionId = Number(id);
  const position: Position | null = await prisma.position.findUnique({ where: { id: positionId } });
  if (!position || !position.projectId) {
    notFound();
  }

  const proj = await prisma.project.findUnique({
    where: { id: position.projectId },
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
      <EditOpeningForm
        key={`Position-${position.id}`}
        position={position}
      />
    </main>
  );
}

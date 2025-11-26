import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import EditOpeningForm from '@/components/EditOpeningForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Position } from '@prisma/client';

export default async function EditOpening({ params }: { params: Promise<{ id: string }> }) {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  const { id } = await params;
  const positionId = Number(id);
  const position: Position | null = await prisma.position.findUnique({ where: { id: positionId } });
  if (!position) {
    notFound();
  }

  return (
    <main>
      <EditOpeningForm
        key={`Position-${position.id}`}
        position={position}
      />
    </main>
  );
}

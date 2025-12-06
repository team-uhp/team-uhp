import React from 'react';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { User } from '@prisma/client';
import { Container } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import { userProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import EditUserForm from '@/components/EditUserForm';
import { PageIDs } from '@/utilities/ids';

/**
 * Renders the edit page for User profile data.
 * @param params is the profile to display.
 */
const EditProfilePage = async ({ params }: { params: Promise<{ id: number; }> }) => {
  const { id } = await params;

  if (Number.isNaN(id)) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const authUsers: string[] = (await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  })).map(u => u.id.toString());
  authUsers.push(id.toString());

  // Protect the page, only authorized users can access it.
  userProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
    authUsers,
  );
  // console.log(id);
  const user: User | null = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!user) {
    return notFound();
  }

  return (
    <Container id={PageIDs.editProfilePage} className="py-4 pt-5">
      <EditUserForm key={`${user.id}`} user={user} />
    </Container>
  );
};

export default EditProfilePage;

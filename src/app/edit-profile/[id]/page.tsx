/* eslint-disable import/extensions */
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { User } from '@prisma/client';
import { Container } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import EditUserForm from '@/components/EditUserForm';
import { PageIDs } from '@/utilities/ids';

/**
 * Renders the edit page for User profile data.
 * @param params is the profile to display.
 */
const EditProfilePage = async ({ params }: { params: { id: number; } }) => {
  if (Number.isNaN(Number(params.id))) {
    notFound();
  }
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  // console.log(id);
  const user: User | null = await prisma.user.findUnique({
    where: {
      id: Number(params.id),
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

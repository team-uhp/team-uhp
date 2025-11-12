import UserProfile from '@/components/UserProfile';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { Container } from 'react-bootstrap';
import { User } from '@prisma/client';

/**
 * Renders User's profile page.
 * @param params is the profile to display.
 */
const ProfilePage = async ({ params }: { params: Promise<{ id: number; }> }) => {
  const { id } = await params;
  if (Number.isNaN(Number(id))) {
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
  // Get the profile data from database using the id from params
  const profile: User | null = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!profile) {
    notFound();
  }

  return (
    <Container id={PageIDs.profilesPage} className="py-4 pt-5">
      <UserProfile
        key={`${profile.id}`}
        user={profile}
      />
    </Container>
  );
};

export default ProfilePage;

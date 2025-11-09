import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import AddOpeningForm from '@/components/AddOpeningForm';

const AddOpening = async ({ params }: { params: { projectId: string } }) => {
  const projectId = Number(params.projectId);
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  return (
    <main>
      <AddOpeningForm projectId={projectId} />
    </main>
  );
};

export default AddOpening;
